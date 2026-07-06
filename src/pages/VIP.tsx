import { Crown, Lock, CheckCircle, Sparkles, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ContentRail from "@/components/ContentRail";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const VIP = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";
  const pathType = isLegado ? "legacy" : "flow";
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center pb-16">
          <div className="animate-pulse text-muted-foreground text-xs">{t("vip.loading")}</div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // VIP Content — temporarily unlocked for all users
  if (true || accessLevel === "vip") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 pt-14 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 text-center mb-4"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full border ${isLegado ? "bg-amber-400/10 border-amber-400/30" : "bg-primary/10 border-primary/30"}`}>
              <Crown className={`h-7 w-7 ${isLegado ? "text-amber-400" : "text-primary"}`} />
            </div>
            <h1 className={`text-xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
              {t("vip.welcome")}
            </h1>
            <div className={`h-0.5 w-12 ${isLegado ? "bg-amber-400/50" : "bg-primary/50"}`} />
          </motion.div>

          <ContentRail
            title={t("vip.exclusiveContent", "Conteúdo Exclusivo")}
            description={t("vip.exclusiveDesc", "Acesso premium desbloqueado")}
            pathType={pathType}
            isVip={true}
            layout={isLegado ? "list" : "grid"}
            showSearch
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  // Free — Premium Upgrade Screen
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5 text-center mt-10"
        >
          {/* Premium Lock Icon */}
          <div className="relative">
            <motion.div
              className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${
                isLegado
                  ? "border-amber-400/40 bg-gradient-to-br from-amber-400/20 via-amber-900/10 to-black"
                  : "border-primary/40 bg-gradient-to-br from-primary/20 via-purple-900/10 to-black"
              }`}
            >
              <Lock className={`h-10 w-10 ${isLegado ? "text-amber-400" : "text-primary"}`} />
            </motion.div>
            <motion.div
              className={`absolute inset-0 rounded-full border-2 ${isLegado ? "border-amber-400/20" : "border-primary/20"}`}
              animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full border ${isLegado ? "border-amber-400/10" : "border-primary/10"}`}
              animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            {/* Sparkle accents */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 180] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className={`h-4 w-4 ${isLegado ? "text-amber-400" : "text-primary"}`} />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -left-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Star className={`h-3 w-3 ${isLegado ? "text-amber-400/60" : "text-primary/60"}`} />
            </motion.div>
          </div>

          {/* Title */}
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${isLegado ? "text-amber-400/70" : "text-primary/70"}`}>
              {t("vip.subscriptionRequired", "Assinatura Necessária")}
            </p>
            <h1 className={`text-2xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
              {t("vip.upgradeTitle")}
            </h1>
          </div>

          <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
            {t("vip.upgradeDesc")}
          </p>

          {/* Perks */}
          <div className={`w-full max-w-[300px] space-y-3 mt-2 rounded-2xl border p-5 ${
            isLegado
              ? "border-amber-400/20 bg-gradient-to-b from-amber-400/5 to-transparent"
              : "border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
          }`}>
            {[
              t("vip.perk1"),
              t("vip.perk2"),
              t("vip.perk3"),
            ].map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 text-left"
              >
                <CheckCircle className={`h-4 w-4 flex-shrink-0 ${isLegado ? "text-amber-400" : "text-primary"}`} />
                <span className="text-xs text-foreground">{perk}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`mt-4 rounded-full px-10 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg ${
              isLegado
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-400/20 hover:shadow-amber-400/40"
                : "bg-gradient-to-r from-primary to-red-500 text-primary-foreground shadow-primary/20 hover:shadow-primary/40"
            }`}
          >
            {t("vip.unlockButton", "DESBLOQUEAR ACESSO VIP")}
          </motion.button>

          <p className="text-[10px] text-muted-foreground mt-1">
            {t("vip.upgradeNote")}
          </p>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

export default VIP;
