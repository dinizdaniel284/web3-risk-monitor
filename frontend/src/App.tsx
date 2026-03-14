import { useState } from 'react';
import { useAccount, useNetwork, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion'; // Animações Premium
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Activity, BrainCircuit, Bot, Database, Zap, DollarSign, LogOut } from 'lucide-react';
import { toast } from 'sonner';

// Mock de dados de cripto para o terminal de luxo
const cryptoQuotes = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$68,543', change: '+1.2%' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,871', change: '+0.9%' },
  { symbol: 'RAYLS', name: 'Rayls Network', price: '$0.75', change: '+5.7%' },
  { symbol: 'AGI', name: 'IA Risk', price: 'High-P', change: '+2.1%' },
];

function App() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { t, i18n } = useTranslation();
  const [contractAddress, setContractAddress] = useState('');
  const [riskScore, setRiskScore] = useState<number | null>(100); // 100 por enquanto
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentLang = i18n.language || 'pt';

  const toggleLanguage = () => {
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    toast.info(`Idioma alterado para: ${newLang === 'pt' ? 'Português' : 'English'}`);
  };

  const startMonitor = () => {
    if (!contractAddress || contractAddress.length < 10) {
      toast.error('Por favor, insira um endereço de contrato válido.');
      return;
    }
    
    setIsAnalyzing(true);
    toast.loading('Iniciando análise comportamental IA...', { id: 'analyzing' });
    
    setTimeout(() => {
      // Simulação de análise
      setRiskScore(Math.floor(Math.random() * (100 - 85) + 85)); // 85-100 para ser 'seguro'
      setIsAnalyzing(false);
      toast.success('Análise de Risco Completa!', { id: 'analyzing' });
    }, 2500);
  };

  return (
    // Fundo Gradiente Deep-Sky com malha tecnológica sutil (estilo vault)
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans pb-20 relative overflow-hidden">
      
      {/* Camada de textura de fundo (Cosmic Mesh) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'0 0 60 60\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* CABEÇALHO PREMIUM: Vidro jateado com borda neon */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-sky-500/20 px-4 py-3 shadow-[0_4px_20px_-2px_rgba(14,165,233,0.15)] flex items-center justify-between">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
          {/* Logo AD Premium */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-between p-0.5 border border-slate-700 shadow-inner overflow-hidden group-hover:border-sky-500 transition-colors">
              <span className="text-white text-base font-extrabold ml-1">A</span>
              <span className="text-sky-400 text-base font-extrabold mr-1">D</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-sky-500/10 blur group-hover:bg-sky-500/20" />
          </div>
          <div className='flex flex-col'>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Agência <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">IA Diniz</span>
            </div>
            <p className='text-[10px] text-sky-500/80 -mt-0.5'>Web3 Risk Monitor (Lux Edition)</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
          {isConnected && chain && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-400">
              <Zap size={12} className="text-amber-400" />
              {chain.name}
            </div>
          )}
          <button onClick={toggleLanguage} className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600">
            {currentLang === 'pt' ? '🇧🇷' : '🇺🇸'}
          </button>
        </motion.div>
      </header>

      {/* 🚀 NOVO ELEMENTO LUXO: Barra de Cotações Cripto (Tech-Ticker) */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{delay: 0.2}} className="overflow-x-auto whitespace-nowrap px-4 py-3 border-b border-slate-800/50 bg-slate-950/40">
        <div className="flex items-center gap-6">
          <div className='text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-widest'>
            <Activity size={10} className='text-sky-500' /> Live Market
          </div>
          {cryptoQuotes.map((quote, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-full">
              <span className="font-bold text-white">{quote.symbol}</span>
              <span className="text-slate-400 text-xs">{quote.price}</span>
              <span className={`text-xs ${quote.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{quote.change}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <main className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 mt-4">
        
        {/* CARDE PRINCIPAL (MONITOR DE RISCO) - Efeito Glassmorphism Premium */}
        <motion.section initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{delay: 0.3}}
          className="relative bg-slate-900/40 backdrop-blur-lg border border-slate-800 rounded-3xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden group">
          
          {/* Efeito Brilho de Canto */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-sky-600/10 rounded-full blur-3xl group-hover:bg-sky-600/20 transition-colors" />

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-900/40">
              <BrainCircuit size={28} />
            </div>
            <div className='flex flex-col'>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{t('risk_monitor')}</h2>
              <p className="text-slate-400 text-sm">{t('analyze_contract_risk')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Input de Vidro Jateado com Foco Neon */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('paste_contract_address')}
                value={contractAddress}
                onChange={(e) => setContractAddress(e.e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-950/60 border border-slate-700/50 rounded-2xl text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition duration-150 backdrop-blur-sm shadow-inner"
              />
              <Database className="absolute left-4 top-4.5 text-slate-600" size={20} />
            </div>
            
            {/* Botão com Gradiente Dinâmico e Efeito Glow */}
            <button
              onClick={startMonitor}
              disabled={isAnalyzing}
              className="w-full h-14 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed shadow-[0_6px_20px_-2px_rgba(14,165,233,0.3)] hover:shadow-[0_10px_25px_-2px_rgba(14,165,233,0.5)]"
            >
              {isAnalyzing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="border-2 border-white/20 border-t-white rounded-full w-5 h-5" />
                  {t('analyzing')}
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  {t('start_monitor')}
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* 🏆 CARDE DE RESULTADO (SCORE): O Destaque Luxo Holográfico */}
        <AnimatePresence>
          {riskScore !== null && (
            <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-3xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="text-slate-700" size={16} />
              </div>

              <div className="flex flex-col items-center gap-6">
                <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">{t('web3_risk_score')}</p>
                
                {/* Score Holográfico Gradiente Verde Emeralda */}
                <div className="relative">
                  <span className="text-8xl font-black bg-gradient-to-b from-emerald-300 to-green-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    {riskScore}
                    <span className='text-3xl text-emerald-300 -ml-1'>/100</span>
                  </span>
                  {/* Efeito Glow atrás do número */}
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[40px]" />
                </div>
                
                <div className="flex items-center gap-2.5 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-lg font-bold text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Bot size={20} className="text-emerald-500" />
                  {t('score_safe')}
                </div>
                
                <p className="text-slate-500 text-xs mt-2">{t('waiting')}...</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* HISTÓRICO PREMIUM - Lista Minimalista com Bordas de Vidro */}
        <motion.section initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{delay: 0.4}}
          className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-6 shadow-md overflow-hidden">
          
          <div className="flex items-center gap-3.5 mb-5 border-b border-slate-800 pb-4">
            <Activity className="text-slate-600" size={20} />
            <h3 className="text-xl font-bold text-slate-200 tracking-tight">{t('my_history_full', { agency: 'Agência IA Diniz' })}</h3>
          </div>

          <div className="space-y-2.5">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/70 rounded-xl hover:border-sky-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Database size={16} />
                  </div>
                  <div className='flex flex-col'>
                    <span className="text-sm font-medium text-white font-mono">0x723...00A9</span>
                    <span className='text-[10px] text-slate-500'>Uniswap Protocol: Core</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20">
                    100/100
                  </div>
                  <span className="text-xs text-slate-600">3h ago</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </main>

      {/* RODAPÉ PREMIUM (DOCK MENU LOOK) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-3 flex justify-center">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex items-center gap-1.5 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} type="button" className="h-11 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold text-sm hover:from-sky-600 hover:to-indigo-600 transition duration-150 transform active:scale-95 shadow-lg shadow-sky-900/30">
                    {t('connect_wallet')}
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-1.5">
                  <button onClick={openAccountModal} type="button" className="h-11 flex items-center gap-2 px-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600">
                    {account.ensAvatar && (
                      <img src={account.ensAvatar} className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-white text-xs font-mono">{account.displayName}</span>
                    <span className='text-[9px] text-sky-400'>({account.displayBalance})</span>
                  </button>
                  <button onClick={() => disconnect()} title={t('logout_confirm_description')} className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-red-400">
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
        
