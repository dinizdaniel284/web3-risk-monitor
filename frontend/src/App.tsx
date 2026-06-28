// src/App.tsx
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BrainCircuit, Globe, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { publicClient } from "./lib/viem";

// IMPORTAÇÕES DO CORE ENGINE E COMPONENTES
import { analyzeSmartContract } from "./core/riskEngine";
import RiskCard from "./components/RiskCard"; 

// Dados do carrossel atualizados com variação positiva e negativa para testar as cores
const cryptoQuotes = [
  { symbol: "BTC", price: "$68,543", change: "+1.2%", isPositive: true },
  { symbol: "ETH", price: "$3,871", change: "+0.9%", isPositive: true },
  { symbol: "SOL", price: "$142.30", change: "-2.1%", isPositive: false },
  { symbol: "BNB", price: "$582.10", change: "+3.4%", isPositive: true },
  { symbol: "LINK", price: "$18.25", change: "-0.5%", isPositive: false }
];

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  const analyzeContract = async () => {
    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      toast.error(t("invalid_address"));
      return;
    }

    setLoading(true);
    const tid = toast.loading(t("analyzing_contract"));
    setAnalysis(null);

    try {
      const bytecode = await publicClient.getBytecode({
        address: contractAddress as `0x${string}`
      });

      if (!bytecode || bytecode === "0x") {
        throw new Error("Empty bytecode");
      }

      const result = analyzeSmartContract(bytecode);
      setAnalysis(result);
      toast.success(t("analysis_completed"), { id: tid });

    } catch (err: any) {
      console.warn("[WEB3] Ativando simulação para testes locais.");
      
      const mockResult = {
        score: 35,
        signals: ['signal_not_contract']
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysis(mockResult);
      toast.success(t("simulation_mode"), { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-32 font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      
      {/* IMAGEM DE FUNDO PREMIUM E SUTIL (OPÇÃO 1) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.07] bg-cover bg-center bg-no-repeat mix-blend-screen"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop')` 
        }}
      />

      {/* MÁSCARA DE DEGRADÊ PARA SUAVIZAR O COMPORTAMENTO EM PROPORÇÃO DE TELA */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-slate-950/0 via-slate-950/40 to-slate-950" />

      {/* HEADER PREMIUM */}
      <header className="relative z-10 sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/10">
            <BrainCircuit size={22} className="text-white animate-pulse" />
          </div>

          <div>
            <h1 className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AGÊNCIA IA DINIZ
            </h1>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block -mt-0.5">
              WEB3 RISK MONITOR
            </span>
          </div>
        </div>

        {/* SELETOR DE IDIOMA DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all"
          >
            <span>{i18n.language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {langDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <button
                  onClick={() => changeLanguage("pt")}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <span>🇧🇷</span> Português
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800 border-t border-slate-800/50 flex items-center gap-2 transition-colors"
                >
                  <span>🇺🇸</span> English
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* CARROSSEL DE MOEDAS (TICKER) ULTRA MODERNO */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-sm border-b border-slate-900 py-2.5 overflow-hidden flex items-center">
        <motion.div
          animate={{ x: [0, -800] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap px-4"
        >
          {[...cryptoQuotes, ...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800/60 shadow-inner">
              <span className="text-xs font-bold text-slate-300">{q.symbol}</span>
              <span className="text-xs font-mono text-slate-400">{q.price}</span>
              <span className={`text-[11px] font-bold font-mono flex items-center px-1.5 py-0.5 rounded ${
                q.isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
              }`}>
                {q.isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                {q.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CONTEÚDO PRINCIPAL TRANSLADADO */}
      <main className="relative z-10 flex-1 max-w-xl mx-auto w-full px-5 py-10 space-y-6">

        {/* WALLET */}
        {isConnected && (
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-md">
            <span className="font-mono text-xs text-slate-300 bg-black/40 px-2 py-1 rounded-lg">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t("connected")}
            </span>
          </div>
        )}

        {/* INTRO */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-900/40 backdrop-blur-md border border-slate-900 p-6 rounded-2xl text-center space-y-1 shadow-xl">
          <h2 className="text-base font-bold text-sky-400 flex justify-center items-center gap-2 tracking-wide">
            <Globe size={18} className="text-sky-500" /> {t("web3_security")}
          </h2>
          <p className="text-xs text-slate-400">
            {t("subtitle")}
          </p>
        </section>

        {/* INPUT & BOTÃO COM TRADUÇÃO DINÂMICA */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-900 p-5 rounded-2xl space-y-4 shadow-xl">
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder={t("placeholder") || "0x..."}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm tracking-wider font-mono text-emerald-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all shadow-inner"
          />

          <button
            onClick={analyzeContract}
            disabled={loading}
            className="w-full p-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-[0.99] rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-600/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? t("btn_processing") : t("btn_analyze")}
          </button>
        </section>

        {/* CONTAINER DO CARREGAMENTO COM ANIMATE PRESENCE */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-box"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <RiskCard score={0} signals={[]} isLoading={true} />
            </motion.div>
          ) : (
            analysis && (
              <motion.div
                key="result-box"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <RiskCard score={analysis.score} signals={analysis.signals} isLoading={false} />
              </motion.div>
            )
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER FIXO TRAVADO NA BASE DA TELA */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-900/50 z-50 flex justify-center shadow-2xl">
        <ConnectButton showBalance={false} />
      </footer>
    </div>
  );
}

export default App;