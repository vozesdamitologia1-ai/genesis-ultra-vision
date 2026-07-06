import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import { registerServiceWorker } from "./pwa/register";

createRoot(document.getElementById("root")!).render(<App />);

// PWA: guarded service worker registration (production only)
registerServiceWorker();
