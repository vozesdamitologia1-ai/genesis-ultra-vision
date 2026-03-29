import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Group {
  id: string;
  name: string;
  leader: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  link_join: string | null;
  path_type: string | null;
}

interface GroupsRailProps {
  pathType?: "legacy" | "flow";
}

const GroupsRail = ({ pathType }: GroupsRailProps) => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isLegado = pathType === "legacy";

  useEffect(() => {
    const fetchGroups = async () => {
      let query = supabase.from("groups").select("*").order("name").limit(20);
      if (pathType) query = query.eq("path_type", pathType);
      const { data } = await query;
      if (data) setGroups(data as Group[]);
    };
    fetchGroups();
  }, [pathType]);

  const filtered = searchQuery.trim()
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (g.leader && g.leader.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : groups;

  return (
    <section className="px-4 py-6">
      <div className="mb-3">
        <h3 className={`text-lg font-bold text-foreground ${isLegado ? "font-serif" : "font-sans"}`}>
          {t("flow.rails.groups.title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("flow.rails.groups.description")}</p>
      </div>

      {/* Search */}
      {groups.length > 2 && (
        <div className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${
          isLegado ? "border-amber-400/20 bg-amber-400/5" : "border-primary/20 bg-primary/5"
        }`}>
          <Search className={`h-4 w-4 ${isLegado ? "text-amber-400/50" : "text-primary/50"}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("content.searchGroups", "Buscar grupo...")}
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((group) => (
            <div
              key={group.id}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                isLegado ? "border-amber-400/20 bg-card/80" : "border-primary/20 bg-card/80"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className={`text-sm font-semibold text-foreground ${isLegado ? "font-serif" : ""}`}>{group.name}</span>
                {group.leader && (
                  <span className="text-[10px] text-muted-foreground">
                    {t("content.leader", "Líder")}: {group.leader}
                  </span>
                )}
                {group.meeting_day && (
                  <span className="text-[10px] text-muted-foreground">
                    {group.meeting_day}{group.meeting_time ? ` • ${group.meeting_time}` : ""}
                  </span>
                )}
              </div>
              {group.link_join ? (
                <a
                  href={group.link_join}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isLegado
                      ? "bg-amber-400 text-black hover:bg-amber-500"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {t("flow.rails.groups.joinNow")}
                </a>
              ) : (
                <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("flow.rails.groups.upcoming")}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-xl border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : t("content.noContent")}</p>
        </div>
      )}
    </section>
  );
};

export default GroupsRail;
