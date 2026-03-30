import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ContentRail from "@/components/ContentRail";
import GroupsRail from "@/components/GroupsRail";
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

        {isLegado ? (
          /* LEGADO study content */
          <ContentRail
            title={t("legado.rails.school.title", "Escola de Ensino")}
            description={t("legado.rails.school.description", "")}
            pathType="legacy"
            isVip={false}
            layout="list"
            showSearch
          />
        ) : (
          /* FLOW study content - 3 sections only */
          <>
            <ContentRail
              title="Performance & Disciplina"
              description="Treinos físicos, foco nos estudos e rotinas de alta performance."
              pathType="flow"
              category="Performance & Disciplina"
              isVip={false}
              layout="reels"
              emptyMessage="Nenhum conteúdo disponível ainda."
            />

            <div className="mx-0 my-2 h-px bg-border/50" />

            <ContentRail
              title="Governo & Carreira"
              description="Mentorias sobre trabalho, dinheiro e liderança."
              pathType="flow"
              category="Governo & Carreira"
              isVip={false}
              layout="reels"
              emptyMessage="Nenhum conteúdo disponível ainda."
            />

            <div className="mx-0 my-2 h-px bg-border/50" />

            <GroupsRail pathType="flow" />
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Study;
