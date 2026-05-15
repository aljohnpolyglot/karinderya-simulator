import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

const CUSTOMER_NAMES = [
  'Kuya Mark', 'Ate Liza', 'Mang Tonyo', 'Ate Joy', 'Kuya Jun',
  'Tita Belen', 'Lolo Bert', 'Lola Nena', 'Jepoy', 'Mimi',
  'Kuya Rodel', 'Ate Grace', 'Mang Kiko', 'Tita Cora', 'Kuya Jojo',
];

const SPEED_LABELS = ['1x', '2x', '5x', '10x'];
const SPEED_VALUES = [1, 2, 5, 10];
const BASE_INTERVAL = 800;

function endDay(lang: Language, setEventLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const t = createT(lang);
  const s = useGameStore.getState();
  if (s.phase !== 'OPERATIONS') return;
  const wages = s.staff.filter(st => st.isAssigned).reduce((sum, st) => sum + st.salary, 0);
  const wasteCost = Object.values(s.preparedDishes).reduce((sum, p) => sum + p.servings * 5, 0);
  const served = s.sessionStats.served;
  const lost = s.sessionStats.lost;
  const total = served + lost;
  const serveRatio = total > 0 ? served / total : 0;
  // Rep: +0.2 per served, -0.1 per lost, but capped so a sold-out day isn't catastrophic
  const repChange = Math.max(-3, (served * 0.2) - (lost * 0.1));
  s.finishSimulation({
    customersServed: served,
    customersLost: lost,
    revenue: s.sessionStats.revenue,
    ingredientCost: 0,
    wages,
    wasteCost,
    profit: s.sessionStats.revenue - wages - wasteCost,
    reputationChange: repChange,
    bestSellerId: undefined,
    bottleneck: undefined,
    riceSold: s.sessionStats.riceSold,
    riceShortageCount: s.sessionStats.riceShortage,
    averageSatisfaction: served > 0 ? Math.round(serveRatio * 100) : 0,
    wastedServings: Object.values(s.preparedDishes).reduce((sum, p) => sum + p.servings, 0),
  });
  setEventLog(prev => [...prev, t('ops.shopClosed')]);
}

function simulateTick(lang: Language, setEventLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const t = createT(lang);
  const s = useGameStore.getState();
  if (s.hour >= 21 || s.phase !== 'OPERATIONS') return false;

  s.tick();
  const st = useGameStore.getState();
  const demandMod = st.dailyConditions.modifiers.demand;
  let arrivalChance = 0.3 * demandMod;
  if (st.rushStatus === 'LUNCH RUSH') arrivalChance = 0.7 * demandMod;
  else if (st.rushStatus === 'DINNER RUSH') arrivalChance = 0.55 * demandMod;
  else if (st.rushStatus === 'BREAKFAST') arrivalChance = 0.4 * demandMod;
  else if (st.rushStatus === 'SIESTA') arrivalChance = 0.15 * demandMod;

  // Auto-close when completely sold out
  const anyDishLeft = Object.values(st.preparedDishes).some(p => p.servings > 0);
  if (!anyDishLeft && Object.keys(st.preparedDishes).length > 0) {
    setEventLog(prev => [...prev, `${st.hour}:${String(st.minute).padStart(2, '0')} — 🎉 ${t('ops.soldOut')}`]);
    endDay(lang, setEventLog);
    return false;
  }

  if (Math.random() < arrivalChance) {
    const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const dishIds = Object.keys(st.preparedDishes).filter(id => st.preparedDishes[id].servings > 0);
    const timeStr = `${st.hour}:${String(st.minute).padStart(2, '0')}`;

    if (dishIds.length > 0) {
      const dishId = dishIds[Math.floor(Math.random() * dishIds.length)];
      const dish = st.activeDishes.find(d => d.id === dishId);
      const price = st.dishPrices[dishId] || dish?.sellingPrice || 0;

      useGameStore.setState(prev => {
        const pd = { ...prev.preparedDishes };
        if (pd[dishId]) pd[dishId] = { ...pd[dishId], servings: pd[dishId].servings - 1 };
        const riceUsed = prev.cookedRiceServings > 0 ? 1 : 0;
        return {
          preparedDishes: pd,
          cookedRiceServings: prev.cookedRiceServings - riceUsed,
          sessionStats: {
            ...prev.sessionStats,
            served: prev.sessionStats.served + 1,
            revenue: prev.sessionStats.revenue + price + (riceUsed * 15),
            riceSold: prev.sessionStats.riceSold + riceUsed,
            riceShortage: prev.sessionStats.riceShortage + (riceUsed === 0 ? 1 : 0),
          },
        };
      });
      setEventLog(prev => [...prev, `${timeStr} — ${name} ${t('ops.ordered')} ${dish?.name || dishId} (+₱${price})`]);
    } else {
      useGameStore.setState(prev => ({
        sessionStats: { ...prev.sessionStats, lost: prev.sessionStats.lost + 1 },
      }));
      setEventLog(prev => [...prev, `${timeStr} — ${name} ${t('ops.leftNoFood')} ❌`]);
    }
  }

  if (useGameStore.getState().hour >= 21) {
    endDay(lang, setEventLog);
    return false;
  }
  return true;
}

export function Operations({ language }: Props) {
  const t = createT(language);
  const logRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [eventLog, setEventLog] = useState<string[]>([t('ops.shopOpen')]);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const hour = useGameStore(s => s.hour);
  const minute = useGameStore(s => s.minute);
  const preparedDishes = useGameStore(s => s.preparedDishes);
  const cookedRiceServings = useGameStore(s => s.cookedRiceServings);
  const rushStatus = useGameStore(s => s.rushStatus);
  const sessionStats = useGameStore(s => s.sessionStats);
  const activeDishes = useGameStore(s => s.activeDishes);
  const phase = useGameStore(s => s.phase);

  const isFinished = phase !== 'OPERATIONS';

  const startInterval = useCallback(() => {
    clearInterval(tickRef.current);
    if (paused || isFinished) return;
    const speed = SPEED_VALUES[speedIndex];
    tickRef.current = setInterval(() => {
      const ok = simulateTick(language, setEventLog);
      if (!ok) clearInterval(tickRef.current);
    }, BASE_INTERVAL / speed);
  }, [speedIndex, paused, language, isFinished]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(tickRef.current);
  }, [startInterval]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [eventLog]);

  const handleSimToEnd = () => {
    clearInterval(tickRef.current);
    let safety = 0;
    while (safety < 500) {
      const ok = simulateTick(language, setEventLog);
      if (!ok) break;
      safety++;
    }
    if (useGameStore.getState().phase === 'OPERATIONS') {
      endDay(language, setEventLog);
    }
  };

  const totalServings = Object.values(preparedDishes).reduce((s, p) => s + p.servings, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🏪 {t('ops.title')}
          </h1>
          <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            rushStatus === 'LUNCH RUSH' || rushStatus === 'DINNER RUSH'
              ? 'bg-rose-100 text-rose-700'
              : rushStatus === 'BREAKFAST' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>{rushStatus}</div>
        </div>
        <div className="text-right text-sm text-karinderya-wood/60">
          {hour}:{String(minute).padStart(2, '0')} {hour < 12 ? 'AM' : 'PM'}
        </div>
      </div>

      {/* Speed Control */}
      <div className="bg-karinderya-cream rounded-xl p-3 flex items-center gap-3">
        <button onClick={() => setPaused(p => !p)} disabled={isFinished}
          className={`w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center cursor-pointer transition-colors ${
            paused ? 'bg-emerald-600 text-white' : 'bg-karinderya-wood-dark/10 text-karinderya-wood-dark'
          } disabled:opacity-40`}>
          {paused ? '▶' : '⏸'}
        </button>
        <div className="flex-1 flex items-center gap-2">
          <input type="range" min={0} max={SPEED_VALUES.length - 1} value={speedIndex}
            onChange={(e) => setSpeedIndex(Number(e.target.value))} disabled={isFinished}
            className="flex-1 accent-amber-600 cursor-pointer" />
          <span className="text-sm font-bold text-karinderya-wood-dark w-8 text-center tabular-nums">{SPEED_LABELS[speedIndex]}</span>
        </div>
        <button onClick={handleSimToEnd} disabled={isFinished}
          className="bg-karinderya-wood-dark text-karinderya-cream font-semibold text-xs rounded-lg px-3 py-2 cursor-pointer disabled:opacity-40 hover:bg-karinderya-wood transition-colors whitespace-nowrap">
          {t('ops.simToEnd')}
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatBox label={t('ops.served')} value={sessionStats.served.toString()} icon="👤" />
        <StatBox label={t('ops.lost')} value={sessionStats.lost.toString()} icon="💨" alert={sessionStats.lost > 0} />
        <StatBox label={t('ops.revenue')} value={`₱${sessionStats.revenue.toLocaleString()}`} icon="💰" />
        <StatBox label={t('ops.rice')} value={cookedRiceServings.toString()} icon="🍚" alert={cookedRiceServings <= 3} />
      </div>

      {/* Display Case */}
      <div>
        <h2 className="text-xs font-bold text-karinderya-wood/50 uppercase mb-2">
          {t('ops.displayCase')} — {t('ops.servingsLeft', totalServings)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(preparedDishes).map(([dishId, pd]) => {
            const dish = activeDishes.find(d => d.id === dishId);
            return (
              <div key={dishId} className={`bg-karinderya-cream rounded-lg p-3 text-center ${pd.servings === 0 ? 'opacity-40' : ''}`}>
                <div className="text-sm font-semibold text-karinderya-wood-dark truncate">{dish?.name || dishId}</div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">{pd.servings}</div>
                <div className="text-[10px] text-karinderya-wood/50">servings</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Log */}
      <div>
        <h2 className="text-xs font-bold text-karinderya-wood/50 uppercase mb-2">{t('ops.eventLog')}</h2>
        <div ref={logRef} className="bg-karinderya-wood-dark/5 rounded-xl p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-xs space-y-1">
          {eventLog.map((msg, i) => (
            <div key={i} className="text-karinderya-wood-dark/80">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, alert }: { label: string; value: string; icon: string; alert?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center ${alert ? 'bg-rose-50' : 'bg-karinderya-cream'}`}>
      <div className="text-lg mb-0.5">{icon}</div>
      <div className={`text-lg font-bold tabular-nums ${alert ? 'text-rose-700' : 'text-karinderya-wood-dark'}`}>{value}</div>
      <div className="text-[10px] font-bold text-karinderya-wood/50 uppercase">{label}</div>
    </div>
  );
}
