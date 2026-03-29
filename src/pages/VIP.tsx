import { Crown, Lock, CheckCircle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const VIP = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";
  const [accessLevel, setAccessLevel] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("access_level")
            .eq("id", user.id)
            .single();
          if (profile?.access_level) {
            setAccessLevel(profile.access_level);
          }
        }
      } catch {
        // Not logged in — default free
      }
      setLoading(false);
    };
    checkAccess();
  }, []);

  const accentColor = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400/10 border-amber-400/30" : "bg-primary/10 border-primary/30";
  const accentBtn = isLegado
    ? "bg-amber-400 text-black hover:bg-amber-500"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center pb-16">
          <div className="animate-pulse text-muted-foreground text-xs">{t("vip.loading", "Carregando...")}</div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // VIP Content
  if (accessLevel === "vip") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 pt-14 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center mt-8"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${accentBg} border`}>
              <Crown className={`h-8 w-8 ${accentColor}`} />
            </div>
            <h1 className={`text-xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
              {t("vip.welcome", "Bem-vindo, VIP")}
            </h1>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              {t("vip.welcomeDesc", "Você tem acesso completo ao conteúdo exclusivo.")}
            </p>
            <div className={`mt-4 h-0.5 w-12 ${isLegado ? "bg-amber-400/50" : "bg-primary/50"}`} />

            {/* VIP content cards */}
            <div className="w-full mt-6 space-y-3">
              {[
                { icon: Sparkles, title: t("vip.feature1", "Mentoria Exclusiva 1:1"), desc: t("vip.feature1Desc", "Sessões privadas com mentores seniores.") },
                { icon: CheckCircle, title: t("vip.feature2", "Conteúdo Premium"), desc: t("vip.feature2Desc", "Aulas avançadas e materiais exclusivos.") },
                { icon: Crown, title: t("vip.feature3", "Comunidade VIP"), desc: t("vip.feature3Desc", "Acesso ao grupo fechado de líderes.") },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`flex items-start gap-3 rounded-xl border p-4 ${accentBg}`}
                >
                  <f.icon className={`h-5 w-5 mt-0.5 ${accentColor}`} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Free — Upgrade screen
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5 text-center mt-12"
        >
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${accentBg} border-2`}>
            <Lock className={`h-8 w-8 ${accentColor}`} />
            <motion.div
              className={`absolute inset-0 rounded-full border-2 ${isLegado ? "border-amber-400/30" : "border-primary/30"}`}
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <h1 className={`text-xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
            {t("vip.upgradeTitle", "Conteúdo Exclusivo")}
          </h1>
          <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
            {t("vip.upgradeDesc", "Desbloqueie mentoria 1:1, conteúdo premium e acesso à comunidade VIP.")}
          </p>

          <div className="w-full max-w-[280px] space-y-2 mt-4">
            {[
              t("vip.perk1", "Mentoria exclusiva com líderes"),
              t("vip.perk2", "Aulas e materiais premium"),
              t("vip.perk3", "Grupo VIP de networking"),
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-left">
                <CheckCircle className={`h-4 w-4 flex-shrink-0 ${accentColor}`} />
                <span className="text-xs text-foreground">{perk}</span>
              </div>
            ))}
          </div>

          <button className={`mt-6 rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all ${accentBtn}`}>
            {t("vip.upgradeButton", "TORNAR-SE VIP")}
          </button>
          <p className="text-[10px] text-muted-foreground mt-1">
            {t("vip.upgradeNote", "Cancele a qualquer momento.")}
          </p>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

export default VIP;
