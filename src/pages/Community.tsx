import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface CommunityMessage {
  id: string;
  content: string | null;
  path_type: string | null;
  user_id: string | null;
  created_at: string | null;
}

const Community = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };
    loadMessages();

    // Realtime subscription
    const channel = supabase
      .channel("community-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new as CommunityMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !userId) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    await supabase.from("community_messages").insert({
      content,
      user_id: userId,
      path_type: path === "portal" ? null : path,
    });

    setSending(false);
  };

  const bubbleMine = isLegado
    ? "bg-amber-400/20 text-foreground border border-amber-400/20"
    : "bg-primary/20 text-foreground border border-primary/20";
  const bubbleOther = "bg-secondary text-secondary-foreground";

  const formatTime = (ts: string | null) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col pt-14 pb-20">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className={`h-5 w-5 ${isLegado ? "text-amber-400" : "text-primary"}`} />
            <h1 className={`text-sm font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
              {t("community.title", "Comunidade")}
            </h1>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {t("community.subtitle", "Conecte-se com a comunidade em tempo real.")}
          </p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Users className="h-8 w-8 opacity-20" />
              <p className="text-xs">{t("community.empty", "Nenhuma mensagem ainda. Seja o primeiro!")}</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.user_id === userId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 ${isMine ? bubbleMine : bubbleOther}`}>
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] text-muted-foreground mt-1 text-right">{formatTime(msg.created_at)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        {userId ? (
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("community.placeholder", "Escreva sua mensagem...")}
                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={2000}
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-40 ${
                  isLegado ? "bg-amber-400 text-black" : "bg-primary text-primary-foreground"
                }`}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-border px-4 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              {t("community.loginRequired", "Faça login para participar da comunidade.")}
            </p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Community;
