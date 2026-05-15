import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
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
  const prepDishes = useGameStore(s => s.prepDishes);
  const cookedRiceServings = useGameStore(s => s.cookedRiceServings);
  const cookRice = useGameStore(s => s.cookRice);
  const isRiceCooking = useGameStore(s => s.isRiceCooking);
  const cash = useGameStore(s => s.cash);
  const buyIngredient = useGameStore(s => s.buyIngredient);
  const menuPlan = useGameStore(s => s.menuPlan);
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
  const [showBuyBigas, setShowBuyBigas] = useState(false);
  const [bigasQty, setBigasQty] = useState(2);

  // Compute remaining inventory after plan deductions
  const remainingInventory: Record<string, number> = {};
  Object.entries(inventory).forEach(([id, qty]) => { remainingInventory[id] = qty; });
  Object.entries(plan).forEach(([dishId, servings]) => {
    if (servings <= 0) return;
    const dish = activeDishes.find(d => d.id === dishId);
    dish?.ingredients.forEach(ing => {
      remainingInventory[ing.ingredientId] = (remainingInventory[ing.ingredientId] || 0) - ing.quantity * servings;
    });
  });

  // Split dishes
  const cookableDishes: Dish[] = [];
  const uncookableDishes: Dish[] = [];
  activeDishes.forEach(dish => {
    const max = maxServingsForDish(dish, inventory, plan, dish.id);
    const hasPlan = (plan[dish.id] || 0) > 0;
    if (max > 0 || hasPlan) cookableDishes.push(dish);
    else uncookableDishes.push(dish);
  });

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

  const bigasData = ingredientsData.find(i => i.id === 'rice-raw');
  const bigasPrice = bigasData?.currentPrice || 0;

  const handleBuyBigas = () => {
    if (bigasData && bigasQty > 0 && bigasPrice * bigasQty <= cash) {
      buyIngredient('rice-raw', bigasQty, bigasPrice);
      setShowBuyBigas(false);
      setBigasQty(2);
    }
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

  // Pantry items
  const pantryItems = ingredientsData
    .filter(i => (inventory[i.id] || 0) > 0)
    .map(i => ({
      id: i.id,
      icon: i.icon,
      name: i.shortName || i.name,
      unit: i.unit,
      total: inventory[i.id] || 0,
      remaining: remainingInventory[i.id] || 0,
    }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-5">
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

      <div className="flex gap-5">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Rice Cooker */}
          <div className={`rounded-xl p-4 ${riceStock === 0 && cookedRiceServings === 0 ? 'bg-rose-50 ring-2 ring-rose-300' : 'bg-karinderya-cream'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-karinderya-wood-dark flex items-center gap-2">
                  🍚 {t('menu.riceCooker')}
                  {isRiceCooking && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold animate-pulse">{t('menu.riceCooking')}</span>}
                  {!isRiceCooking && cookedRiceServings > 0 && <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">{t('menu.riceDone')}</span>}
                  {!isRiceCooking && cookedRiceServings === 0 && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">{t('menu.riceEmpty')}</span>}
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
              <div className="flex gap-2 shrink-0">
                {riceStock === 0 && (
                  <button onClick={() => setShowBuyBigas(true)}
                    className="bg-rose-600 text-white font-semibold text-xs rounded-xl px-3 py-2 cursor-pointer hover:bg-rose-500 transition-colors">
                    🛒 {t('menu.buyBigas')}
                  </button>
                )}
                <button onClick={cookRice} disabled={isRiceCooking || riceStock < 2}
                  className="bg-amber-600 text-white font-semibold text-sm rounded-xl px-4 py-2 cursor-pointer disabled:opacity-40 hover:bg-amber-500 transition-colors">
                  {t('menu.cookRice')}
                </button>
              </div>
            </div>
          </div>

          {/* Cookable Dishes */}
          {cookableDishes.length === 0 && (
            <div className="bg-karinderya-cream/50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🫕</div>
              <div className="font-bold text-sm text-karinderya-wood/50">{t('menu.noCookable')}</div>
            </div>
          )}

          <div className="space-y-3">
            {cookableDishes.map(dish => {
              const qty = plan[dish.id] || 0;
              const maxAvailable = maxServingsForDish(dish, inventory, plan, dish.id);
              const cost = getCostPerServing(dish);

              return (
                <div key={dish.id} className="rounded-xl p-4 bg-karinderya-cream">
                  <div className="flex gap-3 items-center">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-xl shrink-0">🍽️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-karinderya-wood-dark">{dish.name}</div>
                      <div className="text-[10px] text-karinderya-wood/50">
                        ₱{cost.toFixed(0)} {t('common.cost')}/serving · max {maxAvailable + qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => adjust(dish.id, -1)} disabled={qty === 0}
                        className="w-8 h-8 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                      <span className="w-8 text-center font-bold text-sm tabular-nums">{qty}</span>
                      <button onClick={() => adjust(dish.id, 1)} disabled={maxAvailable <= 0}
                        className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-amber-500 transition-colors">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Uncookable Dishes */}
          {uncookableDishes.length > 0 && (
            <details className="group">
              <summary className="text-xs font-bold text-karinderya-wood/40 uppercase cursor-pointer hover:text-karinderya-wood/60 flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                {t('menu.uncookableLabel')} ({uncookableDishes.length})
              </summary>
              <div className="mt-2 space-y-2">
                {uncookableDishes.map(dish => (
                  <div key={dish.id} className="rounded-xl p-3 bg-karinderya-cream/40 opacity-50 flex gap-3 items-center">
                    {dish.imageUrl ? (
                      <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 rounded-lg object-cover shrink-0 grayscale" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-lg shrink-0">🍽️</div>
                    )}
                    <span className="font-semibold text-sm text-karinderya-wood/50 truncate">{dish.name}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Total */}
          <div className="bg-karinderya-wood-dark/5 rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.servings')}</div>
            <div className="text-2xl font-bold text-karinderya-wood-dark">{totalServings}</div>
          </div>

          <button onClick={handleContinue}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
            {t('menu.nextButton2')}
          </button>
        </div>

        {/* Pantry Sidebar */}
        {pantryItems.length > 0 && (
          <div className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-6 bg-karinderya-cream rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-karinderya-wood/50 uppercase flex items-center gap-1.5">
                🗄️ {t('menu.pantry')}
              </h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {pantryItems.map(item => {
                  const depleted = item.remaining <= 0 && item.total > 0;
                  const partial = item.remaining < item.total && item.remaining > 0;
                  return (
                    <div key={item.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${depleted ? 'bg-rose-100' : partial ? 'bg-amber-50' : 'bg-white/60'}`}>
                      <span className="text-sm">{item.icon}</span>
                      <span className="flex-1 font-semibold text-karinderya-wood-dark truncate">{item.name}</span>
                      <span className={`tabular-nums font-bold ${depleted ? 'text-rose-600' : partial ? 'text-amber-600' : 'text-karinderya-wood/60'}`}>
                        {item.remaining.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

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

      {/* Buy Bigas Modal */}
      {showBuyBigas && bigasData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-xs p-6 space-y-4">
            <h3 className="text-lg font-bold text-karinderya-wood-dark flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🍚 {t('menu.buyBigasTitle')}
            </h3>
            <p className="text-xs text-karinderya-wood/60">{t('menu.buyBigasDesc')}</p>
            <div className="text-center">
              <div className="text-sm font-bold text-amber-700">₱{bigasPrice}/kg</div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setBigasQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-xl flex items-center justify-center cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
              <div className="text-center">
                <div className="text-3xl font-bold text-karinderya-wood-dark tabular-nums">{bigasQty}</div>
                <div className="text-[10px] text-karinderya-wood/50">kg</div>
              </div>
              <button onClick={() => setBigasQty(q => q + 1)} disabled={bigasPrice * (bigasQty + 1) > cash}
                className="w-10 h-10 rounded-lg bg-amber-600 text-white font-bold text-xl flex items-center justify-center cursor-pointer disabled:opacity-30 hover:bg-amber-500 transition-colors">+</button>
            </div>
            <div className="text-center text-sm font-bold text-amber-700">
              {t('common.total')}: ₱{(bigasPrice * bigasQty).toLocaleString()}
            </div>
            {bigasPrice * bigasQty > cash && (
              <div className="text-xs text-rose-600 font-bold text-center">⚠️ {t('common.notEnoughBudget')}</div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowBuyBigas(false)}
                className="flex-1 bg-karinderya-cream text-karinderya-wood-dark font-semibold rounded-xl px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
                {t('common.cancel')}
              </button>
              <button onClick={handleBuyBigas} disabled={bigasPrice * bigasQty > cash}
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
