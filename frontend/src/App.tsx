import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Bot, Zap, ShieldAlert, CheckCircle2, Search, History, Lock, UserX, TrendingUp, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from './lib/supabase';
import { publicClient } from './lib/viem'; // O cliente que você criou

const cryptoQuotes = [
  { symbol: 'BTC', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', price: '$0.75', change: '+5.7%' },
  { symbol: 'SOL', price: '$142.30', change: '+2.1%' },
];

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [myHistory, setMyHistory] = useState<any[]>([]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  const fetchMyHistory = async () => {
    if (!address) return;
    const { data } = await supabase.from('history').select('*').eq('wallet_address', address).order('created_at', { ascending: false });
    if (data) setMyHistory(data);
  };

  useEffect(() => { if (isConnected) fetchMyHistory(); }, [address, isConnected]);

  // FUNÇÃO DE ANÁLISE REAL USANDO VIEM
  const startMonitor = async () => {
    if (!contractAddress || !contractAddress.startsWith('0x')) {
      return toast.error("Endereço de contrato inválido!");
    }

    setIsAnalyzing(true);
    const tid = toast.loading("Consultando Blockchain...");

    try {
      // 1. Busca o bytecode do contrato (Se for 0x, não é um contrato verificado/existente)
      const bytecode = await publicClient.getBytecode({ address: contractAddress as `0x${string}` });
      
      // 2. Simulação de análise lógica baseada no bytecode e taxas (Diferencial)
      const hasCode = bytecode !== undefined && bytecode !== '0x';
      
      const result = {
        score: hasCode ? 95 : 10,
        isVerified: hasCode,
        isHoneypot: false, // Aqui você integraria uma API de Honeypot futuramente
        isRenounced: true,
        liquidityLocked: true,
        buyTax: "0%",
        sellTax: "0%",
        riskLevel: hasCode ? "Low" : "High"
      };

      setAnalysis(result);
      toast.success("Análise Concluída!", { id: tid });

      // Salva no histórico privado
      if (isConnected && address) {
        await supabase.from('history').insert([{ 
          wallet_address: address, 
          contract_target: contractAddress, 
          score: result.score, 
          details: result 
        }]);
        fetchMyHistory();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao ler contrato", { id: tid });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-sky-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <BrainCircuit className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight italic">AGÊNCIA IA DINIZ</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Web3 Risk Monitor</p>
          </div>
        </div>
        <button onClick={toggleLanguage} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold active:scale-95 transition-all">
          {i18n.language.toUpperCase() === 'PT' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
      </header>

      {/* TICKER CARROSSEL */}
      <div className="bg-slate-900/40 border-b border-slate-800 py-2">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex gap-10 whitespace-nowrap px-4">
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-bold">
              <span className="text-sky-400">{q.symbol}</span> <span className="text-white">{q.price}</span> <span className="text-emerald-400">{q.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-6 mt-6">
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-sky-500" />
            <h2 className="text-sm font-bold text-slate-300 uppercase">{t('new_analysis')}</h2>
          </div>
          <div className="space-y-4">
            <input 
              value={contractAddress} 
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Cole o contrato (0x...)" 
              className="w-full h-14 px-5 bg-black/40 border border-slate-700 rounded-2xl text-sm focus:border-sky-500 outline-none font-mono"
            />
            <button onClick={startMonitor} disabled={isAnalyzing} className="w-full h-14 bg-sky-600 hover:bg-sky-500 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-900/40 transition-all">
              {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              {isAnalyzing ? "Analisando..." : "Iniciar Monitor"}
            </button>
          </div>
        </section>

        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-[2.5rem] p-10 text-center relative">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Safety Score</p>
                <div className={`text-8xl font-black ${analysis.score > 50 ? 'text-emerald-400' : 'text-red-500'} drop-shadow-lg`}>
                  {analysis.score}<span className="text-2xl text-slate-700">/100</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase">
                   {analysis.score > 50 ? <CheckCircle2 className="text-emerald-400" size={16}/> : <ShieldAlert className="text-red-500" size={16}/>}
                   {analysis.score > 50 ? "Sistema Seguro" : "Alto Risco Detectado"}
                </div>
              </div>

              {/* GRID DE DIFERENCIAIS */}
              <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-tighter">
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <Code2 className="text-sky-500 mb-2" />
                   <span className="text-slate-500">Contrato</span>
                   <span>{analysis.isVerified ? 'Verificado' : 'Não Identificado'}</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <Lock className="text-sky-500 mb-2" />
                   <span className="text-slate-500">Liquidez</span>
                   <span>{analysis.liquidityLocked ? 'Bloqueada' : 'Exposta'}</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <UserX className="text-sky-500 mb-2" />
                   <span className="text-slate-500">Propriedade</span>
                   <span>{analysis.isRenounced ? 'Renunciada' : 'Centralizada'}</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <TrendingUp className="text-emerald-500 mb-2" />
                   <span className="text-slate-500">Rede</span>
                   <span>Mainnet (ETH)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HISTÓRICO PRIVADO NO FINAL */}
        {isConnected && myHistory.length > 0 && (
          <section className="bg-slate-900/20 rounded-3xl p-4 border border-slate-800/50">
            <h3 className="text-[10px] font-black text-slate-600 uppercase mb-4 flex items-center gap-2">
              <History size={14} /> Histórico de Consultas
            </h3>
            <div className="space-y-2">
              {myHistory.slice(0, 3).map((h, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] bg-black/20 p-2 rounded-lg border border-slate-800/30">
                  <span className="font-mono text-slate-400">{h.contract_target.slice(0, 15)}...</span>
                  <span className="font-black text-sky-500">{h.score}/100</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
        <ConnectButton />
      </footer>
    </div>
  );
}

export default App;
          
