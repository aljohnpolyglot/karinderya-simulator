import { createT, type Language } from '../lib/i18n';

interface Props {
  language: Language;
  onStartGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
}

export function HomeMenu({ language, onStartGame, onLoadGame, onSettings }: Props) {
  const t = createT(language);
  const hasSave = !!localStorage.getItem('karinderya-save');

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 select-none">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🍲</span>
            <h1
              className="text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Fredoka', sans-serif", color: '#F5EBD3' }}
            >
              KARINDERYA
            </h1>
            <span className="text-4xl">🍚</span>
          </div>
          <h2
            className="text-2xl font-semibold -mt-1"
            style={{ fontFamily: "'Fredoka', sans-serif", color: '#D97706' }}
          >
            SIMULATOR
          </h2>
          <p className="text-sm mt-3 italic" style={{ color: '#C19A6B' }}>
            {t('home.tagline')}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <MenuButton onClick={onStartGame} primary>
            {t('home.start')}
          </MenuButton>
          <MenuButton onClick={onLoadGame} disabled={!hasSave} subtitle={!hasSave ? t('home.noSave') : undefined}>
            {t('home.load')}
          </MenuButton>
          <MenuButton onClick={onSettings}>
            {t('home.settings')}
          </MenuButton>
        </div>

        <p className="text-xs mt-4" style={{ color: '#8B7355' }}>
          v0.1 — Prototype
        </p>
      </div>
    </div>
  );
}

function MenuButton({
  children, onClick, primary, disabled, subtitle,
}: {
  children: React.ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean; subtitle?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-xl px-6 py-4 text-lg font-semibold transition-all
        ${primary
          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-900/30 hover:from-amber-500 hover:to-orange-500 active:scale-[0.98]'
          : 'bg-karinderya-paper/90 text-karinderya-wood-dark hover:bg-karinderya-paper active:scale-[0.98] shadow-md'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {children}
      {subtitle && <span className="block text-xs font-normal mt-0.5 opacity-60">{subtitle}</span>}
    </button>
  );
}
