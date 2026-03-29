import { Home, BookOpen, Star, Users, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePath } from "@/contexts/PathContext";

const navItems = [
  { icon: Home, key: "home" },
  { icon: BookOpen, key: "study" },
  { icon: Star, key: "vip" },
  { icon: Users, key: "community" },
  { icon: User, key: "profile" },
];

const BottomNav = () => {
  const [active, setActive] = useState(0);
  const { t } = useTranslation();
  const { path } = usePath();

  // Theme-aware active color
  const activeClass =
    path === "legado"
      ? "text-foreground drop-shadow-[0_0_6px_hsl(var(--foreground)/0.4)]"
      : "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setActive(i)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-300 ${
              i === active ? activeClass : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium tracking-wide">{t(`nav.${item.key}`)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
