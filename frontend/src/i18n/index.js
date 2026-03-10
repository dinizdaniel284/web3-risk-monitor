import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Diniz IA Agency",
      conn_status: "Connection Status",
      waiting: "Waiting...",
      balance: "Balance",
      active_networks: "Active Networks",
      risk_monitor_title: "Risk Monitor",
      risk_description: "Analyze the governance and security of any smart contract instantly.",
      placeholder_contract: "Paste contract address (0x...)",
      btn_monitor: "Start Monitoring",
      invalid_addr: "Invalid contract address!",
      risk_score: "Risk Score",
      safe: "Safe",
      high_risk: "High Risk",
      details: "Security Details",
      // Novos sinais de monitoramento
      signal_owner: "Owner identified (Centralization risk)",
      signal_proxy: "Proxy detected (Contract can be changed)",
      signal_not_contract: "Warning: This is a personal wallet, not a contract!",
      error_blockchain_connection: "Blockchain connection error."
    }
  },
  pt: {
    translation: {
      title: "Agência IA Diniz",
      conn_status: "Status da Conexão",
      waiting: "Aguardando...",
      balance: "Saldo",
      active_networks: "Redes Ativas",
      risk_monitor_title: "Monitor de Risco",
      risk_description: "Analise a governança e segurança de qualquer contrato inteligente instantaneamente.",
      placeholder_contract: "Cole o endereço do contrato (0x...)",
      btn_monitor: "Iniciar Monitor",
      invalid_addr: "Endereço de contrato inválido!",
      risk_score: "Pontuação de Risco",
      safe: "Seguro",
      high_risk: "Alto Risco",
      details: "Detalhes de Segurança",
      // Novos sinais de monitoramento
      signal_owner: "Dono identificado (Risco de centralização)",
      signal_proxy: "Proxy detectado (Contrato pode ser alterado)",
      signal_not_contract: "Aviso: Isto é uma carteira pessoal, não um contrato!",
      error_blockchain_connection: "Erro na conexão com a blockchain."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // Idioma padrão da Agência
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;