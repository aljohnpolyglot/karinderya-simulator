import { useGameStore } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function StoreClosed({ language, onNext }: Props) {
  const { day, cash, reputation } = useGameStore();
  const t = createT(language);

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-6xl">🌙</div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {t('night.title')}
        </h1>
        <p className="text-sm text-karinderya-wood/70 mt-2">{t('night.dayDone', day)}</p>
      </div>

      <div className="flex gap-6 text-center">
        <div>
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('common.cash')}</div>
          <div className="text-2xl font-bold text-amber-700">₱{cash.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('night.rep')}</div>
          <div className="text-2xl font-bold text-karinderya-wood-dark">⭐ {reputation.toFixed(1)}</div>
        </div>
      </div>

      <button onClick={onNext}
        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-8 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
        {t('night.nextButton')}
      </button>
    </div>
  );
}
