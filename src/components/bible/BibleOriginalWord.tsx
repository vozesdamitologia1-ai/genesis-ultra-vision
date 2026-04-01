import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BibleOriginalWordProps {
  originalWord: {
    word: string;
    transliteration: string;
    language: string;
    meaning: string;
  };
  pathType?: "legado" | "flow";
}

const BibleOriginalWord = ({ originalWord, pathType = "legado" }: BibleOriginalWordProps) => {
  const { t } = useTranslation();
  const isLegado = pathType === "legado";
  const [showTooltip, setShowTooltip] = useState(false);

  const accent = isLegado ? "text-amber-700" : "text-red-500";
  const borderColor = isLegado ? "border-amber-700/15" : "border-red-500/15";
  const bg = isLegado ? "bg-amber-100/30" : "bg-zinc-900/80";
  const fontClass = isLegado ? "font-serif" : "font-sans";
  const textColor = isLegado ? "text-stone-700" : "text-foreground/80";
  const wordHighlight = isLegado ? "text-amber-700" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-lg border ${borderColor} ${bg} p-5`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Languages className={`h-4 w-4 ${accent}`} />
        <h5 className={`${fontClass} text-xs font-bold uppercase tracking-[0.2em] ${accent}`}>
          {t("legado.bible.originalTitle", "Raiz no Original")}
        </h5>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  className={`${fontClass} text-2xl font-bold ${wordHighlight} cursor-pointer transition-all hover:scale-105 underline decoration-dotted underline-offset-4 decoration-current/30`}
                >
                  {originalWord.word}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className={`max-w-xs p-4 ${isLegado ? "bg-amber-50 border-amber-300/40 text-stone-800" : "bg-zinc-900 border-red-500/30 text-foreground"}`}
              >
                <p className={`${fontClass} text-xs font-bold uppercase tracking-wider ${accent} mb-1.5`}>
                  ✨ {t("legado.bible.practicalApp", "Aplicação Prática")}
                </p>
                <p className={`${fontClass} text-sm leading-relaxed ${isLegado ? "text-stone-700" : "text-foreground/80"}`}>
                  {originalWord.meaning}
                </p>
                <p className={`mt-2 text-[10px] ${isLegado ? "text-stone-500" : "text-muted-foreground"} italic`}>
                  ({originalWord.transliteration}) — {originalWord.language}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className={`text-xs ${isLegado ? "text-stone-500" : "text-muted-foreground"} italic`}>
            ({originalWord.transliteration}) — {originalWord.language}
          </span>
        </div>
        <p className={`${fontClass} text-sm leading-relaxed ${textColor}`}>
          {originalWord.meaning}
        </p>
        <p className={`text-[10px] ${isLegado ? "text-stone-500" : "text-muted-foreground"} mt-1`}>
          {t("legado.bible.clickWord", "👆 Toque na palavra para ver a aplicação prática")}
        </p>
      </div>
    </motion.div>
  );
};

export default BibleOriginalWord;
