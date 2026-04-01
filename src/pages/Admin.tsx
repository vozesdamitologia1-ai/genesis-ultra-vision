import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Upload, CheckCircle2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePath } from "@/contexts/PathContext";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";

const CATEGORIES = [
  "Performance & Disciplina",
  "Governo & Carreira",
  "Escola de Ensino",
];

const normalizeVideoUrl = (url: string): string => {
  try {
    const u = new URL(url);
    // YouTube watch → embed
    if (/youtu\.?be/.test(u.hostname)) {
      const id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch { /* keep original */ }
  return url;
};

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { path } = usePath();
  const isLegado = path === "legado";

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [pathType, setPathType] = useState<"flow" | "legacy">("flow");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isVip, setIsVip] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const accentColor = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400/10 border-amber-400/20" : "bg-primary/10 border-primary/20";
  const accentBtn = isLegado
    ? "bg-amber-400 text-black hover:bg-amber-500"
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  const handlePublish = async () => {
    if (!title.trim() || !videoUrl.trim()) {
      toast({ title: "Preencha o título e a URL do vídeo.", variant: "destructive" });
      return;
    }

    setPublishing(true);
    const cleanUrl = normalizeVideoUrl(videoUrl.trim());

    const { error } = await supabase.from("contents").insert({
      title: title.trim(),
      video_url: cleanUrl,
      description: description.trim() || null,
      path_type: pathType,
      category,
      is_vip: isVip,
      is_reel: true,
    });

    if (error) {
      console.error("[Admin] Insert error:", error);
      toast({ title: "Erro ao publicar", description: error.message, variant: "destructive" });
    } else {
      setPublished(true);
      toast({ title: "✅ Conteúdo publicado com sucesso!", description: `"${title}" já está disponível na tela de Estudo.` });
      setTimeout(() => {
        setTitle("");
        setVideoUrl("");
        setDescription("");
        setIsVip(false);
        setPublished(false);
      }, 2000);
    }
    setPublishing(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 pt-14 pb-20 px-5">
        {/* Back button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 mt-4 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Perfil
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-xl font-bold text-foreground mb-1 ${isLegado ? "font-serif" : "font-sans"}`}>
            Gerenciar Conteúdo
          </h1>
          <p className="text-xs text-muted-foreground mb-6">
            Publique vídeos diretamente no app. Eles aparecerão na tela de Estudo.
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Rotina matinal de 5 passos"
              maxLength={120}
              className={`w-full rounded-xl border p-3 text-sm bg-background text-foreground outline-none placeholder:text-muted-foreground ${accentBg} focus:ring-2 focus:ring-primary/30`}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">URL do Vídeo *</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube, Instagram Reels ou TikTok"
              className={`w-full rounded-xl border p-3 text-sm bg-background text-foreground outline-none placeholder:text-muted-foreground ${accentBg} focus:ring-2 focus:ring-primary/30`}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Cole o link completo do YouTube Shorts, Instagram Reels ou TikTok.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Descrição (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do conteúdo..."
              maxLength={300}
              rows={2}
              className={`w-full rounded-xl border p-3 text-sm bg-background text-foreground outline-none placeholder:text-muted-foreground resize-none ${accentBg} focus:ring-2 focus:ring-primary/30`}
            />
          </div>

          {/* Path Type */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Caminho</label>
            <div className="flex gap-2">
              {([["flow", "FLOW"], ["legacy", "LEGADO"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setPathType(val)}
                  className={`flex-1 rounded-xl border p-3 text-sm font-bold transition-all ${
                    pathType === val
                      ? val === "legacy"
                        ? "border-amber-400 bg-amber-400/20 text-amber-400"
                        : "border-primary bg-primary/20 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Categoria</label>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl border p-3 text-left text-sm transition-all ${
                    category === cat
                      ? `${accentBg} ${accentColor} font-bold`
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* VIP toggle */}
          <div className="flex items-center justify-between rounded-xl border p-3 border-border bg-card">
            <span className="text-sm text-foreground">Conteúdo VIP?</span>
            <button
              onClick={() => setIsVip(!isVip)}
              className={`rounded-full px-4 py-1 text-xs font-bold transition-all ${
                isVip
                  ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isVip ? "SIM" : "NÃO"}
            </button>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing || published}
            className={`flex w-full items-center justify-center gap-2 rounded-xl p-4 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60 ${
              published ? "bg-green-500/20 text-green-400 border border-green-500/30" : accentBtn
            }`}
          >
            {published ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Publicado!
              </>
            ) : publishing ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                PUBLICAR NO APP
              </>
            )}
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Admin;
