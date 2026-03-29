import { useState, useRef, useEffect, useCallback } from "react";
import { X, Mic, MicOff, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePath } from "@/contexts/PathContext";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceMentorProps {
  open: boolean;
  onClose: () => void;
}

const LEGADO_PROMPT = `Você é um mentor de vida, empresário bem-sucedido e estrategista de alto desempenho.
Sua abordagem é conservadora, baseada em disciplina, responsabilidade, constância e princípios sólidos.
Você carrega valores cristãos, mas não menciona nomes de igrejas ou instituições.
Sua comunicação é firme, direta e respeitosa, como um mentor experiente que orienta com autoridade.

Você acredita que resultados vêm de: Disciplina diária, Sacrifício consciente, Controle emocional, Planejamento de longo prazo.

Você orienta nas áreas de: Finanças (construção de patrimônio, evitar dívidas, consistência), Relacionamentos (responsabilidade, compromisso, liderança), Carreira e negócios (crescimento sólido, decisões racionais), Disciplina pessoal e hábitos.

Regras de resposta: Não use gírias ou linguagem informal. Seja direto e objetivo. Corrija o usuário quando ele estiver se sabotando. Evite motivação vazia. Traga sempre um senso de responsabilidade pessoal.

Formato das respostas: 1. Diagnóstico claro da situação. 2. Onde a pessoa está errando. 3. Plano de ação prático e disciplinado.

Seu objetivo é formar pessoas fortes, estáveis e confiáveis, que constroem uma vida sólida ao longo do tempo.
Responda na mesma língua que o usuário usar. Mantenha respostas concisas (máximo 3 parágrafos curtos) para serem faladas em voz alta.
IMPORTANTE: Responda de forma conversacional e natural, como se estivesse falando diretamente com a pessoa num bate-papo. Não use listas numeradas, bullets ou formatação. Use frases completas e fluidas, conectando ideias naturalmente.`;

const FLOW_PROMPT = `Você é um coach de vida, comunicador energético e mentor de alta performance, com uma abordagem moderna, intensa e conectada com uma linguagem jovem.
Você carrega valores cristãos na essência, mas não menciona nomes de igrejas ou instituições.

Sua comunicação é: Direta, mas motivadora. Energética e envolvente. Atual, com linguagem acessível.

Você acredita que a vida é movimento, atitude e posicionamento. Você incentiva o usuário a sair da inércia e agir com coragem.

Você orienta nas áreas de: Finanças (crescimento, mentalidade de prosperidade, ação), Relacionamentos (inteligência emocional, posicionamento), Propósito e identidade, Disciplina e consistência com intensidade.

Regras de resposta: Pode usar linguagem mais leve e moderna (sem exagerar em gírias). Ser inspirador sem ser superficial. Confrontar quando necessário, mas com energia de construção. Trazer senso de urgência e ação.

Formato das respostas: 1. Verdade direta (o que precisa ser dito). 2. Quebra de mentalidade (tirar a pessoa da inércia). 3. Ação prática imediata.

Seu objetivo é ativar o potencial do usuário, gerar movimento e fazer com que ele tome decisões que mudem sua vida.
Responda na mesma língua que o usuário usar. Mantenha respostas concisas (máximo 3 parágrafos curtos) para serem faladas em voz alta.
IMPORTANTE: Responda de forma conversacional e natural, como se estivesse num bate-papo animado. Não use listas numeradas, bullets ou formatação. Use frases completas e fluidas, com energia e conexão direta.`;

type VoiceState = "idle" | "listening" | "processing" | "speaking";

const VoiceMentor = ({ open, onClose }: VoiceMentorProps) => {
  const { path } = usePath();
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isLegado = path === "legado";
  const systemPrompt = isLegado ? LEGADO_PROMPT : FLOW_PROMPT;

  // Waveform colors
  const waveColor = isLegado ? "#D4AF37" : "#ef4444";
  const bgGradient = isLegado
    ? "from-black via-neutral-900 to-black"
    : "from-black via-red-950 to-black";

  const stopEverything = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    window.speechSynthesis.cancel();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setState("idle");
    setTranscript("");
    setResponseText("");
  }, []);

  useEffect(() => {
    if (!open) stopEverything();
  }, [open, stopEverything]);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;
      ctx.strokeStyle = waveColor;
      ctx.shadowColor = waveColor;
      ctx.shadowBlur = 20;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    draw();
  }, [waveColor]);

  // Idle animation when not using mic
  const drawIdleWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = waveColor;
      ctx.shadowColor = waveColor;
      ctx.shadowBlur = 15;
      ctx.beginPath();

      const amplitude = state === "speaking" ? 40 : 10;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.02 + phase) * amplitude * Math.sin(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      phase += 0.05;
    };

    draw();
  }, [waveColor, state]);

  useEffect(() => {
    if (!open) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (state === "listening" && analyserRef.current) {
      drawWaveform();
    } else if (state === "speaking" || state === "idle" || state === "processing") {
      drawIdleWave();
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [open, state, drawWaveform, drawIdleWave]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [open]);

  const sendToGemini = async (text: string) => {
    setState("processing");
    setResponseText("");

    try {
      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { message: text, history: [], systemPrompt },
      });

      if (error) throw error;

      const reply = data?.reply ?? "Sem resposta.";
      setResponseText(reply);
      speakResponse(reply);
    } catch (e) {
      console.error("Gemini error:", e);
      setResponseText("Erro ao conectar com a IA.");
      setState("idle");
    }
  };

  const pickMaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    const ptVoices = voices.filter(v => v.lang.startsWith("pt"));
    
    // Priority male voice keywords
    const maleKeywords = ["daniel", "ricardo", "guilherme", "microsoft", "google português do brasil"];
    
    // Try to find a known male voice
    for (const keyword of maleKeywords) {
      const match = ptVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }
    
    // Try any Portuguese Google voice (tend to be higher quality)
    const googlePt = ptVoices.find(v => v.name.toLowerCase().includes("google"));
    if (googlePt) return googlePt;
    
    // Any Portuguese voice
    if (ptVoices.length > 0) return ptVoices[0];
    
    // Absolute fallback
    return voices[0] || null;
  };

  const speakResponse = (text: string) => {
    setState("speaking");
    window.speechSynthesis.cancel();

    // Clean text for more natural speech - remove excessive punctuation pauses
    const cleanedText = text
      .replace(/\.\.\./g, ", ")
      .replace(/\n\n/g, ". ")
      .replace(/\n/g, ", ")
      .replace(/\d+\.\s/g, "") // remove numbered list markers like "1. "
      .replace(/[•\-]\s/g, "") // remove bullet markers
      .replace(/\s{2,}/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "pt-BR";
    
    // Persona differentiation
    if (isLegado) {
      utterance.rate = 0.9;   // slower, more solemn
      utterance.pitch = 0.85; // deeper, authoritative
    } else {
      utterance.rate = 1.1;   // faster, energetic
      utterance.pitch = 1.05; // slightly higher, youthful
    }

    // Pick best male voice available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = pickMaleVoice(voices);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // If no voice found yet (voices load async), retry once
      utterance.pitch = 0.8; // fallback: make it as deep as possible
    }

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponseText("Seu navegador não suporta reconhecimento de voz. Use o Chrome para melhor experiência.");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setState("listening");
    setTranscript("");
    setResponseText("");

    // Set up audio visualization (optional - don't block if it fails)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Mic visualization unavailable:", e);
      // Continue without waveform - speech recognition may still work
    }

    let finalTranscript = "";

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onend = () => {
      // Clean up audio
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;

      // Use the captured finalTranscript directly
      const textToSend = finalTranscript.trim() || "";
      if (textToSend) {
        console.log("Sending to Gemini:", textToSend);
        sendToGemini(textToSend);
      } else {
        console.log("No speech detected");
        setResponseText("Não consegui ouvir. Tente novamente.");
        setState("idle");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      // Clean up audio
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      
      const errorMessages: Record<string, string> = {
        "not-allowed": "Permissão do microfone negada. Permita o acesso nas configurações do navegador.",
        "no-speech": "Nenhuma fala detectada. Tente novamente.",
        "network": "Erro de rede. Verifique sua conexão.",
        "aborted": "Escuta cancelada.",
      };
      setResponseText(errorMessages[event.error] || `Erro no reconhecimento de voz: ${event.error}`);
      setState("idle");
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      console.log("Speech recognition started");
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setResponseText("Não foi possível iniciar o reconhecimento de voz. Abra o app diretamente no navegador (não em iframe).");
      setState("idle");
    }
  };

  const handleMicClick = () => {
    if (state === "listening") {
      try { recognitionRef.current?.stop(); } catch {}
    } else if (state === "idle") {
      startListening();
    }
  };

  const handleClose = () => {
    stopEverything();
    onClose();
  };

  const stateLabel = {
    idle: "Toque no microfone para começar",
    listening: "Ouvindo...",
    processing: "Processando...",
    speaking: "Falando...",
  };

  const accentColor = isLegado ? "text-amber-400" : "text-red-500";
  const accentBorder = isLegado ? "border-amber-400/30" : "border-red-500/30";
  const micBg = isLegado
    ? "bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/50"
    : "bg-red-500/20 hover:bg-red-500/30 border-red-500/50";
  const micActive = isLegado
    ? "bg-amber-400 text-black"
    : "bg-red-500 text-white";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient}`}
        >
          {/* Canvas for waveform */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Path label */}
          <div className={`absolute top-6 left-6 z-10 text-xs font-bold uppercase tracking-[0.3em] ${accentColor}`}>
            {isLegado ? "LEGADO" : "FLOW"}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
            {/* Status */}
            <motion.p
              key={state}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-medium tracking-wide ${accentColor}`}
            >
              {stateLabel[state]}
            </motion.p>

            {/* Mic button */}
            <motion.button
              onClick={handleMicClick}
              disabled={state === "processing" || state === "speaking"}
              whileTap={{ scale: 0.9 }}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all disabled:opacity-40 ${
                state === "listening" ? micActive : micBg
              }`}
            >
              {state === "listening" ? (
                <MicOff className="h-10 w-10" />
              ) : state === "speaking" ? (
                <Volume2 className="h-10 w-10 text-white animate-pulse" />
              ) : (
                <Mic className={`h-10 w-10 ${state === "processing" ? "animate-pulse text-white/50" : "text-white"}`} />
              )}

              {/* Pulse ring */}
              {state === "listening" && (
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${accentBorder}`}
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-white/5 px-6 py-4 backdrop-blur-sm max-h-32 overflow-y-auto w-full"
              >
                <p className="text-xs text-white/50 mb-1">Você:</p>
                <p className="text-sm text-white/90 leading-relaxed">{transcript}</p>
              </motion.div>
            )}

            {/* Response */}
            {responseText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border bg-white/5 px-6 py-4 backdrop-blur-sm max-h-48 overflow-y-auto w-full ${accentBorder}`}
              >
                <p className={`text-xs mb-1 ${accentColor}`}>
                  {isLegado ? "Mentor:" : "Coach:"}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">{responseText}</p>
              </motion.div>
            )}
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-8 z-10">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              Genesis Vision • {isLegado ? "Mentor Conservador" : "Coach Energético"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceMentor;
