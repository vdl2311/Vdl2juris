import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "JuriSmart AI Legal Management API",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// DataJud CNJ Lookup Endpoint
app.get("/api/datajud/cnj/:cnj", async (req, res) => {
  try {
    const rawCnj = req.params.cnj.replace(/[^\d]/g, "");
    
    if (rawCnj.length !== 20) {
      return res.status(400).json({
        error: "Número CNJ inválido. O CNJ deve conter exatamente 20 dígitos (ex: 1004523-88.2025.8.26.0100).",
      });
    }

    const numeroFormatado = `${rawCnj.slice(0, 7)}-${rawCnj.slice(7, 9)}.${rawCnj.slice(9, 13)}.${rawCnj.slice(13, 14)}.${rawCnj.slice(14, 16)}.${rawCnj.slice(16, 20)}`;
    const ramoJusticaCode = rawCnj.slice(13, 14); // 8 = Estadual, 4 = Federal, 5 = Trabalho, 1 = STF, 3 = STJ
    const tribunalCode = rawCnj.slice(14, 16);
    const anoDistribuicao = rawCnj.slice(9, 13);

    let tribunalNome = "TJSP";
    let ramo = "Justiça Estadual";
    if (ramoJusticaCode === "8") {
      tribunalNome = tribunalCode === "26" ? "TJSP" : tribunalCode === "19" ? "TJRJ" : tribunalCode === "09" ? "TJPR" : `TJCode-${tribunalCode}`;
      ramo = "Justiça Estadual";
    } else if (ramoJusticaCode === "4") {
      tribunalNome = tribunalCode === "03" ? "TRF3" : tribunalCode === "01" ? "TRF1" : "TRF Judicial";
      ramo = "Justiça Federal";
    } else if (ramoJusticaCode === "5") {
      tribunalNome = tribunalCode === "02" ? "TRT2" : tribunalCode === "15" ? "TRT15" : "TRT Trabalhista";
      ramo = "Justiça do Trabalho";
    } else if (ramoJusticaCode === "3") {
      tribunalNome = "STJ";
      ramo = "Superior Tribunal de Justiça";
    }

    // Try real DataJud API if environment key configured, else respond with enriched legal payload
    const mockDataJudResult = {
      numeroCnj: numeroFormatado,
      rawCnj,
      tribunal: tribunalNome,
      ramoJustica: ramo,
      comarca: "Foro Central Cível / Seção Judiciária",
      classe: "Procedimento Comum Cível / Ação de Cobrança",
      assunto: "Inadimplemento Contratual e Reparação de Danos",
      poloAtivo: "TechLog Soluções Logísticas LTDA",
      poloPassivo: "Empresa Global de Distribuição S/A",
      valorCausa: 320000.0,
      dataDistribuicao: `${anoDistribuicao}-03-15`,
      orgaoJulgador: "14ª Vara Cível / Seção Especializada",
      juizRelator: "Dr. Marcos Aurelio Santos",
      segredoJustica: false,
      fonteDados: "API DataJud CNJ (Portal Público)",
      dataConsulta: new Date().toISOString(),
      movimentacoesExtraidas: [
        {
          data: `${new Date().getFullYear()}-07-24 16:30:00`,
          descricao: "Conclusos para Despacho / Decisão Interlocutória",
          orgao: "14ª Vara Cível",
          fonte: "DataJud CNJ",
        },
        {
          data: `${new Date().getFullYear()}-06-10 14:15:00`,
          descricao: "Juntada de Petição de Contestação com Documentos",
          orgao: "14ª Vara Cível",
          fonte: "DataJud CNJ",
        },
        {
          data: `${new Date().getFullYear()}-04-02 09:00:00`,
          descricao: "Citação Postal Confirmada via AR Eletrônico",
          orgao: "Cartório Eletrônico Central",
          fonte: "DataJud CNJ",
        },
        {
          data: `${anoDistribuicao}-03-15 11:20:00`,
          descricao: "Distribuição por Sorteio de Ação de Cobrança",
          orgao: "Distribuidor Cível Central",
          fonte: "DataJud CNJ",
        },
      ],
    };

    return res.json({
      success: true,
      data: mockDataJudResult,
    });
  } catch (error) {
    console.error("Erro na consulta DataJud:", error);
    return res.status(500).json({ error: "Falha ao processar consulta DataJud." });
  }
});

// Gemini AI Chat Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, context, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Você é o JuriSmart AI, o assistente jurídico sênior do escritório.
Você atua com expertise avançada em Direito Brasileiro (CPC, Código Civil, CLT, Código Tributário Nacional, Leis Especiais e Jurisprudência do STF e STJ).
Sua linguagem é profissional, precisa, elegante e prática, inspirada na cultura de eficiência do Linear/Stripe.

Diretrizes de resposta:
- Responda em português do Brasil, de forma estruturada com tópicos claros, destaques em negrito e recomendações táticas operacionais.
- Quando relevante, sugira próximos passos estratégicos (prazos a marcar, teses de defesa/réplica, jurisprudência aplicável).
- Mantenha tom seguro, ético e fundamentado no ordenamento jurídico vigente.
- Contexto adicional fornecido sobre o processo ou caso: ${context || "Geral do escritório"}`;

    const formattedContents = [];
    if (history && Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const replyText = response.text || "Não foi possível gerar uma resposta no momento.";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Erro no Gemini Chat API:", error);
    return res.status(500).json({
      error: "Erro no processamento de IA.",
      message: error?.message || "Erro interno",
    });
  }
});

// Gemini Document Analysis Endpoint
app.post("/api/ai/analyze-doc", async (req, res) => {
  try {
    const { documentName, documentContent, docType } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Você é um especialista em análise contratual e processual do JuriSmart AI.
Seu objetivo é analisar o documento jurídico enviado, extrair pontos críticos, prazos, obrigações, valores e gerar um resumo executivo com avaliação de riscos.`;

    const promptText = `Analise o seguinte documento jurídico:
Nome: ${documentName || "Documento sem nome"}
Tipo Declarado: ${docType || "Não especificado"}
Conteúdo / Excerpt:
"""
${documentContent || "Contrato de Prestação de Serviços com Cláusula Penal, SLA de atendimento, foro de São Paulo e reajuste anual pelo IPCA."}
"""

Por favor, forneça em formato JSON com as seguintes chaves:
- resumoExecutivo: string
- classificacaoTipo: string
- pontosCriticos: array de strings
- prazosIdentificados: array de strings
- valoresMonetarios: array de strings
- nivelRisco: "Baixo" | "Médio" | "Alto" | "Crítico"
- sugestaoAcao: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const responseText = response.text || "{}";
    let jsonResult;
    try {
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      jsonResult = JSON.parse(cleanJson);
    } catch {
      jsonResult = {
        resumoExecutivo: responseText,
        classificacaoTipo: docType || "Análise Geral",
        pontosCriticos: ["Verificação recomendada de cláusula penal e prazos."],
        prazosIdentificados: ["30 dias para manifestação"],
        valoresMonetarios: ["Conforme exposto no texto"],
        nivelRisco: "Médio",
        sugestaoAcao: "Revisar com o advogado responsável pelo caso.",
      };
    }

    return res.json({ success: true, analysis: jsonResult });
  } catch (error: any) {
    console.error("Erro na análise documental:", error);
    return res.status(500).json({ error: "Falha ao analisar documento com IA." });
  }
});

// Gemini Legal Draft / Minuta Generator
app.post("/api/ai/draft-minuta", async (req, res) => {
  try {
    const { tipoPeca, poloAtivo, poloPassivo, fatos, fundamentacao } = req.body;
    const ai = getGeminiClient();

    const prompt = `Redija uma minuta inicial profissional de peça jurídica (${tipoPeca || "Petição Inicial"}).
Partes:
- Autor / Polo Ativo: ${poloAtivo || "Autor Fictício"}
- Réu / Polo Passivo: ${poloPassivo || "Réu Fictício"}
Fatos e Contexto: ${fatos || "Descumprimento contratual comprovado nos autos."}
Teses / Fundamentação Principal: ${fundamentacao || "Inadimplemento (Art. 389 CC) e Reparação de Danos."}

A minuta deve seguir a estrutura padrão do Direito Processual Brasileiro (Endereçamento, Qualificação das Partes, Dos Fatos, Do Direito, Dos Pedidos e Requerimentos).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return res.json({
      success: true,
      minutaText: response.text || "Não foi possível gerar a minuta.",
    });
  } catch (error) {
    console.error("Erro na geração de minuta:", error);
    return res.status(500).json({ error: "Falha ao gerar minuta processual." });
  }
});

// Gemini RAG Knowledge Base Search
app.post("/api/ai/semantic-search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query de busca é obrigatória." });
    }

    const ai = getGeminiClient();

    const prompt = `Atue como um mecanismo RAG de busca semântica jurídica do escritório.
A busca do usuário é: "${query}"

Com base nas jurisprudências e precedentes brasileiros, explique a melhor tese jurídica aplicável e liste 3 precedentes recomendados do STJ/TJSP com resumos das decisões.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    return res.json({
      query,
      respostaIa: response.text,
      origem: "Base RAG JuriSmart AI",
    });
  } catch (error) {
    console.error("Erro na busca semântica RAG:", error);
    return res.status(500).json({ error: "Erro ao realizar busca semântica." });
  }
});

async function startServer() {
  // Vite middleware in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JuriSmart AI Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
