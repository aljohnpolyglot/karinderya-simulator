import { useGameStore } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function PricingPhase({ language, onNext }: Props) {
  const preparedDishes = useGameStore(s => s.preparedDishes);
  const activeDishes = useGameStore(s => s.activeDishes);
  const ingredientsData = useGameStore(s => s.ingredientsData);
  const dishPrices = useGameStore(s => s.dishPrices);
  const setDishPrice = useGameStore(s => s.setDishPrice);
  const t = createT(language);

  const preppedDishes = activeDishes.filter(d => (preparedDishes[d.id]?.servings || 0) > 0);

  const getCostPerServing = (dish: typeof activeDishes[0]) =>
    dish.ingredients.reduce((sum, ing) => {
      const data = ingredientsData.find(i => i.id === ing.ingredientId);
      return sum + (data ? data.currentPrice * ing.quantity : 0);
    }, 0);

  const getPrice = (dish: typeof activeDishes[0]) => dishPrices[dish.id] || dish.sellingPrice;

  const totalRevenue = preppedDishes.reduce((sum, dish) => {
    return sum + getPrice(dish) * (preparedDishes[dish.id]?.servings || 0);
  }, 0);

  const totalCost = preppedDishes.reduce((sum, dish) => {
    return sum + getCostPerServing(dish) * (preparedDishes[dish.id]?.servings || 0);
  }, 0);

  if (preppedDishes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <div className="text-4xl">💰</div>
        <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {t('pricing.title')}
        </h1>
        <p className="text-sm text-karinderya-wood/60">{t('pricing.noPrepped')}</p>
        <button onClick={onNext}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 cursor-pointer">
          {t('pricing.nextButton')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          💰 {t('pricing.title')}
        </h1>
        <p className="text-sm text-karinderya-wood/70 mt-1">{t('pricing.subtitle')}</p>
      </div>

      {/* Dish Price Cards */}
      <div className="space-y-3">
        {preppedDishes.map(dish => {
          const cost = getCostPerServing(dish);
          const price = getPrice(dish);
          const margin = ((price - cost) / price * 100);
          const servings = preparedDishes[dish.id]?.servings || 0;
          const projectedRevenue = price * servings;
          const projectedProfit = (price - cost) * servings;

          return (
            <div key={dish.id} className="bg-karinderya-cream rounded-xl p-4 space-y-3">
              <div className="flex gap-3 items-center">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-xl shrink-0">🍽️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-karinderya-wood-dark">{dish.name}</div>
                  <div className="text-[10px] text-karinderya-wood/50">
                    {servings} servings · {t('menu.costLabel')}: ₱{cost.toFixed(0)}/serving
                  </div>
                </div>
              </div>

              {/* Price Slider */}
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDishPrice(dish.id, price - 5)}
                  className="w-9 h-9 rounded-lg bg-karinderya-wood-dark/10 text-karinderya-wood-dark font-bold text-lg flex items-center justify-center cursor-pointer hover:bg-karinderya-wood-dark/20 transition-colors">−</button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700 tabular-nums">₱{price}</div>
                  <div className={`text-[10px] font-bold ${margin >= 30 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {t('common.margin')}: {margin.toFixed(0)}%
                  </div>
                </div>
                <button onClick={() => setDishPrice(dish.id, price + 5)}
                  className="w-9 h-9 rounded-lg bg-amber-600 text-white font-bold text-lg flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors">+</button>
              </div>

              {/* Projected */}
              <div className="flex justify-between text-xs bg-white/50 rounded-lg px-3 py-2">
                <span className="text-karinderya-wood/50">{t('common.revenue')}: <span className="font-bold text-karinderya-wood-dark">₱{projectedRevenue.toLocaleString()}</span></span>
                <span className={`font-bold ${projectedProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {t('common.profit')}: ₱{projectedProfit.toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-karinderya-wood-dark/5 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.revenue')}</div>
            <div className="text-lg font-bold text-emerald-700">₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{t('common.profit')}</div>
            <div className="text-lg font-bold text-amber-700">₱{(totalRevenue - totalCost).toFixed(0)}</div>
          </div>
        </div>
      </div>

      <button onClick={onNext}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
        {t('pricing.nextButton')}
      </button>
    </div>
  );
}
