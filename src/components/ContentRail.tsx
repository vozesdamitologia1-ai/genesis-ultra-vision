import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  content_url: string | null;
  type: string | null;
  category: string | null;
}

interface ContentRailProps {
  title: string;
  description: string;
  pathType: "legado" | "flow";
  category: string;
}

const ContentRail = ({ title, description, pathType, category }: ContentRailProps) => {
  const { i18n, t } = useTranslation();
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("contents")
        .select("*")
        .eq("path_type", pathType)
        .eq("category", category)
        .eq("language", i18n.language)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setItems(data as ContentItem[]);
    };
    fetchContent();
  }, [pathType, category, i18n.language]);

  return (
    <section className="px-4 py-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.content_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0"
            >
              <div className="relative h-36 w-56 overflow-hidden rounded bg-card">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <span className="text-xs text-muted-foreground">{item.type || "Content"}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                  <p className="text-xs font-semibold text-foreground line-clamp-2">{item.title}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">{t("content.noContent")}</p>
        </div>
      )}
    </section>
  );
};

export default ContentRail;
