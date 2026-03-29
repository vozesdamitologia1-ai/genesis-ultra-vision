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
  const pathType = isLegado ? "legacy" : "flow";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h1 className={`text-xl font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
            {t("study.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t("study.subtitle")}</p>
          <div className={`mt-3 h-0.5 w-12 ${isLegado ? "bg-amber-400/50" : "bg-primary/50"}`} />
        </motion.div>

        <ContentRail
          title={t(isLegado ? "legado.rails.school.title" : "flow.rails.performance.title", "Conteúdo")}
          description={t(isLegado ? "legado.rails.school.description" : "flow.rails.performance.description", "")}
          pathType={pathType}
          isVip={false}
          layout={isLegado ? "list" : "grid"}
          showSearch
        />
      </main>
      <BottomNav />
    </div>
  );
};

export default Study;
