import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyRound, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "@/components/LanguageSelector";

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() || undefined },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Conta criada!", description: "Verifique seu e-mail para confirmar o cadastro." });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast({ title: "Erro no login", description: error.message, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[120px]" />

      {/* Language selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <KeyRound className="h-7 w-7 text-red-500" />
            <span className="font-serif text-2xl font-bold italic tracking-wide text-white">
              {t("header.brand")}
            </span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.3em]">
            {mode === "login" ? "Acesse sua jornada" : "Inicie sua jornada"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              minLength={6}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/80 py-3 pl-10 pr-10 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:from-red-500 hover:to-red-600 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              "ENTRAR"
            ) : (
              "CRIAR CONTA"
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
          >
            {mode === "login"
              ? "Não tem conta? Criar agora"
              : "Já tem conta? Entrar"}
          </button>
        </div>

        {/* Decorative bottom */}
        <div className="mt-10 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
