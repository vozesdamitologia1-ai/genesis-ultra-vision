import { useTranslation } from "react-i18next";
import { Globe, Smartphone, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  title: string;
  city: string;
  state: string;
  country_code: string | null;
  raised_amount: number | null;
  goal_amount: number;
  description: string | null;
}

const VolunteerSection = () => {
  const { t, i18n } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const isUSA = i18n.language === "en";
  const countryCode = isUSA ? "US" : "BR";
  const currencySymbol = isUSA ? "$" : "R$";

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("country_code", countryCode);
      setCampaigns(data || []);
      setLoading(false);
    };
    fetchCampaigns();
  }, [countryCode]);

  const formatCurrency = (value: number) =>
    `${currencySymbol} ${value.toLocaleString(isUSA ? "en-US" : "pt-BR")}`;

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

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded border border-border/50 bg-card/80" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("flow.volunteer.noCampaigns")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {campaigns.map((c) => {
            const raised = c.raised_amount ?? 0;
            const pct = Math.round((raised / c.goal_amount) * 100);
            return (
              <div key={c.id} className="rounded border border-border/50 bg-card/80 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{c.title}</span>
                  <span className="text-[10px] text-muted-foreground">{pct}%</span>
                </div>
                <p className="mb-2 text-[10px] text-muted-foreground">
                  {c.city}, {c.state}
                </p>
                <Progress value={pct} className="mb-2 h-1.5" />
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    {formatCurrency(raised)} {t("flow.volunteer.donated")}
                  </span>
                  <span>
                    {formatCurrency(c.goal_amount)} {t("flow.volunteer.goal")}
                  </span>
                </div>
                <button className="mt-3 flex w-full items-center justify-center gap-2 bg-primary py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90">
                  {isUSA ? (
                    <CreditCard className="h-3 w-3" />
                  ) : (
                    <Smartphone className="h-3 w-3" />
                  )}
                  {t("flow.volunteer.donate")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default VolunteerSection;
