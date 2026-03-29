import { motion } from "framer-motion";

interface BibleVersesProps {
  verses: { verse: number; content: string }[];
}

const BibleVerses = ({ verses }: BibleVersesProps) => {
  return (
    <div
      className="max-h-[50vh] space-y-1 overflow-y-auto rounded-lg border border-amber-400/10 p-5"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, hsl(40 30% 8% / 0.5), hsl(35 20% 6% / 0.7))",
      }}
    >
      {verses.map((verse, i) => (
        <motion.div
          key={verse.verse}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02 }}
          className="flex items-start gap-2 rounded px-2 py-1.5 hover:bg-amber-400/5 transition-colors"
        >
          <span className="mt-0.5 min-w-[1.5rem] text-right font-serif text-[10px] font-bold text-amber-400/50">
            {verse.verse}
          </span>
          <p className="flex-1 font-serif text-sm leading-relaxed text-foreground/90">
            {verse.content}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default BibleVerses;
