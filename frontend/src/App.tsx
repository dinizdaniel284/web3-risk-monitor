import { useState, useEffect, useCallback } from 'react';
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { Shield, Globe, Wallet, Languages, Search, History, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner'; 
import './i18n/index';

import { useRiskAnalysis } from './hooks/useRiskAnalysis';
import RiskCard from './components/RiskCard';

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

  // Carrega histórico apenas do usuário logado
  const carregarHistorico = useCallback(async () => {
    if (!address) {
      setHistory([]);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/history?user=${address}`);
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, [address]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    toast.info(newLang === 'en' ? 'Language: English' : 'Idioma: Português', { id: 'lang-toast' });
  };

  const salvarNoBanco = async (contract: string, score: number, alertSignals: string[]) => {
    // SÓ SALVA SE ESTIVER CONECTADO (Evita lixo e análises anônimas no DB)
    if (!address) return;

    try {
      await fetch(`${API_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: contract, 
          score, 
          signals: alertSignals,
          user_address: address // Vincula a análise ao dono
        })
      });
      carregarHistorico(); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleStartMonitor = async () => {
    if (!contractInput.startsWith('0x') || contractInput.length !== 42) {
      toast.error(t('invalid_addr'), { id: 'validation-error' });
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading("Analisando segurança...", {
      description: "Agência IA Diniz processando..."
    });

    try {
      const result = await analyzeContract(contractInput); 
      
      if (result) {
        // Salva apenas se houver carteira, mas mostra o resultado para todos
        if (isConnected) {
          await salvarNoBanco(contractInput, result.score, result.signals);
        }
        
        toast.success("Análise concluída!", { 
          id: toastId, 
          duration: 6000, // Travado em 6 segundos
          description: isConnected ? "Salvo no seu histórico." : "Conecte a carteira para salvar."
        });
      } else {
        toast.dismiss(toastId);
      }
    } catch (error) {
      toast.error("Falha na análise.", { id: toastId, duration: 6000 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <RainbowKitProvider locale={i18n.language === 'pt' ? 'pt-BR' : 'en-US'}>
      {/* Visual de Nuvem/Vidro Forçado */}
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#fff',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          },
        }}
      />
      
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">AD</div>
              <span className="font-bold text-xl">{t('title')}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleLanguage} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-sm">
                {i18n.language?.toUpperCase() || 'PT'}
              </button>
              <ConnectButton />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-4 text-white">{t('risk_monitor_title')}</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    value={contractInput} 
                    onChange={(e) => setContractInput(e.target.value)} 
                    placeholder={t('placeholder_contract')} 
                    className="bg-slate-950 border border-slate-700 pl-12 pr-4 py-4 rounded-xl w-full text-white outline-none focus:ring-2 focus:ring-blue-600" 
                  />
                </div>
                <button 
                  onClick={handleStartMonitor} 
                  disabled={isAnalyzing} 
                  className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold w-full disabled:opacity-50"
                >
                  {isAnalyzing ? "Analisando..." : t('btn_monitor')}
                </button>
              </div>
            </div>
            <RiskCard score={riskScore} signals={signals} />
          </div>

          {/* Histórico Filtrado */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
              <History size={20} />
              Meu Histórico (Agência IA Diniz)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-800">
                    <th className="pb-4">Contrato</th>
                    <th className="pb-4 text-center">Risco</th>
                    <th className="pb-4 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="py-4 font-mono text-sm">
                        {item.address.slice(0, 10)}...{item.address.slice(-8)}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.score >= 80 ? 'text-green-500' : 
                          item.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {item.score}/100
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {!isConnected && (
                    <tr><td colSpan={3} className="py-12 text-center text-slate-500 italic">Conecte sua carteira para ver seu histórico pessoal.</td></tr>
                  )}
                  {isConnected && history.length === 0 && (
                    <tr><td colSpan={3} className="py-12 text-center text-slate-500 italic">Nenhuma análise encontrada.</td></tr>
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
                
