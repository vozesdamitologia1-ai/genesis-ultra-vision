import { motion } from "framer-motion";

interface BibleVersesProps {
  verses: { verse: number; content: string }[];
  pathType?: "legado" | "flow";
}

const BibleVerses = ({ verses, pathType = "legado" }: BibleVersesProps) => {
  const isLegado = pathType === "legado";

  const bgStyle = isLegado
    ? { backgroundColor: "rgba(244, 236, 216, 0.7)" }
    : { backgroundImage: "linear-gradient(to bottom, hsl(0 0% 5% / 0.9), hsl(0 0% 3% / 0.95))" };

  const accent = isLegado ? "text-amber-700" : "text-red-500/50";
  const textColor = isLegado ? "text-black" : "text-foreground/90";
  const hoverBg = isLegado ? "hover:bg-amber-800/5" : "hover:bg-red-500/5";
  const borderColor = isLegado ? "border-amber-700/15" : "border-red-500/10";
  const fontClass = isLegado ? "font-serif" : "font-sans";
  const verseTextClass = isLegado
    ? "text-xl font-bold leading-loose tracking-wide"
    : "text-sm leading-relaxed";

  return (
    <div
      className={`max-h-[50vh] space-y-1 overflow-y-auto rounded-lg border ${borderColor} p-5`}
      style={bgStyle}
    >
      {verses.map((verse, i) => (
        <motion.div
          key={verse.verse}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02 }}
          className={`flex items-start gap-2 rounded px-2 py-1.5 ${hoverBg} transition-colors`}
        >
          <span className={`mt-0.5 min-w-[1.5rem] text-right ${fontClass} text-[10px] font-bold ${accent}`}>
            {verse.verse}
          </span>
          <p className={`flex-1 ${fontClass} ${verseTextClass} ${textColor}`}>
            {verse.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default BibleVerses;
