import { useGameStore } from '../../stores/gameStore';
import { DAYS, WEATHER_ICONS, createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onQuit: () => void;
}

export function TopBar({ language, onQuit }: Props) {
  const { day, dayOfWeek, hour, minute, cash, reputation, dailyConditions } = useGameStore();
  const t = createT(language);
  const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayOfWeek);
  const dayLabel = DAYS[language][dayIndex] || dayOfWeek;
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const period = hour < 12 ? 'AM' : 'PM';

  return (
    <header className="bg-karinderya-wood-dark/95 text-karinderya-cream px-4 py-2.5 flex items-center justify-between gap-4 text-sm shadow-md select-none shrink-0"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      <button onClick={onQuit} className="text-karinderya-cream/60 hover:text-karinderya-cream text-xs font-bold cursor-pointer">✕</button>

      <div className="flex items-center gap-1.5">
        <span className="bg-karinderya-wood/60 rounded-lg px-2.5 py-1 font-bold text-xs">
          {t('topbar.day')} {day}
        </span>
        <span className="text-karinderya-cream/70 text-xs">{dayLabel}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-base">{WEATHER_ICONS[dailyConditions.weather] || '☀️'}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-lg font-bold tabular-nums">{timeStr}</span>
        <span className="text-[10px] text-karinderya-cream/60 font-bold">{period}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-karinderya-cream/60 font-bold">₱</span>
        <span className="text-lg font-bold tabular-nums text-amber-300">{cash.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-base">⭐</span>
        <span className="font-bold">{reputation.toFixed(1)}</span>
      </div>
    </header>
  );
}
