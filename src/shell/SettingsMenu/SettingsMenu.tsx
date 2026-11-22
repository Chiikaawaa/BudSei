import React, { useCallback, useEffect, useRef } from 'react';
import styles from './SettingsMenu.module.css';
import { ColorRow } from './ColorRow';
import {
  useSettingsStore,
  ACCENT_PRESETS,
  DARK_BG_PRESETS,
  LIGHT_BG_PRESETS,
  CAT_PRESETS,
} from '../../store/settingsStore';
import { CatSprite } from '../../mascot/catSprite.svg';

export const SettingsMenu = React.memo(function SettingsMenu() {
  const {
    theme, setTheme,
    accentColor, isCustomAccent, setAccentColor, resetAccentColor,
    bgColor, setBgColor, resetBgColor,
    catColor, isCustomCatColor, setCatColor, resetCatColor,
    mascotEnabled, toggleMascot,
    menuOpen, setMenuOpen,
  } = useSettingsStore();

  const overlayRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setMenuOpen(false), [setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, close]);

  if (!menuOpen) return null;
  const bgPresets = theme === 'dark' ? DARK_BG_PRESETS : LIGHT_BG_PRESETS;

  return (
    <>
      <div
        ref={overlayRef}
        className={styles.overlay}
        onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      />

      <div className={styles.panel} role="dialog" aria-label="Settings">
        <div className={styles.header}>
          <span className={styles.headerTitle}>Theme & Mascot Settings</span>
          <button type="button" className={styles.closeBtn} onClick={close}>✕</button>
        </div>

        <div className={styles.body}>
          {/* Theme Mode */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Theme Mode</span>
            <div className={styles.themeRow}>
              <button
                type="button"
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
              >
                <span>◐</span> <span>Dark Mode</span>
              </button>
              <button
                type="button"
                className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => setTheme('light')}
              >
                <span>◑</span> <span>Light Mode</span>
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Accent Color Customizer */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Accent Color</span>
              {isCustomAccent && (
                <button type="button" className={styles.resetBtn} onClick={resetAccentColor}>Reset</button>
              )}
            </div>
            <div className={styles.swatchRow}>
              {ACCENT_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`${styles.swatch} ${accentColor.toLowerCase() === hex.toLowerCase() ? styles.selected : ''}`}
                  style={{ background: hex }}
                  onClick={() => setAccentColor(hex)}
                  title={hex}
                />
              ))}
            </div>
            <ColorRow
              label="Custom"
              value={accentColor}
              onChange={setAccentColor}
              onReset={resetAccentColor}
              showReset={isCustomAccent}
            />
          </div>

          <div className={styles.divider} />

          {/* Background Palette */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Background Theme</span>
              {bgColor && (
                <button type="button" className={styles.resetBtn} onClick={resetBgColor}>Reset</button>
              )}
            </div>
            <div className={styles.swatchRow}>
              {bgPresets.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  className={`${styles.swatchPill} ${bgColor?.toLowerCase() === p.hex.toLowerCase() ? styles.selected : ''}`}
                  onClick={() => setBgColor(p.hex)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ColorRow
              label="Custom"
              value={bgColor ?? (theme === 'dark' ? '#0e0e10' : '#f7f7f9')}
              onChange={setBgColor}
              onReset={resetBgColor}
              showReset={Boolean(bgColor)}
            />
          </div>

          <div className={styles.divider} />

          {/* Cat Mascot */}
          <div className={styles.section}>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Following Cat Mascot</span>
              <button
                type="button"
                className={`${styles.toggle} ${mascotEnabled ? styles.on : ''}`}
                onClick={toggleMascot}
                role="switch"
                aria-checked={mascotEnabled}
                title={mascotEnabled ? 'Disable Cat' : 'Enable Cat'}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>

            {mascotEnabled && (
              <>
                <div className={styles.catPreviewRow}>
                  <div style={{ width: 34, height: 34 }}><CatSprite /></div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    Cat is active & following cursor
                  </span>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: 4 }}>
                  <span className={styles.sectionLabel}>Cat Color</span>
                  {isCustomCatColor && (
                    <button type="button" className={styles.resetBtn} onClick={resetCatColor}>Reset</button>
                  )}
                </div>

                <div className={styles.swatchRow}>
                  {CAT_PRESETS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      className={`${styles.swatch} ${catColor.toLowerCase() === hex.toLowerCase() ? styles.selected : ''}`}
                      style={{ background: hex }}
                      onClick={() => setCatColor(hex)}
                      title={hex}
                    />
                  ))}
                </div>

                <ColorRow
                  label="Custom"
                  value={catColor}
                  onChange={setCatColor}
                  onReset={resetCatColor}
                  showReset={isCustomCatColor}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
