import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";

const Profile = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 pt-12 pb-16 px-6">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${
          isLegado ? "border-amber-400/50 bg-amber-400/10" : "border-primary/50 bg-primary/10"
        }`}>
          <User className={`h-10 w-10 ${isLegado ? "text-amber-400" : "text-primary"}`} />
        </div>
        <h1 className={`text-lg font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
          {t("nav.profile")}
        </h1>
        <p className="text-xs text-muted-foreground text-center max-w-[250px]">
          {t("profile.comingSoon", "Em breve: seu perfil completo com histórico e configurações.")}
        </p>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
