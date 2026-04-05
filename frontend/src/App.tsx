import { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BrainCircuit, Globe, ShieldAlert, CheckCircle2, Zap, Search, Lock } from "lucide-react";
import { toast } from "sonner";
import { analyzeSmartContract } from "./core/riskEngine";

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();
  const client = usePublicClient(); 

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");

  const analyzeContract = async () => {
    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      toast.error(t('invalid_addr'));
      return;
    }

    setLoading(true);
    const tid = toast.loading(t('analyzing'));

    try {
      if (!client) throw new Error(t('waiting_connection'));

      const bytecode = await client.getBytecode({
        address: contractAddress as `0x${string}`
      });

      if (!bytecode || bytecode === "0x") {
        throw new Error(t('signal_not_contract'));
      }

      const result = analyzeSmartContract(bytecode);
      setAnalysis(result);
      toast.success(t('safe'), { id: tid });
    } catch (err: any) {
      toast.error(err.message || t('error_blockchain_connection'), { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-sky-500/30">
      {/* GLOW DE FUNDO */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-sky-500/10 blur-[120px] pointer-events-none" />

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)]">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-[10px] text-sky-400 font-bold tracking-widest">{t('risk_monitor_title')}</p>
          </div>
        </div>

        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-all"
        >
          {i18n.language.toUpperCase()}
        </button>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 space-y-10">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent"
          >
            {t('risk_monitor_title')}
          </motion.h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            {t('risk_description')}
          </p>
        </section>

        {/* INPUT BOX - GLASSMORPHISM */}
        <section className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
          <div className="bg-slate-900/90 rounded-[22px] p-6 space-y-4 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder={t('placeholder_contract')}
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all text-sm"
              />
            </div>

            <button
              onClick={analyzeContract}
              disabled={loading}
              className="w-full py-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(14,165,233,0.2)] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? t('analyzing') : (
                <>
                  {t('btn_monitor')}
                  <Zap size={16} className="group-hover:fill-current" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* RESULTS AREA */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* SCORE CARD */}
              <div className="relative overflow-hidden p-8 rounded-3xl bg-slate-900 border border-white/5 text-center">
                <div className={`absolute top-0 left-0 w-full h-1 ${analysis.score > 60 ? 'bg-green-500' : 'bg-red-500'}`} />
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">{t('risk_score')}</h3>
                <div className={`text-7xl font-black ${analysis.score > 60 ? 'text-green-400' : 'text-red-500'}`}>
                  {analysis.score}<span className="text-2xl text-slate-700">/100</span>
                </div>
                <p className="mt-4 font-bold text-lg uppercase tracking-tight">
                  {analysis.score > 60 ? t('safe') : t('high_risk')}
                </p>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.signals.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className={analysis.score > 60 ? 'text-green-500' : 'text-red-400'}>
                      {analysis.score > 60 ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                    </div>
                    <div className="text-[11px] font-medium leading-tight text-slate-300">
                      {s.label}: <span className="text-white font-bold">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER FIXED */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex justify-center">
        <ConnectButton accountStatus="address" showBalance={false} chainStatus="icon" />
      </footer>
    </div>
  );
}

export default App;
                                                                                 
