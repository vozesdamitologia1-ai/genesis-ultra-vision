import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, BookOpen, Users, Mic, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// TODO: substitua pelo seu Payment Link do Stripe (Dashboard → Payment Links)
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_REPLACE_ME";

const features = [
  { icon: Crown, title: "Acesso VIP total", desc: "Todo o catálogo LEGADO e FLOW liberado sem limites." },
  { icon: Mic, title: "Mentor IA ilimitado", desc: "Conversas por voz com o mentor espiritual, 24/7." },
  { icon: BookOpen, title: "Bíblia interativa", desc: "Estudos com raízes hebraicas e gregas explicadas." },
  { icon: Users, title: "Comunidade privada", desc: "Grupos exclusivos e mentoria em grupo ao vivo." },
  { icon: Sparkles, title: "Conteúdos premium", desc: "Séries, aulas e reels que não aparecem no app free." },
  { icon: ShieldCheck, title: "Cancele quando quiser", desc: "Sem fidelidade. Sem taxa de app store." },
];

const testimonials = [
  { name: "Marcos R.", text: "O mentor por voz mudou minha rotina de oração. Nunca vi nada parecido." },
  { name: "Beatriz L.", text: "A Bíblia interativa com raízes hebraicas me deu profundidade que faltava." },
  { name: "Diego S.", text: "Assinei o VIP no primeiro dia. Vale cada centavo." },
  { name: "Ana P.", text: "Comunidade viva, conteúdo denso e IA que respeita minha fé." },
  { name: "Rafael M.", text: "O FLOW me destravou profissionalmente. Recomendo demais." },
  { name: "Julia C.", text: "Melhor investimento espiritual do ano." },
];

const modules = [
  { title: "Escola de Ensino", tag: "LEGADO", color: "from-amber-500/30 to-transparent" },
  { title: "Raízes Teológicas", tag: "LEGADO", color: "from-amber-500/30 to-transparent" },
  { title: "Bíblia Imersiva", tag: "LEGADO", color: "from-amber-500/30 to-transparent" },
  { title: "Performance & Disciplina", tag: "FLOW", color: "from-red-600/40 to-transparent" },
  { title: "Governo & Carreira", tag: "FLOW", color: "from-red-600/40 to-transparent" },
  { title: "Mentor por Voz", tag: "IA", color: "from-fuchsia-600/30 to-transparent" },
  { title: "Comunidade VIP", tag: "COMUNIDADE", color: "from-emerald-500/30 to-transparent" },
];

const Carousel = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <div className="relative group">
      <div
        ref={ref}
        id={id}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/70 border border-white/10 opacity-0 group-hover:opacity-100 transition"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/70 border border-white/10 opacity-0 group-hover:opacity-100 transition"
        aria-label="Próximo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

const Site = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    document.title = "LEGADO | FLOW — Assinatura VIP";
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Mouse-follow glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-100"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(220,20,60,0.15), transparent 40%)`,
        }}
      />
      {/* Cursor dot */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-50 h-4 w-4 rounded-full border border-red-500/60 mix-blend-difference"
        style={{ left: pos.x - 8, top: pos.y - 8, transition: "transform 0.08s linear" }}
      />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="font-serif italic text-xl font-bold tracking-wide">LEGADO | FLOW</div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#modulos" className="hover:text-white">Módulos</a>
          <a href="#beneficios" className="hover:text-white">Benefícios</a>
          <a href="#depoimentos" className="hover:text-white">Depoimentos</a>
          <a href="#planos" className="hover:text-white">Planos</a>
        </nav>
        <a
          href={STRIPE_CHECKOUT_URL}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-white/90 transition"
        >
          Assinar VIP <ArrowRight className="h-4 w-4" />
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
            Mentoria · Fé · Propósito
          </span>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl font-bold leading-[1.05]">
            Raízes profundas.<br />
            <span className="italic text-white/70">Destino ativado.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Uma plataforma dupla — tradição teológica e performance espiritual — com mentor IA por voz, Bíblia interativa e comunidade viva.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={STRIPE_CHECKOUT_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-8 py-4 text-sm font-bold uppercase tracking-widest transition"
            >
              Assinar VIP agora <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#modulos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:border-white/60 px-8 py-4 text-sm font-bold uppercase tracking-widest transition"
            >
              Conhecer módulos
            </a>
          </div>
        </motion.div>
      </section>

      {/* Modules carousel */}
      <section id="modulos" className="relative z-10 px-6 md:px-12 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">01 · Módulos</span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">Explore o universo</h2>
          </div>
        </div>
        <Carousel id="modules">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className={`relative snap-start shrink-0 w-[320px] h-[420px] rounded-2xl border border-white/10 bg-gradient-to-b ${m.color} to-black overflow-hidden p-6 flex flex-col justify-between`}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">{m.tag}</span>
              <div>
                <h3 className="font-serif text-2xl font-bold leading-tight">{m.title}</h3>
                <div className="mt-4 h-px w-10 bg-white/40" />
                <p className="mt-4 text-sm text-white/60">Acesso completo incluso no plano VIP.</p>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </section>

      {/* Benefits carousel */}
      <section id="beneficios" className="relative z-10 px-6 md:px-12 py-16">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">02 · Benefícios VIP</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">Tudo desbloqueado</h2>
        </div>
        <Carousel id="benefits">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="snap-start shrink-0 w-[300px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6"
            >
              <f.icon className="h-8 w-8 text-red-500" />
              <h3 className="mt-6 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </motion.div>
          ))}
        </Carousel>
      </section>

      {/* Testimonials carousel */}
      <section id="depoimentos" className="relative z-10 px-6 md:px-12 py-16">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">03 · Depoimentos</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">Quem já vive isso</h2>
        </div>
        <Carousel id="testimonials">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[340px] rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm text-white/80 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 text-xs uppercase tracking-widest text-white/50">— {t.name}</div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Pricing */}
      <section id="planos" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-red-500">04 · Assinatura</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold">Um plano. Tudo incluso.</h2>
          <p className="mt-4 text-white/60">Cancele quando quiser. Sem taxa de app store.</p>
        </div>
        <div className="mt-12 max-w-md mx-auto rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-950/40 to-black p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-red-500">VIP</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold">R$29</span>
                <span className="text-white/50">/mês</span>
              </div>
            </div>
            <Crown className="h-10 w-10 text-red-500" />
          </div>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                {f.title}
              </li>
            ))}
          </ul>
          <a
            href={STRIPE_CHECKOUT_URL}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-6 py-4 text-sm font-bold uppercase tracking-widest transition"
          >
            Assinar VIP <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-center text-[11px] text-white/40">
            Pagamento seguro via Stripe. Ativação automática no app após o cadastro.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LEGADO | FLOW. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Site;
