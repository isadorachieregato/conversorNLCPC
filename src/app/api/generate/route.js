import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const MODEL_NAME = "gemini-2.5-flash";

function formatPropositions(props) {
  if (!props) return "";
  return Object.entries(props)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: "${v.trim()}"`)
    .join("\n");
}

export async function POST(req) {
  try {
    const { input, mode, propositions } = await req.json();

    if (!input || !mode) {
      return NextResponse.json(
        { error: "O campo 'input' e 'mode' são obrigatórios." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key do Gemini não encontrada." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    let systemInstruction = "";
    let userPrompt = "";

    if (mode === "nl-to-cpc") {
      systemInstruction = `
        Você converte frases em português para fórmulas de CPC.
        Responda SOMENTE nesta estrutura:

        Fórmula: [FÓRMULA]
        Proposições:
        P: [Texto]
        Q: [Texto]
        ...`;

      userPrompt = `Converta para CPC:\n\n"${input}"`;

    } else if (mode === "cpc-to-nl") {
      systemInstruction = `
        Você converte fórmulas de CPC em frases em português.
        Responda SOMENTE com a frase.`;

      userPrompt = `
        Fórmula: ${input}
        Proposições:
        ${formatPropositions(propositions)}
      `;
    }
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction
    });

    const resposta = result.response.text(); 

    return NextResponse.json({ resposta });

  } catch (error) {
    console.error("Erro Gemini:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
