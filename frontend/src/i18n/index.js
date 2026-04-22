import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      title: "Diniz IA Agency",
      risk_monitor_title: "Risk Monitor",
      risk_description: "Analyze the governance and security of any smart contract instantly.",
      placeholder_contract: "Paste contract address (0x...)",
      btn_monitor: "Start Monitoring",
      analyzing: "Analyzing...",
      invalid_addr: "Invalid contract address!",
      risk_score: "Risk Score",
      safe: "Safe / Low Risk",
      high_risk: "High Risk Detected",
      view_etherscan: "View on Etherscan",
      error_not_found: "Contract not found or no bytecode.",
      error_blockchain: "Blockchain connection error.",
      signals: {
        self_destruct: "Self-Destruct Detected 🚨",
        delegate_call: "DelegateCall Active ⚠️",
        withdraw_lock: "Withdrawal Lock Suspected 🛑",
        proxy: "Hidden Proxy Detected 🔄",
        clean: "Clean Patterns ✅"
      }
    }
  },
  pt: {
    translation: {
      title: "Agência IA Diniz",
      risk_monitor_title: "Monitor de Risco",
      risk_description: "Analise a governança e segurança de qualquer contrato inteligente instantaneamente.",
      placeholder_contract: "Cole o endereço do contrato (0x...)",
      btn_monitor: "Iniciar Monitoramento",
      analyzing: "Analisando...",
      invalid_addr: "Endereço de contrato inválido!",
      risk_score: "Pontuação de Risco",
      safe: "Seguro / Baixo Risco",
      high_risk: "Alto Risco Detectado",
      view_etherscan: "Ver no Etherscan",
      error_not_found: "Contrato não encontrado ou sem código.",
      error_blockchain: "Erro na conexão com a blockchain.",
      signals: {
        self_destruct: "Self-Destruct Detectado 🚨",
        delegate_call: "DelegateCall Ativo ⚠️",
        withdraw_lock: "Suspeita de Trava de Saque 🛑",
        proxy: "Proxy Oculto Detectado 🔄",
        clean: "Padrões Limpos ✅"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt", // Começar em PT já que seu público inicial é BR
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;