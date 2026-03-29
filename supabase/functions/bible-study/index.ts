import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { reference } = await req.json();

    if (!reference || typeof reference !== "string" || reference.trim().length === 0 || reference.length > 500) {
      return new Response(
        JSON.stringify({ error: "Reference is required (max 500 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Você é um mentor bíblico teológico do app Genesis Vision (modo LEGADO). Sua tarefa é analisar referências bíblicas.

REGRAS ESTRITAS:
1. Só responda sobre conteúdo bíblico (livros canônicos do Antigo e Novo Testamento).
2. Se o input NÃO for uma referência bíblica válida (livro, capítulo ou tema bíblico), retorne EXATAMENTE:
   {"error": "not_biblical"}
3. Se FOR uma referência válida, retorne um JSON com esta estrutura:
   {
     "book": "Nome do livro",
     "chapter": número,
     "verses": [{"verse": número, "content": "texto do versículo"}],
     "insight": "Contexto histórico e teológico do capítulo em 2-3 parágrafos profundos",
     "originalWord": {
       "word": "palavra original em hebraico ou grego",
       "transliteration": "transliteração",
       "language": "Hebraico" ou "Grego",
       "meaning": "significado profundo da palavra e como ela ilumina o texto"
     },
      "relatedTopics": ["tema1", "tema2", "tema3"],
      "applications": ["Ponto prático 1 para aplicar hoje", "Ponto prático 2", "Ponto prático 3"]
   }
4. Use a versão "Almeida Revista e Corrigida" para o texto bíblico.
5. As "applications" devem ser 3 pontos práticos e pessoais de como aplicar a mensagem do capítulo no dia a dia do leitor.
5. Sempre retorne JSON válido, sem markdown, sem backticks.
6. Inclua todos os versículos do capítulo referenciado.
7. Os "relatedTopics" devem ser temas teológicos relacionados (ex: adoração, oração, fé, redenção).`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analise a referência bíblica: "${reference.trim()}"` },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawReply = data?.choices?.[0]?.message?.content ?? "";

    // Try to parse the AI response as JSON
    let parsed;
    try {
      // Remove possible markdown wrapping
      const cleaned = rawReply.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", rawReply);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if AI flagged it as not biblical
    if (parsed.error === "not_biblical") {
      return new Response(
        JSON.stringify({ notBiblical: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("bible-study error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
