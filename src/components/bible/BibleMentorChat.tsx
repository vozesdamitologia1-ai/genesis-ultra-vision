import { useState } from "react";
import { MessageCircle, Send, Loader2, Mic } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { BibleStudyResult } from "@/components/BibleReader";

interface BibleMentorChatProps {
  result: BibleStudyResult;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const BibleMentorChat = ({ result }: BibleMentorChatProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  const contextSummary = `Contexto atual: ${result.book} capítulo ${result.chapter}. Insight: ${result.insight?.slice(0, 500)}. Palavra original: ${result.originalWord?.word} (${result.originalWord?.meaning?.slice(0, 200)}).`;

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    const userMsg: ChatMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = `Você é o Mentor Legado do app Genesis Vision. O usuário está lendo ${result.book} capítulo ${result.chapter}. ${contextSummary}

Responda a pergunta do usuário especificamente sobre este capítulo. Seja profundo mas conciso (máx 3 parágrafos). Use referências bíblicas quando relevante. Responda no idioma do usuário.`;

      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: {
          message: q,
          history: messages,
          systemPrompt,
        },
      });

      if (error) throw error;

      const reply = data?.reply ?? t("legado.bible.mentorChat.noAnswer", "Sem resposta.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("legado.bible.mentorChat.error", "Erro ao consultar o Mentor. Tente novamente.") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-left transition-colors hover:bg-amber-400/10"
      >
        <MessageCircle className="h-4 w-4 text-amber-400" />
        <span className="font-serif text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
          {t("legado.bible.mentorChat.title", "Pergunte ao Mentor sobre este Capítulo")}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-lg border border-amber-400/15 bg-card/80"
          >
            {/* Messages */}
            <div className="max-h-60 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center font-serif text-xs text-muted-foreground italic">
                  {t("legado.bible.mentorChat.hint", "Ex: \"O que significa a 'vara' e o 'cajado' no versículo 4?\"")}
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs font-serif leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-400/15 text-foreground"
                        : "bg-amber-400/5 text-foreground/80 border border-amber-400/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg bg-amber-400/5 px-3 py-2 border border-amber-400/10">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                    <span className="text-xs text-muted-foreground font-serif">
                      {t("legado.bible.mentorChat.thinking", "Meditando...")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-amber-400/10 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("legado.bible.mentorChat.inputPlaceholder", "Sua pergunta sobre o capítulo...")}
                className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground font-serif"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-full bg-amber-400/15 p-2 text-amber-400 transition-colors hover:bg-amber-400/25 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BibleMentorChat;
