import { useState } from 'react';
import { useGameStore, computeShoppingList } from '../../stores/gameStore';
import { Cookbook } from '../Cookbook';
import { createT, CATEGORIES, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function Palengke({ language, onNext }: Props) {
  const cash = useGameStore(s => s.cash);
  const ingredientsData = useGameStore(s => s.ingredientsData);
  const inventory = useGameStore(s => s.inventory);
  const activeDishes = useGameStore(s => s.activeDishes);
  const buyIngredient = useGameStore(s => s.buyIngredient);
  const menuPlan = useGameStore(s => s.menuPlan);
  const bulkBuyForPlan = useGameStore(s => s.bulkBuyForPlan);
  const t = createT(language);
  const [filter, setFilter] = useState('ALL');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCookbook, setShowCookbook] = useState(false);
  const [showList, setShowList] = useState(true);

  const hasPlan = Object.values(menuPlan).some(v => v > 0);
  const shoppingList = computeShoppingList(menuPlan, activeDishes, inventory, ingredientsData);
  const shoppingCost = shoppingList.reduce((s, item) => s + item.totalCost, 0);
  const neededMap = new Map(shoppingList.map(item => [item.ingredientId, item]));

  const filtered = filter === 'ALL' ? ingredientsData : ingredientsData.filter(i => i.category === filter);

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const ing = ingredientsData.find(i => i.id === id);
    return sum + (ing ? ing.currentPrice * qty : 0);
  }, 0);

  const dishesUsingIngredient = (ingId: string): string[] =>
    activeDishes.filter(d => d.ingredients.some(i => i.ingredientId === ingId)).map(d => d.name);

  const addToCart = (id: string) => {
    const ing = ingredientsData.find(i => i.id === id);
    if (!ing || cartTotal + ing.currentPrice > cash) return;
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: newQty };
    });
  };

  const checkout = () => {
    Object.entries(cart).forEach(([id, qty]) => {
      const ing = ingredientsData.find(i => i.id === id);
      if (ing && qty > 0) buyIngredient(id, qty, ing.currentPrice);
    });
    setCart({});
    onNext();
  };

  const handleBulkBuy = () => { bulkBuyForPlan(); setShowList(false); };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🛒 {t('palengke.title')}
          </h1>
          <p className="text-sm text-karinderya-wood/70 mt-1">{t('palengke.subtitle')}</p>
        </div>
        <div className="flex items-start gap-3">
          <button onClick={() => setShowCookbook(true)}
            className="bg-karinderya-cream hover:bg-amber-100 text-karinderya-wood-dark font-semibold text-sm rounded-xl px-4 py-2 cursor-pointer transition-colors">
            📖 {t('common.cookbook')}
          </button>
          <div className="text-right">
            <div className="text-xs font-bold text-karinderya-wood/50 uppercase">{t('common.budget')}</div>
            <div className="text-xl font-bold text-amber-700">₱{(cash - cartTotal).toLocaleString()}</div>
            {cartTotal > 0 && <div className="text-xs text-rose-600 font-semibold">-₱{cartTotal.toLocaleString()}</div>}
          </div>
        </div>
      </div>

      {/* Shopping List from Plan */}
      {hasPlan && shoppingList.length > 0 && showList && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span className="font-bold text-sm text-amber-900">{t('palengke.shoppingListTitle')}</span>
            </div>
            <button onClick={() => setShowList(false)} className="text-xs text-amber-600 hover:text-amber-800 cursor-pointer">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {shoppingList.map(item => (
              <div key={item.ingredientId} className="flex items-center gap-2 bg-white/70 rounded-lg px-2.5 py-1.5">
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-semibold text-karinderya-wood-dark flex-1 truncate">{item.name}</span>
                <span className="text-xs tabular-nums text-amber-700 font-bold">{item.toBuy} {item.unit}</span>
                <span className="text-[10px] tabular-nums text-karinderya-wood/50">₱{item.totalCost}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-amber-200">
            <div className="text-sm font-bold text-amber-900">{t('common.total')}: ₱{shoppingCost.toLocaleString()}</div>
            <button onClick={handleBulkBuy} disabled={shoppingCost > cash}
              className="bg-amber-600 text-white font-bold text-sm rounded-xl px-5 py-2.5 cursor-pointer disabled:opacity-40 hover:bg-amber-500 active:scale-[0.97] transition-all">
              🛒 {t('palengke.buyAll')} — ₱{shoppingCost.toLocaleString()}
            </button>
          </div>
          {shoppingCost > cash && (
            <div className="text-[10px] text-rose-600 font-bold text-right">⚠️ {t('common.notEnoughBudget')}</div>
          )}
        </div>
      )}

      {hasPlan && shoppingList.length === 0 && showList && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-bold text-sm text-emerald-800">{t('palengke.allStocked')}</div>
            <div className="text-xs text-emerald-600">{t('palengke.allStockedDesc')}</div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(key => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === key ? 'bg-amber-600 text-white' : 'bg-karinderya-cream text-karinderya-wood hover:bg-amber-100'
            }`}>
            {t(`cat.${key}`)}
          </button>
        ))}
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(ing => {
          const qty = cart[ing.id] || 0;
          const stock = inventory[ing.id] || 0;
          const usedBy = dishesUsingIngredient(ing.id);
          const needed = neededMap.get(ing.id);
          return (
            <div key={ing.id} className={`rounded-xl p-4 transition-all ${needed ? 'bg-amber-50 ring-2 ring-amber-300' : 'bg-karinderya-cream'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ing.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-karinderya-wood-dark truncate flex items-center gap-2">
                    {ing.shortName || ing.name}
                    {needed && (
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        📋 {needed.toBuy} {ing.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-karinderya-wood/60">{t('common.stock')}: {stock.toFixed(1)} {ing.unit || ''}</div>
                  <div className="font-bold text-amber-700 text-sm mt-0.5">₱{ing.currentPrice}/{ing.unit || 'ea'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(ing.id)} disabled={qty === 0}
                    className="w-8 h-8 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                  <span className="w-6 text-center font-bold text-sm tabular-nums">{qty}</span>
                  <button onClick={() => addToCart(ing.id)} disabled={cartTotal + ing.currentPrice > cash}
                    className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-amber-500 transition-colors">+</button>
                </div>
              </div>
              {usedBy.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {usedBy.map(name => (
                    <span key={name} className="text-[10px] font-semibold bg-karinderya-wood-dark/8 text-karinderya-wood/70 px-1.5 py-0.5 rounded">{name}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart & Checkout */}
      <div className="bg-karinderya-wood-dark/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-karinderya-wood-dark">{t('palengke.cartTotal')}</span>
          <span className="font-bold text-lg text-amber-700">₱{cartTotal.toLocaleString()}</span>
        </div>
        <button onClick={checkout}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
          {t('palengke.nextButton')}
        </button>
      </div>

      {showCookbook && <Cookbook language={language} onClose={() => setShowCookbook(false)} />}
    </div>
  );
}
