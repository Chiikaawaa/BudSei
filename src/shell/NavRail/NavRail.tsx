import React, { useEffect, useCallback } from 'react';
import styles from './NavRail.module.css';
import { SUBSYSTEM_ROUTES } from '../../app/routes';
import { useSessionStore } from '../../store/sessionStore';
import { useUiStore } from '../../store/uiStore';
import { NavIcon } from './navIcons';

export const NavRail = React.memo(function NavRail() {
  const { activeSubsystem, setActiveSubsystem } = useSessionStore();
  const { navRailCollapsed, toggleNavRail } = useUiStore();

  const handleSelect = useCallback(
    (id: string) => {
      setActiveSubsystem(id);
      window.location.hash = `#${id}`;
    },
    [setActiveSubsystem]
  );

  // Sync hash with store on load and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (SUBSYSTEM_ROUTES.some((r) => r.id === hash)) {
        setActiveSubsystem(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveSubsystem]);

  // Keyboard navigation: Up / Down arrow + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable ||
        Boolean(target?.closest('.cm-editor')) ||
        Boolean(target?.closest('[contenteditable="true"]'))
      ) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = SUBSYSTEM_ROUTES.findIndex((r) => r.id === activeSubsystem);
        const nextIndex =
          e.key === 'ArrowDown'
            ? (currentIndex + 1) % SUBSYSTEM_ROUTES.length
            : (currentIndex - 1 + SUBSYSTEM_ROUTES.length) % SUBSYSTEM_ROUTES.length;
        handleSelect(SUBSYSTEM_ROUTES[nextIndex].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubsystem, handleSelect]);

  return (
    <nav className={styles.navRail}>
      <div className={styles.headerRow}>
        {!navRailCollapsed && <span className={styles.headerTitle}>NAVIGATION</span>}
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={toggleNavRail}
          title={navRailCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {navRailCollapsed ? '⇥' : '⇤'}
        </button>
      </div>

      <div className={styles.navList}>
        {SUBSYSTEM_ROUTES.map((route) => {
          const isActive = route.id === activeSubsystem;
          return (
            <button
              key={route.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleSelect(route.id)}
              title={navRailCollapsed ? route.label : undefined}
            >
              <span className={styles.iconWrapper}>
                <NavIcon id={route.id} />
              </span>
              {!navRailCollapsed && <span className={styles.navLabel}>{route.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
});
