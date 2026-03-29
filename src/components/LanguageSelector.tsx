import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const changeLang = async (lng: "pt" | "en") => {
    if (lng === current) return;
    i18n.changeLanguage(lng);

    // Try to sync with Supabase profile if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ language: lng } as any)
        .eq("id", user.id);
    }
  };

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-border/50 bg-background/30 backdrop-blur-md">
      {(["pt", "en"] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => changeLang(lng)}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
            current === lng
              ? "bg-foreground/15 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
