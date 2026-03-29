import { useTranslation } from "react-i18next";
import { Heart, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SOSButton = () => {
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSOS = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: t("flow.sos.loginRequired", "Faça login para pedir ajuda"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("help_requests").insert({
        user_id: user.id,
        message: "SOS - Pedido de ajuda urgente",
        status: "pending",
      });

      if (error) throw error;

      setShowMessage(true);
      toast({
        title: t("flow.sos.sent", "Mensagem enviada!"),
        description: t("flow.sos.sentDesc", "Entraremos em contato em breve."),
      });
    } catch (err) {
      console.error("SOS error:", err);
      toast({
        title: t("flow.sos.error", "Erro ao enviar"),
        description: t("flow.sos.errorDesc", "Tente novamente mais tarde."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed floating SOS button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="SOS"
      >
        <Heart className="h-5 w-5" />
      </button>

      {/* Expanded SOS panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-34 right-4 z-40 w-72 rounded-xl border border-destructive/30 bg-background p-4 shadow-xl"
          >
            <h3 className="mb-1 text-sm font-bold text-foreground">{t("flow.sos.title")}</h3>
            <p className="mb-3 text-[11px] text-muted-foreground">{t("flow.sos.description")}</p>

            <button
              onClick={handleSOS}
              disabled={loading || showMessage}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : showMessage ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              {showMessage ? t("flow.sos.sentShort", "Enviado!") : t("flow.sos.button")}
            </button>

            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg bg-destructive/10 p-2.5"
              >
                <p className="text-[11px] text-foreground">
                  {t("flow.sos.confirmation", "Sua mensagem foi enviada. Nossa equipe entrará em contato em breve. Você não está sozinho(a). 💛")}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
