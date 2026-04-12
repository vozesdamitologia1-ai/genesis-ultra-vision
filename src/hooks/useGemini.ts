import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useGemini() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, pathType?: string) => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: message.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { message: message.trim(), history: messages, pathType: pathType || null },
      });

      if (error) throw error;

      const reply = data?.reply ?? "Sem resposta.";
      const assistantMsg: ChatMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);

      // Save to mentorship_logs
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("mentorship_logs").insert({
            user_id: user.id,
            user_query: message.trim(),
            ai_response: reply,
            path_type: pathType || null,
          });
        }
      } catch (logErr) {
        console.warn("Failed to save mentorship log:", logErr);
      }
    } catch (e) {
      console.error("Gemini error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com a IA. Tente novamente." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, isLoading, sendMessage, clearMessages };
}
