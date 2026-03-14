import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Bot, Database, Zap, LogOut, ShieldAlert, CheckCircle2, Search, History } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from './lib/supabase'; // Certifique-se que o arquivo lib/supabase.ts existe

const cryptoQuotes = [
  { symbol: 'BTC', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', price: '$0.75', change: '+5.7%' },
  { symbol: 'SOL', price: '$142.30', change: '+2.1%' },
  { symbol: 'BNB', price: '$592.10', change: '-0.4%' },
];

function App() {
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Lógica de análise completa (Simulada para Web3)
  const startMonitor = async () => {
    if (!contractAddress || contractAddress.length < 10) {
      toast.error('Endereço inválido');
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading('Escaneando contrato...');

    try {
      // Simulação de análise técnica
      setTimeout(async () => {
        const result = {
          score: Math.floor(Math.random() * (100 - 85) + 85),
          isVerified: true,
          isPrivate: false,
          hasHoneypot: false,
          buyTax: "0%",
          sellTax: "0.5%",
          timestamp: new Date().toISOString()
        };

        setAnalysis(result);
        toast.success('Análise concluída!', { id: toastId });

        // SALVAR NO SUPABASE se estiver logado
        if (isConnected && address) {
          const { error } = await supabase.from('history').insert([
            { 
              wallet_address: address, 
              contract_target: contractAddress, 
              score: result.score,
              details: result 
            }
          ]);
          if (error) console.error("Erro ao salvar:", error);
        }

        setIsAnalyzing(false);
      }, 2000);
    } catch (err) {
      toast.error('Falha na análise');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-sky-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="text-white font-black italic text-lg">D</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Agência IA Diniz</h1>
            <p className="text-[9px] text-sky-400 font-medium tracking-tighter uppercase">Web3 Risk Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')} className="p-2 text-xs rounded-lg bg-slate-800 border border-slate-700">
            {i18n.language === 'pt' ? '🇧🇷' : '🇺🇸'}
          </button>
        </div>
      </header>

      {/* TICKER CARROSSEL ANIMADO */}
      <div className="bg-slate-900/50 border-b border-slate-800 overflow-hidden py-2">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap px-4"
        >
          {[...cryptoQuotes, ...cryptoQuotes].map((quote, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-sky-400 font-bold">{quote.symbol}</span>
              <span className="text-white">{quote.price}</span>
              <span className={quote.change.includes('+') ? 'text-emerald-400' : 'text-red-400'}>{quote.change}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-6 mt-6">
        {/* INPUT SECTION */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <Search className="text-sky-500" size={20} />
            <h2 className="font-bold text-slate-200">Nova Análise</h2>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="0x... (Endereço do Contrato)"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full h-14 px-4 bg-black/40 border border-slate-700 rounded-2xl text-sm focus:border-sky-500 outline-none transition-all"
            />
            <button
              onClick={startMonitor}
              disabled={isAnalyzing}
              className="w-full h-14 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              {isAnalyzing ? 'Processando...' : 'Iniciar Monitor'}
            </button>
          </div>
        </motion.section>

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {/* SCORE CARD */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-bold">Safety Score</p>
                <div className="text-7xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {analysis.score}<span className="text-xl text-emerald-700">/100</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <Bot size={14} /> Sistema Seguro
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] uppercase mb-1">Contrato</div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {analysis.isVerified ? <CheckCircle2 size={14} className="text-emerald-400" /> : <ShieldAlert size={14} className="text-red-400" />}
                    {analysis.isVerified ? 'Verificado' : 'Não Verificado'}
                  </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] uppercase mb-1">Visibilidade</div>
                  <div className="text-sm font-medium">{analysis.isPrivate ? 'Privado' : 'Público'}</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] uppercase mb-1">Taxa Compra</div>
                  <div className="text-sm font-medium text-emerald-400">{analysis.buyTax}</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] uppercase mb-1">Taxa Venda</div>
                  <div className="text-sm font-medium text-amber-400">{analysis.sellTax}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FIXED FOOTER WITH CONNECT */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 flex justify-center">
        <ConnectButton />
      </footer>
    </div>
  );
}

export default App;
