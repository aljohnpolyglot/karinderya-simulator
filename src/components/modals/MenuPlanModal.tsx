import { useState } from 'react';
import { useGameStore, computeShoppingList } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onAutoBuy: (plan: Record<string, number>, extraRiceKg: number) => void;
  onManual: (plan: Record<string, number>, extraRiceKg: number) => void;
  onSkip: () => void;
}

export function MenuPlanModal({ language, onAutoBuy, onManual, onSkip }: Props) {
  const activeDishes = useGameStore(s => s.activeDishes);
  const ingredientsData = useGameStore(s => s.ingredientsData);
  const inventory = useGameStore(s => s.inventory);
  const cash = useGameStore(s => s.cash);
  const cookedRiceServings = useGameStore(s => s.cookedRiceServings);
  const t = createT(language);

  const riceStock = inventory['rice-raw'] || 0;
  const bigasData = ingredientsData.find(i => i.id === 'rice-raw');
  const bigasPrice = bigasData?.currentPrice || 0;

  const [plan, setPlan] = useState<Record<string, number>>({});
  const [riceKg, setRiceKg] = useState(0);

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

  const totalServings = Object.values(plan).reduce((a, b) => a + b, 0);
  const shoppingList = computeShoppingList(plan, activeDishes, inventory, ingredientsData);
  const ingredientCost = shoppingList.reduce((s, item) => s + item.totalCost, 0);
  const riceCost = riceKg * bigasPrice;
  const estimatedCost = ingredientCost + riceCost;
  const projectedRevenue = Object.entries(plan).reduce((sum, [dishId, qty]) => {
    const dish = activeDishes.find(d => d.id === dishId);
    return sum + (dish ? dish.sellingPrice * qty : 0);
  }, 0);

  const hasAnythingToBuy = shoppingList.length > 0 || riceKg > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-karinderya-wood/10 shrink-0">
          <h2 className="text-xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            📋 {t('planModal.title')}
          </h2>
          <p className="text-xs text-karinderya-wood/60 mt-1">{t('planModal.subtitle')}</p>
        </div>

        {/* Dish List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {/* Rice — adjustable */}
          <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${riceStock === 0 && cookedRiceServings === 0 && riceKg === 0 ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-amber-50'}`}>
            <span className="text-2xl">🍚</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-karinderya-wood-dark">{t('menu.rawRice')}</div>
              <div className="text-[10px] text-karinderya-wood/50">
                {t('common.stock')}: {riceStock.toFixed(1)} kg · {t('menu.cooked')}: {cookedRiceServings} servings
              </div>
              {bigasData && <div className="text-[10px] text-amber-700 font-semibold">₱{bigasPrice}/kg</div>}
              {riceStock === 0 && cookedRiceServings === 0 && riceKg === 0 && (
                <div className="text-[10px] text-rose-600 font-bold mt-0.5">⚠️ {t('menu.noRice')}</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setRiceKg(q => Math.max(0, q - 1))} disabled={riceKg === 0}
                className="w-7 h-7 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
              <span className="w-8 text-center font-bold text-xs tabular-nums">{riceKg} kg</span>
              <button onClick={() => setRiceKg(q => q + 1)} disabled={bigasPrice * (riceKg + 1) + ingredientCost > cash}
                className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-amber-500 transition-colors">+</button>
            </div>
          </div>

          {activeDishes.map(dish => {
            const qty = plan[dish.id] || 0;
            const cost = dish.ingredients.reduce((sum, ing) => {
              const data = ingredientsData.find(i => i.id === ing.ingredientId);
              return sum + (data ? data.currentPrice * ing.quantity : 0);
            }, 0);
            return (
              <div key={dish.id} className="flex items-center gap-3 bg-karinderya-cream rounded-lg px-3 py-2.5">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-lg shrink-0">🍽️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-karinderya-wood-dark truncate">{dish.name}</div>
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

        {/* Summary + Actions */}
        <div className="px-6 py-4 border-t border-karinderya-wood/10 space-y-3 shrink-0">
          {(totalServings > 0 || riceKg > 0) && (
            <div className="bg-karinderya-cream rounded-lg p-3 space-y-1.5">
              {totalServings > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-karinderya-wood/60">{t('common.servings')}</span>
                  <span className="font-bold text-karinderya-wood-dark">{totalServings}</span>
                </div>
              )}
              {hasAnythingToBuy && (
                <div className="flex justify-between text-xs">
                  <span className="text-karinderya-wood/60">{t('planModal.estimatedCost')}</span>
                  <span className="font-bold text-amber-700">₱{estimatedCost.toLocaleString()}</span>
                </div>
              )}
              {!hasAnythingToBuy && totalServings > 0 && (
                <div className="text-xs text-emerald-600 font-semibold">{t('receipt.nothingToBuy')}</div>
              )}
              {totalServings > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-karinderya-wood/60">{t('morning.projectedRevenue')}</span>
                  <span className="font-bold text-emerald-700">₱{projectedRevenue.toLocaleString()}</span>
                </div>
              )}
              {estimatedCost > cash && (
                <div className="text-[10px] text-rose-600 font-bold">⚠️ {t('common.notEnoughBudget')}</div>
              )}
              {hasAnythingToBuy && (
                <div className="border-t border-karinderya-wood/10 pt-2 mt-1">
                  <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase mb-1">{t('common.shoppingList')}</div>
                  <div className="flex flex-wrap gap-1">
                    {riceKg > 0 && (
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        🍚 Bigas x{riceKg}kg
                      </span>
                    )}
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

          <div className="flex gap-2">
            {(totalServings > 0 || riceKg > 0) && hasAnythingToBuy && (
              <button onClick={() => onAutoBuy(plan, riceKg)} disabled={estimatedCost > cash}
                className="flex-1 bg-amber-600 text-white font-bold text-sm rounded-xl px-4 py-3 cursor-pointer disabled:opacity-40 hover:bg-amber-500 active:scale-[0.97] transition-all">
                🛒 {t('planModal.autoBuy')} — ₱{estimatedCost.toLocaleString()}
              </button>
            )}
            {(totalServings > 0 || riceKg > 0) && (
              <button onClick={() => onManual(plan, riceKg)}
                className="flex-1 bg-karinderya-cream text-karinderya-wood-dark font-semibold text-sm rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
                {t('planModal.manual')}
              </button>
            )}
          </div>
          <button onClick={onSkip}
            className="w-full text-xs text-karinderya-wood/50 hover:text-karinderya-wood-dark cursor-pointer py-1 transition-colors">
            {t('planModal.skipPlan')}
          </button>
        </div>
      </div>
    </div>
  );
}
