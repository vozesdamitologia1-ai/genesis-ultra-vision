import { KeyRound, Mic } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import VoiceMentor from "./VoiceMentor";
import { usePath } from "@/contexts/PathContext";

const AppHeader = () => {
  const { t } = useTranslation();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const { path } = usePath();

  const showMic = path === "legado" || path === "flow";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
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
