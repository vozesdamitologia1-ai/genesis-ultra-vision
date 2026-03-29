import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  category: string | null;
}

interface BibleRelatedContentProps {
  topics: string[];
}

const BibleRelatedContent = ({ topics }: BibleRelatedContentProps) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (!topics || topics.length === 0) return;

    const fetchRelated = async () => {
      // Search contents that match any of the related topics by title/description
      const { data } = await supabase
        .from("contents")
        .select("id, title, description, thumbnail_url, video_url, category")
        .eq("path_type", "legacy")
        .eq("is_vip", false)
        .limit(6);

      if (data && data.length > 0) {
        setItems(data);
      }
    };

    fetchRelated();
  }, [topics]);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-amber-400" />
        <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          {t("legado.bible.relatedTitle", "Materiais Relacionados")}
        </h5>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.video_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="group flex-shrink-0 w-40"
          >
            <div className="overflow-hidden rounded-lg border border-amber-400/15 bg-card/80 transition-colors hover:border-amber-400/30">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-24 w-full items-center justify-center bg-amber-400/5">
                  <span className="text-lg">📜</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-[11px] font-semibold text-foreground font-serif line-clamp-2">
                  {item.title}
                </p>
                {item.category && (
                  <p className="text-[9px] text-amber-400/60 mt-0.5 uppercase tracking-wider">
                    {item.category}
                  </p>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default BibleRelatedContent;
