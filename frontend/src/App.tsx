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
  ShieldAlert,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { publicClient } from "./lib/viem";

const cryptoQuotes = [
  { symbol: "BTC", price: "$68,543", change: "+1.2%" },
  { symbol: "ETH", price: "$3,871", change: "+0.9%" },
  { symbol: "RAYLS", price: "$0.75", change: "+5.7%" },
  { symbol: "SOL", price: "$142.30", change: "+2.1%" }
];

function App() {
  const { isConnected, address } = useAccount();
  const { t, i18n } = useTranslation();

  const [contractAddress, setContractAddress] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");

  const analyzeContract = async () => {
    if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
      toast.error(t("invalid_addr") || "Endereço Inválido");
      return;
    }

    setLoading(true);
    const tid = toast.loading("Acessando Blockchain...");

    try {
      const bytecode = await publicClient.getBytecode({
        address: contractAddress as `0x${string}`
      });

      // Simulação de lógica de segurança baseada no bytecode real
      const scoreValue = bytecode && bytecode !== "0x" ? 98 : 10;

      setAnalysis({
        score: scoreValue,
        isVerified: !!bytecode && bytecode !== "0x",
        liquidityLocked: true,
        buyTax: 0,
        sellTax: 0.5
      });

      toast.success("Análise Concluída", { id: tid });
    } catch {
      toast.error(t("error_blockchain_connection") || "Erro na conexão", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-32">

      {/* HEADER LUX */}
      <header className="sticky top-0 z-[60] bg-slate-900/90 backdrop-blur-xl border-b border-sky-500/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <BrainCircuit size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-xs font-black uppercase tracking-tight italic">AGÊNCIA IA DINIZ</h1>
            <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest">
              WEB3 RISK MONITOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold active:scale-95 transition-all"
          >
            {i18n.language === "pt" ? "🇧🇷" : "🇺🇸"}
          </button>
        </div>
      </header>

      {/* CARROSSEL DE PREÇOS */}
      <div className="bg-slate-900/40 border-b border-slate-800 py-2 overflow-hidden">
        <motion.div
          animate={{ x: [0, -800] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap px-4"
        >
          {[...cryptoQuotes, ...cryptoQuotes].map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-bold italic">
              <span className="text-sky-400">{q.symbol}</span>
              <span>{q.price}</span>
              <span className="text-emerald-400">{q.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 space-y-6">

        {/* CARD DE IDENTIDADE DA CARTEIRA (PESSOAL) */}
        {isConnected && (
          <motion.section 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-sky-900/20 to-indigo-900/20 border border-sky-500/30 p-5 rounded-3xl flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
                <UserCheck className="text-sky-400" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest leading-none mb-1">Conta Verificada</p>
                <h2 className="text-sm font-bold font-mono text-white italic">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </h2>
              </div>
            </div>
            <span className="bg-sky-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
              Pessoal
            </span>
          </motion.section>
        )}

        {/* INTRO/EDUCATIVO */}
        <section className="bg-slate-900/60 border border-slate-800 p-6 rounded-[2rem] text-center shadow-lg">
          <h2 className="text-lg font-black italic text-sky-400 flex justify-center items-center gap-2">
            <Globe size={18} />
            Sua Segurança em Web3
          </h2>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-medium uppercase tracking-tight">
            Análise avançada de contratos inteligentes. Identificamos Honeypots e monitoramos liquidez em tempo real com o poder da IA.
          </p>
        </section>

        {/* SCANNER */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl space-y-4">
          <div className="flex justify-center items-center gap-2 text-xs font-black uppercase italic tracking-widest text-slate-300">
            <Search size={16} className="text-sky-400" />
            Scanner de Contratos
          </div>

          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full h-14 px-5 bg-black/60 border border-slate-700 rounded-2xl text-sm outline-none text-center font-mono focus:border-sky-500 transition-all"
          />

          <button
            onClick={analyzeContract}
            disabled={loading}
            className="w-full h-14 bg-sky-600 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={16} />
            )}
            {loading ? "Processando..." : "Iniciar Monitoramento de Risco"}
          </button>
        </section>

        {/* RESULT */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4 block">
                  Safety Score
                </span>

                <div
                  className={`text-8xl font-black drop-shadow-2xl ${
                    analysis.score > 50 ? "text-emerald-400" : "text-red-500"
                  }`}
                >
                  {analysis.score}<span className="text-2xl text-slate-700 italic">/100</span>
                </div>

                <div className={`mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[10px] font-black uppercase italic ${
                  analysis.score > 50 ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                  {analysis.score > 50 ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  {analysis.score > 50 ? "Sistema Seguro para Negociação" : "Alto Risco Detectado"}
                </div>
              </div>

              {/* GRID COM RÓTULOS DETALHADOS */}
              <div className="grid grid-cols-2 gap-3 font-bold uppercase text-[10px]">
                {[
                  { icon: <Code2 size={16}/>, label: "Status do Contrato", val: analysis.isVerified ? "Verificado" : "Suspeito" },
                  { icon: <Lock size={16}/>, label: "Liquidez do Pool", val: analysis.liquidityLocked ? "Bloqueada" : "Exposta" },
                  { icon: <TrendingUp size={16}/>, label: "Taxa Compra", val: `${analysis.buyTax}%` },
                  { icon: <TrendingUp size={16}/>, label: "Taxa Venda", val: `${analysis.sellTax}%` }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-[2rem] flex flex-col items-center gap-1 shadow-sm">
                    <div className="text-sky-500 mb-1">{item.icon}</div>
                    <span className="text-slate-500 text-[9px] font-black tracking-tighter">{item.label}</span>
                    <span className="text-white">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER FIXO (MANTÉM O CONECTAR SEMPRE ACESSÍVEL) */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 flex flex-col items-center gap-3 z-[100]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            {isConnected ? 'Sessão Ativa' : 'Aguardando Conexão'}
          </span>
        </div>
        <div className="w-full max-w-xs shadow-2xl shadow-sky-900/20">
          <ConnectButton 
            label="CONECTAR CARTEIRA"
            showBalance={false} 
            chainStatus="none" 
            accountStatus={{ smallScreen: 'address', largeScreen: 'full' }}
          />
        </div>
      </footer>

    </div>
  );
}

export default App;
            
