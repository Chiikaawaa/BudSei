import React, { useRef, useCallback, useEffect } from 'react';
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

export const AppLayout = React.memo(function AppLayout({
  topBar,
  navRail,
  consolePane,
  resultsPane,
  subsystemPanel,
  bottomDrawerContent,
  footer,
}: AppLayoutProps) {
  const navRailCollapsed = useUiStore((s) => s.navRailCollapsed);
  const bottomDrawerOpen = useUiStore((s) => s.bottomDrawerOpen);
  const bottomDrawerTab = useUiStore((s) => s.bottomDrawerTab);
  const bottomDrawerHeight = useUiStore((s) => s.bottomDrawerHeight);
  const consoleSplitRatio = useUiStore((s) => s.consoleSplitRatio);
  const toggleBottomDrawer = useUiStore((s) => s.toggleBottomDrawer);
  const setBottomDrawerTab = useUiStore((s) => s.setBottomDrawerTab);
  const setConsoleSplitRatio = useUiStore((s) => s.setConsoleSplitRatio);

  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Sync initial and store updates to CSS custom property
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.style.setProperty(
        '--console-split-pct',
        `${consoleSplitRatio * 100}%`
      );
    }
  }, [consoleSplitRatio]);

  const handleDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';

      const startY = e.clientY;
      const container = consoleContainerRef.current;
      if (!container) return;
      const totalHeight = container.getBoundingClientRect().height;
      const startRatio = consoleSplitRatio;
      let targetRatio = startRatio;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const deltaY = moveEvent.clientY - startY;
        const rawRatio = startRatio + deltaY / totalHeight;
        targetRatio = Math.min(0.85, Math.max(0.15, rawRatio));

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            if (container) {
              container.style.setProperty('--console-split-pct', `${targetRatio * 100}%`);
            }
            rafIdRef.current = null;
          });
        }
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        setConsoleSplitRatio(targetRatio);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [consoleSplitRatio, setConsoleSplitRatio]
  );

  return (
    <div className={styles.appShell}>
      {/* TopBar region */}
      <header className={styles.topBarRegion}>{topBar}</header>

      {/* Main middle workspace */}
      <div className={styles.workspaceRegion}>
        <aside className={`${styles.navRailRegion} ${navRailCollapsed ? styles.collapsed : ''}`}>
          {navRail}
        </aside>

        <section className={styles.consoleColumnRegion} ref={consoleContainerRef}>
          <div className={styles.consolePaneWrapper}>{consolePane}</div>

          <div
            className={styles.draggableDivider}
            onMouseDown={handleDividerMouseDown}
            role="separator"
            aria-orientation="horizontal"
          />

          <div className={styles.resultsPaneWrapper}>{resultsPane}</div>
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
});
