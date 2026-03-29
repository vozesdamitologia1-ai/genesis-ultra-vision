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
    <section className="px-4 py-8">
      <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-primary/10 p-6 text-center">
        <h3 className="mb-1 text-lg font-bold text-foreground">{t("flow.sos.title")}</h3>
        <p className="mb-4 text-xs text-muted-foreground">{t("flow.sos.description")}</p>

        <button
          onClick={handleSOS}
          disabled={loading || showMessage}
          className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
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

        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded bg-primary/20 p-3"
            >
              <p className="text-sm text-foreground">
                {t("flow.sos.confirmation", "Sua mensagem foi enviada. Nossa equipe entrará em contato em breve. Você não está sozinho(a). 💛")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SOSButton;
