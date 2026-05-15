import { useState } from 'react';
import { useGameStore, computeShoppingList } from '../../stores/gameStore';
import { Cookbook } from '../Cookbook';
import { MenuPlanModal } from '../modals/MenuPlanModal';
import { ReceiptModal } from '../modals/ReceiptModal';
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
  const setMenuPlan = useGameStore(s => s.setMenuPlan);
  const bulkBuyForPlan = useGameStore(s => s.bulkBuyForPlan);
  const t = createT(language);

  const [showPlanModal, setShowPlanModal] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{ items: ReturnType<typeof computeShoppingList>; totalCost: number } | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCookbook, setShowCookbook] = useState(false);

  const hasPlan = Object.values(menuPlan).some(v => v > 0);
  const shoppingList = computeShoppingList(menuPlan, activeDishes, inventory, ingredientsData);
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

  const handleAutoBuy = (plan: Record<string, number>, extraRiceKg: number) => {
    setMenuPlan(plan);
    const list = computeShoppingList(plan, activeDishes, inventory, ingredientsData);
    const bigasData = ingredientsData.find(i => i.id === 'rice-raw');
    const bigasPrice = bigasData?.currentPrice || 0;

    // Buy rice first if requested
    if (extraRiceKg > 0 && bigasData) {
      buyIngredient('rice-raw', extraRiceKg, bigasPrice);
    }

    // Build receipt items (rice + ingredients)
    const receiptItems = [...list];
    if (extraRiceKg > 0) {
      receiptItems.unshift({
        ingredientId: 'rice-raw',
        icon: '🍚',
        name: 'Bigas',
        unit: 'kg',
        needed: extraRiceKg,
        inStock: 0,
        toBuy: extraRiceKg,
        unitCost: bigasPrice,
        totalCost: extraRiceKg * bigasPrice,
      });
    }

    const totalCost = receiptItems.reduce((s, item) => s + item.totalCost, 0);

    if (list.length === 0 && extraRiceKg === 0) {
      setShowPlanModal(false);
      return;
    }

    // Buy ingredients
    if (list.length > 0) bulkBuyForPlan(plan);

    setReceiptData({ items: receiptItems, totalCost });
    setShowPlanModal(false);
    setShowReceipt(true);
  };

  const handleManual = (plan: Record<string, number>, extraRiceKg: number) => {
    setMenuPlan(plan);
    // Buy rice even in manual mode since they explicitly asked for it
    if (extraRiceKg > 0) {
      const bigasData = ingredientsData.find(i => i.id === 'rice-raw');
      if (bigasData) buyIngredient('rice-raw', extraRiceKg, bigasData.currentPrice);
    }
    setShowPlanModal(false);
  };

  const handleSkip = () => {
    setShowPlanModal(false);
  };

  const handleReceiptConfirm = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

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

      {/* Shopping List reminder (after auto-buy or manual plan) */}
      {!showPlanModal && hasPlan && shoppingList.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="font-bold text-sm text-amber-900">{t('palengke.shoppingListTitle')}</span>
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
        </div>
      )}

      {!showPlanModal && hasPlan && shoppingList.length === 0 && (
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
      {showPlanModal && (
        <MenuPlanModal language={language} onAutoBuy={handleAutoBuy} onManual={handleManual} onSkip={handleSkip} />
      )}
      {showReceipt && receiptData && (
        <ReceiptModal language={language} items={receiptData.items} totalCost={receiptData.totalCost} remainingCash={cash} onConfirm={handleReceiptConfirm} />
      )}
    </div>
  );
}
