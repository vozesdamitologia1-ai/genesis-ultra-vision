import { useTranslation } from "react-i18next";
import { BookOpen, Search, Play, Loader2, Sparkles, Languages, BookMarked } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BibleVerses from "@/components/bible/BibleVerses";
import BibleInsight from "@/components/bible/BibleInsight";
import BibleOriginalWord from "@/components/bible/BibleOriginalWord";
import BibleRelatedContent from "@/components/bible/BibleRelatedContent";
import BibleAudioPlayer from "@/components/bible/BibleAudioPlayer";

export interface BibleStudyResult {
  book: string;
  chapter: number;
  verses: { verse: number; content: string }[];
  insight: string;
  originalWord: {
    word: string;
    transliteration: string;
    language: string;
    meaning: string;
  };
  relatedTopics: string[];
}

const BibleReader = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<BibleStudyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notBiblical, setNotBiblical] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const query = search.trim();
    if (!query) return;

    setLoading(true);
    setResult(null);
    setNotBiblical(false);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bible-study`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ reference: query }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Request failed");
      }

      const data = await response.json();

      if (data.notBiblical) {
        setNotBiblical(true);
      } else if (data.verses) {
        setResult(data);
      } else {
        setError(t("legado.bible.noResults"));
      }
    } catch (e: any) {
      console.error("Bible study error:", e);
      setError(e.message || "Erro ao buscar estudo bíblico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-8">
      <div className="rounded-lg border border-amber-400/20 bg-amber-50/5 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold text-foreground">
            {t("legado.bible.title")}
          </h3>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded border border-amber-400/20 bg-amber-950/20 px-3 py-2.5">
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
            disabled={loading}
            className="rounded border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 transition-all hover:bg-amber-400/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("legado.bible.button")}
          </button>
        </div>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 flex-col items-center justify-center gap-3"
            >
              <Loader2 className="h-8 w-8 animate-spin text-amber-400/60" />
              <p className="text-xs text-muted-foreground font-serif animate-pulse">
                {t("legado.bible.aiLoading", "O Mentor está preparando o estudo...")}
              </p>
            </motion.div>
          )}

          {/* Not biblical message */}
          {notBiblical && (
            <motion.div
              key="not-biblical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-amber-400/10 bg-amber-950/10 p-8"
            >
              <BookMarked className="h-8 w-8 text-amber-400/40" />
              <p className="text-center text-sm text-muted-foreground font-serif leading-relaxed max-w-xs">
                {t("legado.bible.notBiblical", "Este conhecimento não consta nos registros do Legado. Tente uma referência bíblica.")}
              </p>
            </motion.div>
          )}

          {/* Error */}
          {error && !notBiblical && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-32 items-center justify-center rounded-lg border border-red-400/20 bg-red-950/10"
            >
              <p className="text-xs text-red-400 font-serif">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Title & Audio */}
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-amber-400">
                  {result.book} — {t("legado.bible.chapter")} {result.chapter}
                </h4>
                <BibleAudioPlayer result={result} />
              </div>

              {/* Verses */}
              <BibleVerses verses={result.verses} />

              {/* Insight */}
              <BibleInsight insight={result.insight} />

              {/* Original Word */}
              <BibleOriginalWord originalWord={result.originalWord} />

              {/* Related Content */}
              <BibleRelatedContent topics={result.relatedTopics} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BibleReader;
