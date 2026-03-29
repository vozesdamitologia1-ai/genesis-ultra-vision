import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const BrazilFlag = () => (
  <svg viewBox="0 0 512 512" className="h-full w-full">
    <rect width="512" height="512" rx="256" fill="#6DA544" />
    <polygon points="256,100 462,256 256,412 50,256" fill="#FFDA44" />
    <circle cx="256" cy="256" r="90" fill="#0052B4" />
    <path d="M170,256 Q256,220 342,256" fill="none" stroke="#F0F0F0" strokeWidth="18" />
  </svg>
);

const USAFlag = () => (
  <svg viewBox="0 0 512 512" className="h-full w-full">
    <rect width="512" height="512" rx="256" fill="#F0F0F0" />
    <g clipPath="url(#usCircle)">
      <rect y="0" width="512" height="39.4" fill="#D80027" />
      <rect y="78.8" width="512" height="39.4" fill="#D80027" />
      <rect y="157.5" width="512" height="39.4" fill="#D80027" />
      <rect y="236.3" width="512" height="39.4" fill="#D80027" />
      <rect y="315" width="512" height="39.4" fill="#D80027" />
      <rect y="393.8" width="512" height="39.4" fill="#D80027" />
      <rect y="472.6" width="512" height="39.4" fill="#D80027" />
      <rect width="256" height="275.7" fill="#0052B4" />
      <g fill="#F0F0F0">
        {[0,1,2,3,4].map(r => (
          [0,1,2,3,4,5].map(c => (
            <circle key={`${r}-${c}`} cx={22 + c * 42} cy={25 + r * 55} r="8" />
          ))
        ))}
        {[0,1,2,3].map(r => (
          [0,1,2,3,4].map(c => (
            <circle key={`o-${r}-${c}`} cx={43 + c * 42} cy={52.5 + r * 55} r="8" />
          ))
        ))}
      </g>
    </g>
    <clipPath id="usCircle"><circle cx="256" cy="256" r="256" /></clipPath>
  </svg>
);

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const changeLang = async (lng: "pt" | "en") => {
    if (lng === current) return;
    i18n.changeLanguage(lng);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ language: lng } as any)
        .eq("id", user.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {([
        { lng: "pt" as const, Flag: BrazilFlag, label: "Português" },
        { lng: "en" as const, Flag: USAFlag, label: "English" },
      ]).map(({ lng, Flag, label }) => (
        <button
          key={lng}
          onClick={() => changeLang(lng)}
          title={label}
          className={`relative h-8 w-8 overflow-hidden rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
            current === lng
              ? "border-primary shadow-[0_0_10px_hsl(var(--primary)/0.4)] ring-1 ring-primary/30"
              : "border-border/40 opacity-60 hover:opacity-100 hover:border-border"
          }`}
        >
          <Flag />
          {current === lng && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
