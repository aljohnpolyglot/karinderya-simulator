import { createT, type Language } from '../../lib/i18n';

interface ReceiptItem {
  ingredientId: string;
  icon: string;
  name: string;
  unit: string;
  toBuy: number;
  unitCost: number;
  totalCost: number;
}

interface Props {
  language: Language;
  items: ReceiptItem[];
  totalCost: number;
  remainingCash: number;
  onConfirm: () => void;
}

export function ReceiptModal({ language, items, totalCost, remainingCash, onConfirm }: Props) {
  const t = createT(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="text-center border-b border-dashed border-karinderya-wood/20 pb-3">
          <div className="text-2xl mb-1">🧾</div>
          <h3 className="text-lg font-bold text-karinderya-wood-dark" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {t('receipt.title')}
          </h3>
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
          {items.map(item => (
            <div key={item.ingredientId} className="flex items-center gap-2 text-sm">
              <span>{item.icon}</span>
              <span className="flex-1 text-karinderya-wood-dark truncate">{item.name}</span>
              <span className="text-xs text-karinderya-wood/50 tabular-nums">{item.toBuy} {item.unit}</span>
              <span className="font-bold text-karinderya-wood-dark tabular-nums w-16 text-right">₱{item.totalCost}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-karinderya-wood/20 pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-karinderya-wood-dark">{t('receipt.totalDeducted')}</span>
            <span className="font-bold text-xl text-rose-700 tabular-nums">-₱{totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-karinderya-wood/50">{t('receipt.remaining')}</span>
            <span className="font-bold text-amber-700 tabular-nums">₱{remainingCash.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={onConfirm}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl px-6 py-3 text-lg shadow-lg hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all cursor-pointer">
          {t('receipt.confirm')}
        </button>
      </div>
    </div>
  );
}
