import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BibleOriginalWordProps {
  originalWord: {
    word: string;
    transliteration: string;
    language: string;
    meaning: string;
  };
}

const BibleOriginalWord = ({ originalWord }: BibleOriginalWordProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-lg border border-amber-400/15 bg-amber-950/20 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Languages className="h-4 w-4 text-amber-400" />
        <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          {t("legado.bible.originalTitle", "Raiz no Original")}
        </h5>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-2xl font-bold text-amber-400">
            {originalWord.word}
          </span>
          <span className="text-xs text-muted-foreground italic">
            ({originalWord.transliteration}) — {originalWord.language}
          </span>
        </div>
        <p className="font-serif text-sm leading-relaxed text-foreground/80">
          {originalWord.meaning}
        </p>
      </div>
    </motion.div>
  );
};

export default BibleOriginalWord;
