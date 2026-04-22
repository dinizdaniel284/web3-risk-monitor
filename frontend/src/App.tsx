import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, Search, ExternalLink, History, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeSmartContract } from "./core/riskEngine";
import { publicClient } from "./lib/viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Carregar histórico do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("web3_risk_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");

  const saveToHistory = (address: string, result: any) => {
    const newEntry = { address, ...result, date: new Date().toLocaleTimeString() };
    const updatedHistory = [newEntry, ...history].slice(0, 5); // Mantém as últimas 5
    setHistory(updatedHistory);
    localStorage.setItem("web3_risk_history", JSON.stringify(updatedHistory));
  };

  const handleAnalyze = async () => {
    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      toast.error(t('invalid_addr'));
      return;
    }

    setLoading(true);
    const tid = toast.loading(t('analyzing'));

    try {
      const bytecode = await publicClient.getBytecode({
        address: contractAddress as `0x${string}`
      });

      if (!bytecode || bytecode === "0x") {
        toast.error(t('error_not_found'), { id: tid });
        return;
      }

      const result = analyzeSmartContract(bytecode);
      setAnalysis(result);
      saveToHistory(contractAddress, result);
      toast.success(result.score > 70 ? t('safe') : t('high_risk'), { id: tid });
    } catch (err) {
      toast.error(t('error_blockchain'), { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const text = `⚠️ WEB3 RISK REPORT\nContract: ${contractAddress}\nScore: ${analysis.score}/100\nResult: ${analysis.score > 70 ? 'SAFE' : 'HIGH RISK'}\n\nAnalyzed by Diniz IA Agency`;
    navigator.clipboard.writeText(text);
    toast.success(i18n.language === 'pt' ? "Relatório copiado para o clipboard!" : "Report copied to clipboard!");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("web3_risk_history");
    toast.info(t('no_history'));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24">
      {/* Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-sky-600/10 blur-[150px] pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500 rounded-lg shadow-lg shadow-sky-500/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="font-bold tracking-tighter text-xl uppercase italic">
            {t('title')}
          </span>
        </div>
        <button onClick={toggleLanguage} className="text-xs font-black border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all uppercase">
          {i18n.language}
        </button>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-6 py-20 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            {t('risk_monitor_title')}
          </h2>
          <p className="text-slate-400 font-medium italic">{t('risk_description')}</p>
        </div>

        {/* Search Bar */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={20} />
            <input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder={t('placeholder_contract')}
              className="w-full pl-14 pr-4 py-5 bg-slate-900/50 border border-white/5 rounded-2xl focus:border-sky-500/50 outline-none transition-all text-sm font-mono shadow-2xl"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-900/20"
          >
            {loading ? t('analyzing') : t('btn_monitor')}
            {!loading && <Zap size={18} fill="currentColor" />}
          </button>
        </div>

        {/* Main Result */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className={`p-10 rounded-[32px] border border-white/5 text-center bg-gradient-to-b ${analysis.score > 70 ? 'from-green-500/10' : 'from-red-500/10'} to-transparent shadow-inner relative overflow-hidden`}>
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">{t('risk_score')}</h3>
                <div className={`text-8xl font-black mb-4 ${analysis.score > 70 ? 'text-green-400' : 'text-red-500'}`}>
                  {analysis.score}<span className="text-2xl text-slate-600">/100</span>
                </div>
                <div className={`inline-block px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${analysis.score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {analysis.score > 70 ? t('safe') : t('high_risk')}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={handleShare} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {analysis.signals.map((s: any, i: number) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <span className="text-sm font-bold text-slate-400">{s.label}</span>
                    <span className="text-sm font-black text-white">{t(s.value)}</span>
                  </motion.div>
                ))}
              </div>

              <a 
                href={`https://etherscan.io/address/${contractAddress}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-400 transition-colors uppercase tracking-tighter"
              >
                {t('view_etherscan')}
                <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 0 && (
          <div className="pt-8 space-y-4 border-t border-white/5">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2 text-slate-400">
                <History size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Recent Scans</span>
              </div>
              <button onClick={clearHistory} className="text-slate-600 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {history.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setContractAddress(item.address)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-900/50 transition-all text-left"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 truncate w-32">{item.address}</p>
                    <p className="text-[10px] font-bold text-slate-600">{item.date}</p>
                  </div>
                  <div className={`font-black text-xs ${item.score > 70 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.score}/100
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Wallet Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/60 backdrop-blur-xl border-t border-white/5 flex justify-center z-50">
        <ConnectButton accountStatus="address" showBalance={false} chainStatus="icon" />
      </footer>
    </div>
  );
}

export default App;