import { User, Globe, Palette, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { path, selectPath } = usePath();
  const isLegado = path === "legado";
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
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

  const accentColor = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400/10 border-amber-400/20" : "bg-primary/10 border-primary/20";

  const settingsItems = [
    {
      icon: Globe,
      label: t("profile.language", "Idioma"),
      value: i18n.language === "pt" ? "Português" : "English",
      action: toggleLanguage,
    },
    {
      icon: Palette,
      label: t("profile.theme", "Tema"),
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

          {userEmail && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-all active:scale-[0.98]"
            >
              <LogOut className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">{t("profile.logout", "Sair")}</span>
            </button>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
