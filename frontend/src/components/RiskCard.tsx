// src/components/RiskCard.tsx
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

interface RiskCardProps {
  score: number;
  signals: string[];
  isLoading?: boolean; // Controla o estado de consulta
}

export default function RiskCard({ score, signals, isLoading = false }: RiskCardProps) {
  const { t } = useTranslation();

  // Definição de níveis de risco baseada no score recebido
  const isSafe = score >= 80;
  const isMedium = score >= 35 && score < 80;

  // Define dinamicamente as classes de cores do container principal
  const cardStyles = isSafe
    ? 'border-green-500/30 bg-green-500/5'
    : isMedium
    ? 'border-yellow-500/30 bg-yellow-500/5'
    : 'border-red-500/30 bg-red-500/5';

  // Define dinamicamente as cores dos textos de destaque
  const textStyles = isSafe 
    ? 'text-green-400' 
    : isMedium 
    ? 'text-yellow-400' 
    : 'text-red-400';

  const labelStyles = isSafe 
    ? 'text-green-500' 
    : isMedium 
    ? 'text-yellow-500' 
    : 'text-red-500';

  // Retorna a label traduzida correta para cada faixa de pontuação
  const getRiskLabel = () => {
    if (isSafe) return t('low_risk');
    if (isMedium) return t('medium_risk');
    return t('high_risk');
  };

  // Se estiver carregando/consultando a blockchain, mostra o feedback visual premium
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 flex flex-col items-center justify-center min-h-[250px] transition-all duration-500 shadow-lg shadow-sky-500/5">
        <div className="relative mb-4 flex items-center justify-center">
          {/* Efeito de onda/pulso no fundo do escudo */}
          <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl animate-pulse scale-150"></div>
          
          {/* O escudo pulando usando o animate-bounce do Tailwind */}
          <div className="animate-bounce">
            <Shield size={56} className="text-sky-400 drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
          </div>
        </div>
        
        <p className="text-sky-400 font-bold text-xs animate-pulse tracking-widest uppercase">
          {t('analyzing_contract')}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 shadow-xl ${cardStyles}`}>
      <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-200">
        {t('risk_score_title')}
      </h3>
      
      <div className="flex items-baseline gap-2.5 mb-6">
        <span className={`text-4xl font-black font-mono tracking-tight ${textStyles}`}>
          {score}/100
        </span>
        <span className={`text-xs font-black uppercase tracking-widest ${labelStyles}`}>
          {getRiskLabel()}
        </span>
      </div>

      <div className="space-y-3">
        {signals.length > 0 ? (
          signals.map((sig, i) => (
            <div 
              key={i} 
              className="flex gap-3 text-xs items-start p-3.5 bg-slate-950/60 rounded-xl border border-white/5 animate-in fade-in slide-in-from-bottom-1"
            >
              {/* Ícones específicos dependendo da severidade do sinal */}
              {sig === 'signal_not_contract' ? (
                <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
              ) : isSafe ? (
                <ShieldCheck size={16} className="text-green-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              )}
              
              {/* Tradução dinâmica do sinal vindo do Core Engine */}
              <span className="text-slate-300 font-medium leading-relaxed">
                {t(sig) || sig}
              </span>
            </div>
          ))
        ) : (
          <div className="flex gap-2 text-xs items-center text-slate-500 italic py-4 justify-center border border-dashed border-slate-900 rounded-xl">
            <CheckCircle2 size={16} className="opacity-50" />
            <span>{t('waiting')}</span> 
          </div>
        )}
      </div>
    </div>
  );
}