import { User, Globe, Palette, LogOut, Crown, Loader2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { path, selectPath } = usePath();
  const isLegado = path === "legado";
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<string>("free");
  const [togglingVip, setTogglingVip] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, access_level")
          .eq("id", user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
        if (profile?.access_level) setAccessLevel(profile.access_level);
      }
    };
    load();
  }, []);

  const toggleLanguage = async () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ language: newLang, preferred_language: newLang } as any).eq("id", user.id);
    }
  };

  const toggleMode = () => {
    selectPath(isLegado ? "flow" : "legado");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleToggleVip = async () => {
    setTogglingVip(true);
    const newLevel = accessLevel === "vip" ? "free" : "vip";
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ access_level: newLevel }).eq("id", user.id);
      setAccessLevel(newLevel);
      toast({
        title: newLevel === "vip" ? t("profile.vipActivated", "🎉 VIP Ativado!") : t("profile.vipDeactivated", "VIP Desativado"),
        description: newLevel === "vip"
          ? t("profile.vipActivatedDesc", "Você agora tem acesso ao conteúdo premium.")
          : t("profile.vipDeactivatedDesc", "Voltou ao plano gratuito."),
      });
    }
    setTogglingVip(false);
  };

  const accentColor = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400/10 border-amber-400/20" : "bg-primary/10 border-primary/20";

  const settingsItems = [
    {
      icon: Globe,
      label: t("profile.language"),
      value: i18n.language === "pt" ? "Português" : "English",
      action: toggleLanguage,
    },
    {
      icon: Palette,
      label: t("profile.theme"),
      value: isLegado ? "Legado" : "Flow",
      action: toggleMode,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-6">
        {/* Avatar area */}
        <div className="flex flex-col items-center gap-3 mt-8 mb-8">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${accentBg}`}>
            <User className={`h-10 w-10 ${accentColor}`} />
          </div>
          <h1 className={`text-lg font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
            {fullName || t("nav.profile")}
          </h1>
          {userEmail && (
            <p className="text-[11px] text-muted-foreground">{userEmail}</p>
          )}
          {/* Access level badge */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            accessLevel === "vip"
              ? isLegado ? "bg-amber-400/20 text-amber-400" : "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          }`}>
            {accessLevel === "vip" && <Crown className="h-3 w-3" />}
            {accessLevel === "vip" ? "VIP" : "FREE"}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-2">
          {settingsItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all active:scale-[0.98] ${accentBg}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${accentColor}`} />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.value}</span>
            </button>
          ))}

          {/* Test VIP Toggle */}
          {userEmail && (
            <button
              onClick={handleToggleVip}
              disabled={togglingVip}
              className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all active:scale-[0.98] ${
                accessLevel === "vip"
                  ? isLegado ? "border-amber-400/30 bg-amber-400/10" : "border-primary/30 bg-primary/10"
                  : "border-amber-400/20 bg-amber-400/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className={`h-5 w-5 ${accessLevel === "vip" ? accentColor : "text-muted-foreground"}`} />
                <span className="text-sm text-foreground">
                  {accessLevel === "vip"
                    ? t("profile.removeVip", "Remover VIP (teste)")
                    : t("profile.becomeVip", "Tornar-se VIP (teste)")}
                </span>
              </div>
              {togglingVip ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {accessLevel === "vip" ? "VIP" : "FREE"}
                </span>
              )}
            </button>
          )}

          {userEmail && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-all active:scale-[0.98]"
            >
              <LogOut className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">{t("profile.logout")}</span>
            </button>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
