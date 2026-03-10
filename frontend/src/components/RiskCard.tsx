// src/components/RiskCard.tsx
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskCardProps {
  score: number;
  signals: string[];
}

export default function RiskCard({ score, signals }: RiskCardProps) {
  const { t } = useTranslation();

  const isSafe = score >= 80;

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 ${
      isSafe ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
    }`}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        {t('risk_score')} Web3
      </h3>
      
      <div className="flex items-baseline gap-2 mb-6">
        <span className={`text-4xl font-black font-mono ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
          {score}/100
        </span>
        <span className={`text-sm font-bold uppercase ${isSafe ? 'text-green-500' : 'text-red-500'}`}>
          {isSafe ? t('safe') : t('high_risk')}
        </span>
      </div>

      <div className="space-y-4">
        {signals.length > 0 ? (
          signals.map((sig, i) => (
            <div key={i} className="flex gap-3 text-sm items-start p-3 bg-slate-950/40 rounded-xl border border-white/5 animate-in fade-in slide-in-from-bottom-1">
              {/* Se o sinal for de "não é contrato", mostramos um ícone mais forte */}
              {sig === 'signal_not_contract' ? (
                <ShieldAlert size={18} className="text-red-500 shrink-0" />
              ) : (
                <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
              )}
              
              {/* USAMOS O t(sig) PARA TRADUZIR A CHAVE QUE VEM DO HOOK */}
              <span className="text-slate-300 leading-tight">{t(sig)}</span>
            </div>
          ))
        ) : (
          <div className="flex gap-2 text-sm items-center text-slate-500 italic py-4">
            <CheckCircle2 size={18} className="opacity-50" />
            <span>{t('waiting')}</span> 
          </div>
        )}
      </div>
    </div>
  );
}