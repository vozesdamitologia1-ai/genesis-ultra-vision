import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Play, Plus, Video, Headphones, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ReelsPlayer from "@/components/ReelsPlayer";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import { extractThumbnail, detectContentType } from "@/lib/thumbnail";

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

const ContentTypeIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "audio":
      return <Headphones className={className} />;
    case "text":
      return <FileText className={className} />;
    default:
      return <Video className={className} />;
  }
};

const DefaultThumbnail = ({ isLegado }: { isLegado: boolean }) => (
  <div className={`flex h-full w-full items-center justify-center ${
    isLegado
      ? "bg-gradient-to-br from-amber-400/10 to-amber-900/20"
      : "bg-gradient-to-br from-primary/10 to-primary/5"
  }`}>
    <span className={`text-xs font-bold tracking-[0.2em] opacity-40 ${
      isLegado ? "font-serif text-amber-400" : "text-primary"
    }`}>
      {isLegado ? "LEGADO" : "FLOW"}
    </span>
  </div>
);

/** Resolve the best thumbnail: explicit → extracted from URL → null */
const resolveThumbnail = (item: ContentItem): string | null =>
  item.thumbnail_url || extractThumbnail(item.video_url);

const ContentRail = ({
  title,
  description,
  pathType,
  category,
  isVip = false,
  layout = "grid",
  showSearch = false,
  emptyMessage,
}: ContentRailProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsStartIndex, setReelsStartIndex] = useState(0);

  const isLegado = pathType === "legacy";

  const fetchContent = async () => {
    setLoading(true);
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
    if (error) {
      console.error("[ContentRail] Fetch error:", error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as ContentItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [pathType, category, isVip]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchContent();
    };
    const handleFocus = () => fetchContent();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathType, category, isVip]);

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

  const emptyState = (
    <div className="flex flex-col h-32 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/50">
      <p className="text-xs text-muted-foreground">
        {searchQuery ? t("content.noResults", "Nenhum resultado.") : (emptyMessage || t("content.noContent"))}
      </p>
      {false /* Admin button removed from public view */}
    </div>
  );

  // ─── LEGADO LIST ───
  if (layout === "list") {
    return (
      <section className="py-4 px-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground font-serif">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {searchBar}
        {loading ? (
          <ContentCardSkeleton layout="list" isLegado={isLegado} />
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const thumb = resolveThumbnail(item);
              const contentType = detectContentType(item.video_url, item.category);
              return (
                <motion.a
                  key={item.id}
                  href={item.video_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex gap-3 rounded-xl border border-amber-400/20 bg-card/80 p-3 group hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(251,191,36,0.08)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <DefaultThumbnail isLegado />
                    )}
                    <div className="absolute top-1 right-1 rounded bg-black/60 p-0.5">
                      <ContentTypeIcon type={contentType} className="h-3 w-3 text-amber-400/80" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-sm font-semibold text-foreground font-serif line-clamp-2">{item.title}</p>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="text-[9px] text-amber-400/60 mt-1 uppercase tracking-wider">{item.category}</p>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>
        ) : emptyState}
      </section>
    );
  }

  // ─── FLOW REELS ───
  if (layout === "reels") {
    return (
      <section className="py-4 px-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground font-sans">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {searchBar}
        {loading ? (
          <ContentCardSkeleton layout="reels" />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item, i) => {
              const thumb = resolveThumbnail(item);
              const contentType = detectContentType(item.video_url, item.category);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openReels(i)}
                  className="group text-left"
                >
                  <div className="relative overflow-hidden rounded-xl bg-card border border-primary/20 hover:border-primary/40 hover:shadow-[0_0_16px_rgba(229,9,20,0.12)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] aspect-[9/16]">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <DefaultThumbnail isLegado={false} />
                    )}
                    {/* Content type badge */}
                    <div className="absolute top-2 right-2 rounded bg-black/60 p-1 backdrop-blur-sm">
                      <ContentTypeIcon type={contentType} className="h-3 w-3 text-primary/90" />
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                        <Play className="h-6 w-6 text-foreground fill-foreground" />
                      </div>
                    </div>
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
                      <p className="text-[11px] font-semibold text-foreground line-clamp-2 drop-shadow">{item.title}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : emptyState}

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

  // ─── FLOW GRID (default) ───
  return (
    <section className="py-4 px-4">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground font-sans">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {searchBar}
      {loading ? (
        <ContentCardSkeleton layout="grid" />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => {
            const thumb = resolveThumbnail(item);
            const contentType = detectContentType(item.video_url, item.category);
            return (
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
                <div className={`relative overflow-hidden rounded-xl bg-card border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                  isLegado
                    ? "border-amber-400/20 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(251,191,36,0.08)]"
                    : "border-primary/20 hover:border-primary/40 hover:shadow-[0_0_16px_rgba(229,9,20,0.12)]"
                }`}>
                  <div className="relative h-28 w-full overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <DefaultThumbnail isLegado={isLegado} />
                    )}
                    <div className="absolute top-1.5 right-1.5 rounded bg-black/60 p-0.5 backdrop-blur-sm">
                      <ContentTypeIcon type={contentType} className={`h-3 w-3 ${isLegado ? "text-amber-400/80" : "text-primary/80"}`} />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className={`text-xs font-semibold text-foreground line-clamp-2 ${isLegado ? "font-serif" : ""}`}>{item.title}</p>
                    {item.description && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                    {isLegado && item.category && (
                      <p className="text-[9px] text-amber-400/60 mt-0.5 uppercase tracking-wider">{item.category}</p>
                    )}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      ) : emptyState}
    </section>
  );
};

export default ContentRail;
