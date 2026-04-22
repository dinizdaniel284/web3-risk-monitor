// frontend/src/lib/aiAnalyzer.ts

export interface AnalysisResult {
  score: number;
  risks: string[];
  summary: string;
}

export class AIAnalyzer {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analisa vulnerabilidades de Smart Contracts usando GPT-4.
   * Foco: Reentrancy, HoneyPots e manipulação de taxas.
   */
  async analyzeContract(contractCode: string): Promise<AnalysisResult> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: "Você é um auditor de segurança Web3 sênior. Analise o código do contrato e retorne um JSON com: 'score' (0-100), 'risks' (lista de strings) e 'summary' (string)."
            },
            {
              role: "user",
              content: `Analise este código: \n\n${contractCode}`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("Erro na auditoria IA:", error);
      return { 
        score: 0, 
        risks: ["Erro na conexão com o serviço de IA"], 
        summary: "Não foi possível realizar a análise técnica no momento." 
      };
    }
  }
}