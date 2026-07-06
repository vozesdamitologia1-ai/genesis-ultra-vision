import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BibleInsightProps {
  insight: string;
  pathType?: "legado" | "flow";
}

const BibleInsight = ({ insight, pathType = "legado" }: BibleInsightProps) => {
  const { t } = useTranslation();
  const isLegado = pathType === "legado";

  const accent = isLegado ? "text-amber-700" : "text-red-500";
  const borderColor = isLegado ? "border-amber-700/15" : "border-red-500/15";
  const bg = isLegado ? "bg-amber-100/40" : "bg-red-500/5";
  const fontClass = isLegado ? "font-serif" : "font-sans";
  const textColor = isLegado ? "text-stone-900" : "text-foreground/80";
  const textSize = isLegado ? "text-base font-bold" : "text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-lg border ${borderColor} ${bg} p-5`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className={`h-4 w-4 ${accent}`} />
        <h5 className={`${fontClass} text-xs font-bold uppercase tracking-[0.2em] ${accent}`}>
          {t("legado.bible.insightTitle", "Insight do Mentor")}
        </h5>
      </div>
      <p className={`${fontClass} ${textSize} leading-relaxed ${textColor} whitespace-pre-line`}>
        {insight}
      </p>
    </motion.div>
  );
};

export default BibleInsight;
