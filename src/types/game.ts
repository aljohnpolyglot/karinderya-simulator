
export type GamePhase = 'MORNING_BRIEFING' | 'PALENGKE' | 'MENU_PLANNING' | 'STAFF_ASSIGNMENT' | 'OPERATIONS' | 'SUMMARY' | 'STORE_CLOSED';

export type Weather = 'SUNNY' | 'RAINY' | 'CLOUDY' | 'STORM';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyConditions {
  weather: Weather;
  event?: string;
  expectedDemographics: string[];
  modifiers: {
    demand: number;
    specificDishPopularity: Record<string, number>;
    ingredientPrice: Record<string, number>;
  };
}

export interface Ingredient {
  id: string;
  name: string;
  shortName?: string; // For compact UI
  icon: string; // Emoji icon
  category: 'MEAT' | 'VEGGIE' | 'STAPLE' | 'MISC' | 'CONDIMENT';
  basePrice: number;
  currentPrice: number;
  stock: number;
  freshness: number; // 0 to 1
  unit?: string; // 'kg' | 'pack' | etc.
}

export interface Dish {
  id: string;
  name: string;
  recipeId?: string; // Links to recipe in catalog (for image)
  imageUrl?: string; // Direct image URL
  ingredients: { ingredientId: string; quantity: number }[]; // quantity per serving
  sellingPrice: number;
  popularity: number; // 0 to 1
  prepDifficulty: number; // 0 to 1
  holdingStability: number; // 0 to 1 (how slow it decays)
  targetDemographics: string[];
}

export interface PreparedDish {
  dishId: string;
  servings: number;
  quality: number; // 0 to 100
  lastTickProcessed: number; // for decay
}

export interface Staff {
  id: string;
  name: string;
  role: 'COOK' | 'CASHIER' | 'CLEANER_SERVER';
  speed: number; // 0 to 100
  cookingSkill: number; // 0 to 100
  friendliness: number;
  stamina: number;
  morale: number;
  salary: number;
  isAssigned: boolean;
  dailyMod?: number; // 0.8 to 1.2
}

export interface Customer {
  id: string;
  name: string;
  age: number;
  occupation: 'Student' | 'Worker' | 'Office' | 'Family' | 'Tambay';
  loyalty: number;
  favoriteDishId?: string;
  visitCount: number;
  status: 'ENTERING' | 'ORDERING' | 'WAITING' | 'EATING' | 'LEAVING' | 'LOST' | 'QUEUING';
  order?: {
    dishId: string;
    riceServings: number;
    quality: number; // Quality of dish when served
  };
  satisfaction: number;
  position: [number, number, number];
  waitTimer: number; // Tracks wait duration
}

export interface DayReport {
  customersServed: number;
  customersLost: number;
  revenue: number;
  ingredientCost: number;
  wages: number;
  wasteCost: number;
  profit: number;
  reputationChange: number;
  bestSellerId?: string;
  bottleneck?: string;
  riceSold: number;
  riceShortageCount: number;
  averageSatisfaction: number;
  wastedServings: number;
}
