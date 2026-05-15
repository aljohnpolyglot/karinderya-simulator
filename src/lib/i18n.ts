export type Language = 'fil' | 'en';

const dict: Record<string, Record<Language, string>> = {
  // ─── Common ───
  'common.cash':             { fil: 'Puhunan', en: 'Cash' },
  'common.budget':           { fil: 'Budget', en: 'Budget' },
  'common.stock':            { fil: 'Stock', en: 'Stock' },
  'common.reputation':       { fil: 'Reputasyon', en: 'Reputation' },
  'common.cost':             { fil: 'puhunan', en: 'cost' },
  'common.sell':             { fil: 'benta', en: 'sell' },
  'common.profit':           { fil: 'tubo', en: 'profit' },
  'common.revenue':          { fil: 'Benta', en: 'Revenue' },
  'common.total':            { fil: 'Kabuuan', en: 'Total' },
  'common.servings':         { fil: 'Servings', en: 'Servings' },
  'common.margin':           { fil: 'Margin', en: 'Margin' },
  'common.cookbook':          { fil: 'Cookbook', en: 'Cookbook' },
  'common.shoppingList':     { fil: 'Shopping List', en: 'Shopping List' },
  'common.notEnoughBudget':  { fil: 'Hindi sapat ang budget!', en: 'Not enough budget!' },
  'common.goBack':           { fil: 'Bumalik', en: 'Go Back' },
  'common.continueAnyway':   { fil: 'Ituloy pa rin', en: 'Continue Anyway' },
  'common.cancel':           { fil: 'Huwag Muna', en: 'Cancel' },
  'common.buy':              { fil: 'Bilhin!', en: 'Buy!' },
  'common.needed':           { fil: 'kailangan', en: 'needed' },

  // ─── Weather ───
  'weather.sunny':  { fil: 'Maaraw', en: 'Sunny' },
  'weather.cloudy': { fil: 'Maulap', en: 'Cloudy' },
  'weather.rainy':  { fil: 'Maulan', en: 'Rainy' },
  'weather.storm':  { fil: 'Bagyo', en: 'Storm' },

  // ─── Categories ───
  'cat.ALL':       { fil: 'Lahat', en: 'All' },
  'cat.MEAT':      { fil: 'Karne', en: 'Meat' },
  'cat.VEGGIE':    { fil: 'Gulay', en: 'Veggie' },
  'cat.STAPLE':    { fil: 'Bigas', en: 'Staple' },
  'cat.CONDIMENT': { fil: 'Sangkap', en: 'Condiment' },
  'cat.MISC':      { fil: 'Iba Pa', en: 'Misc' },

  // ─── Roles ───
  'role.COOK':           { fil: 'Tagaluto', en: 'Cook' },
  'role.CASHIER':        { fil: 'Kahera', en: 'Cashier' },
  'role.CLEANER_SERVER': { fil: 'Tagasilbi', en: 'Server' },

  // ─── Phase Nav ───
  'phase.MORNING_BRIEFING': { fil: 'Umaga', en: 'Morning' },
  'phase.PALENGKE':         { fil: 'Palengke', en: 'Market' },
  'phase.MENU_PLANNING':    { fil: 'Menu & Luto', en: 'Menu & Prep' },
  'phase.STAFF_ASSIGNMENT': { fil: 'Staff', en: 'Staff' },
  'phase.OPERATIONS':       { fil: 'Operasyon', en: 'Operations' },
  'phase.SUMMARY':          { fil: 'Buod', en: 'Summary' },
  'phase.STORE_CLOSED':     { fil: 'Tulog', en: 'Sleep' },

  // ─── Home Menu ───
  'home.tagline': { fil: 'Simpleng ulam, malaking kita!', en: 'Simple dishes, big profits!' },
  'home.start':   { fil: 'Bagong Laro', en: 'New Game' },
  'home.load':    { fil: 'Ituloy ang Laro', en: 'Load Game' },
  'home.settings':{ fil: 'Mga Setting', en: 'Settings' },
  'home.noSave':  { fil: 'Walang naka-save na laro', en: 'No saved game found' },

  // ─── Settings ───
  'settings.title':    { fil: 'Mga Setting', en: 'Settings' },
  'settings.language': { fil: 'Wika', en: 'Language' },
  'settings.filipino': { fil: 'Filipino', en: 'Filipino' },
  'settings.english':  { fil: 'English', en: 'English' },
  'settings.back':     { fil: '← Bumalik', en: '← Back' },

  // ─── TopBar ───
  'topbar.day': { fil: 'ARAW', en: 'DAY' },

  // ─── Morning Briefing ───
  'morning.title':            { fil: 'Magandang Umaga!', en: 'Good Morning!' },
  'morning.dayLabel':         { fil: 'Araw {0} — {1}', en: 'Day {0} — {1}' },
  'morning.weather':          { fil: 'Panahon Ngayon', en: 'Weather' },
  'morning.demandForecast':   { fil: 'Demand Forecast', en: 'Demand Forecast' },
  'morning.demandHigh':       { fil: '🔥 Mataas!', en: '🔥 High!' },
  'morning.demandNormal':     { fil: '👍 Katamtaman', en: '👍 Normal' },
  'morning.demandLow':        { fil: '📉 Mababa', en: '📉 Low' },
  'morning.expectedCustomers':{ fil: 'Inaasahang customers', en: 'Expected customers' },
  'morning.eventToday':       { fil: '📢 Event Ngayon', en: "📢 Today's Event" },
  'morning.trending':         { fil: '🔥 Uso Ngayon', en: '🔥 Trending Today' },
  'morning.marketPrices':     { fil: 'Presyo sa Palengke (vs. kahapon)', en: 'Market Prices (vs. yesterday)' },
  'morning.tipRainy':         { fil: '"Maulan ngayon — expect na maraming customers na maghahanap ng mainit na sabaw!"', en: '"Rainy day — expect customers looking for hot soups!"' },
  'morning.tipStorm':         { fil: '"Malakas ang ulan — konti lang siguro ang pupunta. Huwag mag-overprepare."', en: '"Strong storm — fewer customers today. Don\'t overprepare."' },
  'morning.tipDefault':       { fil: '"Magandang araw para magluto! Magsimula na tayo."', en: '"Beautiful day for cooking! Let\'s get started."' },
  'morning.planMenu':         { fil: 'Plano ng Menu', en: 'Plan Your Menu' },
  'morning.planDesc':         { fil: 'Piliin ang mga ulam at servings. Auto-compute ang shopping list sa Palengke.', en: 'Pick dishes & servings. Shopping list auto-computes for Palengke.' },
  'morning.needToBuy':        { fil: 'Kailangan bilhin', en: 'Need to buy' },
  'morning.projectedRevenue': { fil: 'Projected na benta', en: 'Projected revenue' },
  'morning.nextButton':       { fil: 'Tuloy sa Palengke →', en: 'Go to Market →' },

  // ─── Palengke ───
  'palengke.title':             { fil: 'Palengke', en: 'Market' },
  'palengke.subtitle':          { fil: 'Bumili ng mga sangkap para sa araw na ito.', en: 'Buy ingredients for today.' },
  'palengke.shoppingListTitle': { fil: 'Listahan mula sa Plano', en: 'Shopping List from Plan' },
  'palengke.buyAll':            { fil: 'Bilhin Lahat', en: 'Buy All' },
  'palengke.allStocked':        { fil: 'Kumpleto na ang ingredients!', en: 'All ingredients stocked!' },
  'palengke.allStockedDesc':    { fil: 'May sapat ka nang sangkap para sa plano mo.', en: 'You have enough ingredients for your menu plan.' },
  'palengke.cartTotal':         { fil: 'Total ng Bili', en: 'Cart Total' },
  'palengke.nextButton':        { fil: 'Tuloy sa Menu Planning →', en: 'Continue to Menu →' },

  // ─── Menu & Prep ───
  'menu.title':             { fil: 'Menu, Luto, at Presyo', en: 'Menu, Prep & Pricing' },
  'menu.subtitle':          { fil: 'Piliin ulam, iluto, at itakda ang presyo.', en: 'Pick dishes, cook, and set prices.' },
  'menu.missingIngredients':{ fil: 'Kulang ang sangkap para sa plano mo', en: 'Missing ingredients for your plan' },
  'menu.itemsShort':        { fil: '{0} sangkap kulang', en: '{0} items short' },
  'menu.buyMissing':        { fil: 'Bumili ng Kulang', en: 'Buy Missing' },
  'menu.buyMissingTitle':   { fil: 'Bumili ng Kulang', en: 'Buy Missing Ingredients' },
  'menu.buyMissingDesc':    { fil: 'Bibilhin sa presyo ngayon sa palengke:', en: "Will be purchased at today's market prices:" },
  'menu.riceCooker':        { fil: 'Rice Cooker', en: 'Rice Cooker' },
  'menu.riceCooking':       { fil: 'Nagluluto...', en: 'Cooking...' },
  'menu.cooked':            { fil: 'Luto', en: 'Cooked' },
  'menu.rawRice':           { fil: 'Bigas', en: 'Raw rice' },
  'menu.noRice':            { fil: 'Walang bigas! Bumili muna sa Palengke!', en: 'No rice! Buy bigas at Palengke first!' },
  'menu.riceWarning':       { fil: '{0} servings ulam pero {1} lang kanin. Magluto pa!', en: '{0} ulam servings but only {1} rice. Cook more!' },
  'menu.cookRice':          { fil: 'Magluto (2kg)', en: 'Cook (2kg)' },
  'menu.insufficient':      { fil: 'Kulang ang sangkap', en: 'Insufficient ingredients' },
  'menu.planned':           { fil: 'Planado', en: 'Planned' },
  'menu.setPrices':         { fil: 'Itakda ang Presyo', en: 'Set Prices' },
  'menu.costLabel':         { fil: 'Puhunan', en: 'Cost' },
  'menu.nextButton':        { fil: 'Tuloy sa Staff Assignment →', en: 'Continue to Staff →' },
  'menu.noRiceTitle':       { fil: 'Walang Bigas!', en: 'No Rice!' },
  'menu.noRiceWarning':     { fil: 'Wala kang bigas na stock at walang luto na kanin. Ang mga customer ay aalis kung walang kanin!', en: "You have no rice stock and no cooked rice. Customers will leave if there's no rice!" },
  'menu.notEnoughMore':     { fil: 'Hindi sapat! Kailangan mo pa ng ₱{0}.', en: 'Not enough! You need ₱{0} more.' },

  // ─── Staff ───
  'staff.title':         { fil: 'Mga Tauhan', en: 'Staff Assignment' },
  'staff.subtitle':      { fil: 'I-assign ang mga tauhan para sa araw na ito.', en: "Assign staff for today's operations." },
  'staff.assignedCount': { fil: '{0} tauhan ang naka-assign', en: '{0} staff assigned' },
  'staff.nextButton':    { fil: 'Buksan ang Tindahan! →', en: 'Open the Shop! →' },

  // ─── Operations ───
  'ops.title':      { fil: 'Bukas ang Tindahan!', en: 'Shop is Open!' },
  'ops.simToEnd':   { fil: 'Tapusin ⏩', en: 'Sim to End ⏩' },
  'ops.served':     { fil: 'Served', en: 'Served' },
  'ops.lost':       { fil: 'Umalis', en: 'Lost' },
  'ops.revenue':    { fil: 'Kita', en: 'Revenue' },
  'ops.rice':       { fil: 'Kanin', en: 'Rice' },
  'ops.displayCase':{ fil: 'Display Case', en: 'Display Case' },
  'ops.servingsLeft':  { fil: '{0} serving natitira', en: '{0} servings left' },
  'ops.eventLog':      { fil: 'Mga Pangyayari', en: 'Event Log' },
  'ops.shopOpen':      { fil: '🏪 Bukas na ang tindahan!', en: '🏪 Shop is open!' },
  'ops.shopClosed':    { fil: '🌙 Sarado na ang tindahan!', en: '🌙 Shop is closed!' },
  'ops.ordered':       { fil: 'kumain ng', en: 'ordered' },
  'ops.leftNoFood':    { fil: 'umalis — walang ulam!', en: 'left — no food!' },
  'ops.soldOut':       { fil: 'Ubos na ang lahat! Maaga nagsara.', en: 'All sold out! Closing early.' },

  // ─── Summary ───
  'summary.title':       { fil: 'Wakas ng Araw', en: 'End of Day Summary' },
  'summary.subtitle':    { fil: 'Paano ang araw mo?', en: 'How was your day?' },
  'summary.netIncome':   { fil: 'Net Income', en: 'Net Income' },
  'summary.wages':       { fil: 'Gastos (sahod)', en: 'Wages' },
  'summary.served':      { fil: 'Customers Served', en: 'Served' },
  'summary.lost':        { fil: 'Nawalan', en: 'Lost' },
  'summary.riceSold':    { fil: 'Kanin Sold', en: 'Rice Sold' },
  'summary.wasted':      { fil: 'Nasayang', en: 'Wasted' },
  'summary.satisfaction': { fil: 'Kasiyahan', en: 'Satisfaction' },
  'summary.currentCash': { fil: 'Puhunan Ngayon', en: 'Current Cash' },
  'summary.nextButton':  { fil: 'Matulog na →', en: 'Go to Sleep →' },
  'summary.noReport':    { fil: 'Walang report...', en: 'No report...' },
  'summary.nextDay':     { fil: 'Susunod na Araw →', en: 'Next Day →' },

  // ─── Store Closed / Night ───
  'night.title':      { fil: 'Gabi na. Pahinga muna.', en: 'Night time. Rest up.' },
  'night.dayDone':    { fil: 'Tapos na ang Araw {0}. Handa ka na ba para bukas?', en: 'Day {0} is done. Ready for tomorrow?' },
  'night.rep':        { fil: 'Reputasyon', en: 'Rep' },
  'night.nextButton': { fil: '☀️ Bagong Umaga →', en: '☀️ New Morning →' },

  // ─── Plan Modal (Pre-Palengke) ───
  'planModal.title':        { fil: 'Ano lulutuin natin ngayon?', en: 'What are we cooking today?' },
  'planModal.subtitle':     { fil: 'Pumili ng mga ulam at servings. Bibilhin namin ang kailangan.', en: 'Pick dishes and servings. We\'ll buy what you need.' },
  'planModal.autoBuy':      { fil: 'Auto-buy', en: 'Auto-buy' },
  'planModal.manual':       { fil: 'Manu-mano', en: 'Manual Shopping' },
  'planModal.skipPlan':     { fil: 'Walang plano, diretsyo sa palengke', en: 'No plan, go straight to market' },
  'planModal.estimatedCost':{ fil: 'Tinatayang gastos', en: 'Estimated cost' },

  // ─── Receipt Modal ───
  'receipt.title':         { fil: 'Resibo', en: 'Receipt' },
  'receipt.totalDeducted': { fil: 'Kabuuang binayaran', en: 'Total Paid' },
  'receipt.remaining':     { fil: 'Natirang pera', en: 'Remaining Cash' },
  'receipt.confirm':       { fil: 'Sige!', en: 'OK' },
  'receipt.nothingToBuy':  { fil: 'Kumpleto na — walang kailangang bilhin!', en: 'All stocked — nothing to buy!' },

  // ─── Menu & Prep (additions) ───
  'menu.pantry':          { fil: 'Pantry', en: 'Pantry' },
  'menu.remaining':       { fil: 'Natitira', en: 'Remaining' },
  'menu.buyBigas':        { fil: 'Bumili ng Bigas', en: 'Buy Rice' },
  'menu.buyBigasTitle':   { fil: 'Bumili ng Bigas', en: 'Buy Rice' },
  'menu.buyBigasDesc':    { fil: 'Presyo ngayon sa palengke:', en: 'Current market price:' },
  'menu.riceDone':        { fil: 'Luto na!', en: 'Done!' },
  'menu.riceEmpty':       { fil: 'Walang laman', en: 'Empty' },
  'menu.noCookable':      { fil: 'Walang malulutong ulam — bumili muna ng sangkap!', en: 'No cookable dishes — buy ingredients first!' },
  'menu.uncookableLabel': { fil: 'Kulang ang sangkap', en: 'Insufficient ingredients' },

  // ─── Cookbook ───
  'cookbook.title':             { fil: 'Libro ng Resipe', en: 'Cookbook' },
  'cookbook.ingredientsPerServing': { fil: 'Sangkap per serving', en: 'Ingredients per serving' },
  'cookbook.realRecipe':        { fil: 'Tunay na resipe', en: 'Real recipe' },
  'cookbook.sellLabel':         { fil: 'Benta', en: 'Sell' },
  'cookbook.costLabel':         { fil: 'Gastos', en: 'Cost' },
  'cookbook.profitLabel':       { fil: 'Tubo', en: 'Profit' },
};

export function createT(lang: Language) {
  return (key: string, ...args: (string | number)[]) => {
    const entry = dict[key];
    if (!entry) return key;
    let text = entry[lang];
    args.forEach((arg, i) => {
      text = text.replaceAll(`{${i}}`, String(arg));
    });
    return text;
  };
}

export const WEATHER_ICONS: Record<string, string> = {
  SUNNY: '☀️', CLOUDY: '⛅', RAINY: '🌧️', STORM: '⛈️',
};

export const PHASE_ICONS: Record<string, string> = {
  MORNING_BRIEFING: '🌅', PALENGKE: '🛒', MENU_PLANNING: '🍳',
  STAFF_ASSIGNMENT: '👥', OPERATIONS: '🏪', SUMMARY: '📊', STORE_CLOSED: '🌙',
};

export const DAYS: Record<Language, string[]> = {
  fil: ['Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado', 'Linggo'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const CATEGORIES = ['ALL', 'MEAT', 'VEGGIE', 'STAPLE', 'CONDIMENT', 'MISC'] as const;
