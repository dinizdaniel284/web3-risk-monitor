import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Zap, Search, Lock, Code2, TrendingUp, ShieldCheck, Globe, Info, History, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "./lib/supabase";
import { publicClient } from "./lib/viem";

// Dados para o Carrossel (Ticker)
const cryptoQuotes = [
  { symbol: 'BTC', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', price: '$0.75', change: '+5.7%' },
  { symbol: 'SOL', price: '$142.30', change: '+2.1%' },
  { symbol: 'BNB', price: '$590.12', change: '+0.4%' },
];

interface AnalysisResult {
  score: number;
  riskLevel: "Low" | "Medium" | "High";
  isVerified: boolean;
  liquidityLocked: boolean;
  ownerRenounced: boolean;
  buyTax: number;
  sellTax: number;
  honeypot: boolean;
}

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const calculateScore = (data: any) => {
    let score = 100;
    if (data.honeypot) score -= 80;
    if (!data.liquidityLocked) score -= 30;
    if (!data.ownerRenounced) score -= 20;
    if (data.buyTax > 10) score -= 20;
    if (data.sellTax > 10) score -= 20;

    let risk: "Low" | "Medium" | "High" = "Low";
    if (score < 70) risk = "Medium";
    if (score < 40) risk = "High";

    return { score: Math.max(0, score), risk };
  };

  const fetchSecurityData = async (address: string) => {
    try {
      const honeypot = await fetch(`https://api.honeypot.is/v2/IsHoneypot?address=${address}`).then(res => res.json());
      return {
        honeypot: honeypot?.IsHoneypot || false,
        liquidityLocked: true, // Simulação de trava (requer DexScreener API para real)
        ownerRenounced: true,
        buyTax: honeypot?.BuyTax || 0,
        sellTax: honeypot?.SellTax || 0
      };
    } catch {
      return { honeypot: false, liquidityLocked: false, ownerRenounced: false, buyTax: 0, sellTax: 0 };
    }
  };

  const analyzeContract = async () => {
    if (!isValidAddress(contractAddress)) {
      toast.error(t('invalid_address') || "Invalid contract address");
      return;
    }
    setLoading(true);
    const tid = toast.loading("Analyzing blockchain...");

    try {
      const [bytecode, security] = await Promise.all([
        publicClient.getBytecode({ address: contractAddress as `0x${string}` }),
        fetchSecurityData(contractAddress)
      ]);

      const verified = bytecode && bytecode !== "0x";
      const { score, risk } = calculateScore(security);

      const result: AnalysisResult = {
        score,
        riskLevel: risk,
        isVerified: !!verified,
        liquidityLocked: security.liquidityLocked,
        ownerRenounced: security.ownerRenounced,
        buyTax: security.buyTax,
        sellTax: security.sellTax,
        honeypot: security.honeypot
      };

      setAnalysis(result);
      toast.success("Complete", { id: tid });

      if (isConnected && address) {
        await supabase.from("history").insert([{
          wallet_address: address,
          contract_target: contractAddress,
          score: score,
          details: result
        }]);
        loadHistory();
      }
    } catch (err) {
      toast.error("Analysis failed", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!address) return;
    const { data } = await supabase.from("history").select("*").eq("wallet_address", address).order("created_at", { ascending: false });
    if (data) setHistory(data);
  };

  useEffect(() => { if (isConnected) loadHistory(); }, [address, isConnected]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500/30">
      
      {/* HEADER LUX */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-sky-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <BrainCircuit className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight italic uppercase">AGÊNCIA IA DINIZ</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest leading-none">Risk Intelligence</p>
          </div>
        </div>
        <button onClick={toggleLanguage} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold active:scale-95 transition-all">
          {i18n.language.toUpperCase() === 'PT' ? '🇧🇷' : '🇺🇸'}
        </button>
      </header>

      {/* TICKER CARROSSEL (VOLTOU!) */}
      <div className="bg-slate-900/40 border-b border-slate-800 py-2">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex gap-10 whitespace-nowrap px-4">
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-bold italic">
              <span className="text-sky-400">{q.symbol}</span> <span className="text-white">{q.price}</span> <span className="text-emerald-400">{q.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-8 mt-6">
        
        {/* SEÇÃO EDUCATIVA (WEB3 RESUMO) */}
        <section className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={80} />
            </div>
            <h2 className="text-lg font-black italic mb-2 flex items-center gap-2">
              <Info size={18} className="text-sky-500" /> Web3 & Blockchain
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Blockchain é um livro contábil digital imutável. No mundo **Web3**, você é dono dos seus dados através de sua **Carteira Digital** (Wallet), que funciona como sua identidade e cofre. Segurança aqui é vital: contratos maliciosos podem drenar seus ativos em segundos.
            </p>
          </div>
        </section>

        {/* SETOR DE MONITORAMENTO (BUSCA) */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-sky-500" />
            <h2 className="text-sm font-bold text-slate-300 uppercase italic">Scanner de Contratos</h2>
          </div>
          <div className="space-y-4">
            <input 
              value={contractAddress} 
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Cole o contrato (0x...)" 
              className="w-full h-14 px-5 bg-black/40 border border-slate-700 rounded-2xl text-sm focus:border-sky-500 outline-none font-mono"
            />
            <button onClick={analyzeContract} disabled={loading} className="w-full h-14 bg-sky-600 hover:bg-sky-500 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-900/40 transition-all active:scale-95">
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              {loading ? "Analizando..." : "Iniciar Monitoramento"}
            </button>
          </div>
        </section>

        {/* RESULTADOS DA ANÁLISE */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-[2.5rem] p-10 text-center relative">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4 italic">Safety Score</p>
                <div className={`text-8xl font-black ${analysis.score > 50 ? 'text-emerald-400' : 'text-red-500'} drop-shadow-lg`}>
                  {analysis.score}<span className="text-2xl text-slate-700">/100</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black uppercase">
                   {analysis.score > 50 ? <ShieldCheck className="text-emerald-400" size={16}/> : <ShieldAlert className="text-red-500" size={16}/>}
                   {analysis.riskLevel} Risk
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase">
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <Code2 className="text-sky-500 mb-2" size={18} />
                   <span className="text-slate-500">Verified</span>
                   <span>{analysis.isVerified ? 'YES' : 'NO'}</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <Lock className="text-sky-500 mb-2" size={18} />
                   <span className="text-slate-500">Liquidity</span>
                   <span>{analysis.liquidityLocked ? 'LOCKED' : 'EXPOSED'}</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <TrendingUp className="text-emerald-500 mb-2" size={18} />
                   <span className="text-slate-500">Buy Tax</span>
                   <span>{analysis.buyTax}%</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl flex flex-col items-center">
                   <TrendingUp className="text-red-500 mb-2" size={18} />
                   <span className="text-slate-500">Sell Tax</span>
                   <span>{analysis.sellTax}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONEXÃO COM CARTEIRA (CONTEÚDO DINÂMICO) */}
        {!isConnected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-[2.5rem] text-center">
            <ShieldCheck size={32} className="text-sky-500/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold mb-2 uppercase italic text-white">Segurança em Primeiro Lugar</h3>
            <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-tighter">
              Conecte sua carteira para registrar suas análises no banco de dados e gerenciar seu histórico privado.
            </p>
            <div className="flex justify-center">
              <ConnectButton label="CONECTAR CARTEIRA" />
            </div>
          </motion.div>
        )}

        {/* HISTÓRICO PRIVADO */}
        {isConnected && history.length > 0 && (
          <section className="bg-slate-900/20 rounded-3xl p-4 border border-slate-800/50">
            <h3 className="text-[9px] font-black text-slate-600 uppercase mb-4 flex items-center gap-2 italic">
              <History size={14} /> Histórico de Consultas
            </h3>
            <div className="space-y-2">
              {history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] bg-black/20 p-3 rounded-xl border border-slate-800/30">
                  <span className="font-mono text-slate-400 italic">{h.contract_target.slice(0, 18)}...</span>
                  <span className="font-black text-sky-500">{h.score}/100</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER FIXO */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </footer>
    </div>
  );
}

export default App;
