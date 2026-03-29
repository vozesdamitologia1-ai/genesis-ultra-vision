import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import portalLegado from "@/assets/portal-legado.jpg";
import portalFlow from "@/assets/portal-flow.jpg";
import { usePath } from "@/contexts/PathContext";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const { selectPath } = usePath();
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<"legado" | "flow" | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header with just brand + language */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
        <span className="font-serif text-lg font-bold italic tracking-wide text-foreground">
          {t("header.brand")}
        </span>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col pt-12">
        {/* LEGADO */}
        <section
          className="relative flex flex-1 flex-col items-center justify-center overflow-hidden"
          onMouseEnter={() => setHovered("legado")}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={portalLegado}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              hovered === "flow" ? "brightness-50" : "brightness-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              {t("portal.legado.tag")}
            </span>
            <h2 className="max-w-xs font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {t("portal.legado.title")}
            </h2>
            <p className="text-xs text-muted-foreground">{t("portal.legado.subtitle")}</p>
            <div className="h-0.5 w-10 bg-muted-foreground" />
            <button
              onClick={() => selectPath("legado")}
              className="mt-2 border border-foreground bg-foreground px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-background transition-all hover:bg-foreground/90"
            >
              [{t("portal.legado.button")}]
            </button>
          </motion.div>
        </section>

        <div className="h-px w-full bg-border" />

        {/* FLOW */}
        <section
          className="relative flex flex-1 flex-col items-center justify-center overflow-hidden"
          onMouseEnter={() => setHovered("flow")}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={portalFlow}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              hovered === "legado" ? "brightness-50" : "brightness-100"
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/20 to-background" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              {t("portal.flow.tag")}
            </span>
            <h2 className="max-w-xs font-sans text-2xl font-extrabold leading-tight text-foreground sm:text-3xl uppercase tracking-wide">
              {t("portal.flow.title")}
            </h2>
            <p className="text-xs text-primary">{t("portal.flow.subtitle")}</p>
            <div className="h-0.5 w-10 bg-primary" />
            <button
              onClick={() => selectPath("flow")}
              className="mt-2 bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              [{t("portal.flow.button")}]
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Index;
