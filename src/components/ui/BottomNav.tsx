import { useGameStore } from '../../stores/gameStore';
import type { GamePhase } from '../../types/game';
import { PHASE_ICONS, createT, type Language } from '../../lib/i18n';

const PHASE_ORDER: GamePhase[] = [
  'MORNING_BRIEFING', 'PALENGKE', 'MENU_PLANNING', 'PRICING',
  'STAFF_ASSIGNMENT', 'OPERATIONS', 'SUMMARY', 'STORE_CLOSED',
];

interface Props {
  language: Language;
}

export function BottomNav({ language }: Props) {
  const phase = useGameStore(s => s.phase);
  const currentIndex = PHASE_ORDER.indexOf(phase);
  const t = createT(language);

  return (
    <nav className="bg-karinderya-wood-dark/95 border-t border-karinderya-wood/40 px-2 py-1.5 shrink-0 select-none overflow-x-auto scrollbar-none">
      <div className="flex gap-1 min-w-max justify-center">
        {PHASE_ORDER.map((p, i) => {
          const isActive = p === phase;
          const isPast = i < currentIndex;
          return (
            <div
              key={p}
              className={`
                flex flex-col items-center px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all min-w-[60px]
                ${isActive
                  ? 'bg-amber-600/90 text-white shadow-md'
                  : isPast
                    ? 'text-karinderya-cream/40'
                    : 'text-karinderya-cream/60'
                }
              `}
            >
              <span className="text-base mb-0.5">{PHASE_ICONS[p]}</span>
              <span className="uppercase tracking-wider">{t(`phase.${p}`)}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
