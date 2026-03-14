import { useState, useEffect, useCallback } from 'react';
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { Shield, Globe, Wallet, Languages, Search, History, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner'; 
import './i18n/index';

import { useRiskAnalysis } from './hooks/useRiskAnalysis';
import RiskCard from './components/RiskCard';

// Tenta pegar a URL de qualquer variável disponível na Vercel
const API_URL = import.meta.env.VITE_API_URL || 
                import.meta.env.NEXT_PUBLIC_API_URL || 
                'https://web3-risk-monitor-backend.vercel.app'; // <--- Troque pelo seu link oficial do backend

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

  const carregarHistorico = useCallback(async () => {
    if (!address) {
      setHistory([]);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/history?user=${address}`);
      if (!response.ok) throw new Error('Falha no histórico');
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, [address]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const salvarNoBanco = async (contract: string, score: number, alertSignals: string[]) => {
    if (!address) return;

    try {
      await fetch(`${API_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: contract, 
          score, 
          signals: alertSignals,
          user_address: address 
        })
      });
      carregarHistorico(); 
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
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
        if (isConnected) {
          await salvarNoBanco(contractInput, result.score, result.signals);
        }
        
        toast.success("Análise concluída!", { 
          id: toastId, 
          duration: 6000, 
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
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.85)',
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
        {/* Header e Main seguem o mesmo padrão que você já tem... */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">AD</div>
            <span className="font-bold text-xl">{t('title')}</span>
          </div>
          <div className="flex items-center gap-4">
             <ConnectButton />
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-4">{t('risk_monitor_title')}</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={contractInput} 
                  onChange={(e) => setContractInput(e.target.value)} 
                  placeholder={t('placeholder_contract')} 
                  className="bg-slate-950 border border-slate-700 p-4 rounded-xl w-full text-white outline-none focus:ring-2 focus:ring-blue-600" 
                />
                <button 
                  onClick={handleStartMonitor} 
                  disabled={isAnalyzing} 
                  className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold w-full"
                >
                  {isAnalyzing ? "Processando..." : t('btn_monitor')}
                </button>
              </div>
            </div>
            <RiskCard score={riskScore} signals={signals} />
          </div>

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
                      <td className="py-4 font-mono text-sm">{item.address.slice(0, 10)}...</td>
                      <td className="py-4 text-center">
                        <span className={item.score >= 50 ? 'text-green-500' : 'text-red-500'}>
                          {item.score}/100
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {isConnected && history.length === 0 && (
                    <tr><td colSpan={3} className="py-12 text-center text-slate-500">Nenhuma análise encontrada.</td></tr>
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
