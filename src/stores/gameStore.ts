
import { create } from 'zustand';
import { 
    GamePhase, Ingredient, Dish, Staff, Customer, 
    Weather, DayOfWeek, DailyConditions, DayReport, PreparedDish
} from '../types/game';
import { INITIAL_INGREDIENTS, INITIAL_DISHES, INITIAL_STAFF } from '../data/mock';
import { UNLOCKABLE_DISHES } from '../data/recipeCatalog';

interface GameState {
  cash: number;
  reputation: number;
  day: number;
  dayOfWeek: DayOfWeek;
  hour: number;
  minute: number;
  phase: GamePhase;
  inventory: Record<string, number>;
  ingredientsData: Ingredient[];
  activeMenu: string[]; 
  activeDishes: Dish[];
  staff: Staff[];
  customers: Customer[];
  sukiList: Customer[];
  dailyConditions: DailyConditions;
  currentReport: DayReport | null;
  alerts: { id: string; message: string; type: 'INFO' | 'WARNING' | 'ERROR' }[];
  sessionStats: {
    served: number;
    lost: number;
    revenue: number;
    riceSold: number;
    riceShortage: number;
  };
  
  // Rice Operations
  cookedRiceServings: number;
  isRiceCooking: boolean;
  riceCookerTimeRemaining: number; // in simulation minutes
  maxRiceCookerCapacity: number; // servings
  
  // Prepared Food State
  preparedDishes: Record<string, PreparedDish>;
  isCookingBatch: boolean;
  batchCookTimeRemaining: number;
  batchDishId: string | null;
  batchServingsRemaining: number;

  // Infrastructure
  seatingCapacity: number;
  occupiedSeats: number;

  // Unlockable recipes
  unlockedDishIds: string[];
  unlockDish: (dishId: string, cost: number, repRequired?: number) => boolean;

  // Price overrides (set by player; falls back to dish.sellingPrice)
  dishPrices: Record<string, number>;
  setDishPrice: (dishId: string, price: number) => void;

  // Customer naming
  customerCounter: number;

  // Menu Plan (set in Morning Briefing, used in Palengke + Menu Planning)
  menuPlan: Record<string, number>;
  setMenuPlan: (plan: Record<string, number>) => void;
  bulkBuyForPlan: (plan?: Record<string, number>) => number;

  // Actions
  nextPhase: () => void;
  startNewDay: () => void;
  buyIngredient: (id: string, qty: number, price: number) => void;
  toggleDishInMenu: (dishId: string) => void;
  assignStaff: (staffId: string) => void;
  tick: () => void;
  rushStatus: string; // 'CALM', 'LUNCH RUSH', 'DINNER RUSH', etc.
  addAlert: (message: string, type?: 'INFO' | 'WARNING' | 'ERROR') => void;
  finishSimulation: (report: DayReport) => void;
  cookRice: () => void;
  prepDishes: (plan: Record<string, number>) => void;
  cookBatch: (dishId: string, servings: number) => void;
}

export function computeShoppingList(
  plan: Record<string, number>,
  activeDishes: Dish[],
  inventory: Record<string, number>,
  ingredientsData: Ingredient[]
) {
  const needed: Record<string, number> = {};

  Object.entries(plan).forEach(([dishId, servings]) => {
    if (servings <= 0) return;
    const dish = activeDishes.find(d => d.id === dishId);
    if (!dish) return;
    dish.ingredients.forEach(ing => {
      needed[ing.ingredientId] = (needed[ing.ingredientId] || 0) + ing.quantity * servings;
    });
  });

  return Object.entries(needed)
    .map(([ingId, qty]) => {
      const data = ingredientsData.find(i => i.id === ingId);
      const inStock = inventory[ingId] || 0;
      const toBuy = Math.max(0, Math.ceil(qty - inStock));
      return {
        ingredientId: ingId,
        icon: data?.icon || '?',
        name: data?.shortName || data?.name || ingId,
        unit: data?.unit || '',
        needed: qty,
        inStock,
        toBuy,
        unitCost: data?.currentPrice || 0,
        totalCost: toBuy * (data?.currentPrice || 0),
      };
    })
    .filter(item => item.toBuy > 0);
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEATHERS: Weather[] = ['SUNNY', 'CLOUDY', 'RAINY', 'STORM'];

export const useGameStore = create<GameState>((set, get) => ({
  cash: 5000,
  reputation: 20,
  day: 1,
  dayOfWeek: 'Monday',
  hour: 6,
  minute: 0,
  phase: 'STORE_CLOSED',
  inventory: {},
  ingredientsData: INITIAL_INGREDIENTS,
  activeMenu: [],
  activeDishes: INITIAL_DISHES,
  staff: INITIAL_STAFF,
  customers: [],
  sukiList: [],
  dailyConditions: {
    weather: 'SUNNY',
    expectedDemographics: ['Worker', 'Office'],
    modifiers: { demand: 1, specificDishPopularity: {}, ingredientPrice: {} }
  },
  currentReport: null,
  alerts: [],
  sessionStats: {
    served: 0,
    lost: 0,
    revenue: 0,
    riceSold: 0,
    riceShortage: 0,
  },
  
  cookedRiceServings: 0,
  isRiceCooking: false,
  riceCookerTimeRemaining: 0,
  maxRiceCookerCapacity: 30, // 30 servings per batch
  
  preparedDishes: {},
  isCookingBatch: false,
  batchCookTimeRemaining: 0,
  batchDishId: null,
  batchServingsRemaining: 0,
  rushStatus: 'CALM',
  seatingCapacity: 12,
  occupiedSeats: 0,
  unlockedDishIds: INITIAL_DISHES.map(d => d.id),
  customerCounter: 0,
  dishPrices: {},
  menuPlan: {},

  setMenuPlan: (plan) => set({ menuPlan: plan }),

  bulkBuyForPlan: (overridePlan) => {
    const state = get();
    const plan = overridePlan || state.menuPlan;
    const list = computeShoppingList(plan, state.activeDishes, state.inventory, state.ingredientsData);
    const totalCost = list.reduce((s, item) => s + item.totalCost, 0);
    if (totalCost <= 0 || totalCost > state.cash) return totalCost;

    const newInventory = { ...state.inventory };
    list.forEach(item => {
      newInventory[item.ingredientId] = (newInventory[item.ingredientId] || 0) + item.toBuy;
    });

    set({ cash: state.cash - totalCost, inventory: newInventory });
    return totalCost;
  },

  setDishPrice: (dishId, price) => set((state) => ({
    dishPrices: { ...state.dishPrices, [dishId]: Math.max(1, Math.round(price)) },
  })),

  unlockDish: (dishId, cost, repRequired = 0) => {
    const state = get();
    if (state.cash < cost) return false;
    if (state.reputation < repRequired) return false;
    if (state.unlockedDishIds.includes(dishId)) return false;
    const newDish = UNLOCKABLE_DISHES.find(d => d.id === dishId);
    if (!newDish) return false;
    set({
      cash: state.cash - cost,
      unlockedDishIds: [...state.unlockedDishIds, dishId],
      activeDishes: [...state.activeDishes, newDish],
      alerts: [{ id: Date.now().toString(), message: `🎉 Natutunan mo na: ${newDish.name}!`, type: 'INFO' as const }, ...state.alerts].slice(0, 5),
    });
    return true;
  },

  nextPhase: () => {
    const { phase } = get();
    const phases: GamePhase[] = ['MORNING_BRIEFING', 'PALENGKE', 'MENU_PLANNING', 'STAFF_ASSIGNMENT', 'OPERATIONS', 'SUMMARY', 'STORE_CLOSED'];
    const currentIndex = phases.indexOf(phase);
    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhaseName = phases[nextIndex];

    if (nextPhaseName === 'MORNING_BRIEFING') {
      get().startNewDay();
    }

    set({ phase: nextPhaseName });
  },

  startNewDay: () => set((state) => {
    const nextDay = state.day + (state.phase === 'STORE_CLOSED' ? 0 : 1);
    const nextDayOfWeek = DAYS[(nextDay - 1) % 7];
    const weather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];

    // Detailed Forecasting
    let expectedDemographics = ['Worker'];
    if (nextDayOfWeek === 'Saturday' || nextDayOfWeek === 'Sunday') expectedDemographics.push('Family');
    if (Math.random() > 0.5) expectedDemographics.push('Office');
    if (Math.random() > 0.7) expectedDemographics.push('Student');

    const demandMod = weather === 'RAINY' ? 1.2 : (weather === 'STORM' ? 0.6 : 1);
    const dayMod = nextDayOfWeek === 'Friday' ? 1.4 : (nextDayOfWeek === 'Monday' ? 0.9 : 1);

    const specificDishPopularity: Record<string, number> = {};
    if (weather === 'RAINY') {
      specificDishPopularity['sinigang-pork'] = 1.6;
      specificDishPopularity['tinolang-manok'] = 1.4;
      specificDishPopularity['arroz-caldo'] = 1.5;
    }
    if (nextDayOfWeek === 'Friday') specificDishPopularity['sisig'] = 1.5;
    if (expectedDemographics.includes('Student')) specificDishPopularity['tapsilog-meat'] = 1.3;
    if (weather === 'SUNNY') specificDishPopularity['fried-bangus'] = 1.2;

    // Dynamic market price volatility (±20%, weather/event-driven)
    const ingredientPrice: Record<string, number> = {};
    const updatedIngredients = state.ingredientsData.map(ing => {
      let mod = 0.92 + Math.random() * 0.18; // base ±10% daily fluctuation
      if (weather === 'STORM' && ing.category === 'MEAT') mod *= 1.15;
      if (weather === 'RAINY' && ing.category === 'VEGGIE') mod *= 1.15;
      if (weather === 'STORM' && ing.category === 'VEGGIE') mod *= 1.25;
      if (weather === 'STORM' && ing.id === 'hipon') mod *= 1.25;
      if (nextDayOfWeek === 'Sunday' && ing.category === 'MEAT') mod *= 1.08;
      ingredientPrice[ing.id] = mod;
      return { ...ing, currentPrice: Math.round(ing.basePrice * mod) };
    });

    // Staff Daily Form
    const updatedStaff = state.staff.map(s => ({
        ...s,
        dailyMod: 0.9 + (Math.random() * 0.2), // 0.9 to 1.1 performance
        stamina: Math.min(100, s.stamina + 40) // Recover some stamina overnight
    }));

    return {
      day: nextDay,
      dayOfWeek: nextDayOfWeek,
      hour: 6,
      minute: 0,
      staff: updatedStaff,
      ingredientsData: updatedIngredients,
      dailyConditions: {
        weather,
        event: nextDayOfWeek === 'Friday' ? 'Payday Friday Rush!' : (weather === 'STORM' ? 'Flooded Street' : undefined),
        expectedDemographics,
        modifiers: {
          demand: demandMod * dayMod,
          specificDishPopularity,
          ingredientPrice,
        }
      },
      currentReport: null,
      customers: [],
      customerCounter: 0,
      alerts: [],
      sessionStats: { served: 0, lost: 0, revenue: 0, riceSold: 0, riceShortage: 0 },
      cookedRiceServings: 0,
      isRiceCooking: false,
      riceCookerTimeRemaining: 0,
      preparedDishes: {},
      isCookingBatch: false,
      batchCookTimeRemaining: 0,
      batchDishId: null,
      batchServingsRemaining: 0,
      occupiedSeats: 0,
      menuPlan: {}
    };
  }),

  buyIngredient: (id, qty, price) => set((state) => ({
    cash: state.cash - (qty * price),
    inventory: {
      ...state.inventory,
      [id]: (state.inventory[id] || 0) + qty
    }
  })),

  toggleDishInMenu: (dishId) => set((state) => ({
    activeMenu: state.activeMenu.includes(dishId)
      ? state.activeMenu.filter(id => id !== dishId)
      : [...state.activeMenu, dishId],
  })),

  assignStaff: (staffId) => set((state) => ({
    staff: state.staff.map(s => s.id === staffId ? { ...s, isAssigned: !s.isAssigned } : s)
  })),

  tick: () => set((state) => {
    let nextMin = state.minute + 5; 
    let nextHour = state.hour;
    if (nextMin >= 60) {
      nextMin = 0;
      nextHour += 1;
    }
    
    // Rice Cooking Logic
    let isCooking = state.isRiceCooking;
    let timeRemaining = state.riceCookerTimeRemaining;
    let cookedRice = state.cookedRiceServings;

    if (isCooking) {
      timeRemaining -= 5;
      if (timeRemaining <= 0) {
        isCooking = false;
        timeRemaining = 0;
        cookedRice = state.maxRiceCookerCapacity;
      }
    }

    // Batch Cooking Logic
    let isBatchCooking = state.isCookingBatch;
    let batchTimeRemaining = state.batchCookTimeRemaining;
    let updatedPreparedDishes = { ...state.preparedDishes };

    if (isBatchCooking) {
      batchTimeRemaining -= 5;
      if (batchTimeRemaining <= 0) {
        if (state.batchDishId) {
          const dishId = state.batchDishId;
          const current = updatedPreparedDishes[dishId] || { dishId, servings: 0, quality: 100, lastTickProcessed: nextHour * 60 + nextMin };
          updatedPreparedDishes[dishId] = {
            ...current,
            servings: current.servings + state.batchServingsRemaining,
            quality: 100, // Fresh batch resets quality or averages? Lets reset for now.
            lastTickProcessed: nextHour * 60 + nextMin
          };
        }
        isBatchCooking = false;
        batchTimeRemaining = 0;
      }
    }

    // Rush Status update
    let newRushStatus = 'CALM';
    if (nextHour >= 6 && nextHour <= 8) newRushStatus = 'BREAKFAST';
    else if (nextHour >= 11 && nextHour <= 14) newRushStatus = 'LUNCH RUSH';
    else if (nextHour >= 18 && nextHour <= 20) newRushStatus = 'DINNER RUSH';
    else if (nextHour >= 15 && nextHour <= 17) newRushStatus = 'SIESTA';

    const baseUpdates = { 
      hour: nextHour, 
      minute: nextMin, 
      isRiceCooking: isCooking, 
      riceCookerTimeRemaining: timeRemaining, 
      cookedRiceServings: cookedRice,
      isCookingBatch: isBatchCooking,
      batchCookTimeRemaining: batchTimeRemaining,
      preparedDishes: updatedPreparedDishes,
      rushStatus: newRushStatus
    };

    if (nextHour >= 21 && state.phase === 'OPERATIONS') {
        return baseUpdates;
    }

    return baseUpdates;
  }),

  cookRice: () => set((state) => {
    const rawRiceNeeded = 2; // 2kg raw rice for a full cooker batch
    const currentRawStock = state.inventory['rice-raw'] || 0;

    if (state.isRiceCooking) return {};
    if (currentRawStock < rawRiceNeeded) {
        return {};
    }

    return {
        isRiceCooking: true,
        riceCookerTimeRemaining: 25, // Slightly longer cook time
        inventory: {
            ...state.inventory,
            'rice-raw': currentRawStock - rawRiceNeeded
        }
    };
  }),

  prepDishes: (plan) => set((state) => {
    const newInventory = { ...state.inventory };
    const newPreparedDishes = { ...state.preparedDishes };

    Object.entries(plan).forEach(([dishId, numServings]) => {
      if (numServings <= 0) return;
      const dish = state.activeDishes.find(d => d.id === dishId);
      if (!dish) return;

      const canCook = dish.ingredients.every(ing =>
        (newInventory[ing.ingredientId] || 0) >= ing.quantity * numServings
      );
      if (!canCook) return;

      dish.ingredients.forEach(ing => {
        newInventory[ing.ingredientId] = (newInventory[ing.ingredientId] || 0) - (ing.quantity * numServings);
      });

      newPreparedDishes[dishId] = {
        dishId,
        servings: (newPreparedDishes[dishId]?.servings || 0) + numServings,
        quality: 100,
        lastTickProcessed: state.hour * 60 + state.minute
      };
    });

    const totalServings = Object.values(plan).reduce((a, b) => a + b, 0);
    const updatedStaff = state.staff.map(s =>
      s.role === 'COOK' && s.isAssigned ? { ...s, stamina: Math.max(10, s.stamina - (totalServings * 0.8)) } : s
    );

    return { inventory: newInventory, preparedDishes: newPreparedDishes, staff: updatedStaff };
  }),

  cookBatch: (dishId, servings) => set((state) => {
    if (state.isCookingBatch) return {};
    const dish = state.activeDishes.find(d => d.id === dishId);
    if (!dish) return {};

    const newInventory = { ...state.inventory };
    let canCook = true;
    dish.ingredients.forEach(ing => {
        if ((newInventory[ing.ingredientId] || 0) < ing.quantity * servings) canCook = false;
    });

    if (!canCook) return {};

    dish.ingredients.forEach(ing => {
        newInventory[ing.ingredientId] -= ing.quantity * servings;
    });

    return {
        isCookingBatch: true,
        batchCookTimeRemaining: 20, // Emergency is harder
        batchDishId: dishId,
        batchServingsRemaining: servings,
        inventory: newInventory
    };
  }),

  addAlert: (message, type = 'INFO') => set((state) => ({
    alerts: [{ id: Date.now().toString(), message, type }, ...state.alerts].slice(0, 5)
  })),

  finishSimulation: (report) => set((state) => ({
    cash: state.cash + report.revenue - report.wages - report.wasteCost,
    reputation: Math.max(0, Math.min(100, state.reputation + report.reputationChange)),
    currentReport: report,
    phase: 'SUMMARY'
  }))
}));
