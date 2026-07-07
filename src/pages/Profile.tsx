import { User, Globe, Palette, LogOut, Settings, Camera, Check, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { path, selectPath } = usePath();
  const { user: authUser, isAdmin } = useAuth();
  const isLegado = path === "legado";
  const [userEmail, setUserEmail] = useState<string | null>(authUser?.email ?? null);
  const [fullName, setFullName] = useState<string>("");
  const [editingName, setEditingName] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadAvatar = async (path: string | null) => {
    if (!path) return setAvatarUrl(null);
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
    setAvatarUrl(data?.signedUrl ?? null);
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email ?? null);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (profile) {
        setFullName(profile.full_name ?? "");
        setAvatarPath(profile.avatar_url ?? null);
        loadAvatar(profile.avatar_url ?? null);
      }
    };
    load();
  }, []);

  const saveName = async () => {
    if (!authUser) return;
    await supabase.from("profiles").update({ full_name: fullName.trim() || null }).eq("id", authUser.id);
    setEditingName(false);
    toast({ title: "Perfil atualizado" });
  };

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${authUser.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Erro ao enviar foto", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    await supabase.from("profiles").update({ avatar_url: path }).eq("id", authUser.id);
    setAvatarPath(path);
    await loadAvatar(path);
    setUploading(false);
    toast({ title: "Foto atualizada" });
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ language: newLang, preferred_language: newLang } as any).eq("id", user.id);
    }
  };

  const toggleMode = () => selectPath(isLegado ? "flow" : "legado");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const accentColor = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400/10 border-amber-400/20" : "bg-primary/10 border-primary/20";

  const settingsItems = [
    { icon: Globe, label: t("profile.language"), value: i18n.language === "pt" ? "Português" : "English", action: toggleLanguage },
    { icon: Palette, label: t("profile.theme"), value: isLegado ? "Legado" : "Flow", action: toggleMode },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-6">
        <div className="flex flex-col items-center gap-3 mt-8 mb-8">
          <div className="relative">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`flex h-24 w-24 items-center justify-center rounded-full border-2 overflow-hidden ${accentBg}`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <User className={`h-10 w-10 ${accentColor}`} />
              )}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background ${isLegado ? "bg-amber-400" : "bg-primary"} text-black`}
              aria-label="Alterar foto"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
          </div>

          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder="Seu nome"
                className={`rounded-lg border bg-secondary px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 ${isLegado ? "focus:ring-amber-400/40" : "focus:ring-primary/40"}`}
              />
              <button onClick={saveName} className={`flex h-8 w-8 items-center justify-center rounded-full ${isLegado ? "bg-amber-400" : "bg-primary"} text-black`}>
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="flex items-center gap-2">
              <h1 className={`text-lg font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
                {fullName || t("nav.profile")}
              </h1>
              <Pencil className={`h-3.5 w-3.5 ${accentColor}`} />
            </button>
          )}
          {userEmail && <p className="text-[11px] text-muted-foreground">{userEmail}</p>}
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 mb-4 transition-all active:scale-[0.98] ${accentBg}`}
          >
            <Settings className={`h-5 w-5 ${accentColor}`} />
            <span className="text-sm font-bold text-foreground">Gerenciar Conteúdo</span>
          </button>
        )}

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
