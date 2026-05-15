import { useState } from 'react';
import { useGameStore, computeShoppingList } from '../../stores/gameStore';
import { Cookbook } from '../Cookbook';
import { createT, type Language } from '../../lib/i18n';
import type { Dish } from '../../types/game';

interface Props {
  language: Language;
  onNext: () => void;
}

function maxServingsForDish(dish: Dish, inventory: Record<string, number>, plan: Record<string, number>, excludeDishId: string): number {
  let max = Infinity;
  for (const ing of dish.ingredients) {
    const stock = inventory[ing.ingredientId] || 0;
    const usedByOthers = Object.entries(plan).reduce((sum, [did, qty]) => {
      if (did === excludeDishId || qty <= 0) return sum;
      const otherDish = useGameStore.getState().activeDishes.find(d => d.id === did);
      const uses = otherDish?.ingredients.find(i => i.ingredientId === ing.ingredientId)?.quantity || 0;
      return sum + uses * qty;
    }, 0);
    const available = stock - usedByOthers;
    if (ing.quantity > 0) max = Math.min(max, Math.floor(available / ing.quantity));
  }
  return max === Infinity ? 0 : Math.max(0, max);
}

export function MenuPlanning({ language, onNext }: Props) {
  const activeDishes = useGameStore(s => s.activeDishes);
  const ingredientsData = useGameStore(s => s.ingredientsData);
  const inventory = useGameStore(s => s.inventory);
  const cash = useGameStore(s => s.cash);
  const prepDishes = useGameStore(s => s.prepDishes);
  const setDishPrice = useGameStore(s => s.setDishPrice);
  const dishPrices = useGameStore(s => s.dishPrices);
  const cookedRiceServings = useGameStore(s => s.cookedRiceServings);
  const cookRice = useGameStore(s => s.cookRice);
  const isRiceCooking = useGameStore(s => s.isRiceCooking);
  const menuPlan = useGameStore(s => s.menuPlan);
  const bulkBuyForPlan = useGameStore(s => s.bulkBuyForPlan);
  const riceStock = inventory['rice-raw'] || 0;
  const t = createT(language);

  const [plan, setPlan] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.entries(menuPlan).forEach(([dishId, qty]) => {
      if (qty > 0) {
        const dish = activeDishes.find(d => d.id === dishId);
        if (dish) {
          const max = maxServingsForDish(dish, inventory, initial, dishId);
          initial[dishId] = Math.min(qty, max);
        }
      }
    });
    return initial;
  });
  const [showCookbook, setShowCookbook] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const sortedDishes = [...activeDishes].sort((a, b) => {
    const maxA = maxServingsForDish(a, inventory, plan, a.id);
    const maxB = maxServingsForDish(b, inventory, plan, b.id);
    if (maxA > 0 && maxB <= 0) return -1;
    if (maxA <= 0 && maxB > 0) return 1;
    return maxB - maxA;
  });

  const plannedDishes = activeDishes.filter(d => (plan[d.id] || 0) > 0);

  const adjust = (dishId: string, delta: number) => {
    setPlan(prev => {
      const dish = activeDishes.find(d => d.id === dishId);
      if (!dish) return prev;
      const current = prev[dishId] || 0;
      const maxAvailable = maxServingsForDish(dish, inventory, prev, dishId);
      const next = Math.max(0, Math.min(current + delta, maxAvailable));
      return { ...prev, [dishId]: next };
    });
  };

  const totalServings = Object.values(plan).reduce((a, b) => a + b, 0);

  const getCostPerServing = (dish: Dish) =>
    dish.ingredients.reduce((sum, ing) => {
      const data = ingredientsData.find(i => i.id === ing.ingredientId);
      return sum + (data ? data.currentPrice * ing.quantity : 0);
    }, 0);

  const getEffectivePrice = (dish: Dish) => dishPrices[dish.id] || dish.sellingPrice;

  const projectedRevenue = Object.entries(plan).reduce((sum, [dishId, qty]) => {
    const dish = activeDishes.find(d => d.id === dishId);
    return sum + (dish ? getEffectivePrice(dish) * qty : 0);
  }, 0);

  const totalCost = Object.entries(plan).reduce((sum, [dishId, qty]) => {
    if (qty <= 0) return sum;
    const dish = activeDishes.find(d => d.id === dishId);
    return sum + (dish ? getCostPerServing(dish) * qty : 0);
  }, 0);

  const shortfallList = computeShoppingList(menuPlan, activeDishes, inventory, ingredientsData);
  const shortfallCost = shortfallList.reduce((s, item) => s + item.totalCost, 0);
  const hasShortfall = shortfallList.length > 0 && Object.values(menuPlan).some(v => v > 0);

  const handleBuyMissing = () => {
    bulkBuyForPlan(menuPlan);
    setShowBuyModal(false);
    setPlan(() => {
      const updated: Record<string, number> = {};
      const newInv = useGameStore.getState().inventory;
      Object.entries(menuPlan).forEach(([dishId, qty]) => {
        if (qty > 0) {
          const dish = activeDishes.find(d => d.id === dishId);
          if (dish) {
            const max = maxServingsForDish(dish, newInv, updated, dishId);
            updated[dishId] = Math.min(qty, max);
          }
        }
      });
      return updated;
    });
  };

  const handleContinue = () => {
    if (totalServings > 0 && riceStock === 0 && cookedRiceServings === 0) { setShowWarning(true); return; }
    doConfirm();
  };

  const doConfirm = () => {
    setShowWarning(false);
    const validPlan = Object.fromEntries(Object.entries(plan).filter(([_, qty]) => qty > 0));
    if (Object.keys(validPlan).length > 0) prepDishes(validPlan);
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🍳 {t('menu.title')}
          </h1>
          <p className="text-sm text-karinderya-wood/70 mt-1">{t('menu.subtitle')}</p>
        </div>
        <button onClick={() => setShowCookbook(true)}
          className="bg-karinderya-cream hover:bg-amber-100 text-karinderya-wood-dark font-semibold text-sm rounded-xl px-4 py-2 cursor-pointer transition-colors">
          📖 {t('common.cookbook')}
        </button>
      </div>

      {/* Buy Missing alert */}
      {hasShortfall && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-sm text-rose-800 flex items-center gap-2">
              ⚠️ {t('menu.missingIngredients')}
            </div>
            <div className="text-xs text-rose-600 mt-0.5">
              {t('menu.itemsShort', shortfallList.length)} · ₱{shortfallCost.toLocaleString()} {t('common.needed')}
            </div>
          </div>
          <button onClick={() => setShowBuyModal(true)} disabled={shortfallCost > cash}
            className="bg-rose-600 text-white font-bold text-sm rounded-xl px-4 py-2.5 cursor-pointer disabled:opacity-40 hover:bg-rose-500 active:scale-[0.97] transition-all shrink-0">
            🛒 {t('menu.buyMissing')}
          </button>
        </div>
      )}

      {/* Rice Cooker */}
      <div className={`rounded-xl p-4 ${riceStock === 0 && cookedRiceServings === 0 ? 'bg-rose-50 ring-2 ring-rose-300' : 'bg-karinderya-cream'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm text-karinderya-wood-dark flex items-center gap-2">
              🍚 {t('menu.riceCooker')}
              {isRiceCooking && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold animate-pulse">{t('menu.riceCooking')}</span>}
            </div>
            <div className="text-xs text-karinderya-wood/60 mt-1">
              {t('menu.cooked')}: {cookedRiceServings} servings · {t('menu.rawRice')}: {riceStock.toFixed(1)} kg
            </div>
            {riceStock === 0 && cookedRiceServings === 0 && (
              <div className="text-xs text-rose-600 font-bold mt-1">⚠️ {t('menu.noRice')}</div>
            )}
            {totalServings > 0 && cookedRiceServings < totalServings && riceStock > 0 && (
              <div className="text-xs text-amber-600 font-semibold mt-1">
                ⚠️ {t('menu.riceWarning', totalServings, cookedRiceServings)}
              </div>
            )}
          </div>
          <button onClick={cookRice} disabled={isRiceCooking || riceStock < 2}
            className="bg-amber-600 text-white font-semibold text-sm rounded-xl px-4 py-2 cursor-pointer disabled:opacity-40 hover:bg-amber-500 transition-colors">
            {t('menu.cookRice')}
          </button>
        </div>
      </div>

      {/* Dish Cards */}
      <div className="space-y-3">
        {sortedDishes.map(dish => {
          const qty = plan[dish.id] || 0;
          const maxAvailable = maxServingsForDish(dish, inventory, plan, dish.id);
          const canCookAny = maxAvailable > 0 || qty > 0;
          const cost = getCostPerServing(dish);
          const plannedInBriefing = (menuPlan[dish.id] || 0) > 0;

          return (
            <div key={dish.id} className={`rounded-xl p-4 transition-all ${canCookAny ? 'bg-karinderya-cream' : 'bg-karinderya-cream/50 opacity-60'} ${plannedInBriefing && canCookAny ? 'ring-2 ring-amber-300' : ''}`}>
              <div className="flex gap-3 items-start">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-xl shrink-0">🍽️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-karinderya-wood-dark flex items-center gap-2">
                    {dish.name}
                    {plannedInBriefing && (
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">📋 {t('menu.planned')}</span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs mt-0.5">
                    <span className="text-karinderya-wood/50">{t('common.cost')}: ₱{cost.toFixed(0)}</span>
                    <span className="text-amber-700">{t('common.sell')}: ₱{getEffectivePrice(dish)}</span>
                    <span className="text-emerald-700">{t('common.profit')}: ₱{(getEffectivePrice(dish) - cost).toFixed(0)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {dish.ingredients.map(ing => {
                      const data = ingredientsData.find(i => i.id === ing.ingredientId);
                      const stock = inventory[ing.ingredientId] || 0;
                      const hasEnough = stock >= ing.quantity;
                      return (
                        <span key={ing.ingredientId}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${hasEnough ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {data?.icon} {data?.shortName || ing.ingredientId}
                        </span>
                      );
                    })}
                  </div>
                  {!canCookAny && (
                    <div className="text-[10px] font-bold text-rose-600 mt-1">{t('menu.insufficient')}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => adjust(dish.id, -1)} disabled={qty === 0}
                    className="w-8 h-8 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                  <span className="w-8 text-center font-bold text-sm tabular-nums">{qty}</span>
                  <button onClick={() => adjust(dish.id, 1)} disabled={maxAvailable <= 0}
                    className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-amber-500 transition-colors">+</button>
                </div>
              </div>
              {canCookAny && (
                <div className="text-[10px] text-karinderya-wood/40 mt-1.5 text-right">max: {maxAvailable + qty} servings</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      {plannedDishes.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-karinderya-wood/50 uppercase mb-3">💰 {t('menu.setPrices')}</h2>
          <div className="space-y-2">
            {plannedDishes.map(dish => {
              const cost = getCostPerServing(dish);
              const price = getEffectivePrice(dish);
              const margin = ((price - cost) / price * 100);
              return (
                <div key={dish.id} className="bg-karinderya-cream rounded-xl p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-karinderya-wood-dark">{dish.name}</div>
                    <div className="text-[10px] text-karinderya-wood/50">
                      {t('menu.costLabel')}: ₱{cost.toFixed(0)} · {t('common.margin')}: {margin.toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-karinderya-wood/50">₱</span>
                    <button onClick={() => setDishPrice(dish.id, price - 5)}
                      className="w-7 h-7 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                    <span className="w-12 text-center font-bold text-lg tabular-nums text-amber-700">{price}</span>
                    <button onClick={() => setDishPrice(dish.id, price + 5)}
                      className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="bg-karinderya-wood-dark/5 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.servings')}</div>
            <div className="text-lg font-bold text-karinderya-wood-dark">{totalServings}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.revenue')}</div>
            <div className="text-lg font-bold text-emerald-700">₱{projectedRevenue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.profit')}</div>
            <div className="text-lg font-bold text-amber-700">₱{(projectedRevenue - totalCost).toFixed(0)}</div>
          </div>
        </div>
      </div>

      <button onClick={handleContinue}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
        {t('menu.nextButton')}
      </button>

      {showCookbook && <Cookbook language={language} onClose={() => setShowCookbook(false)} />}

      {/* No Rice Warning */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="text-4xl">🍚⚠️</div>
            <h3 className="text-lg font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {t('menu.noRiceTitle')}
            </h3>
            <p className="text-sm text-karinderya-wood/70">{t('menu.noRiceWarning')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowWarning(false)}
                className="flex-1 bg-karinderya-cream text-karinderya-wood-dark font-semibold rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
                {t('common.goBack')}
              </button>
              <button onClick={doConfirm}
                className="flex-1 bg-rose-600 text-white font-semibold rounded-xl px-4 py-3 cursor-pointer hover:bg-rose-500 transition-colors">
                {t('common.continueAnyway')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Missing Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-karinderya-wood-dark flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🛒 {t('menu.buyMissingTitle')}
            </h3>
            <p className="text-xs text-karinderya-wood/60">{t('menu.buyMissingDesc')}</p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
              {shortfallList.map(item => (
                <div key={item.ingredientId} className="flex items-center gap-2 bg-karinderya-cream rounded-lg px-3 py-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-semibold text-karinderya-wood-dark flex-1">{item.name}</span>
                  <span className="text-xs tabular-nums text-karinderya-wood/60">{item.toBuy} {item.unit}</span>
                  <span className="text-sm font-bold tabular-nums text-amber-700">₱{item.totalCost}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-karinderya-wood/10">
              <span className="font-bold text-sm text-karinderya-wood-dark">{t('common.total')}</span>
              <span className="font-bold text-lg text-amber-700">₱{shortfallCost.toLocaleString()}</span>
            </div>
            {shortfallCost > cash && (
              <div className="text-xs text-rose-600 font-bold">
                ⚠️ {t('menu.notEnoughMore', (shortfallCost - cash).toLocaleString())}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowBuyModal(false)}
                className="flex-1 bg-karinderya-cream text-karinderya-wood-dark font-semibold rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
                {t('common.cancel')}
              </button>
              <button onClick={handleBuyMissing} disabled={shortfallCost > cash}
                className="flex-1 bg-amber-600 text-white font-bold rounded-xl px-4 py-3 cursor-pointer disabled:opacity-40 hover:bg-amber-500 active:scale-[0.97] transition-all">
                {t('common.buy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
