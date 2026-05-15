import { useGameStore } from '../stores/gameStore';
import type { Language } from '../App';
import { TopBar } from './ui/TopBar';
import { BottomNav } from './ui/BottomNav';
import { MorningBriefing } from './phases/MorningBriefing';
import { Palengke } from './phases/Palengke';
import { MenuPlanning } from './phases/MenuPlanning';
import { StaffAssignment } from './phases/StaffAssignment';
import { Operations } from './phases/Operations';
import { Summary } from './phases/Summary';
import { StoreClosed } from './phases/StoreClosed';

interface Props {
  language: Language;
  onQuit: () => void;
}

export function Game({ language, onQuit }: Props) {
  const phase = useGameStore(s => s.phase);
  const nextPhase = useGameStore(s => s.nextPhase);

  const renderPhase = () => {
    const props = { language, onNext: nextPhase };
    switch (phase) {
      case 'MORNING_BRIEFING': return <MorningBriefing {...props} />;
      case 'PALENGKE':         return <Palengke {...props} />;
      case 'MENU_PLANNING':    return <MenuPlanning {...props} />;
      case 'STAFF_ASSIGNMENT': return <StaffAssignment {...props} />;
      case 'OPERATIONS':       return <Operations {...props} />;
      case 'SUMMARY':          return <Summary {...props} />;
      case 'STORE_CLOSED':     return <StoreClosed {...props} />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <TopBar language={language} onQuit={onQuit} />
      <main className="flex-1 overflow-y-auto bg-paper custom-scrollbar">
        {renderPhase()}
      </main>
      <BottomNav language={language} />
    </div>
  );
}
