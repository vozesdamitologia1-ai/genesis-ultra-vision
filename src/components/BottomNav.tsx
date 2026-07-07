import { BookOpen, Users, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePath } from "@/contexts/PathContext";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const navigate = useNavigate();
  const location = useLocation();

  const isLegado = path === "legado";

  const navItems = [
    { icon: BookOpen, key: "study", route: "/study" },
    { icon: Users, key: "community", route: "/community" },
    { icon: User, key: "profile", route: "/profile" },
  ];

  const getActiveIndex = () => {
    const map: Record<string, number> = {
      "/study": 0,
      "/community": 1,
      "/profile": 2,
      "/legado": -1,
      "/flow": -1,
    };
    return map[location.pathname] ?? -1;
  };

  const active = getActiveIndex();

  const activeColor = isLegado
    ? "text-amber-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
    : "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]";

  const barBg = isLegado
    ? "bg-black/95 border-amber-400/20"
    : "bg-background/95 border-border";

  const fontClass = isLegado ? "font-serif" : "font-sans";

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${barBg}`}>
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item, i) => (
          <button
            key={item.key}
            onClick={() => navigate(item.route)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-300 ${
              i === active ? activeColor : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className={`text-[10px] font-medium tracking-wide ${fontClass}`}>
              {t(`nav.${item.key}`)}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
