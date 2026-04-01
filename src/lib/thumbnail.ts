/**
 * Extract thumbnail URL from video platforms (YouTube, Instagram, TikTok).
 * Returns null if no thumbnail can be derived.
 */
export function extractThumbnail(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  try {
    const u = new URL(videoUrl);

    // YouTube (watch, shorts, embed, youtu.be)
    if (/youtu\.?be/.test(u.hostname)) {
      let id: string | null = null;
      if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/embed/")[1]?.split(/[?/]/)[0] || null;
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/shorts/")[1]?.split(/[?/]/)[0] || null;
      } else if (u.hostname === "youtu.be") {
        id = u.pathname.slice(1).split(/[?/]/)[0] || null;
      } else {
        id = u.searchParams.get("v");
      }
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

/**
 * Detect content type from URL or category string.
 */
export type ContentType = "video" | "audio" | "text";

export function detectContentType(
  videoUrl: string | null,
  category: string | null
): ContentType {
  const cat = (category || "").toLowerCase();
  if (cat.includes("audio") || cat.includes("podcast")) return "audio";
  if (cat.includes("texto") || cat.includes("text") || cat.includes("artigo")) return "text";
  return "video";
}
