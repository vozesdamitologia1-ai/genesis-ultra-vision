import { Play, Loader2, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { BibleStudyResult } from "@/components/BibleReader";

interface BibleAudioPlayerProps {
  result: BibleStudyResult;
}

const BibleAudioPlayer = ({ result }: BibleAudioPlayerProps) => {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      // Build narration text: chapter title + first 10 verses + insight summary
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
          body: JSON.stringify({ text, path: "legado" }),
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
      console.error("TTS error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 transition-all hover:bg-amber-400/20 disabled:opacity-50"
      title={t("legado.bible.listenAll", "Ouvir capítulo")}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : playing ? (
        <Pause className="h-3.5 w-3.5" />
      ) : (
        <Play className="h-3.5 w-3.5" />
      )}
      {playing ? t("legado.bible.pause", "Pausar") : t("legado.bible.listenAll", "Ouvir")}
    </button>
  );
};

export default BibleAudioPlayer;
