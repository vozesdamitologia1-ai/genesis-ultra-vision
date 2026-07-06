import { useTranslation } from "react-i18next";
import { BookOpen, Search, Loader2, BookMarked } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BibleVerses from "@/components/bible/BibleVerses";
import BibleInsight from "@/components/bible/BibleInsight";
import BibleOriginalWord from "@/components/bible/BibleOriginalWord";
import BibleRelatedContent from "@/components/bible/BibleRelatedContent";
import BibleAudioPlayer from "@/components/bible/BibleAudioPlayer";
import BibleMentorChat from "@/components/bible/BibleMentorChat";
import BibleMindMap from "@/components/bible/BibleMindMap";

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
  applications?: string[];
}

interface BibleReaderProps {
  pathType?: "legado" | "flow";
}

const BibleReader = ({ pathType = "legado" }: BibleReaderProps) => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<BibleStudyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notBiblical, setNotBiblical] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLegado = pathType === "legado";

  // Theme tokens
  const accent = isLegado ? "text-amber-400" : "text-red-500";
  const accentBorder = isLegado ? "border-amber-400/20" : "border-red-500/20";
  const accentBg = isLegado ? "bg-amber-50/5" : "bg-black";
  const accentBgInput = isLegado ? "bg-amber-950/20" : "bg-zinc-900";
  const accentBtnBg = isLegado ? "bg-amber-400/10 hover:bg-amber-400/20" : "bg-red-500/10 hover:bg-red-500/20";
  const accentBtnBorder = isLegado ? "border-amber-400/30" : "border-red-500/30";
  const fontClass = isLegado ? "font-serif" : "font-sans";
  const containerBg = isLegado
    ? { backgroundColor: "#f4ecd8", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")" }
    : {};

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
          body: JSON.stringify({ reference: query, language: i18n.language }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao conectar com o Mentor.");
      }

      const data = await response.json();

      if (data.notBiblical) {
        setNotBiblical(true);
      } else if (data.book) {
        setResult(data);
      } else {
        setError("Tente buscar por livro e capítulo, ex: 'Salmos 23' ou 'João 3'.");
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
      <div
        className={`rounded-lg border ${accentBorder} ${accentBg} p-6`}
        style={containerBg}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className={`h-5 w-5 ${accent}`} />
          <h3 className={`${fontClass} text-lg font-bold ${isLegado ? "text-stone-800" : "text-foreground"}`}>
            {t("legado.bible.title")}
          </h3>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`flex flex-1 items-center gap-2 rounded border ${accentBorder} ${accentBgInput} px-3 py-2.5`}>
            <Search className={`h-4 w-4 ${accent} opacity-60`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("legado.bible.placeholder")}
              className={`flex-1 bg-transparent text-sm ${isLegado ? "text-stone-800" : "text-foreground"} outline-none placeholder:text-muted-foreground ${fontClass}`}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`rounded border ${accentBtnBorder} ${accentBtnBg} px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] ${accent} transition-all disabled:opacity-50`}
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
              <Loader2 className={`h-8 w-8 animate-spin ${accent} opacity-60`} />
              <p className={`text-xs text-muted-foreground ${fontClass} animate-pulse`}>
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
              className={`flex flex-col items-center justify-center gap-3 rounded-lg border ${accentBorder} ${isLegado ? "bg-amber-100/50" : "bg-zinc-900/80"} p-8`}
            >
              <BookMarked className={`h-8 w-8 ${accent} opacity-40`} />
              <p className={`text-center text-sm text-muted-foreground ${fontClass} leading-relaxed max-w-xs`}>
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
              className={`flex h-32 items-center justify-center rounded-lg border border-red-400/20 ${isLegado ? "bg-red-100/30" : "bg-red-950/10"}`}
            >
              <p className={`text-xs text-red-400 ${fontClass}`}>{error}</p>
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
                <h4 className={`${fontClass} text-base font-bold ${accent}`}>
                  {result.book} — {t("legado.bible.chapter")} {result.chapter}
                </h4>
                <BibleAudioPlayer result={result} pathType={pathType} />
              </div>

              <BibleVerses verses={result.verses} pathType={pathType} />
              <BibleInsight insight={result.insight} pathType={pathType} />
              <BibleOriginalWord originalWord={result.originalWord} pathType={pathType} />
              <BibleMindMap applications={result.applications || []} pathType={pathType} />
              <BibleMentorChat result={result} />
              <BibleRelatedContent topics={result.relatedTopics} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BibleReader;
