import { useState } from 'react';
import { useGameStore, computeShoppingList } from '../../stores/gameStore';
import { createT, WEATHER_ICONS, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function MorningBriefing({ language, onNext }: Props) {
  const { day, dayOfWeek, dailyConditions, cash, ingredientsData } = useGameStore();
  const activeDishes = useGameStore(s => s.activeDishes);
  const inventory = useGameStore(s => s.inventory);
  const setMenuPlan = useGameStore(s => s.setMenuPlan);
  const t = createT(language);
  const w = dailyConditions.weather;
  const demandMod = dailyConditions.modifiers.demand;

  const [plan, setPlan] = useState<Record<string, number>>({});
  const [showPlanner, setShowPlanner] = useState(false);

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

  const shoppingList = computeShoppingList(plan, activeDishes, inventory, ingredientsData);
  const estimatedCost = shoppingList.reduce((s, item) => s + item.totalCost, 0);

  const totalServings = Object.values(plan).reduce((a, b) => a + b, 0);
  const projectedRevenue = Object.entries(plan).reduce((sum, [dishId, qty]) => {
    const dish = activeDishes.find(d => d.id === dishId);
    return sum + (dish ? dish.sellingPrice * qty : 0);
  }, 0);

  const handleContinue = () => {
    setMenuPlan(plan);
    onNext();
  };

  const adjust = (dishId: string, delta: number) => {
    setPlan(prev => {
      const next = Math.max(0, (prev[dishId] || 0) + delta);
      if (next === 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: next };
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
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

      {/* Weather & Demand */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-karinderya-cream rounded-xl p-4">
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase mb-2">{t('morning.weather')}</div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{WEATHER_ICONS[w]}</span>
            <div className="font-bold text-lg text-karinderya-wood-dark">{t(`weather.${w.toLowerCase()}`)}</div>
          </div>
        </div>

        <div className="bg-karinderya-cream rounded-xl p-4">
          <div className="text-xs font-bold text-karinderya-wood/50 uppercase mb-2">{t('morning.demandForecast')}</div>
          <div className="font-bold text-lg text-karinderya-wood-dark">
            {demandMod >= 1.3 ? t('morning.demandHigh') : demandMod >= 0.9 ? t('morning.demandNormal') : t('morning.demandLow')}
          </div>
          <div className="text-xs text-karinderya-wood/60 mt-1">
            {t('morning.expectedCustomers')}: {dailyConditions.expectedDemographics.join(', ')}
          </div>
        </div>
      </div>

      {/* Event */}
      {dailyConditions.event && (
        <div className="bg-amber-100 border-l-4 border-amber-500 rounded-r-xl p-4">
          <div className="text-xs font-bold text-amber-700 uppercase mb-1">{t('morning.eventToday')}</div>
          <div className="font-semibold text-amber-900">{dailyConditions.event}</div>
        </div>
      )}

      {/* Hot dishes */}
      {hotDishes.length > 0 && (
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="text-xs font-bold text-orange-700 uppercase mb-2">{t('morning.trending')}</div>
          <div className="flex flex-wrap gap-2">
            {hotDishes.map(([dishId, mod]) => {
              const dish = activeDishes.find(d => d.id === dishId);
              return dish ? (
                <span key={dishId} className="text-xs font-semibold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg">
                  {dish.name} +{Math.round(((mod as number) - 1) * 100)}%
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Market Prices */}
      {priceChanges.length > 0 && (
        <div>
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
      )}

      {/* Nanay Rose Tip */}
      <div className="bg-karinderya-wood-dark/5 rounded-xl p-4 flex gap-3 items-start">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=nanay-rose&backgroundColor=f5ebd3" alt="Nanay Rose" className="w-12 h-12 rounded-full bg-karinderya-cream shrink-0" />
        <div>
          <div className="text-xs font-bold text-karinderya-wood/50">Nanay Rose</div>
          <p className="text-sm text-karinderya-wood-dark mt-0.5 italic">
            {t(w === 'RAINY' ? 'morning.tipRainy' : w === 'STORM' ? 'morning.tipStorm' : 'morning.tipDefault')}
          </p>
        </div>
      </div>

      {/* Menu Planner */}
      <div className="bg-karinderya-cream rounded-xl overflow-hidden">
        <button onClick={() => setShowPlanner(!showPlanner)}
          className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-amber-100/50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="font-bold text-sm text-karinderya-wood-dark">{t('morning.planMenu')}</span>
            {totalServings > 0 && (
              <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                {totalServings} {t('common.servings').toLowerCase()}
              </span>
            )}
          </div>
          <span className="text-karinderya-wood/40 text-sm">{showPlanner ? '▲' : '▼'}</span>
        </button>

        {showPlanner && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-karinderya-wood/60">{t('morning.planDesc')}</p>

            <div className="space-y-2">
              {activeDishes.map(dish => {
                const qty = plan[dish.id] || 0;
                const cost = dish.ingredients.reduce((sum, ing) => {
                  const data = ingredientsData.find(i => i.id === ing.ingredientId);
                  return sum + (data ? data.currentPrice * ing.quantity : 0);
                }, 0);
                return (
                  <div key={dish.id} className="flex items-center gap-3 bg-white/60 rounded-lg px-3 py-2">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-sm shrink-0">🍽️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-karinderya-wood-dark truncate">{dish.name}</div>
                      <div className="text-[10px] text-karinderya-wood/50">
                        ₱{cost.toFixed(0)} {t('common.cost')} · ₱{dish.sellingPrice} {t('common.sell')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => adjust(dish.id, -1)} disabled={qty === 0}
                        className="w-7 h-7 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                      <span className="w-6 text-center font-bold text-xs tabular-nums">{qty}</span>
                      <button onClick={() => adjust(dish.id, 1)}
                        className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors">+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalServings > 0 && (
              <div className="bg-white/60 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-karinderya-wood/60">{t('morning.needToBuy')}</span>
                  <span className="font-bold text-amber-700">₱{estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-karinderya-wood/60">{t('morning.projectedRevenue')}</span>
                  <span className="font-bold text-emerald-700">₱{projectedRevenue.toLocaleString()}</span>
                </div>
                {estimatedCost > cash && (
                  <div className="text-[10px] text-rose-600 font-bold">⚠️ {t('common.notEnoughBudget')}</div>
                )}
                {shoppingList.length > 0 && (
                  <div className="border-t border-karinderya-wood/10 pt-2 mt-2">
                    <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase mb-1">{t('common.shoppingList')}</div>
                    <div className="flex flex-wrap gap-1">
                      {shoppingList.map(item => (
                        <span key={item.ingredientId} className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {item.icon} {item.name} x{item.toBuy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={handleContinue}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
        {t('morning.nextButton')}
      </button>
    </div>
  );
}
