import { motion } from "framer-motion";

interface HeroSectionProps {
  tag: string;
  title: string;
  buttonLabel: string;
  bgImage: string;
  variant: "legado" | "flow";
}

const HeroSection = ({ tag, title, buttonLabel, bgImage, variant }: HeroSectionProps) => {
  const isLegado = variant === "legado";

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="h-full w-full object-cover"
          {...(isLegado ? {} : { loading: "lazy" })}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-[0.3em] ${
            isLegado ? "text-muted-foreground" : "text-primary"
          }`}
        >
          {tag}
        </span>

        <h2
          className={`max-w-md text-3xl font-bold leading-tight text-foreground sm:text-4xl ${
            isLegado ? "font-serif" : "font-sans"
          }`}
        >
          {title}
        </h2>

        {/* Divider */}
        <div className={`h-0.5 w-12 ${isLegado ? "bg-muted-foreground" : "bg-primary"}`} />

        {/* CTA */}
        <button
          className={`mt-4 px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 ${
            isLegado
              ? "border border-foreground bg-foreground text-background hover:bg-foreground/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          [{buttonLabel}]
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
