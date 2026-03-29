import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const campaigns = [
  { id: 1, name: "África — Água Limpa", donated: 12500, goal: 25000 },
  { id: 2, name: "Brasil — Educação", donated: 8700, goal: 15000 },
  { id: 3, name: "Ásia — Alimentos", donated: 19200, goal: 30000 },
];

const VolunteerSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-8">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">{t("flow.volunteer.title")}</h3>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">{t("flow.volunteer.description")}</p>

      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
        {t("flow.volunteer.campaigns")}
      </p>

      <div className="flex flex-col gap-4">
        {campaigns.map((c) => {
          const pct = Math.round((c.donated / c.goal) * 100);
          return (
            <div key={c.id} className="rounded border border-border/50 bg-card/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="mb-2 h-1.5" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  ${c.donated.toLocaleString()} {t("flow.volunteer.donated")}
                </span>
                <span>
                  ${c.goal.toLocaleString()} {t("flow.volunteer.goal")}
                </span>
              </div>
              <button className="mt-3 w-full bg-primary py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90">
                {t("flow.volunteer.donate")}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VolunteerSection;
