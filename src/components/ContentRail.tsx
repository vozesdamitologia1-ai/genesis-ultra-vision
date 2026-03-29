import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  category: string | null;
  is_vip: boolean | null;
  path_type: string;
}

interface ContentRailProps {
  title: string;
  description: string;
  pathType: "legacy" | "flow";
  category?: string;
  isVip?: boolean;
  layout?: "list" | "grid";
  showSearch?: boolean;
  emptyMessage?: string;
}

const ContentRail = ({ title, description, pathType, category, isVip = false, layout = "grid", showSearch = false, emptyMessage }: ContentRailProps) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      let query = supabase
        .from("contents")
        .select("*")
        .eq("path_type", pathType)
        .eq("is_vip", isVip)
        .order("created_at", { ascending: false })
        .limit(20);

      if (category) {
        query = query.eq("category", category);
      }

      const { data } = await query;
      if (data) setItems(data as ContentItem[]);
    };
    fetchContent();
  }, [pathType, category, isVip]);

  const isLegado = pathType === "legacy";

  const filtered = searchQuery.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items;

  const searchBar = (showSearch || items.length > 3) && (
    <div className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${
      isLegado ? "border-amber-400/20 bg-amber-400/5" : "border-primary/20 bg-primary/5"
    }`}>
      <Search className={`h-4 w-4 ${isLegado ? "text-amber-400/50" : "text-primary/50"}`} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("content.searchPlaceholder", "Buscar conteúdo...")}
        className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );

  // Legado = elegant list layout
  if (layout === "list") {
    return (
      <section className="py-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground font-serif">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {searchBar}

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.video_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 rounded-xl border border-amber-400/20 bg-card/80 p-3 group hover:border-amber-400/40 transition-colors"
              >
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="h-20 w-28 flex-shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                    <span className="text-[10px] text-amber-400/60">{item.category || "📜"}</span>
                  </div>
                )}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-sm font-semibold text-foreground font-serif line-clamp-2">{item.title}</p>
                  {item.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border border-border/50 bg-card/50">
            <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : (emptyMessage || t("content.noContent"))}</p>
          </div>
        )}
      </section>
    );
  }

  // Flow = modern grid layout
  return (
    <section className="py-4">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground font-sans">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {searchBar}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.video_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-card border border-primary/20 hover:border-primary/40 transition-colors">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center bg-primary/5">
                    <span className="text-2xl">🚀</span>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">{item.title}</p>
                  {item.description && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : t("content.noContent")}</p>
        </div>
      )}
    </section>
  );
};

export default ContentRail;
