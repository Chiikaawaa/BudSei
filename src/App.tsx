import { useEffect } from 'react';
import { AppLayout } from './app/layout/AppLayout';
import { StartupAnimation } from './app/StartupAnimation/StartupAnimation';
import { TopBar } from './shell/TopBar/TopBar';
import { NavRail } from './shell/NavRail/NavRail';
import { ConsolePane } from './shell/ConsolePane/ConsolePane';
import { ResultsPane } from './shell/ResultsPane/ResultsPane';
import { BottomDrawer } from './shell/BottomDrawer/BottomDrawer';
import { TheoryDrawer } from './learn/theory-drawer/TheoryDrawer';
import { CommandPalette } from './shell/CommandPalette';
import { SettingsMenu } from './shell/SettingsMenu/SettingsMenu';
import { Cat } from './mascot/Cat';
import { SubsystemHost } from './subsystems/SubsystemHost';
import { useSessionStore } from './store/sessionStore';
import { sqliteRpc } from './engine/rpc';

export function App() {
  const { sqliteVersion, setSqliteVersion, setPageStats, setJournalMode } = useSessionStore();

  useEffect(() => {
    sqliteRpc
      .init()
      .then((data) => {
        setSqliteVersion(data.version);
        setPageStats(
          data.pageStats.pageSize,
          data.pageStats.pageCount,
          data.pageStats.freelistCount
        );
        setJournalMode(data.pageStats.journalMode);
      })
      .catch((err) => {
        console.error('Failed to initialize SQLite WASM:', err);
      });
  }, [setSqliteVersion, setPageStats, setJournalMode]);

  return (
    <>
      <StartupAnimation />
      <AppLayout
        topBar={<TopBar />}
        navRail={<NavRail />}
        consolePane={<ConsolePane />}
        resultsPane={<ResultsPane />}
        subsystemPanel={<SubsystemHost />}
        bottomDrawerContent={<BottomDrawer />}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>BUDSEI v0.2</span>
            <span>•</span>
            <span>SQLITE {sqliteVersion} WASM</span>
          </div>
        }
      />
      <TheoryDrawer />
      <CommandPalette />
      <SettingsMenu />
      <Cat />
    </>
  );
}
