import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { createT, WEATHER_ICONS, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function MorningBriefing({ language, onNext }: Props) {
  const { day, dayOfWeek, dailyConditions, cash, ingredientsData } = useGameStore();
  const activeDishes = useGameStore(s => s.activeDishes);
  const t = createT(language);
  const w = dailyConditions.weather;
  const demandMod = dailyConditions.modifiers.demand;

  const [step, setStep] = useState(0);

  const priceChanges = ingredientsData
    .filter(i => i.currentPrice !== i.basePrice)
    .map(i => ({
      name: i.shortName || i.name,
      icon: i.icon,
      price: i.currentPrice,
      base: i.basePrice,
      diff: i.currentPrice - i.basePrice,
    }));

  const hotDishes = Object.entries(dailyConditions.modifiers.specificDishPopularity || {});

  // Build steps dynamically (skip steps with no content)
  const steps: { id: string; content: React.ReactNode }[] = [];

  // Step 0: Weather + Demand
  steps.push({
    id: 'weather',
    content: (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-karinderya-cream rounded-xl p-6 text-center">
          <div className="text-6xl mb-3">{WEATHER_ICONS[w]}</div>
          <div className="text-2xl font-bold text-karinderya-wood-dark">{t(`weather.${w.toLowerCase()}`)}</div>
          <div className="text-sm text-karinderya-wood/60 mt-1">{t('morning.weather')}</div>
        </div>
        <div className="bg-karinderya-cream rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-karinderya-wood-dark">
            {demandMod >= 1.3 ? t('morning.demandHigh') : demandMod >= 0.9 ? t('morning.demandNormal') : t('morning.demandLow')}
          </div>
          <div className="text-xs text-karinderya-wood/60 mt-1">
            {t('morning.expectedCustomers')}: {dailyConditions.expectedDemographics.join(', ')}
          </div>
        </div>
      </div>
    ),
  });

  // Step 1: Event (if any)
  if (dailyConditions.event) {
    steps.push({
      id: 'event',
      content: (
        <div className="animate-fade-in">
          <div className="bg-amber-100 border-l-4 border-amber-500 rounded-r-xl p-6">
            <div className="text-xs font-bold text-amber-700 uppercase mb-2">{t('morning.eventToday')}</div>
            <div className="text-lg font-semibold text-amber-900">{dailyConditions.event}</div>
          </div>
        </div>
      ),
    });
  }

  // Step 2: Hot dishes (if any)
  if (hotDishes.length > 0) {
    steps.push({
      id: 'trending',
      content: (
        <div className="animate-fade-in">
          <div className="bg-orange-50 rounded-xl p-5">
            <div className="text-xs font-bold text-orange-700 uppercase mb-3">{t('morning.trending')}</div>
            <div className="flex flex-wrap gap-2">
              {hotDishes.map(([dishId, mod]) => {
                const dish = activeDishes.find(d => d.id === dishId);
                return dish ? (
                  <span key={dishId} className="text-sm font-semibold bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg">
                    {dish.name} +{Math.round(((mod as number) - 1) * 100)}%
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ),
    });
  }

  // Step 3: Market Prices (if any changes)
  if (priceChanges.length > 0) {
    steps.push({
      id: 'prices',
      content: (
        <div className="animate-fade-in">
          <h2 className="text-sm font-bold text-karinderya-wood/50 uppercase mb-3">{t('morning.marketPrices')}</h2>
          <div className="grid grid-cols-2 gap-2">
            {priceChanges.map(p => (
              <div key={p.name} className="flex items-center gap-2 bg-karinderya-cream rounded-lg px-3 py-2">
                <span className="text-lg">{p.icon}</span>
                <span className="text-sm font-semibold text-karinderya-wood-dark flex-1">{p.name}</span>
                <span className="text-sm font-bold tabular-nums">₱{p.price}</span>
                <span className={`text-xs font-bold ${p.diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {p.diff > 0 ? '▲' : '▼'}{Math.abs(p.diff).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  // Step 4: Nanay Rose tip
  steps.push({
    id: 'tip',
    content: (
      <div className="animate-fade-in">
        <div className="bg-karinderya-wood-dark/5 rounded-xl p-5 flex gap-4 items-start">
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=nanay-rose&backgroundColor=f5ebd3" alt="Nanay Rose" className="w-14 h-14 rounded-full bg-karinderya-cream shrink-0" />
          <div>
            <div className="text-xs font-bold text-karinderya-wood/50 mb-1">Nanay Rose</div>
            <p className="text-sm text-karinderya-wood-dark italic leading-relaxed">
              {t(w === 'RAINY' ? 'morning.tipRainy' : w === 'STORM' ? 'morning.tipStorm' : 'morning.tipDefault')}
            </p>
          </div>
        </div>
      </div>
    ),
  });

  const isLastStep = step >= steps.length - 1;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            ☀️ {t('morning.title')}
          </h1>
          <p className="text-sm text-karinderya-wood/70 mt-1">{t('morning.dayLabel', day, dayOfWeek)}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('common.cash')}</div>
          <div className="text-xl font-bold text-amber-700">₱{cash.toLocaleString()}</div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-amber-600 w-6' : i < step ? 'bg-amber-400' : 'bg-karinderya-wood/20'}`} />
        ))}
      </div>

      {/* Current step content */}
      <div className="min-h-[200px]">
        {steps[step]?.content}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="bg-karinderya-cream text-karinderya-wood-dark font-semibold rounded-xl px-5 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
            ←
          </button>
        )}
        {!isLastStep ? (
          <button onClick={() => setStep(s => s + 1)}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
            {t('morning.nextStep')}
          </button>
        ) : (
          <button onClick={onNext}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
            {t('morning.nextButton')}
          </button>
        )}
      </div>
    </div>
  );
}
