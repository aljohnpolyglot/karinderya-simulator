import { useGameStore } from '../../stores/gameStore';
import { createT, type Language } from '../../lib/i18n';

interface Props {
  language: Language;
  onNext: () => void;
}

export function StaffAssignment({ language, onNext }: Props) {
  const { staff, assignStaff } = useGameStore();
  const t = createT(language);
  const assignedCount = staff.filter(s => s.isAssigned).length;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          👥 {t('staff.title')}
        </h1>
        <p className="text-sm text-karinderya-wood/70 mt-1">{t('staff.subtitle')}</p>
      </div>

      <div className="space-y-3">
        {staff.map(s => (
          <button
            key={s.id}
            onClick={() => assignStaff(s.id)}
            className={`w-full rounded-xl p-4 text-left transition-all cursor-pointer flex items-center gap-4 ${
              s.isAssigned ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-karinderya-cream hover:bg-amber-50'
            }`}
          >
            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.id}&backgroundColor=f5ebd3`} alt={s.name} className="w-14 h-14 rounded-full bg-karinderya-cream shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-karinderya-wood-dark">{s.name}</div>
              <div className="text-xs text-karinderya-wood/60">{t(`role.${s.role}`)} — ₱{s.salary}/araw</div>
              <div className="flex gap-3 mt-1.5 text-[10px] font-bold text-karinderya-wood/50 uppercase">
                <span>🍳 {s.cookingSkill}</span>
                <span>⚡ {s.speed}</span>
                <span>😊 {s.friendliness}</span>
                <span>💪 {Math.round(s.stamina)}%</span>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              s.isAssigned ? 'bg-amber-500 border-amber-500 text-white' : 'border-karinderya-wood/30'
            }`}>
              {s.isAssigned && '✓'}
            </div>
          </button>
        ))}
      </div>

      <div className="text-sm text-karinderya-wood/60">{t('staff.assignedCount', assignedCount)}</div>

      <button onClick={onNext} disabled={assignedCount === 0}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-4 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40">
        {t('staff.nextButton')}
      </button>
    </div>
  );
}
