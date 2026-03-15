import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BrainCircuit,
  Zap,
  Search,
  Lock,
  Code2,
  TrendingUp,
  ShieldCheck,
  Globe,
  History,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { publicClient } from "./lib/viem";

const cryptoQuotes = [
  { symbol: "BTC", price: "$68,543", change: "+1.2%" },
  { symbol: "ETH", price: "$3,871", change: "+0.9%" },
  { symbol: "SOL", price: "$142.30", change: "+2.1%" }
];

function App() {
  const { isConnected } = useAccount();
  const { t, i18n } = useTranslation();

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");

  const analyzeContract = async () => {
    if (!contractAddress.startsWith("0x")) {
      toast.error(t("invalid_addr"));
      return;
    }

    setLoading(true);

    try {
      const bytecode = await publicClient.getBytecode({
        address: contractAddress as `0x${string}`
      });

      setAnalysis({
        score: bytecode && bytecode !== "0x" ? 90 : 10,
        isVerified: !!bytecode,
        liquidityLocked: true,
        buyTax: 0,
        sellTax: 0.5
      });

      toast.success("Success");
    } catch {
      toast.error(t("error_blockchain_connection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h1 className="text-xs font-black uppercase">AGÊNCIA IA DINIZ</h1>
            <span className="text-[9px] text-sky-400 font-bold uppercase">
              WEB3 RISK MONITOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-slate-800 text-xs"
          >
            {i18n.language === "pt" ? "🇧🇷" : "🇺🇸"}
          </button>

          <ConnectButton showBalance={false} chainStatus="icon" />

        </div>
      </header>

      {/* CRYPTO TICKER */}
      <div className="bg-slate-900/40 border-b border-slate-800 py-2 overflow-hidden">

        <motion.div
          animate={{ x: [0, -600] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap px-4"
        >
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="text-sky-400">{q.symbol}</span>
              <span>{q.price}</span>
              <span className="text-emerald-400">{q.change}</span>
            </div>
          ))}
        </motion.div>

      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-10 space-y-8">

        {/* INTRO */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center">

          <h2 className="text-lg font-bold text-sky-400 flex justify-center items-center gap-2">
            <Globe size={18} />
            {t("risk_monitor_title")}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            {t("risk_description")}
          </p>

        </section>

        {/* SCANNER */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">

          <div className="flex justify-center items-center gap-2 text-sm font-bold uppercase">
            <Search size={16} className="text-sky-400" />
            Contract Scanner
          </div>

          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder={t("placeholder_contract")}
            className="w-full h-14 px-5 bg-black/60 border border-slate-700 rounded-xl text-sm outline-none text-center font-mono"
          />

          <button
            onClick={analyzeContract}
            disabled={loading}
            className="w-full h-14 bg-sky-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={16} />
            )}

            {loading ? t("analyzing") : t("btn_monitor")}
          </button>

        </section>

        {/* RESULT */}
        <AnimatePresence>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">

                <span className="text-xs text-slate-400 uppercase">
                  {t("risk_score")}
                </span>

                <div
                  className={`text-7xl font-black ${
                    analysis.score > 50 ? "text-emerald-400" : "text-red-500"
                  }`}
                >
                  {analysis.score}
                </div>

                <div className="mt-3 text-xs font-bold flex justify-center items-center gap-2">

                  {analysis.score > 50 ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <ShieldAlert size={16} />
                  )}

                  {analysis.score > 50 ? t("safe") : t("high_risk")}

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <Code2 className="mx-auto mb-1 text-sky-400" />
                  {t("contract")}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <Lock className="mx-auto mb-1 text-sky-400" />
                  {t("liquidity")}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <TrendingUp className="mx-auto mb-1 text-sky-400" />
                  {t("buy_tax")}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                  <TrendingUp className="mx-auto mb-1 text-sky-400" />
                  {t("sell_tax")}
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 text-xs text-slate-600 border-t border-slate-900">
        Web3 Risk Monitor • Agência IA Diniz
      </footer>

    </div>
  );
}

export default App;
