import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ContentRail from "@/components/ContentRail";
import { usePath } from "@/contexts/PathContext";
import { motion } from "framer-motion";

const Study = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className={`text-xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
            {t("study.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t("study.subtitle")}</p>
          <div className={`mt-3 h-0.5 w-12 ${isLegado ? "bg-amber-400/50" : "bg-primary/50"}`} />
        </motion.div>

        {isLegado ? (
          <>
            <ContentRail
              title={t("legado.rails.school.title")}
              description={t("legado.rails.school.description")}
              pathType="legado"
              category="school"
            />
            <div className="mx-0 h-px bg-border/50 my-2" />
            <ContentRail
              title={t("legado.rails.archive.title")}
              description={t("legado.rails.archive.description")}
              pathType="legado"
              category="archive"
            />
          </>
        ) : (
          <>
            <ContentRail
              title={t("flow.rails.performance.title")}
              description={t("flow.rails.performance.description")}
              pathType="flow"
              category="performance"
            />
            <div className="mx-0 h-px bg-border/50 my-2" />
            <ContentRail
              title={t("flow.rails.government.title")}
              description={t("flow.rails.government.description")}
              pathType="flow"
              category="government"
            />
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Study;
