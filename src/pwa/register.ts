/**
 * Guarded Service Worker registration.
 *
 * The SW is registered ONLY in the published production app.
 * It is NEVER registered in:
 *  - development builds
 *  - the Lovable editor preview (iframe)
 *  - preview hostnames (id-preview--*, preview--*, *.lovableproject.com, ...)
 *  - when the URL contains ?sw=off (kill switch)
 *
 * In any refused context, stale registrations for /sw.js are removed.
 */

const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;

  // Inside an iframe (Lovable editor preview)
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;

  // Kill switch: ?sw=off
  if (new URLSearchParams(window.location.search).has("sw") &&
      new URLSearchParams(window.location.search).get("sw") === "off") return true;

  return false;
}

async function unregisterAppServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.allSettled(
      registrations
        .filter((r) => {
          const url = r.active?.scriptURL || r.waiting?.scriptURL || r.installing?.scriptURL || "";
          return url.endsWith(SW_URL);
        })
        .map((r) => r.unregister()),
    );
  } catch {
    // ignore
  }
}

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    // Clean up stale registrations from previous deploys
    void unregisterAppServiceWorkers();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        // Check for updates periodically (autoUpdate activates them)
        setInterval(() => void registration.update(), 60 * 60 * 1000);
      })
      .catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
  });
}
