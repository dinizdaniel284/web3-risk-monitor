import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Bot, Database, Zap, LogOut, ShieldAlert, CheckCircle2, Search, History } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from './lib/supabase';

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
  const [myHistory, setMyHistory] = useState<any[]>([]);

  // Alternar idioma
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
    toast.info(nextLang === 'pt' ? 'Idioma: Português' : 'Language: English');
  };

  // Buscar histórico privado do usuário
  const fetchMyHistory = async () => {
    if (!address) return;
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (data) setMyHistory(data);
  };

  useEffect(() => {
    if (isConnected) fetchMyHistory();
  }, [address, isConnected]);

  const startMonitor = async () => {
    if (!contractAddress || contractAddress.length < 10) {
      toast.error('Endereço inválido');
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading('Analisando contrato...');

    setTimeout(async () => {
      const result = {
        score: Math.floor(Math.random() * (100 - 85) + 85),
        isVerified: true,
        isPrivate: false,
        buyTax: "0%",
        sellTax: "0.5%",
        timestamp: new Date().toISOString()
      };

      setAnalysis(result);
      toast.success('Concluído!', { id: toastId });

      if (isConnected && address) {
        await supabase.from('history').insert([
          { 
            wallet_address: address, 
            contract_target: contractAddress, 
            score: result.score,
            details: result 
          }
        ]);
        fetchMyHistory();
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      
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
        <button onClick={toggleLanguage} className="p-2 text-xs rounded-lg bg-slate-800 border border-slate-700 active:scale-90 transition-transform">
          {i18n.language === 'pt' ? '🇧🇷' : '🇺🇸'}
        </button>
      </header>

      {/* CARROSSEL DE PREÇOS */}
      <div className="bg-slate-900/50 border-b border-slate-800 overflow-hidden py-2">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
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
        {/* INPUT */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <Search className="text-sky-500" size={20} />
            <h2 className="font-bold text-slate-200">{t('new_analysis')}</h2>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full h-14 px-4 bg-black/40 border border-slate-700 rounded-2xl text-sm outline-none focus:border-sky-500 transition-all"
            />
            <button
              onClick={startMonitor}
              disabled={isAnalyzing}
              className="w-full h-14 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
            >
              {isAnalyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
              {isAnalyzing ? t('processing') : t('start_monitor')}
            </button>
          </div>
        </section>

        {/* RESULTADOS */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center relative">
                <div className="text-7xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {analysis.score}<span className="text-xl text-emerald-700">/100</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                   <Bot size={14} /> {t('system_safe')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase mb-1">{t('contract')}</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> {t('verified')}
                  </p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase mb-1">{t('buy_tax')}</p>
                  <p className="text-sm font-medium text-emerald-400">{analysis.buyTax}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HISTÓRICO PRIVADO */}
        {isConnected && myHistory.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4 px-2">
              <History size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('my_history')}</h3>
            </div>
            <div className="space-y-2">
              {myHistory.slice(0, 5).map((item, idx) => (
                <div key={idx} className="bg-slate-900/30 border border-slate-800/50 p-3 rounded-xl flex justify-between items-center">
                  <div className="text-[10px] font-mono text-slate-500">{item.contract_target.slice(0, 12)}...</div>
                  <div className="text-emerald-500 font-bold text-xs">{item.score}/100</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 flex justify-center">
        <ConnectButton />
      </footer>
    </div>
  );
}

export default App;
                    
