import { BookOpen, Users, User, Mic, Home } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePath } from "@/contexts/PathContext";
import { useNavigate, useLocation } from "react-router-dom";
import VoiceMentor from "./VoiceMentor";

const BottomNav = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const navigate = useNavigate();
  const location = useLocation();
  const [voiceOpen, setVoiceOpen] = useState(false);

  const isLegado = path === "legado";
  const showMentor = path === "legado" || path === "flow";
  const mentorLabel = isLegado ? "Legado" : "Flow";
  const homeRoute = path === "flow" ? "/flow" : path === "legado" ? "/legado" : "/";

  const navItems = [
    { icon: Home, key: "home", route: homeRoute, label: t("nav.home", "Início") },
    { icon: BookOpen, key: "study", route: "/study", label: t("nav.study") },
    { icon: Users, key: "community", route: "/community", label: t("nav.community") },
    ...(showMentor
      ? [{ icon: Mic, key: "mentor", route: "__mentor__", label: mentorLabel }]
      : []),
    { icon: User, key: "profile", route: "/profile", label: t("nav.profile") },
  ];

  const getActiveKey = () => {
    const map: Record<string, string> = {
      "/study": "study",
      "/community": "community",
      "/profile": "profile",
      "/legado": "home",
      "/flow": "home",
      "/": "home",
    };
    return map[location.pathname] ?? "";
  };
  const activeKey = voiceOpen ? "mentor" : getActiveKey();


  const activeColor = isLegado
    ? "text-amber-400 drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
    : "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]";

  const barBg = isLegado
    ? "bg-black/95 border-amber-400/20"
    : "bg-background/95 border-border";

  const fontClass = isLegado ? "font-serif" : "font-sans";

  const handleClick = (item: (typeof navItems)[number]) => {
    if (item.key === "mentor") {
      setVoiceOpen(true);
    } else {
      navigate(item.route);
    }
  };

  return (
    <>
      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${barBg}`}>
        <div className="flex items-center justify-around py-2 pb-safe">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-300 ${
                item.key === activeKey ? activeColor : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className={`text-[10px] font-medium tracking-wide ${fontClass}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
      <VoiceMentor open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
};

export default BottomNav;
