import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Cell {
  id: string;
  name: string;
  is_live: boolean | null;
  live_url: string | null;
  mentor_type: string | null;
  starts_at: string | null;
}

const GroupsRail = () => {
  const { t, i18n } = useTranslation();
  const [cells, setCells] = useState<Cell[]>([]);

  useEffect(() => {
    const fetchCells = async () => {
      const { data } = await supabase
        .from("cells")
        .select("*")
        .eq("language", i18n.language)
        .order("starts_at", { ascending: true })
        .limit(10);
      if (data) setCells(data as Cell[]);
    };
    fetchCells();
  }, [i18n.language]);

  return (
    <section className="px-4 py-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground">{t("flow.rails.groups.title")}</h3>
        <p className="text-xs text-muted-foreground">{t("flow.rails.groups.description")}</p>
      </div>

      {cells.length > 0 ? (
        <div className="flex flex-col gap-3">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="flex items-center justify-between rounded border border-border/50 bg-card/80 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">{cell.name}</span>
                {cell.mentor_type && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {cell.mentor_type}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {cell.is_live && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {t("flow.rails.groups.live")}
                  </span>
                )}
                {cell.live_url ? (
                  <a
                    href={cell.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    {t("flow.rails.groups.joinNow")}
                  </a>
                ) : (
                  <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("flow.rails.groups.upcoming")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">{t("content.noContent")}</p>
        </div>
      )}
    </section>
  );
};

export default GroupsRail;
