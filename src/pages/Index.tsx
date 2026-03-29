import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import HeroSection from "@/components/HeroSection";
import heroLegado from "@/assets/hero-legado.jpg";
import heroFlow from "@/assets/hero-flow.jpg";

const Index = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />

    <main className="pt-12 pb-20">
      <HeroSection
        tag="Tradição"
        title="LEGADO: Raízes, Teologia e Profundidade."
        buttonLabel="ACESSAR TRADIÇÃO"
        bgImage={heroLegado}
        variant="legado"
      />

      <HeroSection
        tag="Performance"
        title="FLOW: Propósito, Liderança e Performance."
        buttonLabel="ATIVAR DESTINO"
        bgImage={heroFlow}
        variant="flow"
      />
    </main>

    <BottomNav />
  </div>
);

export default Index;
