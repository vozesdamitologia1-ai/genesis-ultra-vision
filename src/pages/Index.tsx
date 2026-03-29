import { motion } from "framer-motion";
import portalLegado from "@/assets/portal-legado.jpg";
import portalFlow from "@/assets/portal-flow.jpg";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { usePath } from "@/contexts/PathContext";

const Index = () => {
  const { path, selectPath } = usePath();

  // If a path is selected, show a confirmation page
  if (path === "legado" || path === "flow") {
    const isLegado = path === "legado";
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pt-12 pb-16 text-center">
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              {isLegado ? "Tradição Ativada" : "Performance Ativada"}
            </span>
            <h1 className={`text-3xl font-bold text-foreground sm:text-4xl ${isLegado ? "font-serif" : "font-sans"}`}>
              {isLegado ? "Bem-vindo ao LEGADO" : "Bem-vindo ao FLOW"}
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              {isLegado
                ? "Raízes, Teologia e Profundidade. Explore o conhecimento ancestral."
                : "Propósito, Liderança e Performance. Ative seu destino."}
            </p>
            <div className="h-0.5 w-12 bg-primary" />
            <button
              onClick={() => selectPath("portal")}
              className="mt-2 border border-muted-foreground px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              [VOLTAR AO PORTAL]
            </button>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 flex-col pt-12 pb-16">
        {/* LEGADO - Top half */}
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <img
            src={portalLegado}
            alt="Biblioteca antiga com Bíblia de couro e luz de velas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Tradição
            </span>
            <h2 className="max-w-xs font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              LEGADO: Raízes, Teologia e Profundidade.
            </h2>
            <div className="h-0.5 w-10 bg-muted-foreground" />
            <button
              onClick={() => selectPath("legado")}
              className="mt-2 border border-foreground bg-foreground px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-background transition-all hover:bg-foreground/90"
            >
              [ACESSAR TRADIÇÃO]
            </button>
          </motion.div>
        </section>

        {/* Divider line */}
        <div className="h-px w-full bg-border" />

        {/* FLOW - Bottom half */}
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <img
            src={portalFlow}
            alt="Escritório moderno em arranha-céu à noite com neon vermelho"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/20 to-background" />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
              Performance
            </span>
            <h2 className="max-w-xs font-sans text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              FLOW: Propósito, Liderança e Performance.
            </h2>
            <div className="h-0.5 w-10 bg-primary" />
            <button
              onClick={() => selectPath("flow")}
              className="mt-2 bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              [ATIVAR DESTINO]
            </button>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
