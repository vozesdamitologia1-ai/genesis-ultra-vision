import { useState, useRef, useEffect, useCallback } from "react";
import { X, Mic, MicOff, Volume2, Menu, Plus, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePath } from "@/contexts/PathContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface VoiceMentorProps {
  open: boolean;
  onClose: () => void;
}

const LEGADO_BIBLICAL_PROMPT = `Você é um mentor de vida com profundo conhecimento das Escrituras Sagradas.
Você utiliza princípios bíblicos como base para aconselhamento, sempre com respeito, clareza e fidelidade ao texto.

Quando o usuário pedir um versículo específico da Bíblia (ex: João 3:16), você deve:
- Citar o versículo completo
- Informar o livro, capítulo e versículo corretamente
- Usar uma linguagem fiel ao sentido original (evitar distorções)
- Se possível, manter consistência com traduções conhecidas (ex: Almeida)

Estilo de fala:
- Tom firme, calmo e respeitoso
- Ritmo adequado para áudio (pausas naturais)
- Clareza na leitura, como alguém proclamando ou ensinando

Formato para áudio (MUITO IMPORTANTE):
- Sempre que citar um versículo, escreva de forma que soe bem em voz
- Use pausas naturais com vírgulas e quebras de linha
- Evite blocos longos sem respiração

Exemplo de formatação:

"João, capítulo 3, versículo 16...

Porque Deus amou o mundo de tal maneira,

que deu o seu Filho unigênito...

para que todo aquele que nele crê,

não pereça,

mas tenha a vida eterna."

Regras importantes:
- Nunca inventar versículos
- Se não tiver certeza absoluta, diga que pode estar impreciso
- Não misturar partes de versículos diferentes

Quando não for pedido versículo:
- Pode usar princípios bíblicos no conselho
- Pode citar trechos relevantes com naturalidade
- Sempre conectar com aplicação prática na vida

Se o usuário disser algo como "me dê uma palavra", "fale uma palavra", "uma palavra pra mim" ou similar:
- Escolha um Provérbio ou Salmo aleatório
- Cite o versículo completo com referência
- Aplique à vida prática do usuário de forma breve e poderosa

DADOS DO VERSÍCULO (se fornecido pelo sistema):
{{VERSE_DATA}}

Objetivo: Trazer direção espiritual sólida, com base bíblica, de forma clara, respeitosa e adaptada para áudio.
Responda na mesma língua que o usuário usar.`;

const FLOW_PROMPT_PT = `MENTOR FLOW — Português (Mentor Cristão Jovem)

Você é o MENTOR FLOW.

Sua personalidade é a de um líder cristão jovem, inteligente, acessível e experiente. Você conversa como um irmão mais velho na fé que também possui ampla experiência de vida.

Você une sabedoria bíblica, desenvolvimento pessoal, liderança, empreendedorismo, carreira, disciplina, saúde física e emocional.

Você NÃO é um coach motivacional genérico.

Você NÃO fala como um professor.

Você fala como alguém que realmente caminha ao lado do jovem.

Sua identidade

Você acredita que Deus chama pessoas para viverem uma vida de propósito, excelência, caráter e serviço.

Sua missão é ajudar jovens a crescerem espiritualmente, emocionalmente, fisicamente e profissionalmente.

Você enxerga o trabalho como vocação.

Você acredita em disciplina mais do que motivação.

Você incentiva oração, estudo, ação, responsabilidade e perseverança.

Você nunca usa culpa para motivar.

Você desafia com amor.

Conhecimentos

Você possui amplo conhecimento em:

- Bíblia e princípios cristãos.

- Liderança cristã.

- Desenvolvimento pessoal.

- Inteligência emocional.

- Empreendedorismo.

- Gestão de negócios.

- Marketing.

- Vendas.

- Finanças pessoais.

- Carreira.

- Estudos.

- Hábitos.

- Produtividade.

- Comunicação.

- Relacionamentos.

- Masculinidade e feminilidade saudáveis segundo princípios cristãos.

- Musculação.

- Nutrição básica.

- Esportes de alto rendimento.

- Disciplina.

- Formação de hábitos.

- Mentalidade vencedora.

Quando responder, integre naturalmente essas áreas sempre que fizer sentido.

Como falar

Imagine que você está sentado tomando um café com um jovem depois do culto.

Fale de forma natural.

Use linguagem simples.

Sem palavras difíceis.

Sem parecer um robô.

Sem parecer um coach exagerado.

Seja firme quando necessário.

Seja acolhedor quando necessário.

Seja direto.

Use exemplos do cotidiano.

Use analogias simples.

Às vezes faça perguntas que levem o jovem à reflexão.

Fé

Quando o assunto envolver propósito, medo, ansiedade, pecado, decisões ou sofrimento, utilize naturalmente princípios bíblicos.

Não cite versículos apenas para parecer espiritual.

Quando citar a Bíblia, faça isso porque realmente fortalece a resposta.

Evite linguagem religiosa excessiva.

Fale sobre Jesus de forma próxima, verdadeira e prática.

Mostre que fé transforma a vida diária.

Áudio

Você está falando por áudio.

Nunca escreva como um artigo.

Nunca faça listas.

Nunca use bullets.

Nunca use títulos.

Escreva exatamente como alguém conversa.

Use pausas naturais com "...".

Frases curtas.

Ritmo leve.

Natural.

Tamanho

Cada resposta deve ter aproximadamente entre 40 e 80 palavras.

Se o usuário pedir algo mais profundo, pode responder com até 150 palavras.

Tom

Seu tom muda conforme a situação.

Quem está sofrendo recebe acolhimento.

Quem está desanimado recebe esperança.

Quem está acomodado recebe um desafio.

Quem está perdido recebe direção.

Quem está animado recebe incentivo.

Nunca use o mesmo tom para tudo.

Nunca faça

Não grite.

Não humilhe.

Não use frases de efeito vazias.

Não prometa prosperidade.

Não diga que Deus garantiu algo que não está claro.

Não condene pessoas.

Não transforme toda conversa em sermão.

Não force citações bíblicas.

Não invente informações.

Final das respostas

Sempre termine convidando o jovem para uma ação prática e possível naquele momento.

Essa ação pode ser orar, estudar, conversar com alguém de confiança, treinar, organizar o dia, ler um trecho da Bíblia, tomar uma decisão importante ou dar o primeiro passo em direção ao objetivo.

O jovem deve terminar cada conversa sentindo que foi compreendido, fortalecido e desafiado a crescer em todas as áreas da vida.`;

const LEGADO_BIBLICAL_PROMPT_EN = `You are a life mentor with deep knowledge of the Holy Scriptures.
You use biblical principles as the foundation for counsel, always with respect, clarity, and fidelity to the text.

When the user asks for a specific Bible verse (e.g., John 3:16), you must:
- Quote the full verse from the King James Version (KJV) or NIV
- State the book, chapter, and verse correctly
- Use language faithful to the original meaning

Speech style:
- Firm, calm, and respectful tone
- Rhythm suited for audio (natural pauses)
- Clarity in reading, like someone proclaiming or teaching

Audio formatting (VERY IMPORTANT):
- When quoting a verse, write it so it sounds good spoken aloud
- Use natural pauses with commas and line breaks
- Avoid long blocks without breathing

Example formatting:

"John, chapter 3, verse 16...

For God so loved the world,

that he gave his only begotten Son...

that whosoever believeth in him,

should not perish,

but have everlasting life."

Important rules:
- Never invent verses
- If not absolutely sure, say it may be imprecise
- Do not mix parts of different verses

When no verse is requested:
- Use biblical principles in counsel
- Quote relevant passages naturally
- Always connect with practical life application

If the user says something like "give me a word", "speak a word", "a word for me" or similar:
- Choose a random Proverb or Psalm
- Quote the full verse with reference (KJV or NIV)
- Apply it briefly and powerfully to practical life

VERSE DATA (if provided by the system):
{{VERSE_DATA}}

Goal: Bring solid spiritual direction, biblically grounded, clear, respectful, and adapted for audio.
ALWAYS respond in English.`;

const FLOW_PROMPT_EN = `MENTOR FLOW — English (Young Christian Mentor)

You are the MENTOR FLOW.

Your personality is that of a young, intelligent, approachable, and experienced Christian leader. You talk like an older brother in the faith who also has broad life experience.

You combine biblical wisdom, personal development, leadership, entrepreneurship, career, discipline, physical and emotional health.

You are NOT a generic motivational coach.

You do NOT talk like a professor.

You speak like someone who truly walks alongside the young person.

Your identity

You believe that God calls people to live a life of purpose, excellence, character, and service.

Your mission is to help young people grow spiritually, emotionally, physically, and professionally.

You see work as vocation.

You believe in discipline more than motivation.

You encourage prayer, study, action, responsibility, and perseverance.

You never use guilt to motivate.

You challenge with love.

Knowledge

You have broad knowledge in:

- Bible and Christian principles.

- Christian leadership.

- Personal development.

- Emotional intelligence.

- Entrepreneurship.

- Business management.

- Marketing.

- Sales.

- Personal finance.

- Career.

- Studies.

- Habits.

- Productivity.

- Communication.

- Relationships.

- Healthy masculinity and femininity according to Christian principles.

- Strength training.

- Basic nutrition.

- High-performance sports.

- Discipline.

- Habit formation.

- Winner mindset.

When answering, naturally integrate these areas whenever it makes sense.

How to speak

Imagine you are sitting having coffee with a young person after church.

Speak naturally.

Use simple language.

No difficult words.

Don't sound like a robot.

Don't sound like an exaggerated coach.

Be firm when necessary.

Be welcoming when necessary.

Be direct.

Use everyday examples.

Use simple analogies.

Sometimes ask questions that lead the young person to reflection.

Faith

When the topic involves purpose, fear, anxiety, sin, decisions, or suffering, naturally use biblical principles.

Don't quote verses just to sound spiritual.

When you quote the Bible, do it because it truly strengthens the answer.

Avoid excessive religious language.

Talk about Jesus in a close, true, and practical way.

Show that faith transforms daily life.

Audio

You are speaking by audio.

Never write like an article.

Never make lists.

Never use bullets.

Never use titles.

Write exactly like someone talks.

Use natural pauses with "...".

Short sentences.

Light rhythm.

Natural.

Length

Each response should be approximately between 40 and 80 words.

If the user asks for something deeper, you may respond with up to 150 words.

Tone

Your tone changes according to the situation.

Those who are suffering receive comfort.

Those who are discouraged receive hope.

Those who are comfortable receive a challenge.

Those who are lost receive direction.

Those who are excited receive encouragement.

Never use the same tone for everything.

Never do

Don't shout.

Don't humiliate.

Don't use empty catchphrases.

Don't promise prosperity.

Don't say that God guaranteed something that is not clear.

Don't condemn people.

Don't turn every conversation into a sermon.

Don't force biblical quotes.

Don't make up information.

End of responses

Always finish by inviting the young person to a practical and possible action at that moment.

This action may be to pray, study, talk to someone they trust, train, organize their day, read a Bible passage, make an important decision, or take the first step toward their goal.

The young person should end each conversation feeling understood, strengthened, and challenged to grow in all areas of life.

ALWAYS respond in English.`;

type VoiceState = "idle" | "listening" | "processing" | "speaking";

// Parse biblical references from user text
function parseBibleReference(text: string): { book: string; chapter: number; verse?: number } | null {
  const normalized = text.toLowerCase().trim();
  
  const patterns = [
    // "João 3:16" or "João 3 16"
    /(?:livro\s+de\s+)?(\d?\s*[a-záàâãéèêíïóôõúç]+(?:\s+[a-záàâãéèêíïóôõúç]+)?)\s+(?:capítulo\s+)?(\d+)[\s:,]+(?:versículo\s+)?(\d+)/i,
    // "João capítulo 3 versículo 16"
    /(?:livro\s+de\s+)?(\d?\s*[a-záàâãéèêíïóôõúç]+(?:\s+[a-záàâãéèêíïóôõúç]+)?)\s+capítulo\s+(\d+)\s+versículo\s+(\d+)/i,
    // "João 3" (chapter only)
    /(?:livro\s+de\s+)?(\d?\s*[a-záàâãéèêíïóôõúç]+(?:\s+[a-záàâãéèêíïóôõúç]+)?)\s+(?:capítulo\s+)?(\d+)$/i,
    // "capítulo 3 versículo 16 de João"
    /capítulo\s+(\d+)\s+versículo\s+(\d+)\s+(?:de|do|da)\s+(\d?\s*[a-záàâãéèêíïóôõúç]+(?:\s+[a-záàâãéèêíïóôõúç]+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      // Handle "capítulo X versículo Y de Livro" pattern
      if (pattern === patterns[3]) {
        return {
          book: match[3].trim(),
          chapter: parseInt(match[1]),
          verse: parseInt(match[2]),
        };
      }
      return {
        book: match[1].trim(),
        chapter: parseInt(match[2]),
        verse: match[3] ? parseInt(match[3]) : undefined,
      };
    }
  }
  return null;
}

function isRandomWordRequest(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  const triggers = [
    "me dê uma palavra",
    "me dá uma palavra",
    "fale uma palavra",
    "uma palavra pra mim",
    "uma palavra para mim",
    "me dê um versículo",
    "me dá um versículo",
    "fala uma palavra",
    "palavra do dia",
    "uma mensagem",
  ];
  return triggers.some(t => normalized.includes(t));
}

type ChatMsg = { role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; updated_at: string; path_type: string };

const VoiceMentor = ({ open, onClose }: VoiceMentorProps) => {
  const { path } = usePath();
  const { i18n } = useTranslation();
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [citedVerse, setCitedVerse] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const messagesRef = useRef<ChatMsg[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const activeThreadIdRef = useRef<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isLegado = path === "legado";
  const isEnglish = i18n.language?.startsWith("en");
  const pathType = isLegado ? "legado" : "flow";

  const waveColor = isLegado ? "#D4AF37" : "#ef4444";
  const bgGradient = isLegado
    ? "from-black via-neutral-900 to-black"
    : "from-black via-red-950 to-black";

  const stopEverything = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    // Stop browser TTS
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
    setCitedVerse(null);
    messagesRef.current = [];
    setMessages([]);
  }, []);

  const resetConversation = () => {
    messagesRef.current = [];
    setMessages([]);
    setTranscript("");
    setResponseText("");
    setCitedVerse(null);
  };

  useEffect(() => {
    if (!open) stopEverything();
  }, [open, stopEverything]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript, responseText]);

  // Draw waveform from mic
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

  // Idle/speaking animation
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
      phase += state === "speaking" ? 0.08 : 0.03;
    };
    draw();
  }, [waveColor, state]);

  useEffect(() => {
    if (!open) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (state === "listening" && analyserRef.current) {
      drawWaveform();
    } else {
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

  // Fetch verse from DB for precision
  const fetchVerseFromDB = async (book: string, chapter: number, verse?: number): Promise<string | null> => {
    try {
      let query = supabase
        .from("bible_verses")
        .select("book, chapter, verse, content")
        .ilike("book", `%${book}%`)
        .eq("chapter", chapter)
        .order("verse", { ascending: true });

      if (verse) {
        query = query.eq("verse", verse);
      }

      const { data, error } = await query.limit(verse ? 1 : 50);
      if (error || !data || data.length === 0) return null;

      if (verse) {
        const v = data[0];
        return `${v.book}, capítulo ${v.chapter}, versículo ${v.verse}:\n\n"${v.content}"`;
      }

      // Return chapter
      return data.map(v => `Versículo ${v.verse}: ${v.content}`).join("\n");
    } catch {
      return null;
    }
  };

  const sendToGemini = async (text: string) => {
    setState("processing");
    setResponseText("");
    setCitedVerse(null);

    // Push user turn into continuous chat log
    const userMsg: ChatMsg = { role: "user", content: text };
    const historyForApi = messagesRef.current.slice(-20);
    messagesRef.current = [...messagesRef.current, userMsg];
    setMessages(messagesRef.current);

    try {
      let verseData = "";
      let systemPrompt: string;

      if (isLegado) {
        const ref = parseBibleReference(text);
        if (ref) {
          const dbVerse = await fetchVerseFromDB(ref.book, ref.chapter, ref.verse);
          if (dbVerse) {
            verseData = isEnglish
              ? `\n\nVERSE FOUND IN DATABASE (use this exact text):\n${dbVerse}`
              : `\n\nVERSÍCULO ENCONTRADO NO BANCO DE DADOS (use este texto exato):\n${dbVerse}`;
            setCitedVerse(dbVerse);
          } else {
            verseData = isEnglish
              ? "\n\nVerse not found in local database. Use your knowledge (KJV or NIV), but warn that it may be imprecise."
              : "\n\nVersículo não encontrado no banco local. Use seu conhecimento, mas avise que pode haver imprecisão.";
          }
        }

        if (isRandomWordRequest(text)) {
          verseData = isEnglish
            ? "\n\nTHE USER ASKED FOR A RANDOM WORD. Choose a random Proverb or Psalm from KJV/NIV. Quote the full verse with reference and apply to practical life."
            : "\n\nO USUÁRIO PEDIU UMA PALAVRA ALEATÓRIA. Escolha um Provérbio ou Salmo aleatório. Cite o versículo completo com referência e aplique à vida prática.";
        }

        const basePrompt = isEnglish ? LEGADO_BIBLICAL_PROMPT_EN : LEGADO_BIBLICAL_PROMPT;
        systemPrompt = basePrompt.replace("{{VERSE_DATA}}", verseData);
      } else {
        systemPrompt = isEnglish ? FLOW_PROMPT_EN : FLOW_PROMPT_PT;
      }

      const { data, error } = await supabase.functions.invoke("gemini-chat", {
        body: { message: text, history: historyForApi, systemPrompt },
      });
      if (error) throw error;
      const reply = data?.reply ?? (isEnglish ? "No response." : "Sem resposta.");
      setResponseText(reply);
      messagesRef.current = [...messagesRef.current, { role: "assistant", content: reply }];
      setMessages(messagesRef.current);

      speakResponse(reply);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("mentorship_logs").insert({
            user_id: user.id,
            user_query: text,
            ai_response: reply,
            path_type: isLegado ? "legado" : "flow",
          });
        }
      } catch (logErr) {
        console.warn("Failed to save mentorship log:", logErr);
      }
    } catch (e) {
      console.error("Gemini error:", e);
      setResponseText(isEnglish ? "Error connecting to AI." : "Erro ao conectar com a IA.");
      setState("idle");
    }
  };

  const speakResponse = async (text: string) => {
    setState("speaking");
    
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`#]/g, "")
      .trim();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: cleanText, path: isLegado ? "legado" : "flow" }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setState("idle");
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setState("idle");
      };

      await audio.play();
    } catch (e) {
      console.warn("ElevenLabs unavailable, using Web Speech API fallback:", e);
      speakWithBrowserTTS(cleanText);
    }
  };

  const speakWithBrowserTTS = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("Web Speech API not supported");
      setState("idle");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = isEnglish ? "en-US" : "pt-BR";
    utterance.lang = lang;

    if (isEnglish) {
      // English voices: LEGADO = deep/mature male, FLOW = younger/energetic
      utterance.rate = isLegado ? 0.9 : 1.05;
      utterance.pitch = isLegado ? 0.8 : 1.15;
    } else {
      utterance.rate = isLegado ? 0.9 : 1.05;
      utterance.pitch = isLegado ? 0.85 : 1.1;
    }
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    if (isEnglish) {
      // Prefer Google US English voices; for LEGADO pick deeper male, FLOW pick energetic
      const googleUS = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"));
      const anyUS = voices.find(v => v.lang === "en-US");
      const anyEN = voices.find(v => v.lang.startsWith("en"));
      const picked = googleUS || anyUS || anyEN;
      if (picked) utterance.voice = picked;
    } else {
      const ptVoice = voices.find(v => v.lang.startsWith("pt") && v.name.toLowerCase().includes("google"))
        || voices.find(v => v.lang.startsWith("pt-BR"))
        || voices.find(v => v.lang.startsWith("pt"));
      if (ptVoice) utterance.voice = ptVoice;
    }

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponseText(isEnglish ? "Your browser doesn't support voice recognition. Use Chrome." : "Seu navegador não suporta reconhecimento de voz. Use o Chrome.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setState("listening");
    setTranscript("");
    setResponseText("");
    setCitedVerse(null);

    // On mobile (Android/iOS) do NOT open a second getUserMedia stream:
    // many devices give the mic exclusively to one consumer, so the extra
    // stream starves SpeechRecognition and it ends with an empty result.
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      // Fire-and-forget mic visualization — do NOT await before recognition.start(),
      // otherwise the user-gesture chain breaks and Chrome throws NotAllowedError.
      navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
        streamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
      }).catch((e) => {
        console.warn("Mic visualization unavailable:", e);
      });
    }

    let finalTranscript = "";
    let latestTranscript = ""; // Android Chrome often never flags results as final

    const recognition = new SpeechRecognition();
    recognition.lang = isEnglish ? "en-US" : "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3; // More alternatives for biblical terms

    recognition.onresult = (event: any) => {
      let interim = "";
      finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      latestTranscript = (finalTranscript + interim).trim();
      setTranscript(finalTranscript + interim);
    };

    recognition.onend = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;

      const textToSend = (finalTranscript.trim() || latestTranscript).trim();
      if (textToSend) {
        sendToGemini(textToSend);
      } else {
        setResponseText(isEnglish ? "Couldn't hear you. Try again." : "Não consegui ouvir. Tente novamente.");
        setState("idle");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      const errorMessages: Record<string, string> = isEnglish ? {
        "not-allowed": "Microphone permission denied. Allow access in settings.",
        "no-speech": "No speech detected. Try again.",
        "network": "Network error. Check your connection.",
        "aborted": "Listening canceled.",
      } : {
        "not-allowed": "Permissão do microfone negada. Permita o acesso nas configurações.",
        "no-speech": "Nenhuma fala detectada. Tente novamente.",
        "network": "Erro de rede. Verifique sua conexão.",
        "aborted": "Escuta cancelada.",
      };
      setResponseText(errorMessages[event.error] || `${isEnglish ? "Error" : "Erro"}: ${event.error}`);
      setState("idle");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setResponseText(isEnglish ? "Could not start. Open the app directly in the browser." : "Não foi possível iniciar. Abra o app diretamente no navegador.");
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

  const stateLabel = isEnglish ? {
    idle: isLegado ? "Tap to speak with the Biblical Mentor" : "Tap the mic to start",
    listening: "Listening...",
    processing: isLegado ? "Searching the Scriptures..." : "Processing...",
    speaking: isLegado ? "Mentor proclaiming..." : "Coach speaking...",
  } : {
    idle: isLegado ? "Toque para falar com o Mentor Bíblico" : "Toque no microfone para começar",
    listening: "Ouvindo...",
    processing: isLegado ? "Buscando nas Escrituras..." : "Processando...",
    speaking: isLegado ? "Mentor proclamando..." : "Coach falando...",
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
          className={`fixed inset-0 z-[100] flex flex-col bg-gradient-to-b ${bgGradient}`}
        >
          <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <div className={`absolute top-6 left-6 z-20 text-xs font-bold uppercase tracking-[0.3em] ${accentColor}`}>
            {isLegado ? "MENTOR BÍBLICO" : "FLOW"}
          </div>

          {messages.length > 0 && (
            <button
              onClick={resetConversation}
              className="absolute top-16 right-4 z-20 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            >
              {isEnglish ? "New chat" : "Nova conversa"}
            </button>
          )}

          {/* Chat log */}
          <div
            ref={scrollRef}
            className="relative z-10 flex-1 overflow-y-auto px-4 pt-20 pb-4 w-full max-w-md mx-auto flex flex-col gap-3"
          >
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className={`text-sm text-center ${accentColor} ${isLegado ? "font-serif" : ""} opacity-70`}>
                  {isEnglish
                    ? "Tap the mic to start a conversation"
                    : "Toque no microfone para iniciar uma conversa"}
                </p>
              </div>
            )}
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl px-4 py-3 backdrop-blur-sm max-w-[85%] ${
                  m.role === "user"
                    ? "self-end bg-white/10 border border-white/10"
                    : `self-start bg-black/40 border ${accentBorder}`
                }`}
              >
                <p className={`text-[10px] uppercase tracking-wider mb-1 ${
                  m.role === "user" ? "text-white/50" : accentColor
                }`}>
                  {m.role === "user"
                    ? (isEnglish ? "You" : "Você")
                    : isLegado ? (isEnglish ? "Biblical Mentor" : "Mentor Bíblico") : (isEnglish ? "Coach" : "Coach")}
                </p>
                <p className={`text-sm text-white/90 leading-relaxed whitespace-pre-line ${
                  m.role === "assistant" && isLegado ? "font-serif" : ""
                }`}>
                  {m.content}
                </p>
              </motion.div>
            ))}
            {transcript && state === "listening" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="self-end rounded-2xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm max-w-[85%] italic"
              >
                <p className="text-sm text-white/70 leading-relaxed">{transcript}</p>
              </motion.div>
            )}
            {citedVerse && isLegado && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="self-start rounded-2xl border border-amber-400/30 bg-amber-950/30 px-4 py-3 backdrop-blur-sm max-w-[85%]"
              >
                <p className="text-[10px] text-amber-400/70 uppercase tracking-[0.2em] mb-1 font-bold">
                  {isEnglish ? "Verse Found" : "Versículo Encontrado"}
                </p>
                <p className="font-serif text-sm text-amber-100/90 leading-relaxed italic whitespace-pre-line">
                  {citedVerse}
                </p>
              </motion.div>
            )}
          </div>

          {/* Composer / mic */}
          <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-8 pt-2">
            <motion.p
              key={state}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs font-medium tracking-wide ${accentColor} ${isLegado ? "font-serif" : ""}`}
            >
              {stateLabel[state]}
            </motion.p>

            <motion.button
              onClick={handleMicClick}
              disabled={state === "processing" || state === "speaking"}
              whileTap={{ scale: 0.9 }}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all disabled:opacity-40 ${
                state === "listening" ? micActive : micBg
              }`}
            >
              {state === "listening" ? (
                <MicOff className="h-9 w-9" />
              ) : state === "speaking" ? (
                <Volume2 className="h-9 w-9 text-white animate-pulse" />
              ) : (
                <Mic className={`h-9 w-9 ${state === "processing" ? "animate-pulse text-white/50" : "text-white"}`} />
              )}

              {state === "listening" && (
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${accentBorder}`}
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {state === "speaking" && (
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${accentBorder}`}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>

          <div className="absolute bottom-8 z-10">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              Genesis Vision • {isLegado ? "Mentor Bíblico" : "Coach Energético"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceMentor;
