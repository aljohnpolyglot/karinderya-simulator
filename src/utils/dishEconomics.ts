import { Dish, Ingredient } from '../types/game';

/**
 * Compute the puhunan (ingredient cost) per serving of a dish,
 * based on current market prices.
 */
export const computeDishCost = (dish: Dish, ingredients: Ingredient[]): number => {
  return dish.ingredients.reduce((sum, ing) => {
    const item = ingredients.find(i => i.id === ing.ingredientId);
    if (!item) return sum;
    return sum + item.currentPrice * ing.quantity;
  }, 0);
};

/**
 * Recommended selling price = cost × markup.
 * Default markup is 2.5x (industry standard for affordable food).
 */
export const recommendedPrice = (dish: Dish, ingredients: Ingredient[], markup = 2.5): number => {
  const cost = computeDishCost(dish, ingredients);
  return Math.round(cost * markup / 5) * 5; // round to nearest ₱5
};

/**
 * Get the effective selling price for a dish.
 * Returns player override if set, otherwise dish.sellingPrice.
 */
export const effectivePrice = (dish: Dish, prices: Record<string, number>): number =>
  prices[dish.id] ?? dish.sellingPrice;

/**
 * Profit per serving at the current price (after ingredient cost).
 */
export const profitPerServing = (
  dish: Dish, ingredients: Ingredient[], prices: Record<string, number>
): number => effectivePrice(dish, prices) - computeDishCost(dish, ingredients);

/**
 * Profit margin as percentage of selling price.
 */
export const profitMargin = (
  dish: Dish, ingredients: Ingredient[], prices: Record<string, number>
): number => {
  const price = effectivePrice(dish, prices);
  if (price <= 0) return 0;
  return profitPerServing(dish, ingredients, prices) / price;
};

/**
 * Max servings possible from current inventory.
 */
export const maxServingsFromInventory = (
  dish: Dish, inventory: Record<string, number>
): number => {
  return dish.ingredients.reduce((min, ing) => {
    const available = inventory[ing.ingredientId] || 0;
    const possible = Math.floor(available / ing.quantity);
    return Math.min(min, possible);
  }, Infinity);
};
