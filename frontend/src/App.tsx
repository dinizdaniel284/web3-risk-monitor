import { useState, useEffect } from 'react';
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { Shield, Globe, Wallet, Languages, Search, History, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './i18n/index';

import { useRiskAnalysis } from './hooks/useRiskAnalysis';
import RiskCard from './components/RiskCard';

// AJUSTE PARA DEPLOY: Define a URL do backend (usa localhost se não houver variável de ambiente)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const { address, isConnected } = useAccount();
  const { t, i18n } = useTranslation();
  const [contractInput, setContractInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<any[]>([]); 
  const { riskScore, signals, analyzeContract } = useRiskAnalysis();

  const { data: balance } = useBalance({ 
    address: address as `0x${string}` | undefined 
  });

  const carregarHistorico = async () => {
    try {
      const response = await fetch(`${API_URL}/api/history`);
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const salvarNoBanco = async (contract: string, score: number, alertSignals: string[]) => {
    try {
      await fetch(`${API_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: contract, score, signals: alertSignals })
      });
      carregarHistorico(); 
    } catch (error) {
      console.error("❌ Erro na sincronização");
    }
  };

  const handleStartMonitor = async () => {
    if (!contractInput.startsWith('0x') || contractInput.length !== 42) {
      alert(t('invalid_addr'));
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeContract(contractInput); 
      if (result) {
        await salvarNoBanco(contractInput, result.score, result.signals);
      }
    } catch (error) {
      console.error("Erro na análise:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RainbowKitProvider locale={i18n.language === 'pt' ? 'pt-BR' : 'en-US'}>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">AD</div>
              <span className="font-bold text-xl tracking-tight">{t('title')}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all text-sm font-medium active:scale-95">
                <Languages size={16} className="text-blue-400" />
                {i18n.language?.toUpperCase() || 'PT'}
              </button>
              <ConnectButton />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-colors">
              <h3 className="font-semibold flex items-center gap-2"><Shield size={18} className="text-blue-400" />{t('conn_status')}</h3>
              <p className="text-slate-400 text-sm mt-2 font-mono">{isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('waiting')}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-green-500/30 transition-colors">
              <h3 className="font-semibold flex items-center gap-2"><Wallet size={18} className="text-green-400" />{t('balance')}</h3>
              <p className="text-slate-400 text-sm mt-2 font-mono">{isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : t('waiting')}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition-colors">
              <h3 className="font-semibold flex items-center gap-2"><Globe size={18} className="text-purple-400" />Redes Ativas</h3>
              <p className="text-slate-400 text-sm mt-2">Ethereum, Polygon & Sepolia</p>
            </div>
          </div>

          {/* Monitor Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-4 text-white">{t('risk_monitor_title')}</h2>
              <p className="text-slate-400 mb-10 leading-relaxed">{t('risk_description')}</p>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="text" value={contractInput} onChange={(e) => setContractInput(e.target.value)} placeholder={t('placeholder_contract')} className="bg-slate-950 border border-slate-700 pl-12 pr-4 py-4 rounded-xl w-full text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <button onClick={handleStartMonitor} disabled={isAnalyzing} className={`bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold w-full transition-all active:scale-95 flex justify-center items-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('btn_monitor')}
                </button>
              </div>
            </div>
            <RiskCard score={riskScore} signals={signals} />
          </div>

          {/* History Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-inner">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <History size={20} className="text-blue-400" />
              Últimas Análises (Agência IA Diniz)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-800">
                    <th className="pb-4 font-medium">Contrato</th>
                    <th className="pb-4 font-medium text-center">Risco</th>
                    <th className="pb-4 font-medium text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-mono text-sm text-slate-300">
                        <a 
                          href={`https://etherscan.io/address/${item.address}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                        >
                          {item.address.slice(0, 10)}...{item.address.slice(-8)}
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.score >= 80 ? 'bg-green-500/10 text-green-500' : 
                          item.score >= 50 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {item.score}/100
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-500 text-xs font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr><td colSpan={3} className="py-12 text-center text-slate-500 italic font-light">Nenhuma análise encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </RainbowKitProvider>
  );
}