
import { Ingredient, Dish, Staff } from '../types/game';

const RECIPE_IMG = (id: string) => `https://assets.unileversolutions.com/recipes-v3/${id}-default.jpg`;

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // === PROTEINS ===
  { id: 'pork', name: 'Pork Liempo / Pigue', shortName: 'Baboy', icon: '🥓', category: 'MEAT', basePrice: 320, currentPrice: 320, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'beef', name: 'Beef Sirloin / Tapa Cut', shortName: 'Baka', icon: '🥩', category: 'MEAT', basePrice: 450, currentPrice: 450, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'chicken', name: 'Manok (Whole Cut)', shortName: 'Manok', icon: '🐔', category: 'MEAT', basePrice: 200, currentPrice: 200, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'bangus', name: 'Boneless Bangus', shortName: 'Bangus', icon: '🐟', category: 'MEAT', basePrice: 220, currentPrice: 220, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'hipon', name: 'Fresh Shrimp', shortName: 'Hipon', icon: '🦐', category: 'MEAT', basePrice: 380, currentPrice: 380, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'atay-manok', name: 'Chicken Liver', shortName: 'Atay', icon: '🫘', category: 'MEAT', basePrice: 150, currentPrice: 150, stock: 0, freshness: 1, unit: 'kg' },

  // === STAPLES ===
  { id: 'rice-raw', name: 'Sinandomeng Rice', shortName: 'Bigas', icon: '🍚', category: 'STAPLE', basePrice: 55, currentPrice: 55, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'asukal', name: 'Brown Sugar', shortName: 'Asukal', icon: '🟤', category: 'STAPLE', basePrice: 60, currentPrice: 60, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'cooking-oil', name: 'Cooking Oil', shortName: 'Mantika', icon: '🫗', category: 'STAPLE', basePrice: 65, currentPrice: 65, stock: 0, freshness: 1, unit: 'L' },

  // === VEGETABLES ===
  { id: 'sibuyas', name: 'Sibuyas (Onion)', shortName: 'Sibuyas', icon: '🧅', category: 'VEGGIE', basePrice: 80, currentPrice: 80, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'bawang', name: 'Bawang (Garlic)', shortName: 'Bawang', icon: '🧄', category: 'VEGGIE', basePrice: 120, currentPrice: 120, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'kamatis', name: 'Kamatis (Tomato)', shortName: 'Kamatis', icon: '🍅', category: 'VEGGIE', basePrice: 60, currentPrice: 60, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'kangkong', name: 'Kangkong (Water Spinach)', shortName: 'Kangkong', icon: '🥬', category: 'VEGGIE', basePrice: 20, currentPrice: 20, stock: 0, freshness: 1, unit: 'bundle' },
  { id: 'sitaw', name: 'Sitaw (String Beans)', shortName: 'Sitaw', icon: '🫛', category: 'VEGGIE', basePrice: 25, currentPrice: 25, stock: 0, freshness: 1, unit: 'bundle' },
  { id: 'talong', name: 'Talong (Eggplant)', shortName: 'Talong', icon: '🍆', category: 'VEGGIE', basePrice: 40, currentPrice: 40, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'labanos', name: 'Labanos (Radish)', shortName: 'Labanos', icon: '🥕', category: 'VEGGIE', basePrice: 35, currentPrice: 35, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'okra', name: 'Okra', shortName: 'Okra', icon: '🟢', category: 'VEGGIE', basePrice: 30, currentPrice: 30, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'sili', name: 'Siling Pangsigang', shortName: 'Sili', icon: '🌶️', category: 'VEGGIE', basePrice: 15, currentPrice: 15, stock: 0, freshness: 1, unit: 'pack' },
  { id: 'calamansi', name: 'Calamansi', shortName: 'Calamansi', icon: '🍋', category: 'VEGGIE', basePrice: 30, currentPrice: 30, stock: 0, freshness: 1, unit: 'pack' },
  { id: 'luya', name: 'Luya (Ginger)', shortName: 'Luya', icon: '🫚', category: 'VEGGIE', basePrice: 50, currentPrice: 50, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'patatas', name: 'Patatas (Potato)', shortName: 'Patatas', icon: '🥔', category: 'VEGGIE', basePrice: 45, currentPrice: 45, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'carrots', name: 'Carrots', shortName: 'Karot', icon: '🥕', category: 'VEGGIE', basePrice: 50, currentPrice: 50, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'sayote', name: 'Sayote (Chayote)', shortName: 'Sayote', icon: '🟩', category: 'VEGGIE', basePrice: 25, currentPrice: 25, stock: 0, freshness: 1, unit: 'pc' },
  { id: 'kalabasa', name: 'Kalabasa (Squash)', shortName: 'Kalabasa', icon: '🎃', category: 'VEGGIE', basePrice: 35, currentPrice: 35, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'ampalaya', name: 'Ampalaya (Bitter Gourd)', shortName: 'Ampalaya', icon: '🥒', category: 'VEGGIE', basePrice: 40, currentPrice: 40, stock: 0, freshness: 1, unit: 'kg' },
  { id: 'malunggay', name: 'Malunggay (Moringa)', shortName: 'Malunggay', icon: '🌿', category: 'VEGGIE', basePrice: 10, currentPrice: 10, stock: 0, freshness: 1, unit: 'bundle' },
  { id: 'papaya-green', name: 'Green Papaya', shortName: 'Papaya', icon: '🟢', category: 'VEGGIE', basePrice: 30, currentPrice: 30, stock: 0, freshness: 1, unit: 'pc' },

  // === CONDIMENTS ===
  { id: 'toyo', name: 'Toyo (Soy Sauce)', shortName: 'Toyo', icon: '🫙', category: 'CONDIMENT', basePrice: 35, currentPrice: 35, stock: 0, freshness: 1, unit: 'bottle' },
  { id: 'suka', name: 'Suka (Vinegar)', shortName: 'Suka', icon: '🫙', category: 'CONDIMENT', basePrice: 30, currentPrice: 30, stock: 0, freshness: 1, unit: 'bottle' },
  { id: 'patis', name: 'Patis (Fish Sauce)', shortName: 'Patis', icon: '🫙', category: 'CONDIMENT', basePrice: 35, currentPrice: 35, stock: 0, freshness: 1, unit: 'bottle' },
  { id: 'sinigang-mix', name: 'Sinigang Mix (Sampalok)', shortName: 'Sinigang Mix', icon: '📦', category: 'CONDIMENT', basePrice: 15, currentPrice: 15, stock: 0, freshness: 1, unit: 'pack' },
  { id: 'bagoong', name: 'Bagoong Alamang', shortName: 'Bagoong', icon: '🫙', category: 'CONDIMENT', basePrice: 45, currentPrice: 45, stock: 0, freshness: 1, unit: 'jar' },
  { id: 'tomato-sauce', name: 'Tomato Sauce', shortName: 'Sarsa', icon: '🥫', category: 'CONDIMENT', basePrice: 25, currentPrice: 25, stock: 0, freshness: 1, unit: 'can' },
  { id: 'laurel', name: 'Laurel / Bay Leaves', shortName: 'Laurel', icon: '🍃', category: 'CONDIMENT', basePrice: 10, currentPrice: 10, stock: 0, freshness: 1, unit: 'pack' },
  { id: 'paminta', name: 'Black Pepper', shortName: 'Paminta', icon: '⚫', category: 'CONDIMENT', basePrice: 15, currentPrice: 15, stock: 0, freshness: 1, unit: 'pack' },

  // === MISC ===
  { id: 'coconut-milk', name: 'Gata (Coconut Milk)', shortName: 'Gata', icon: '🥥', category: 'MISC', basePrice: 70, currentPrice: 70, stock: 0, freshness: 1, unit: 'pack' },
];

// Quantities are PER SERVING, based on real recipes from recipes.json
// Pork Adobo: 0.5kg pork / 4 servings = 0.125kg per serving
// Sinigang: 1kg pork / 5 servings = 0.2kg per serving, veggies split across 5
// Sisig: 2kg pork / 4 servings = 0.5kg per serving (heavy dish!)
// Tapa: 1kg beef / 4 servings = 0.25kg per serving
// Bangus: 0.5kg bangus / 4 servings = 0.125kg per serving

export const INITIAL_DISHES: Dish[] = [
  {
    id: 'pork-adobo',
    name: 'Pork Adobo',
    recipeId: '110231',
    imageUrl: RECIPE_IMG('110231'),
    ingredients: [
      { ingredientId: 'pork', quantity: 0.125 },
      { ingredientId: 'bawang', quantity: 0.01 },
      { ingredientId: 'sibuyas', quantity: 0.035 },
      { ingredientId: 'toyo', quantity: 0.05 },
      { ingredientId: 'suka', quantity: 0.03 },
      { ingredientId: 'laurel', quantity: 0.02 },
      { ingredientId: 'paminta', quantity: 0.01 },
    ],
    sellingPrice: 95,
    popularity: 0.9,
    prepDifficulty: 0.3,
    holdingStability: 0.9,
    targetDemographics: ['Office', 'Worker', 'Family'],
  },
  {
    id: 'sinigang-pork',
    name: 'Sinigang na Baboy',
    recipeId: '110188',
    imageUrl: RECIPE_IMG('110188'),
    ingredients: [
      { ingredientId: 'pork', quantity: 0.2 },
      { ingredientId: 'sibuyas', quantity: 0.05 },
      { ingredientId: 'kamatis', quantity: 0.06 },
      { ingredientId: 'kangkong', quantity: 0.2 },
      { ingredientId: 'sitaw', quantity: 0.1 },
      { ingredientId: 'labanos', quantity: 0.06 },
      { ingredientId: 'okra', quantity: 0.04 },
      { ingredientId: 'sili', quantity: 0.05 },
      { ingredientId: 'sinigang-mix', quantity: 0.2 },
    ],
    sellingPrice: 110,
    popularity: 0.85,
    prepDifficulty: 0.4,
    holdingStability: 0.7,
    targetDemographics: ['Family', 'Office'],
  },
  {
    id: 'sisig',
    name: 'Pork Sisig',
    recipeId: '152601',
    imageUrl: RECIPE_IMG('152601'),
    ingredients: [
      { ingredientId: 'pork', quantity: 0.5 },
      { ingredientId: 'atay-manok', quantity: 0.125 },
      { ingredientId: 'sibuyas', quantity: 0.06 },
      { ingredientId: 'bawang', quantity: 0.015 },
      { ingredientId: 'sili', quantity: 0.05 },
      { ingredientId: 'calamansi', quantity: 0.1 },
      { ingredientId: 'toyo', quantity: 0.03 },
      { ingredientId: 'cooking-oil', quantity: 0.05 },
    ],
    sellingPrice: 140,
    popularity: 0.95,
    prepDifficulty: 0.6,
    holdingStability: 0.6,
    targetDemographics: ['Worker', 'Office'],
  },
  {
    id: 'tapsilog-meat',
    name: 'Beef Tapa',
    recipeId: '110461',
    imageUrl: RECIPE_IMG('110461'),
    ingredients: [
      { ingredientId: 'beef', quantity: 0.25 },
      { ingredientId: 'toyo', quantity: 0.04 },
      { ingredientId: 'bawang', quantity: 0.015 },
      { ingredientId: 'asukal', quantity: 0.015 },
      { ingredientId: 'cooking-oil', quantity: 0.03 },
    ],
    sellingPrice: 115,
    popularity: 0.8,
    prepDifficulty: 0.2,
    holdingStability: 0.7,
    targetDemographics: ['Student', 'Worker'],
  },
  {
    id: 'fried-bangus',
    name: 'Crispy Fried Bangus',
    recipeId: '110322',
    imageUrl: RECIPE_IMG('110322'),
    ingredients: [
      { ingredientId: 'bangus', quantity: 0.125 },
      { ingredientId: 'bawang', quantity: 0.01 },
      { ingredientId: 'cooking-oil', quantity: 0.05 },
    ],
    sellingPrice: 130,
    popularity: 0.75,
    prepDifficulty: 0.3,
    holdingStability: 0.4,
    targetDemographics: ['Family', 'Office'],
  },
];

export const INITIAL_STAFF: Staff[] = [
  { id: 'nanay-rose', name: 'Nanay Rose', role: 'COOK', speed: 70, cookingSkill: 95, friendliness: 90, stamina: 100, morale: 100, salary: 550, isAssigned: true },
  { id: 'marites', name: 'Marites', role: 'CASHIER', speed: 90, cookingSkill: 15, friendliness: 45, stamina: 100, morale: 80, salary: 450, isAssigned: true },
  { id: 'rudy', name: 'Mang Rudy', role: 'CLEANER_SERVER', speed: 55, cookingSkill: 10, friendliness: 75, stamina: 100, morale: 90, salary: 400, isAssigned: false },
];
