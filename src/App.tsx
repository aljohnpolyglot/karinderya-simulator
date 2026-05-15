import { useState } from 'react';
import { HomeMenu } from './components/HomeMenu';
import { Settings } from './components/Settings';
import { Game } from './components/Game';

import type { Language } from './lib/i18n';

export type Screen = 'home' | 'game' | 'settings';
export type { Language };

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [language, setLanguage] = useState<Language>('fil');

  return (
    <div className="h-full bg-wood">
      {screen === 'home' && (
        <HomeMenu
          language={language}
          onStartGame={() => setScreen('game')}
          onLoadGame={() => {}}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'settings' && (
        <Settings
          language={language}
          onChangeLanguage={setLanguage}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'game' && (
        <Game
          language={language}
          onQuit={() => setScreen('home')}
        />
      )}
    </div>
  );
}
