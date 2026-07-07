import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Send, Loader2, Users, Heart, MessageCircle, Sparkles, ImagePlus, X, Film, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface CommunityMessage {
  id: string;
  content: string | null;
  path_type: string | null;
  user_id: string | null;
  created_at: string | null;
  parent_id: string | null;
  likes: string[] | null;
  media_url: string | null;
  media_type: string | null;
}

interface ProfileInfo {
  name: string | null;
  avatarUrl: string | null;
}

const timeAgo = (ts: string | null) => {
  if (!ts) return "";
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

const avatarColor = (id: string) => {
  const colors = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-violet-500 to-fuchsia-500",
  ];
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
};

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "??";
};

const Avatar = ({ uid, info, size = 36 }: { uid: string; info?: ProfileInfo; size?: number }) => {
  const displayName = info?.name || `Membro ${uid.slice(0, 4)}`;
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br ${avatarColor(uid)} flex items-center justify-center text-[10px] font-bold text-white`}
    >
      {info?.avatarUrl ? (
        <img src={info.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(displayName)}</span>
      )}
    </div>
  );
};

const Community = () => {
  const { t } = useTranslation();
  const { path } = usePath();
  const isLegado = path === "legado";
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<CommunityMessage | null>(null);
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setMessages(data as CommunityMessage[]);
    };
    load();

    const channel = supabase
      .channel("community-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_messages" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => [payload.new as CommunityMessage, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setMessages((prev) =>
            prev.map((m) => (m.id === (payload.new as CommunityMessage).id ? (payload.new as CommunityMessage) : m))
          );
        } else if (payload.eventType === "DELETE") {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as CommunityMessage).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch profiles for new user_ids
  useEffect(() => {
    const uids = Array.from(new Set(messages.map((m) => m.user_id).filter(Boolean) as string[]));
    const missing = uids.filter((u) => !profiles[u]);
    if (missing.length === 0) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", missing);
      if (!data) return;
      const next: Record<string, ProfileInfo> = {};
      await Promise.all(
        data.map(async (p: any) => {
          let signed: string | null = null;
          if (p.avatar_url) {
            const { data: s } = await supabase.storage.from("avatars").createSignedUrl(p.avatar_url, 60 * 60 * 24 * 7);
            signed = s?.signedUrl ?? null;
          }
          next[p.id] = { name: p.full_name, avatarUrl: signed };
        })
      );
      // Fill blanks for uids without profile row
      for (const u of missing) if (!next[u]) next[u] = { name: null, avatarUrl: null };
      setProfiles((prev) => ({ ...prev, ...next }));
    })();
  }, [messages, profiles]);

  // Sign community media URLs
  useEffect(() => {
    const paths = Array.from(new Set(messages.map((m) => m.media_url).filter(Boolean) as string[]));
    const missing = paths.filter((p) => !mediaUrls[p]);
    if (missing.length === 0) return;
    (async () => {
      const { data } = await supabase.storage.from("community-media").createSignedUrls(missing, 60 * 60 * 24 * 7);
      if (!data) return;
      const next: Record<string, string> = {};
      data.forEach((d, i) => {
        if (d.signedUrl) next[missing[i]] = d.signedUrl;
      });
      setMediaUrls((prev) => ({ ...prev, ...next }));
    })();
  }, [messages, mediaUrls]);

  const { posts, repliesByParent } = useMemo(() => {
    const posts = messages.filter((m) => !m.parent_id);
    const repliesByParent: Record<string, CommunityMessage[]> = {};
    for (const m of messages) {
      if (m.parent_id) (repliesByParent[m.parent_id] ||= []).push(m);
    }
    for (const k of Object.keys(repliesByParent)) {
      repliesByParent[k].sort(
        (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
      );
    }
    return { posts, repliesByParent };
  }, [messages]);

  const pickFile = () => fileRef.current?.click();

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      toast({ title: "Arquivo grande demais", description: "Máx. 25MB", variant: "destructive" });
      return;
    }
    setPendingFile(f);
    setPendingPreview(URL.createObjectURL(f));
  };

  const clearPending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || sending || !userId) return;
    setSending(true);
    const content = input.trim();
    const parent = replyTo?.id ?? null;

    let media_url: string | null = null;
    let media_type: string | null = null;

    if (pendingFile) {
      const isVideo = pendingFile.type.startsWith("video/");
      media_type = isVideo ? "video" : "image";
      const ext = pendingFile.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("community-media").upload(path, pendingFile, {
        contentType: pendingFile.type,
      });
      if (error) {
        toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
        setSending(false);
        return;
      }
      media_url = path;
    }

    setInput("");
    setReplyTo(null);
    clearPending();

    await supabase.from("community_messages").insert({
      content: content || null,
      user_id: userId,
      path_type: path === "portal" ? null : path,
      parent_id: parent,
      media_url,
      media_type,
    });

    setSending(false);
  };

  const toggleLike = async (msg: CommunityMessage) => {
    if (!userId) return;
    const current = msg.likes ?? [];
    const hasLiked = current.includes(userId);
    const next = hasLiked ? current.filter((id) => id !== userId) : [...current, userId];
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, likes: next } : m)));
    await supabase.from("community_messages").update({ likes: next }).eq("id", msg.id);
  };

  const accentText = isLegado ? "text-amber-400" : "text-primary";
  const accentBg = isLegado ? "bg-amber-400" : "bg-primary";
  const accentRing = isLegado ? "ring-amber-400/40" : "ring-primary/40";
  const fontClass = isLegado ? "font-serif" : "font-sans";

  const startReply = (msg: CommunityMessage) => {
    setReplyTo(msg);
    setOpenThread(msg.id);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const renderMedia = (msg: CommunityMessage) => {
    if (!msg.media_url) return null;
    const url = mediaUrls[msg.media_url];
    if (!url) {
      return (
        <div className="mt-2 flex h-40 items-center justify-center rounded-xl bg-secondary/40">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (msg.media_type === "video") {
      return (
        <video
          src={url}
          controls
          playsInline
          className="mt-2 max-h-96 w-full rounded-xl bg-black object-contain"
        />
      );
    }
    return <img src={url} alt="" className="mt-2 max-h-96 w-full rounded-xl object-cover" />;
  };

  const displayName = (uid: string | null) => {
    if (!uid) return "Anônimo";
    if (uid === userId) return "Você";
    return profiles[uid]?.name || `Membro ${uid.slice(0, 4)}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex flex-1 flex-col pt-14 pb-32">
        <div className="sticky top-14 z-20 backdrop-blur-xl bg-background/70 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${isLegado ? "from-amber-400 to-amber-600" : "from-primary to-primary/60"}`}>
                <Users className="h-4 w-4 text-black" />
                <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${accentBg} ring-2 ring-background animate-pulse`} />
              </div>
              <div>
                <h1 className={`text-sm font-bold text-foreground ${fontClass}`}>
                  {t("community.title", "Comunidade")}
                </h1>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  {messages.length} {t("community.interactions", "interações")} · ao vivo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${isLegado ? "from-amber-400/20 to-amber-600/10" : "from-primary/20 to-primary/5"}`}>
                <MessageCircle className={`h-7 w-7 ${accentText}`} />
              </div>
              <p className="text-sm font-medium">{t("community.empty", "Nenhuma postagem ainda.")}</p>
              <p className="text-xs">Seja o primeiro a compartilhar algo ✨</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {posts.map((post) => {
              const replies = repliesByParent[post.id] ?? [];
              const likes = post.likes ?? [];
              const isLiked = userId ? likes.includes(userId) : false;
              const isMine = post.user_id === userId;
              const threadOpen = openThread === post.id;
              const info = post.user_id ? profiles[post.user_id] : undefined;

              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={`rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-3.5 shadow-sm hover:shadow-md transition-shadow ${isLegado ? "hover:border-amber-400/30" : "hover:border-primary/30"}`}
                >
                  <header className="flex items-center gap-2.5">
                    <div className={`ring-2 rounded-full ${isMine ? accentRing : "ring-transparent"}`}>
                      <Avatar uid={post.user_id ?? "x"} info={info} size={36} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold text-foreground ${fontClass}`}>
                        {displayName(post.user_id)}
                        {post.path_type && (
                          <span className={`ml-1.5 inline-flex items-center rounded-full px-1.5 py-0 text-[8px] font-medium uppercase tracking-wider ${post.path_type === "legado" ? "bg-amber-400/15 text-amber-400" : "bg-primary/15 text-primary"}`}>
                            {post.path_type}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)} atrás</p>
                    </div>
                  </header>

                  {post.content && (
                    <p className="mt-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  )}
                  {renderMedia(post)}

                  <footer className="mt-3 flex items-center gap-1 border-t border-border/50 pt-2">
                    <button
                      onClick={() => toggleLike(post)}
                      className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-all hover:bg-secondary ${isLiked ? "text-rose-500" : "text-muted-foreground"}`}
                    >
                      <motion.span
                        key={isLiked ? "liked" : "unliked"}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Heart className={`h-4 w-4 transition-all ${isLiked ? "fill-rose-500" : "group-hover:scale-110"}`} />
                      </motion.span>
                      <span className="font-medium">{likes.length}</span>
                    </button>

                    <button
                      onClick={() => setOpenThread(threadOpen ? null : post.id)}
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{replies.length}</span>
                    </button>

                    <button
                      onClick={() => startReply(post)}
                      className={`ml-auto rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${isLegado ? "text-amber-400 hover:bg-amber-400/10" : "text-primary hover:bg-primary/10"}`}
                    >
                      Responder
                    </button>
                  </footer>

                  <AnimatePresence>
                    {threadOpen && replies.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-3 space-y-2 border-l-2 pl-3 ${isLegado ? "border-amber-400/30" : "border-primary/30"}`}>
                          {replies.map((r) => {
                            const rLiked = userId ? (r.likes ?? []).includes(userId) : false;
                            const rInfo = r.user_id ? profiles[r.user_id] : undefined;
                            return (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                              >
                                <Avatar uid={r.user_id ?? "x"} info={rInfo} size={24} />
                                <div className="flex-1 rounded-xl bg-secondary/60 px-2.5 py-1.5">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-semibold text-foreground">
                                      {displayName(r.user_id)}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">{timeAgo(r.created_at)}</span>
                                  </div>
                                  {r.content && <p className="text-xs text-foreground leading-relaxed">{r.content}</p>}
                                  {renderMedia(r)}
                                  <button
                                    onClick={() => toggleLike(r)}
                                    className={`mt-0.5 flex items-center gap-1 text-[10px] ${rLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"}`}
                                  >
                                    <Heart className={`h-2.5 w-2.5 ${rLiked ? "fill-rose-500" : ""}`} />
                                    {(r.likes ?? []).length > 0 && <span>{(r.likes ?? []).length}</span>}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {userId ? (
          <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl px-3 py-2.5">
            <AnimatePresence>
              {replyTo && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`mb-2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] ${isLegado ? "bg-amber-400/10 text-amber-400" : "bg-primary/10 text-primary"}`}
                >
                  <span className="truncate">
                    Respondendo: <span className="opacity-70">{replyTo.content?.slice(0, 50)}</span>
                  </span>
                  <button onClick={() => setReplyTo(null)}>
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {pendingPreview && (
              <div className="mb-2 relative inline-block">
                {pendingFile?.type.startsWith("video/") ? (
                  <video src={pendingPreview} className="h-24 rounded-lg" muted />
                ) : (
                  <img src={pendingPreview} className="h-24 rounded-lg object-cover" alt="preview" />
                )}
                <button
                  onClick={clearPending}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className={`flex items-end gap-2 rounded-3xl border border-border bg-secondary/70 px-2 py-1.5 focus-within:ring-2 ${accentRing} transition-all`}>
              <button
                onClick={pickFile}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${accentText} hover:bg-background/40`}
                aria-label="Adicionar mídia"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={onFilePicked}
                className="hidden"
              />
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={replyTo ? "Escreva sua resposta..." : t("community.placeholder", "Compartilhe algo com a comunidade...")}
                className="flex-1 resize-none bg-transparent py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none max-h-24"
                rows={1}
                maxLength={2000}
              />
              <button
                onClick={handleSend}
                disabled={sending || (!input.trim() && !pendingFile)}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all disabled:opacity-30 disabled:scale-90 ${accentBg} text-black shadow-lg ${isLegado ? "shadow-amber-400/30" : "shadow-primary/30"} active:scale-90`}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="fixed bottom-16 left-0 right-0 border-t border-border bg-background/95 px-4 py-4 text-center backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">
              {t("community.loginRequired", "Faça login para participar da comunidade.")}
            </p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Community;
