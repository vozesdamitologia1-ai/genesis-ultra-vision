import { Home, BookOpen, Sparkles, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePath } from "@/contexts/PathContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import MentorChat from "./MentorChat";

const BottomNav = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const navigate = useNavigate();
  const location = useLocation();
  const [mentorOpen, setMentorOpen] = useState(false);

  const isLegado = path === "legado";

  const navItems = [
    { icon: Home, key: "home", action: () => navigate("/") },
    {
      icon: BookOpen,
      key: "trails",
      action: () => {
        if (path === "legado") navigate("/legado");
        else if (path === "flow") navigate("/flow");
        else navigate("/");
      },
    },
    { icon: Sparkles, key: "mentor", action: () => setMentorOpen(true) },
    { icon: User, key: "profile", action: () => navigate("/profile") },
  ];

  const getActiveIndex = () => {
    if (mentorOpen) return 2;
    if (location.pathname === "/profile") return 3;
    if (location.pathname === "/legado" || location.pathname === "/flow") return 1;
    return 0;
  };

  const active = getActiveIndex();

  // Theme-aware styling
  const activeColor = isLegado
    ? "text-amber-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
    : "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]";

  const barBg = isLegado
    ? "bg-black/95 border-amber-400/20"
    : "bg-background/95 border-border";

  const fontClass = isLegado ? "font-serif" : "font-sans";

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${barBg}`}>
        <div className="flex items-center justify-around py-2 pb-safe">
          {navItems.map((item, i) => (
            <button
              key={item.key}
              onClick={item.action}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-300 ${
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
      <MentorChat open={mentorOpen} onClose={() => setMentorOpen(false)} />
    </>
  );
};

export default BottomNav;
