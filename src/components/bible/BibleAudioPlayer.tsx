import { Play, Loader2, Pause, Stamp } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
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

  const speakWithBrowserTTS = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEnglish ? "en-US" : "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 0.85;
    const voices = window.speechSynthesis.getVoices();
    if (isEnglish) {
      const enVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"))
        || voices.find(v => v.lang === "en-US")
        || voices.find(v => v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    } else {
      const ptVoice = voices.find(v => v.lang.startsWith("pt") && v.name.toLowerCase().includes("google"))
        || voices.find(v => v.lang.startsWith("pt-BR"))
        || voices.find(v => v.lang.startsWith("pt"));
      if (ptVoice) utterance.voice = ptVoice;
    }
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = async () => {
    if (playing) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      const versesText = result.verses
        .slice(0, 10)
        .map((v) => `Versículo ${v.verse}. ${v.content}`)
        .join(" ");
      const text = `${result.book}, capítulo ${result.chapter}. ${versesText}`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, path: pathType }),
        }
      );

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setPlaying(false);
        audioRef.current = null;
      };

      await audio.play();
      setPlaying(true);
    } catch (e) {
      console.warn("ElevenLabs unavailable, using browser TTS:", e);
      const versesText = result.verses
        .slice(0, 10)
        .map((v) => `Versículo ${v.verse}. ${v.content}`)
        .join(". ");
      const text = `${result.book}, capítulo ${result.chapter}. ${versesText}`;
      setPlaying(true);
      speakWithBrowserTTS(text);
    } finally {
      setLoading(false);
    }
  };

  // LEGADO uses a classic "seal" icon, FLOW uses play/pause
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
