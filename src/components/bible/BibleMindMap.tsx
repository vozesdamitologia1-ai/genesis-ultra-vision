import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BibleMindMapProps {
  applications: string[];
  pathType?: "legado" | "flow";
}

const BibleMindMap = ({ applications, pathType = "legado" }: BibleMindMapProps) => {
  const { t } = useTranslation();
  const isLegado = pathType === "legado";

  if (!applications || applications.length === 0) return null;

  const accent = isLegado ? "text-amber-700" : "text-amber-400";
  const borderColor = isLegado ? "border-amber-700/15" : "border-amber-400/15";
  const bg = isLegado ? "bg-amber-100/40" : "bg-gradient-to-br from-amber-400/5 to-amber-400/10";
  const fontClass = isLegado ? "font-serif" : "font-sans";
  const textColor = isLegado ? "text-stone-900" : "text-foreground/80";
  const textSize = isLegado ? "text-base font-bold" : "text-sm";
  const numberBg = isLegado ? "bg-amber-700/20 text-amber-800" : "bg-amber-400/20 text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`rounded-lg border ${borderColor} ${bg} p-5`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className={`h-4 w-4 ${accent}`} />
        <h5 className={`${fontClass} text-xs font-bold uppercase tracking-[0.2em] ${accent}`}>
          {t("legado.bible.mindMap.title", "Aplicação para Hoje")}
        </h5>
      </div>
      <div className="space-y-3">
        {applications.map((app, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.15 }}
            className="flex items-start gap-3"
          >
            <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${numberBg} ${fontClass} text-xs font-bold`}>
              {i + 1}
            </span>
            <p className={`flex-1 ${fontClass} ${textSize} leading-relaxed ${textColor}`}>
              {app}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BibleMindMap;
