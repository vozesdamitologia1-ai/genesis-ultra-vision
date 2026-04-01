import { KeyRound, Mic, Home } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import VoiceMentor from "./VoiceMentor";
import { usePath } from "@/contexts/PathContext";

const AppHeader = () => {
  const { t } = useTranslation();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const { path, selectPath } = usePath();
  const location = useLocation();

  const showMic = path === "legado" || path === "flow";
  const isInsidePath = location.pathname !== "/";

  const handleHomeClick = () => {
    setVoiceOpen(false);
    void selectPath("portal");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isInsidePath && (
              <motion.button
                key="home-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={handleHomeClick}
                className="mr-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Home"
              >
                <Home className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <KeyRound className="h-5 w-5 text-primary" />
          <span className="font-serif text-lg font-bold italic tracking-wide text-foreground">
            {t("header.brand")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {showMic && (
            <button
              onClick={() => setVoiceOpen(true)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
      <VoiceMentor open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
};

export default AppHeader;
