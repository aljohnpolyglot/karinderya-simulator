import { createT, type Language } from '../lib/i18n';

interface Props {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onBack: () => void;
}

export function Settings({ language, onChangeLanguage, onBack }: Props) {
  const t = createT(language);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 select-none">
      <div className="w-full max-w-md bg-paper rounded-2xl p-8 shadow-xl">
        <h1
          className="text-3xl font-bold mb-8 text-karinderya-wood-dark"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          {t('settings.title')}
        </h1>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-karinderya-wood mb-3 uppercase tracking-wider">
            {t('settings.language')}
          </label>
          <div className="flex gap-3">
            <LangButton active={language === 'fil'} onClick={() => onChangeLanguage('fil')} flag="🇵🇭" label={t('settings.filipino')} />
            <LangButton active={language === 'en'} onClick={() => onChangeLanguage('en')} flag="🇺🇸" label={t('settings.english')} />
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-sm font-semibold text-karinderya-wood hover:text-karinderya-amber transition-colors cursor-pointer"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {t('settings.back')}
        </button>
      </div>
    </div>
  );
}

function LangButton({ active, onClick, flag, label }: { active: boolean; onClick: () => void; flag: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-base font-semibold transition-all cursor-pointer
        ${active
          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
          : 'bg-karinderya-cream text-karinderya-wood-dark hover:bg-amber-100'
        }
      `}
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <span className="text-xl">{flag}</span>
      {label}
    </button>
  );
}
