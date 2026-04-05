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
  Globe,
  ShieldAlert,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { publicClient } from "./lib/viem";

// 🔥 IMPORTANTE (SEU CORE AGORA MANDA NO JOGO)
import { analyzeSmartContract } from "./core/riskEngine";

const cryptoQuotes = [
  { symbol: "BTC", price: "$68,543", change: "+1.2%" },
  { symbol: "ETH", price: "$3,871", change: "+0.9%" },
  { symbol: "SOL", price: "$142.30", change: "+2.1%" }
];

function App() {
  const { isConnected, address } = useAccount();
  const { i18n } = useTranslation();

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");

  // 🚀 AGORA USA CORE REAL
  const analyzeContract = async () => {
    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      toast.error("Endereço inválido");
      return;
    }

    setLoading(true);
    const tid = toast.loading("Analisando contrato...");

    try {
      const bytecode = await publicClient.getBytecode({
        address: contractAddress as `0x${string}`
      });

      if (!bytecode || bytecode === "0x") {
        throw new Error("Contrato vazio ou inválido");
      }

      // 🔥 CORE ENGINE
      const result = analyzeSmartContract(bytecode);

      setAnalysis(result);

      toast.success("Análise concluída", { id: tid });
    } catch (err) {
      toast.error("Erro ao analisar contrato", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-32">

      {/* HEADER */}
      <header className="sticky top-0 z-[60] bg-slate-900/90 backdrop-blur-xl border-b border-sky-500/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h1 className="text-xs font-black uppercase italic">
              AGÊNCIA IA DINIZ
            </h1>
            <span className="text-[9px] text-sky-400 font-bold uppercase">
              WEB3 RISK MONITOR
            </span>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="p-2 bg-slate-800 rounded-lg text-xs"
        >
          {i18n.language === "pt" ? "🇧🇷" : "🇺🇸"}
        </button>
      </header>

      {/* TICKER */}
      <div className="bg-slate-900 py-2 overflow-hidden">
        <motion.div
          animate={{ x: [0, -600] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap px-4 text-xs"
        >
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <span key={i}>
              {q.symbol} {q.price} ({q.change})
            </span>
          ))}
        </motion.div>
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 space-y-6">

        {/* WALLET */}
        {isConnected && (
          <div className="bg-slate-900 p-4 rounded-2xl flex justify-between">
            <span>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <span className="text-green-400">Conectado</span>
          </div>
        )}

        {/* INTRO */}
        <section className="bg-slate-900 p-5 rounded-2xl text-center">
          <h2 className="text-lg text-sky-400 flex justify-center gap-2">
            <Globe size={16} /> Segurança Web3
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Analise contratos e evite golpes.
          </p>
        </section>

        {/* INPUT */}
        <section className="bg-slate-900 p-5 rounded-2xl space-y-3">
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 bg-black border border-slate-700 rounded-xl text-center"
          />

          <button
            onClick={analyzeContract}
            disabled={loading}
            className="w-full p-3 bg-sky-600 rounded-xl font-bold"
          >
            {loading ? "Processando..." : "Analisar"}
          </button>
        </section>

        {/* RESULT */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-slate-900 p-8 rounded-3xl text-center">
                <span className="text-xs text-slate-500">Score</span>

                <div
                  className={`text-6xl font-bold ${
                    analysis.score > 60 ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {analysis.score}/100
                </div>

                <div className="mt-4 text-xs">
                  {analysis.score > 60
                    ? "Seguro"
                    : "Alto risco"}
                </div>
              </div>

              {/* DETALHES */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {analysis.signals.map((s: any, i: number) => (
                  <div
                    key={i}
                    className="bg-slate-900 p-4 rounded-xl"
                  >
                    {s.label}: {s.value}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950 border-t border-slate-900">
        <ConnectButton showBalance={false} />
      </footer>
    </div>
  );
}

export default App;
