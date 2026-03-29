import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import portalLegado from "@/assets/portal-legado.jpg";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ContentRail from "@/components/ContentRail";
import BibleReader from "@/components/BibleReader";

const Legado = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="flex-1 pt-12 pb-16">
        {/* Hero */}
        <section className="relative flex h-[50vh] flex-col items-center justify-center overflow-hidden">
          <img src={portalLegado} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3 px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              {t("legado.hero.tag")}
            </span>
            <h1 className="max-w-sm font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {t("legado.hero.title")}
            </h1>
            <p className="text-xs text-muted-foreground">{t("legado.hero.subtitle")}</p>
            <div className="h-0.5 w-10 bg-muted-foreground" />
          </motion.div>
        </section>

        {/* Content Rails */}
        <ContentRail
          title={t("legado.rails.school.title")}
          description={t("legado.rails.school.description")}
          pathType="legacy"
          category="school"
        />

        <div className="mx-4 h-px bg-border/50" />

        <ContentRail
          title={t("legado.rails.archive.title")}
          description={t("legado.rails.archive.description")}
          pathType="legado"
          category="archive"
        />

        <div className="mx-4 h-px bg-border/50" />

        {/* Bible Reader */}
        <BibleReader />
      </main>

      <BottomNav />
    </div>
  );
};

export default Legado;
