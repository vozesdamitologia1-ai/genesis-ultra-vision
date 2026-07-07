import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // PWA: manifest + service worker (offline support).
    // Registration happens ONLY via src/pwa/register.ts (guarded wrapper).
    VitePWA({
      registerType: "autoUpdate", // new SW versions activate automatically
      injectRegister: null, // never auto-inject registration code
      filename: "sw.js",
      devOptions: { enabled: false }, // no SW in dev / Lovable preview
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "offline.html",
        "icons/*.png",
      ],
      manifest: {
        id: "/",
        name: "Genesis Vision — Mentoria e Fé",
        short_name: "Genesis Vision",
        description:
          "Mentoria espiritual com IA, Bíblia interativa, comunidade e conteúdo para os caminhos LEGADO e FLOW.",
        lang: "pt-BR",
        dir: "ltr",
        scope: "/",
        start_url: "/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "portrait",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        categories: ["lifestyle", "education", "social"],
        icons: [
          { src: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/icon-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            label: "Genesis Vision",
          },
        ],
      },
      workbox: {
        // Precache built app shell (hashed JS/CSS). HTML is handled via NetworkFirst below.
        globPatterns: ["**/*.{js,css,ico,png,svg,webmanifest}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            // NetworkFirst for HTML navigations. Long timeout so slow mobile
            // networks don't trigger the offline fallback. Falls back to the
            // last cached HTML (not offline.html) when the network truly fails.
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 20,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },

          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) =>
              !sameOrigin &&
              (request.destination === "style" || request.destination === "script" || request.destination === "font"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },

    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
