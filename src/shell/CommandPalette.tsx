import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './CommandPalette.module.css';
import { useUiStore } from '../store/uiStore';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import { useConsoleStore } from '../store/consoleStore';
import { SUBSYSTEM_ROUTES } from '../app/routes';
import { SQL_PRESETS } from '../engine/presets';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  action: () => void;
}

export const CommandPalette = React.memo(function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleTheoryDrawer } = useUiStore();
  const { setActiveSubsystem, toggleConnectionMode } = useSessionStore();
  const { toggleTheme, toggleMascot, mascotEnabled } = useSettingsStore();
  const { loadPreset, execute } = useConsoleStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const commands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      {
        id: 'exec',
        category: 'Execution',
        title: 'Run Query (Execute SQL)',
        action: () => execute(),
      },
      {
        id: 'theory',
        category: 'Help',
        title: 'Open Why // Database Theory Drawer',
        action: () => toggleTheoryDrawer(),
      },
      {
        id: 'theme',
        category: 'Settings',
        title: 'Toggle Theme (Dark / Light)',
        action: () => toggleTheme(),
      },
      {
        id: 'mascot',
        category: 'Settings',
        title: `Mascot: ${mascotEnabled ? 'Turn Off' : 'Turn On'}`,
        action: () => toggleMascot(),
      },
      {
        id: 'mode',
        category: 'Concurrency',
        title: 'Toggle Mode: Single / Dual Connection',
        action: () => toggleConnectionMode(),
      },
    ];

    for (const r of SUBSYSTEM_ROUTES) {
      list.push({
        id: `nav_${r.id}`,
        category: 'Navigation',
        title: `Go to ${r.label}`,
        action: () => {
          setActiveSubsystem(r.id);
          window.location.hash = `#${r.id}`;
        },
      });
    }

    for (const p of SQL_PRESETS) {
      list.push({
        id: `preset_${p.id}`,
        category: 'Presets',
        title: `Load Preset: ${p.label}`,
        action: () => loadPreset(p.sql),
      });
    }

    return list;
  }, [execute, toggleTheoryDrawer, toggleTheme, toggleMascot, mascotEnabled, toggleConnectionMode, setActiveSubsystem, loadPreset]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const runItem = useCallback(
    (item: CommandItem) => {
      item.action();
      setCommandPaletteOpen(false);
      setQuery('');
    },
    [setCommandPaletteOpen]
  );

  if (!commandPaletteOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setCommandPaletteOpen(false)}>
      <div className={styles.paletteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a command or search (e.g. storage, preset, theme, mascot)…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
        </div>

        <div className={styles.list}>
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className={`${styles.item} ${idx === selectedIndex ? styles.selectedItem : ''}`}
              onClick={() => runItem(item)}
            >
              <span className={styles.categoryBadge}>{item.category}</span>
              <span className={styles.itemTitle}>{item.title}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={styles.empty}>No matching commands found.</div>
          )}
        </div>
      </div>
    </div>
  );
});
