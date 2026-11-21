import React, { useRef, useCallback } from 'react';
import styles from './AppLayout.module.css';
import { useUiStore } from '../../store/uiStore';
import { Tabs } from '../../ui/Tabs';

interface AppLayoutProps {
  topBar: React.ReactNode;
  navRail: React.ReactNode;
  consolePane: React.ReactNode;
  resultsPane: React.ReactNode;
  subsystemPanel: React.ReactNode;
  bottomDrawerContent?: React.ReactNode;
  footer: React.ReactNode;
}

export function AppLayout({
  topBar,
  navRail,
  consolePane,
  resultsPane,
  subsystemPanel,
  bottomDrawerContent,
  footer,
}: AppLayoutProps) {
  const {
    navRailCollapsed,
    bottomDrawerOpen,
    bottomDrawerTab,
    bottomDrawerHeight,
    consoleSplitRatio,
    toggleBottomDrawer,
    setBottomDrawerTab,
    setConsoleSplitRatio,
  } = useUiStore();

  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const startY = e.clientY;
    const container = consoleContainerRef.current;
    if (!container) return;
    const totalHeight = container.getBoundingClientRect().height;
    const startRatio = consoleSplitRatio;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startY;
      const newRatio = startRatio + deltaY / totalHeight;
      setConsoleSplitRatio(newRatio);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [consoleSplitRatio, setConsoleSplitRatio]);

  return (
    <div className={styles.appShell}>
      {/* TopBar region */}
      <header className={styles.topBarRegion}>{topBar}</header>

      {/* Main middle workspace: NavRail + Console Column + Subsystem */}
      <div className={styles.workspaceRegion}>
        <aside className={`${styles.navRailRegion} ${navRailCollapsed ? styles.collapsed : ''}`}>
          {navRail}
        </aside>

        <section className={styles.consoleColumnRegion} ref={consoleContainerRef}>
          <div
            className={styles.consolePaneWrapper}
            style={{ height: `calc(${consoleSplitRatio * 100}% - 4px)` }}
          >
            {consolePane}
          </div>

          <div
            className={styles.draggableDivider}
            onMouseDown={handleDividerMouseDown}
            role="separator"
            aria-orientation="horizontal"
          />

          <div
            className={styles.resultsPaneWrapper}
            style={{ height: `calc(${(1 - consoleSplitRatio) * 100}% - 4px)` }}
          >
            {resultsPane}
          </div>
        </section>

        <main className={styles.subsystemRegion}>{subsystemPanel}</main>
      </div>

      {/* Bottom drawer bar + expandable content */}
      <div className={styles.bottomDrawerContainer}>
        <div className={styles.bottomDrawerHeader}>
          <Tabs
            tabs={[
              { id: 'execution-log', label: 'Execution Log' },
              { id: 'timeline', label: 'Time-Travel Timeline' },
            ]}
            activeId={bottomDrawerOpen ? bottomDrawerTab : ''}
            onChange={(id) => setBottomDrawerTab(id as 'execution-log' | 'timeline')}
          />
          <button
            type="button"
            className={styles.drawerToggleBtn}
            onClick={toggleBottomDrawer}
            title={bottomDrawerOpen ? 'Collapse Drawer' : 'Expand Drawer'}
          >
            {bottomDrawerOpen ? '▾' : '▴'}
          </button>
        </div>
        {bottomDrawerOpen && (
          <div className={styles.bottomDrawerBody} style={{ height: `${bottomDrawerHeight}px` }}>
            {bottomDrawerContent || (
              <div className={styles.emptyDrawer}>
                Execution log & time-travel snapshots will appear here.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footerRegion}>{footer}</footer>
    </div>
  );
}
