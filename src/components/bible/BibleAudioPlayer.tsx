import { Play, Loader2, Pause, Stamp } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import type { BibleStudyResult } from "@/components/BibleReader";

interface BibleAudioPlayerProps {
  result: BibleStudyResult;
  pathType?: "legado" | "flow";
}

const BibleAudioPlayer = ({ result, pathType = "legado" }: BibleAudioPlayerProps) => {
  const { t, i18n } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLegado = pathType === "legado";
  const isEnglish = i18n.language?.startsWith("en");

  const accent = isLegado ? "text-amber-700" : "text-red-500";
  const borderColor = isLegado ? "border-amber-700/30" : "border-red-500/30";
  const bg = isLegado ? "bg-amber-100/40 hover:bg-amber-200/50" : "bg-red-500/10 hover:bg-red-500/20";

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const speakWithBrowserTTS = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEnglish ? "en-US" : "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = isLegado ? 0.85 : 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = async () => {
    if (playing) {
      stopAll();
      return;
    }

    setLoading(true);
    try {
      const versesText = result.verses
        .slice(0, 15)
        .map((v) => `${isEnglish ? "Verse" : "Versículo"} ${v.verse}. ${v.content}`)
        .join(" ");
      const intro = isLegado
        ? `${isEnglish ? "Beloved, let us meditate on" : "Amado, meditemos em"} ${result.book}, ${isEnglish ? "chapter" : "capítulo"} ${result.chapter}.`
        : `${result.book}, ${isEnglish ? "chapter" : "capítulo"} ${result.chapter}.`;
      const text = `${intro} ${versesText}`;

      // Try ElevenLabs first (natural voice tuned per path)
      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
        body: { text, path: pathType },
      });

      if (!error && data instanceof Blob && data.type.startsWith("audio")) {
        const url = URL.createObjectURL(data);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setPlaying(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setPlaying(false);
          URL.revokeObjectURL(url);
          speakWithBrowserTTS(text);
        };
        setPlaying(true);
        await audio.play();
      } else {
        // Fallback to browser TTS
        setPlaying(true);
        speakWithBrowserTTS(text);
      }
    } catch (e) {
      console.error("TTS error:", e);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const PlayIcon = isLegado ? Stamp : Play;

  return (
    <button
      onClick={handlePlay}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border ${borderColor} ${bg} px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${accent} transition-all disabled:opacity-50`}
      title={t("legado.bible.listenAll", "Ouvir capítulo")}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : playing ? (
        <Pause className="h-3.5 w-3.5" />
      ) : (
        <PlayIcon className="h-3.5 w-3.5" />
      )}
      {playing ? t("legado.bible.pause", "Pausar") : t("legado.bible.listenAll", "Ouvir")}
    </button>
  );
};

export default BibleAudioPlayer;
