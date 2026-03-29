import { useTranslation } from "react-i18next";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BibleReader = () => {
  const { t } = useTranslation();
  const [showExample, setShowExample] = useState(false);

  return (
    <section className="px-4 py-8">
      <div className="rounded-lg border border-border/50 bg-card/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-foreground" />
          <h3 className="font-serif text-lg font-bold text-foreground">{t("legado.bible.title")}</h3>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2 rounded border border-border bg-background/60 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("legado.bible.placeholder")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          onClick={() => setShowExample(!showExample)}
          className="w-full border border-foreground bg-foreground py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-background transition-all hover:bg-foreground/90"
        >
          [{t("legado.bible.button")}]
        </button>

        <AnimatePresence>
          {showExample && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded border border-border/30 bg-background/40 p-4">
                <h4 className="mb-2 font-serif text-base font-bold text-foreground">
                  {t("legado.bible.example.title")}
                </h4>
                <blockquote className="mb-3 border-l-2 border-muted-foreground pl-3 font-serif text-sm italic text-muted-foreground">
                  {t("legado.bible.example.text")}
                </blockquote>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t("legado.bible.example.explanation")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BibleReader;
