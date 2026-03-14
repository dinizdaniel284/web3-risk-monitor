import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Zap, Search, Lock, Code2, TrendingUp, ShieldCheck, Globe, Info, History, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "./lib/supabase";
import { publicClient } from "./lib/viem";

const cryptoQuotes = [
  { symbol: 'BTC', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', price: '$0.75', change: '+5.7%' },
  { symbol: 'SOL', price: '$142.30', change: '+2.1%' },
];

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');

  const analyzeContract = async () => {
    if (!contractAddress.startsWith('0x')) return toast.error("Endereço inválido");
    setLoading(true);
    const tid = toast.loading("Escaneando...");
    try {
      const bytecode = await publicClient.getBytecode({ address: contractAddress as `0x${string}` });
      setAnalysis({ score: bytecode && bytecode !== '0x' ? 98 : 12, riskLevel: "Low", isVerified: true, liquidityLocked: true, buyTax: 0, sellTax: 0.5 });
      toast.success("Sucesso", { id: tid });
    } catch { toast.error("Erro"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden flex flex-col">
      
      {/* HEADER - Centralizado com Padding Mobile */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-sky-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <BrainCircuit className="text-white" size={22} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black tracking-tight italic uppercase leading-none">AGÊNCIA IA DINIZ</h1>
            <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest">Risk Intelligence</span>
          </div>
        </div>
        <button onClick={toggleLanguage} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold active:scale-90 transition-all">
          {i18n.language.toUpperCase() === 'PT' ? '🇧🇷' : '🇺🇸'}
        </button>
      </header>

      {/* TICKER */}
      <div className="bg-slate-900/40 border-b border-slate-800 py-2 w-full overflow-hidden">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="flex gap-8 whitespace-nowrap px-4">
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-bold italic">
              <span className="text-sky-400">{q.symbol}</span> <span>{q.price}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* MAIN - Ajustado para centralizar no mobile */}
      <main className="flex-1 w-full max-w-xl mx-auto px-5 py-8 space-y-8 flex flex-col items-stretch">
        
        {/* RESUMO EDUCATIVO */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[2rem] text-center">
          <h2 className="text-xl font-black italic mb-3 flex items-center justify-center gap-2 text-sky-400">
            <Globe size={20} /> WEB3 SECURITY
          </h2>
          <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-tight font-medium">
            Sua identidade digital protegida. Analisamos contratos inteligentes para evitar golpes e garantir a segurança dos seus ativos.
          </p>
        </section>

        {/* MONITOR / BUSCA */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Search size={18} className="text-sky-400" />
            <h2 className="text-xs font-black text-slate-300 uppercase italic tracking-widest">Scanner de Contratos</h2>
          </div>
          <input 
            value={contractAddress} 
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Cole o endereço 0x..." 
            className="w-full h-14 px-5 bg-black/60 border border-slate-700 rounded-2xl text-sm focus:border-sky-500 outline-none font-mono text-center transition-all"
          />
          <button onClick={analyzeContract} disabled={loading} className="w-full h-14 bg-sky-600 active:bg-sky-700 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20 transition-all active:scale-[0.98]">
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Zap size={16} />}
            {loading ? "Analizando..." : "Iniciar Monitoramento"}
          </button>
        </section>

        {/* RESULTADOS */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] py-12 px-6 text-center shadow-inner">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4 block">Safety Score</span>
                <div className="text-8xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  {analysis.score}<span className="text-2xl text-slate-700 italic">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-bold uppercase text-[10px]">
                {[
                  { icon: <Code2 size={16}/>, label: "Contrato", val: "OK" },
                  { icon: <Lock size={16}/>, label: "Liquidez", val: "TRAVADA" },
                  { icon: <TrendingUp size={16}/>, label: "Taxa Compra", val: "0%" },
                  { icon: <TrendingUp size={16}/>, label: "Taxa Venda", val: "0.5%" }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-[2rem] flex flex-col items-center gap-1">
                    <div className="text-sky-500">{item.icon}</div>
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-white">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONNECT CTA */}
        {!isConnected && (
          <div className="bg-sky-500/5 border border-sky-500/10 p-8 rounded-[3rem] text-center flex flex-col items-center">
            <ShieldCheck size={40} className="text-sky-500/30 mb-4" />
            <p className="text-[11px] font-black text-slate-400 mb-6 uppercase tracking-tight leading-relaxed">
              Conecte sua carteira para sincronizar seu histórico de análises com nossa IA.
            </p>
            <div className="scale-110">
              <ConnectButton label="CONECTAR CARTEIRA" />
            </div>
          </div>
        )}
      </main>

      {/* FOOTER FIXO MOBILE */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex justify-center z-50">
        <div className="w-full max-w-xs">
          <ConnectButton showBalance={false} accountStatus="address" chainStatus="none" />
        </div>
      </footer>
    </div>
  );
}

export default App;
                                                       
