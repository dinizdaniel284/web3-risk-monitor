import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Activity, BrainCircuit, Bot, Database, Zap, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const cryptoQuotes = [
  { symbol: 'BTC', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', price: '$0.75', change: '+5.7%' },
  { symbol: 'AGI', price: 'High-P', change: '+2.1%' },
];

function App() {
  const { isConnected, chain } = useAccount(); // No Wagmi v2, o chain vem do useAccount
  const { disconnect } = useDisconnect();
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState('');
  const [riskScore, setRiskScore] = useState<number | null>(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentLang = i18n.language || 'pt';

  const toggleLanguage = () => {
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    toast.info(`Idioma: ${newLang === 'pt' ? 'Português' : 'English'}`);
  };

  const startMonitor = () => {
    if (!contractAddress || contractAddress.length < 10) {
      toast.error('Endereço inválido');
      return;
    }
    setIsAnalyzing(true);
    toast.loading('Analisando...', { id: 'analyzing' });
    setTimeout(() => {
      setRiskScore(Math.floor(Math.random() * (100 - 85) + 85));
      setIsAnalyzing(false);
      toast.success('Completo!', { id: 'analyzing' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-sky-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-white font-bold text-sm">A</span><span className="text-sky-400 font-bold text-sm">D</span>
          </div>
          <div className='flex flex-col'>
            <h1 className="text-sm font-bold text-white leading-tight">
              Agência <span className="text-sky-400">IA Diniz</span>
            </h1>
            <p className='text-[9px] text-sky-500/80'>Web3 Risk Monitor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected && chain && (
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] text-sky-400">
              <Zap size={10} className="text-amber-400" /> {chain.name}
            </div>
          )}
          <button onClick={toggleLanguage} className="p-2 text-sm rounded-xl bg-slate-800 border border-slate-700 active:scale-95 transition-transform">
            {currentLang === 'pt' ? '🇧🇷' : '🇺🇸'}
          </button>
        </div>
      </header>

      <div className="overflow-x-auto whitespace-nowrap px-4 py-3 border-b border-slate-800/50 bg-slate-950/40">
        <div className="flex items-center gap-6">
          <div className='text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-widest'>
            <Activity size={10} className='text-sky-500' /> Market
          </div>
          {cryptoQuotes.map((quote, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-full">
              <span className="font-bold text-white">{quote.symbol}</span>
              <span className="text-slate-400">{quote.price}</span>
              <span className={`font-medium ${quote.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{quote.change}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-colors" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-900/40">
              <BrainCircuit size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-white">{t('risk_monitor')}</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('paste_contract_address')}
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-950/60 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all shadow-inner"
              />
              <Database className="absolute left-4 top-4.5 text-slate-600" size={18} />
            </div>
            <button
              onClick={startMonitor}
              disabled={isAnalyzing}
              className="w-full h-14 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  {t('analyzing')}
                </span>
              ) : t('start_monitor')}
            </button>
          </div>
        </motion.section>

        <AnimatePresence>
          {riskScore !== null && (
            <motion.section initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[50px] rounded-full" />
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">{t('web3_risk_score')}</p>
              <div className="text-8xl font-black bg-gradient-to-b from-emerald-300 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                {riskScore}<span className="text-2xl text-emerald-600/60">/100</span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Bot size={16} /> {t('score_safe')}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center gap-2">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all active:scale-95 shadow-lg shadow-sky-900/40">
                    {t('connect_wallet')}
                  </button>
                );
              }
              return (
                <div className="flex items-center gap-2">
                  <button onClick={openAccountModal} className="h-11 px-4 rounded-xl bg-slate-800 text-white text-xs font-mono border border-slate-700 hover:bg-slate-750 transition-colors">
                    {account.displayName}
                  </button>
                  <button onClick={() => disconnect()} className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </footer>
    </div>
  );
}

export default App;
