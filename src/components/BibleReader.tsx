import { useTranslation } from "react-i18next";
import { BookOpen, Search, Volume2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  version: string | null;
  path_type: string | null;
}

const BibleReader = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState("Gênesis");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchVerses = async (book?: string, chapter?: number) => {
    setLoading(true);
    setHasSearched(true);
    let query = supabase
      .from("bible_verses")
      .select("*")
      .order("verse", { ascending: true })
      .limit(50);

    if (book) query = query.eq("book", book);
    if (chapter) query = query.eq("chapter", chapter);

    const { data } = await query;
    if (data && data.length > 0) {
      setVerses(data);
      setCurrentBook(data[0].book);
      setCurrentChapter(data[0].chapter);
    } else {
      setVerses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerses(currentBook, currentChapter);
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    // Parse search like "Genesis 1:1" or "Gênesis 1"
    const match = search.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
    if (match) {
      const book = match[1].trim();
      const chapter = parseInt(match[2]);
      fetchVerses(book, chapter);
    } else {
      fetchVerses(search.trim());
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      fetchVerses(currentBook, currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    fetchVerses(currentBook, currentChapter + 1);
  };

  const speakVerse = async (verse: BibleVerse) => {
    setSpeaking(verse.id);
    try {
      const text = `${verse.book}, capítulo ${verse.chapter}, versículo ${verse.verse}. ${verse.content}`;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, path: "legado" }),
        }
      );
      if (!response.ok) throw new Error("TTS failed");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setSpeaking(null);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setSpeaking(null);
      };
      await audio.play();
    } catch (e) {
      console.error("TTS error:", e);
      setSpeaking(null);
    }
  };

  return (
    <section className="px-4 py-8">
      <div className="rounded-lg border border-amber-400/20 bg-amber-50/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold text-foreground">{t("legado.bible.title")}</h3>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded border border-amber-400/20 bg-amber-950/20 px-3 py-2">
            <Search className="h-4 w-4 text-amber-400/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("legado.bible.placeholder")}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-serif"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 transition-all hover:bg-amber-400/20"
          >
            {t("legado.bible.button")}
          </button>
        </div>

        {/* Chapter navigation */}
        {verses.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <button onClick={handlePrevChapter} className="rounded-full p-1.5 text-amber-400/70 hover:bg-amber-400/10 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h4 className="font-serif text-base font-bold text-amber-400">
              {currentBook} — {t("legado.bible.chapter", "Capítulo")} {currentChapter}
            </h4>
            <button onClick={handleNextChapter} className="rounded-full p-1.5 text-amber-400/70 hover:bg-amber-400/10 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Verses */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-40 items-center justify-center"
            >
              <Loader2 className="h-6 w-6 animate-spin text-amber-400/60" />
            </motion.div>
          ) : verses.length > 0 ? (
            <motion.div
              key="verses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[50vh] space-y-1 overflow-y-auto rounded-lg border border-amber-400/10 bg-amber-950/10 p-5"
              style={{
                backgroundImage: "linear-gradient(to bottom, hsl(40 30% 8% / 0.5), hsl(35 20% 6% / 0.7))",
              }}
            >
              {verses.map((verse, i) => (
                <motion.div
                  key={verse.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="group flex items-start gap-2 rounded px-2 py-1.5 hover:bg-amber-400/5 transition-colors"
                >
                  <span className="mt-0.5 min-w-[1.5rem] text-right font-serif text-[10px] font-bold text-amber-400/50">
                    {verse.verse}
                  </span>
                  <p className="flex-1 font-serif text-sm leading-relaxed text-foreground/90">
                    {verse.content}
                  </p>
                  <button
                    onClick={() => speakVerse(verse)}
                    disabled={speaking !== null}
                    className="mt-0.5 flex-shrink-0 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400/60 hover:text-amber-400 hover:bg-amber-400/10 disabled:opacity-30"
                    title={t("legado.bible.listen", "Ouvir versículo")}
                  >
                    {speaking === verse.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-32 items-center justify-center rounded-lg border border-amber-400/10 bg-amber-950/10"
            >
              <p className="text-xs text-muted-foreground font-serif">
                {t("legado.bible.noResults", "Nenhum versículo encontrado.")}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Version info */}
        {verses.length > 0 && verses[0].version && (
          <p className="mt-3 text-center text-[9px] tracking-widest text-muted-foreground/50 uppercase">
            {verses[0].version}
          </p>
        )}
      </div>
    </section>
  );
};

export default BibleReader;
