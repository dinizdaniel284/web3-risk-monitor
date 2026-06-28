// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      web3_security: "Segurança Web3",
      subtitle: "Analise contratos e evite golpes.",
      placeholder: "0x...",
      btn_analyze: "Analisar",
      btn_processing: "Processando...",
      analyzing_contract: "Analisando contrato...",
      connected: "Conectado",
      invalid_address: "Endereço inválido",
      analysis_completed: "Análise concluída",
      simulation_mode: "Análise concluída (Simulação)",
      
      // NOVAS CHAVES DO CARD DE RISCO
      risk_score_title: "Pontuação de Risco Web3",
      high_risk: "RISCO ALTO",
      medium_risk: "RISCO MÉDIO",
      low_risk: "RISCO BAIXO",
      signal_not_contract: "O endereço informado não pertence a um Contrato Inteligente"
    }
  },
  en: {
    translation: {
      web3_security: "Web3 Security",
      subtitle: "Analyze contracts and avoid scams.",
      placeholder: "0x...",
      btn_analyze: "Analyze",
      btn_processing: "Processing...",
      analyzing_contract: "Analyzing contract...",
      connected: "Connected",
      invalid_address: "Invalid address",
      analysis_completed: "Analysis completed",
      simulation_mode: "Analysis completed (Simulation)",
      
      // NOVAS CHAVES DO CARD DE RISCO
      risk_score_title: "Web3 Risk Score",
      high_risk: "HIGH RISK",
      medium_risk: "MEDIUM RISK",
      low_risk: "LOW RISK",
      signal_not_contract: "The provided address does not belong to a Smart Contract"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;