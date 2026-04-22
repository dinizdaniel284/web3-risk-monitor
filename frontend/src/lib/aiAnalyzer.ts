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
   * Calibrado para evitar falsos positivos em protocolos Blue Chip.
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
              content: `Você é um auditor de segurança Web3 sênior especializado em Solidity.
              Sua tarefa é realizar uma análise de risco técnica e precisa.

              DIRETRIZES DE PONTUAÇÃO:
              1. Comece com score 100.
              2. Se o código for de um protocolo amplamente conhecido e confiável (como WETH, DAI, USDC, USDT, Uniswap, AAVE), o score DEVE ser entre 95 e 100.
              3. Reduza o score drasticamente (60-80 pontos) apenas para riscos fatais: Honeypot, funções de Rugpull, ou falta de proteção contra Reentrancy em funções de saque.
              4. Reduza moderadamente (10-20 pontos) para funções administrativas centralizadas (Owner) que não possuem Timelock.
              5. Se o código estiver incompleto ou for apenas uma interface, mantenha um score neutro (50) e relate nos riscos.

              RETORNE APENAS UM JSON NO FORMATO:
              {
                "score": number,
                "risks": string[],
                "summary": string
              }`
            },
            {
              role: "user",
              content: `Analise o seguinte código de contrato inteligente. Se você reconhecer o protocolo, leve isso em conta na pontuação: \n\n${contractCode}`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API da OpenAI: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return JSON.parse(content);
    } catch (error) {
      console.error("Erro na auditoria IA:", error);
      return { 
        score: 10, // Retornamos um score baixo em caso de erro técnico para não dar falsa sensação de segurança
        risks: ["Erro na conexão com o serviço de análise de IA."], 
        summary: "Não foi possível realizar a análise técnica. Verifique sua conexão ou a chave da API." 
      };
    }
  }
}
