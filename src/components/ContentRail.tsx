import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Play, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ReelsPlayer from "@/components/ReelsPlayer";

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
  layout?: "list" | "grid" | "reels";
  showSearch?: boolean;
  emptyMessage?: string;
}

const ContentRail = ({ title, description, pathType, category, isVip = false, layout = "grid", showSearch = false, emptyMessage }: ContentRailProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsStartIndex, setReelsStartIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      const normalizedCategory = category?.trim();

      let query = supabase
        .from("contents")
        .select("*")
        .eq("path_type", pathType)
        .eq("is_vip", isVip)
        .order("created_at", { ascending: false })
        .limit(20);

      if (normalizedCategory) {
        query = query.eq("category", normalizedCategory);
      }

      const { data, error } = await query;

      console.log("[ContentRail] Supabase response", {
        pathType,
        category: normalizedCategory ?? null,
        isVip,
        data,
        error,
      });

      if (error) {
        console.error("[ContentRail] Fetch error:", error.message, {
          pathType,
          category: normalizedCategory,
          isVip,
        });
        setItems([]);
      } else {
        console.log("[ContentRail] Fetched", data?.length ?? 0, "items for", {
          pathType,
          category: normalizedCategory,
          isVip,
        });
        if (!data?.length) {
          console.log("[ContentRail] Empty result set (check category/path_type/is_vip filters)", {
            pathType,
            category: normalizedCategory,
            isVip,
          });
        }
        setItems((data ?? []) as ContentItem[]);
      }
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

  const openReels = (index: number) => {
    setReelsStartIndex(index);
    setReelsOpen(true);
  };

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
          <div className="flex flex-col h-32 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/50">
            <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : (emptyMessage || t("content.noContent"))}</p>
            {!searchQuery && (
              <button onClick={() => navigate("/admin")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${isLegado ? "bg-amber-400/20 text-amber-400" : "bg-primary/20 text-primary"}`}>
                <Plus className="h-3.5 w-3.5" /> Adicionar Vídeo
              </button>
            )}
          </div>
        )}
      </section>
    );
  }

  // Reels layout — vertical thumbnails styled like shorts
  if (layout === "reels") {
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
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openReels(i)}
                className="group text-left"
              >
                <div className="relative overflow-hidden rounded-xl bg-card border border-primary/20 hover:border-primary/40 transition-colors aspect-[9/16]">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-primary/10 to-primary/5">
                      <span className="text-3xl">🚀</span>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
                    <p className="text-[11px] font-semibold text-white line-clamp-2 drop-shadow">{item.title}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-32 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/50">
            <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : (emptyMessage || t("content.noContent"))}</p>
            {!searchQuery && (
              <button onClick={() => navigate("/admin")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${isLegado ? "bg-amber-400/20 text-amber-400" : "bg-primary/20 text-primary"}`}>
                <Plus className="h-3.5 w-3.5" /> Adicionar Primeiro Vídeo
              </button>
            )}
          </div>
        )}

        {/* Fullscreen Reels Player */}
        <AnimatePresence>
          {reelsOpen && (
            <ReelsPlayer
              items={filtered}
              startIndex={reelsStartIndex}
              onClose={() => setReelsOpen(false)}
            />
          )}
        </AnimatePresence>
      </section>
    );
  }

  // Flow = modern grid layout (default)
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
            <p className="text-xs text-muted-foreground">{searchQuery ? t("content.noResults", "Nenhum resultado.") : (emptyMessage || t("content.noContent"))}</p>
          </div>
      )}
    </section>
  );
};

export default ContentRail;
