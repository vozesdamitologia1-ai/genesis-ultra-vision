import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOSButton = () => {
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);

  return (
    <section className="px-4 py-8">
      <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/10 p-6 text-center">
        <h3 className="mb-1 text-lg font-bold text-foreground">{t("flow.sos.title")}</h3>
        <p className="mb-4 text-xs text-muted-foreground">{t("flow.sos.description")}</p>

        <button
          onClick={() => setShowMessage(true)}
          className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
        >
          <Heart className="h-4 w-4" />
          {t("flow.sos.button")}
        </button>

        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded bg-primary/20 p-3"
            >
              <p className="text-sm text-foreground">{t("flow.sos.message")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SOSButton;
