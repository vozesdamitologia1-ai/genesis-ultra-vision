import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Crown,
  Sparkles,
  BookOpen,
  Users,
  Mic,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Flame,
  Star,
  Quote,
} from "lucide-react";

// Acesso liberado (sem assinatura): CTA leva ao app / cadastro gratuito
const CTA_URL = "/auth";
const CTA_LABEL = "Acessar grátis";

// Imagens (Unsplash — livres para uso)
const IMG_HERO =
  "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&q=80";
const IMG_BIBLE =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80";
const IMG_PRAY =
  "https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=1200&q=80";
const IMG_COMMUNITY =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";
const IMG_STUDY =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80";
const IMG_MENTOR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80";
const IMG_FLOW =
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80";
const IMG_ROOTS =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80";
const IMG_CAREER =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";

// Vídeo público (Coverr / Pexels — livres)
const VIDEO_LOOP =
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4";

const features = [
  {
    icon: Crown,
    title: "Acesso VIP total",
    desc: "Todo o catálogo LEGADO e FLOW liberado sem limites.",
    img: IMG_STUDY,
  },
  {
    icon: Mic,
    title: "Mentor IA por voz",
    desc: "Converse por áudio com o mentor espiritual 24/7.",
    img: IMG_MENTOR,
  },
  {
    icon: BookOpen,
    title: "Bíblia interativa",
    desc: "Raízes hebraicas e gregas explicadas em cada versículo.",
    img: IMG_BIBLE,
  },
  {
    icon: Users,
    title: "Comunidade privada",
    desc: "Grupos VIP e mentoria em grupo ao vivo.",
    img: IMG_COMMUNITY,
  },
  {
    icon: Sparkles,
    title: "Conteúdos premium",
    desc: "Séries e aulas que não aparecem no app free.",
    img: IMG_PRAY,
  },
  {
    icon: ShieldCheck,
    title: "Cancele quando quiser",
    desc: "Sem fidelidade. Sem taxa de app store.",
    img: IMG_FLOW,
  },
];

const modules = [
  {
    title: "Escola de Ensino",
    tag: "LEGADO",
    desc: "Aulas profundas de teologia sistemática, doutrina e história da Igreja.",
    img: IMG_STUDY,
  },
  {
    title: "Raízes Teológicas",
    tag: "LEGADO",
    desc: "Hebraico e grego bíblico decodificados palavra por palavra.",
    img: IMG_ROOTS,
  },
  {
    title: "Bíblia Imersiva",
    tag: "LEGADO",
    desc: "Leia com IA, mapa mental e insights culturais em tempo real.",
    img: IMG_BIBLE,
  },
  {
    title: "Performance & Disciplina",
    tag: "FLOW",
    desc: "Rotinas de foco, oração ativa e alta performance espiritual.",
    img: IMG_FLOW,
  },
  {
    title: "Governo & Carreira",
    tag: "FLOW",
    desc: "Fé aplicada à liderança, dinheiro, propósito e carreira.",
    img: IMG_CAREER,
  },
  {
    title: "Mentor por Voz",
    tag: "IA",
    desc: "Diálogo por áudio com o mentor treinado nas escrituras.",
    img: IMG_MENTOR,
  },
  {
    title: "Comunidade VIP",
    tag: "COMUNIDADE",
    desc: "Grupos privados, encontros ao vivo e rede de fé real.",
    img: IMG_COMMUNITY,
  },
];

const testimonials = [
  {
    name: "Marcos R.",
    role: "Pastor · SP",
    text:
      "O mentor por voz mudou minha rotina de oração. Nunca vi nada parecido em um app cristão.",
  },
  {
    name: "Beatriz L.",
    role: "Missionária · PT",
    text:
      "A Bíblia interativa com raízes hebraicas me deu profundidade que faltava nos meus estudos.",
  },
  {
    name: "Diego S.",
    role: "Empresário · RJ",
    text: "Assinei o VIP no primeiro dia. Vale cada centavo. O FLOW é diferente de tudo.",
  },
  {
    name: "Ana P.",
    role: "Líder de célula · MG",
    text: "Comunidade viva, conteúdo denso e IA que respeita minha fé. Simplesmente completo.",
  },
  {
    name: "Rafael M.",
    role: "Coach · BA",
    text: "O FLOW me destravou profissionalmente. Fé e performance no mesmo lugar.",
  },
  {
    name: "Julia C.",
    role: "Estudante de teologia",
    text: "Melhor investimento espiritual do ano. Uso todos os dias.",
  },
];

const stats = [
  { n: "+50k", l: "assinantes VIP" },
  { n: "+1.200", l: "aulas e reels" },
  { n: "24/7", l: "mentor por voz" },
  { n: "4.9★", l: "avaliação média" },
];

const Carousel = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  return (
    <div className="relative group">
      <div
        ref={ref}
        id={id}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 hover:border-red-600"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 hover:border-red-600"
        aria-label="Próximo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

const Site = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  // Scroll-based zoom no hero (efeito parallax pedido pelo usuário)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.35]);
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.3]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);

  // Zoom no vídeo conforme scroll
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });
  const videoScale = useTransform(videoProgress, [0, 0.5, 1], [0.85, 1, 1.15]);

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
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(220,20,60,0.18), transparent 40%)`,
        }}
      />

      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-sm">
        <div className="font-serif italic text-xl font-bold tracking-wide">LEGADO | FLOW</div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#modulos" className="hover:text-white">Módulos</a>
          <a href="#beneficios" className="hover:text-white">Benefícios</a>
          <a href="#depoimentos" className="hover:text-white">Depoimentos</a>
          <a href="#planos" className="hover:text-white">Planos</a>
        </nav>
        <a
          href={CTA_URL}
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-white/90 transition"
        >
          Assinar VIP <ArrowRight className="h-4 w-4" />
        </a>
      </header>

      {/* HERO com scroll-scale */}
      <section ref={heroRef} className="relative z-10 h-[100vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <img src={IMG_HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </motion.div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 flex h-full flex-col justify-center px-6 md:px-12 max-w-5xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500"
          >
            Mentoria · Fé · Propósito
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02]"
          >
            Raízes profundas.
            <br />
            <span className="italic text-white/70">Destino ativado.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-white/70"
          >
            Uma plataforma dupla — tradição teológica e performance espiritual — com mentor IA por
            voz, Bíblia interativa e comunidade viva.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href={CTA_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-8 py-4 text-sm font-bold uppercase tracking-widest transition"
            >
              Assinar VIP agora <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#modulos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 hover:border-white/80 px-8 py-4 text-sm font-bold uppercase tracking-widest transition"
            >
              <Play className="h-4 w-4" /> Ver módulos
            </a>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/60 backdrop-blur">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.l} className="px-6 py-5 text-center">
                <div className="font-serif text-2xl md:text-3xl font-bold text-red-500">{s.n}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/50">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="relative z-10 px-6 md:px-12 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">01 · Módulos</span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold">
              Explore o <span className="italic text-red-500">universo</span>
            </h2>
          </div>
          <Flame className="hidden md:block h-12 w-12 text-red-500/60" />
        </div>
        <Carousel id="modules">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="relative snap-start shrink-0 w-[320px] h-[460px] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer"
            >
              <img
                src={m.img}
                alt={m.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative h-full p-6 flex flex-col justify-between">
                <span className="self-start text-[10px] uppercase tracking-[0.3em] text-red-500 bg-black/60 border border-red-500/40 px-3 py-1 rounded-full">
                  {m.tag}
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold leading-tight">{m.title}</h3>
                  <div className="mt-3 h-px w-10 bg-red-500" />
                  <p className="mt-4 text-sm text-white/70">{m.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-red-500">
                    Acessar <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </section>

      {/* VÍDEO com scroll-scale */}
      <section ref={videoRef} className="relative z-10 px-6 md:px-12 py-24">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">Assista</span>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold">
            Uma nova forma de <span className="italic text-red-500">viver a fé</span>
          </h2>
        </div>
        <motion.div
          style={{ scale: videoScale }}
          className="relative mx-auto max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(220,20,60,0.25)]"
        >
          <video
            src={VIDEO_LOOP}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-red-500">Trailer</div>
              <div className="mt-1 font-serif text-2xl font-bold">Bem-vindo ao LEGADO | FLOW</div>
            </div>
            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <Play className="h-5 w-5" fill="currentColor" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="relative z-10 px-6 md:px-12 py-24">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">02 · Benefícios VIP</span>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold">
            Tudo <span className="italic text-red-500">desbloqueado</span>
          </h2>
        </div>
        <Carousel id="benefits">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="snap-start shrink-0 w-[320px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={f.img} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <f.icon className="absolute bottom-3 left-4 h-8 w-8 text-red-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </section>

      {/* IMAGEM de destaque com parallax */}
      <section className="relative z-10 my-16 h-[60vh] overflow-hidden">
        <motion.img
          src={IMG_PRAY}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <Quote className="h-10 w-10 text-red-500 mb-6" />
          <p className="font-serif italic text-2xl md:text-4xl max-w-3xl leading-snug">
            "A fé não é a ausência de dúvida — é a decisão diária de caminhar mesmo com ela."
          </p>
          <div className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60">
            Manifesto LEGADO | FLOW
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="relative z-10 px-6 md:px-12 py-24">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">03 · Depoimentos</span>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold">
            Quem já <span className="italic text-red-500">vive isso</span>
          </h2>
        </div>
        <Carousel id="testimonials">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[360px] rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7"
            >
              <div className="flex gap-1 text-red-500">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-base text-white/85 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest">{t.role}</div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* PLANOS */}
      <section id="planos" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-red-500">04 · Assinatura</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold">
            Um plano. <span className="italic">Tudo incluso.</span>
          </h2>
          <p className="mt-4 text-white/60">
            Cancele quando quiser. Sem fidelidade. Sem taxa de app store.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 max-w-md mx-auto rounded-3xl border border-red-500/40 bg-gradient-to-b from-red-950/50 to-black p-8 shadow-[0_0_60px_rgba(220,20,60,0.25)]"
        >
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
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                {f.title}
              </li>
            ))}
          </ul>
          <a
            href={CTA_URL}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-6 py-4 text-sm font-bold uppercase tracking-widest transition"
          >
            Assinar VIP <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-center text-[11px] text-white/40">
            Pagamento seguro via Stripe. Ativação automática no app após o cadastro.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LEGADO | FLOW. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Site;
