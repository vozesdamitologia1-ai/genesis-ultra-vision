import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BibleInsightProps {
  insight: string;
}

const BibleInsight = ({ insight }: BibleInsightProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-lg border border-amber-400/15 bg-amber-400/5 p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          {t("legado.bible.insightTitle", "Insight do Mentor")}
        </h5>
      </div>
      <p className="font-serif text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
        {insight}
      </p>
    </motion.div>
  );
};

export default BibleInsight;
