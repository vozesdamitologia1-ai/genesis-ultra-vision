import { useState, useRef, useEffect, useCallback } from "react";
import { X, Notebook, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import ReactPlayer from "react-player";

interface ReelItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  category: string | null;
}

interface ReelsPlayerProps {
  items: ReelItem[];
  startIndex: number;
  onClose: () => void;
}

const normalizePlayerUrl = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?playsinline=1&rel=0&modestbranding=1`;
  }

  const igMatch = trimmed.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) {
    return `https://www.instagram.com/reel/${igMatch[1]}/`;
  }

  const tkMatch = trimmed.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/);
  if (tkMatch) {
    return `https://www.tiktok.com/@${tkMatch[1]}/video/${tkMatch[2]}`;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
};

const ReelsPlayer = ({ items, startIndex, onClose }: ReelsPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const constraintsRef = useRef<HTMLDivElement>(null);

  const current = items[currentIndex];
  const playerUrl = current?.video_url ? normalizePlayerUrl(current.video_url) : null;
  const canPlay = !!playerUrl && ReactPlayer.canPlay(playerUrl);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) setCurrentIndex(i => i + 1);
  }, [currentIndex, items.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -80) goNext();
    else if (info.offset.y > 80) goPrev();
  };

  const toggleComplete = () => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-[110] rounded-full bg-black/50 p-2 text-white backdrop-blur-sm"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 right-4 z-[110] rounded-full bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
        {currentIndex + 1}/{items.length}
      </div>

      {/* Swipeable video area */}
      <motion.div
        ref={constraintsRef}
        className="flex-1 relative overflow-hidden"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {playerUrl && canPlay ? (
              <ReactPlayer
                url={playerUrl}
                playing
                controls={false}
                width="100%"
                height="100%"
                playsinline
                style={{ background: "hsl(var(--background))" }}
                config={{
                  youtube: {
                    playerVars: {
                      playsinline: 1,
                      rel: 0,
                      modestbranding: 1,
                      controls: 0,
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black">
                {current.thumbnail_url ? (
                  <img src={current.thumbnail_url} alt={current.title} className="h-full w-full object-cover opacity-60" />
                ) : (
                  <span className="text-6xl">🚀</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-sm">Vídeo indisponível ou bloqueado na origem</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right-side action buttons */}
        <div className="absolute right-3 bottom-32 z-[110] flex flex-col items-center gap-5">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
              <Notebook className="h-5 w-5 text-white" />
            </div>
            <span className="text-[9px] text-white/70">Anotar</span>
          </button>

          <button onClick={toggleComplete} className="flex flex-col items-center gap-1">
            <div className={`rounded-full p-3 backdrop-blur-sm ${completed.has(current.id) ? "bg-green-500/80" : "bg-black/50"}`}>
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-[9px] text-white/70">{completed.has(current.id) ? "Feito" : "Marcar"}</span>
          </button>
        </div>

        {/* Swipe indicators */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[105] flex flex-col items-center gap-2 opacity-30">
          {currentIndex > 0 && <ChevronUp className="h-5 w-5 text-white animate-bounce" />}
          {currentIndex < items.length - 1 && <ChevronDown className="h-5 w-5 text-white animate-bounce" />}
        </div>

        {/* Bottom overlay — title & description */}
        <div className="absolute bottom-0 left-0 right-14 z-[110] bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
          <p className="text-sm font-bold text-white drop-shadow-lg">{current.title}</p>
          {current.description && (
            <p className="mt-1 text-xs text-white/70 line-clamp-2 drop-shadow">{current.description}</p>
          )}
          {current.category && (
            <span className="mt-2 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
              {current.category}
            </span>
          )}
        </div>
      </motion.div>

      {/* Notes overlay */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 z-[120] rounded-t-2xl bg-card/95 backdrop-blur-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-foreground">📝 Insight</h4>
              <button onClick={() => setShowNotes(false)} className="text-xs text-muted-foreground">Fechar</button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Anote seu insight sobre este conteúdo..."
              className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground outline-none placeholder:text-muted-foreground resize-none h-24"
            />
            <button
              onClick={() => { setShowNotes(false); }}
              className="mt-2 w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground"
            >
              Salvar Insight
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReelsPlayer;
