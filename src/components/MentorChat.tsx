import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { useGemini } from "@/hooks/useGemini";
import { useTranslation } from "react-i18next";
import { usePath } from "@/contexts/PathContext";
import { motion, AnimatePresence } from "framer-motion";

interface MentorChatProps {
  open: boolean;
  onClose: () => void;
}

const MentorChat = ({ open, onClose }: MentorChatProps) => {
  const { messages, isLoading, sendMessage, clearMessages } = useGemini();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { path } = usePath();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const accentClass = path === "legado" ? "bg-foreground text-background" : "bg-primary text-primary-foreground";
  const bubbleUser = path === "legado" ? "bg-foreground/90 text-background" : "bg-primary/90 text-primary-foreground";
  const bubbleAI = "bg-secondary text-secondary-foreground";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-serif text-sm font-bold tracking-wide text-foreground">
                {t("mentor.title", "Mentor IA")}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Sparkles className="h-10 w-10 opacity-30" />
                <p className="text-xs text-center max-w-[200px]">
                  {t("mentor.empty", "Pergunte algo ao seu mentor espiritual...")}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user" ? bubbleUser : bubbleAI
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`${bubbleAI} rounded-2xl px-4 py-2.5`}>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border px-4 py-3 pb-safe">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("mentor.placeholder", "Digite sua mensagem...")}
                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={5000}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-40 ${accentClass}`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MentorChat;
