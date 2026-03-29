import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface BibleMindMapProps {
  applications: string[];
}

const BibleMindMap = ({ applications }: BibleMindMapProps) => {
  const { t } = useTranslation();

  if (!applications || applications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-lg border border-amber-400/15 bg-gradient-to-br from-amber-400/5 to-amber-400/10 p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
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
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/20 font-serif text-xs font-bold text-amber-400">
              {i + 1}
            </span>
            <p className="font-serif text-sm leading-relaxed text-foreground/80">
              {app}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BibleMindMap;
