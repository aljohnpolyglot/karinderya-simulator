import { useGameStore } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function Summary({ language, onNext }: Props) {
  const { currentReport, cash, reputation } = useGameStore();
  const t = createT(language);

  if (!currentReport) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-karinderya-wood/60">{t('summary.noReport')}</p>
        <button onClick={onNext}
          className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 cursor-pointer">
          {t('summary.nextDay')}
        </button>
      </div>
    );
  }

  const r = currentReport;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          📊 {t('summary.title')}
        </h1>
        <p className="text-sm text-karinderya-wood/70 mt-1">{t('summary.subtitle')}</p>
      </div>

      <div className={`rounded-xl p-6 text-center ${r.profit >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        <div className="text-xs font-bold uppercase tracking-wider text-karinderya-wood/50 mb-1">{t('summary.netIncome')}</div>
        <div className={`text-4xl font-bold ${r.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
          {r.profit >= 0 ? '+' : ''}₱{r.profit.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon="💰" label={t('common.revenue')} value={`₱${r.revenue.toLocaleString()}`} />
        <SummaryCard icon="💸" label={t('summary.wages')} value={`-₱${r.wages.toLocaleString()}`} negative />
        <SummaryCard icon="👤" label={t('summary.served')} value={r.customersServed.toString()} />
        <SummaryCard icon="💨" label={t('summary.lost')} value={r.customersLost.toString()} negative={r.customersLost > 0} />
        <SummaryCard icon="🍚" label={t('summary.riceSold')} value={r.riceSold.toString()} />
        <SummaryCard icon="🗑️" label={t('summary.wasted')} value={`${r.wastedServings} servings`} negative={r.wastedServings > 0} />
        <SummaryCard icon="😊" label={t('summary.satisfaction')} value={`${r.averageSatisfaction}%`} />
        <SummaryCard icon="⭐" label={t('common.reputation')}
          value={`${r.reputationChange >= 0 ? '+' : ''}${r.reputationChange.toFixed(1)}`}
          negative={r.reputationChange < 0} />
      </div>

      <div className="bg-karinderya-cream rounded-xl p-4 flex justify-between items-center">
        <div>
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('summary.currentCash')}</div>
          <div className="text-2xl font-bold text-amber-700">₱{cash.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('common.reputation')}</div>
          <div className="text-2xl font-bold text-karinderya-wood-dark">⭐ {reputation.toFixed(1)}</div>
        </div>
      </div>

      <button onClick={onNext}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
        {t('summary.nextButton')}
      </button>
    </div>
  );
}

function SummaryCard({ icon, label, value, negative }: { icon: string; label: string; value: string; negative?: boolean }) {
  return (
    <div className="bg-karinderya-cream rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{label}</span>
      </div>
      <div className={`text-lg font-bold ${negative ? 'text-rose-700' : 'text-karinderya-wood-dark'}`}>{value}</div>
    </div>
  );
}
