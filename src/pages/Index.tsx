import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import portalLegado from "@/assets/portal-legado.jpg";
import portalFlow from "@/assets/portal-flow.jpg";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";

const Index = () => {
  const { selectPath } = usePath();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 flex-col pt-12 pb-16">
        {/* LEGADO */}
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <img src={portalLegado} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <img src={portalFlow} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
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
            <h2 className="max-w-xs font-sans text-2xl font-bold leading-tight text-foreground sm:text-3xl">
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

      <BottomNav />
    </div>
  );
};

export default Index;
