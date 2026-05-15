import { useGameStore } from '../stores/gameStore';
import { RECIPE_BOOK } from '../data/recipeCatalog';
import { createT, type Language } from '../lib/i18n';

interface Props {
  language: Language;
  onClose: () => void;
}

export function Cookbook({ language, onClose }: Props) {
  const t = createT(language);
  const activeDishes = useGameStore(s => s.activeDishes);
  const ingredientsData = useGameStore(s => s.ingredientsData);
  const inventory = useGameStore(s => s.inventory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-karinderya-wood/10 shrink-0">
          <h2 className="text-xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            📖 {t('cookbook.title')}
          </h2>
          <button onClick={onClose} className="text-karinderya-wood/50 hover:text-karinderya-wood-dark text-xl font-bold cursor-pointer px-2">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {activeDishes.map(dish => {
            const recipeEntry = RECIPE_BOOK.find(r => r.dishId === dish.id);
            const costPerServing = dish.ingredients.reduce((sum, ing) => {
              const data = ingredientsData.find(i => i.id === ing.ingredientId);
              return sum + (data ? data.currentPrice * ing.quantity : 0);
            }, 0);

            return (
              <div key={dish.id} className="bg-karinderya-cream rounded-xl p-4">
                <div className="flex gap-3 mb-3">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-karinderya-wood/10 flex items-center justify-center text-2xl shrink-0">🍽️</div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-karinderya-wood-dark">{dish.name}</div>
                    {recipeEntry && <p className="text-xs text-karinderya-wood/60 mt-0.5 line-clamp-2">{recipeEntry.description}</p>}
                    <div className="flex gap-3 mt-1.5 text-xs font-semibold">
                      <span className="text-amber-700">{t('cookbook.sellLabel')}: ₱{dish.sellingPrice}</span>
                      <span className="text-karinderya-wood/60">{t('cookbook.costLabel')}: ₱{costPerServing.toFixed(0)}</span>
                      <span className="text-emerald-700">{t('cookbook.profitLabel')}: ₱{(dish.sellingPrice - costPerServing).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-karinderya-wood/40 uppercase mb-1.5">
                  {t('cookbook.ingredientsPerServing')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map(ing => {
                    const data = ingredientsData.find(i => i.id === ing.ingredientId);
                    const stock = inventory[ing.ingredientId] || 0;
                    const hasEnough = stock >= ing.quantity;
                    return (
                      <div key={ing.ingredientId}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${
                          hasEnough ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                        <span>{data?.icon || '?'}</span>
                        <span>{data?.shortName || ing.ingredientId}</span>
                        <span className="opacity-60">{ing.quantity}{data?.unit ? ` ${data.unit}` : ''}</span>
                        <span className="opacity-40">({t('common.stock').toLowerCase()}: {stock.toFixed(2)})</span>
                      </div>
                    );
                  })}
                </div>

                {recipeEntry && (
                  <details className="mt-3">
                    <summary className="text-[10px] font-bold text-karinderya-wood/40 uppercase cursor-pointer hover:text-karinderya-wood/60">
                      {t('cookbook.realRecipe')}
                    </summary>
                    <ul className="mt-1.5 text-xs text-karinderya-wood/70 space-y-0.5 pl-4">
                      {recipeEntry.realIngredients.map((ri, i) => (
                        <li key={i} className="list-disc">{ri}</li>
                      ))}
                    </ul>
                    {recipeEntry.cookingTip && (
                      <p className="mt-2 text-xs text-amber-800 italic bg-amber-50 rounded-lg px-3 py-2">
                        💡 {recipeEntry.cookingTip}
                      </p>
                    )}
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
