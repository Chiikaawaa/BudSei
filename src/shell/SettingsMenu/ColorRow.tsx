import { useEffect, useState } from 'react';
import styles from './SettingsMenu.module.css';

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onReset?: () => void;
  showReset?: boolean;
}

export function ColorRow({ label, value, onChange, onReset, showReset }: ColorRowProps) {
  const [raw, setRaw] = useState(value);
  useEffect(() => setRaw(value), [value]);

  const handleBlur = () => {
    const hex = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) onChange(hex);
    else setRaw(value);
  };

  return (
    <div className={styles.customRow}>
      <span className={styles.customLabel}>{label}</span>
      <input
        type="color"
        className={styles.colorInput}
        value={value.startsWith('#') && value.length === 7 ? value : '#e87c9c'}
        onChange={(e) => {
          setRaw(e.target.value);
          onChange(e.target.value);
        }}
      />
      <input
        type="text"
        className={styles.hexInput}
        value={raw}
        maxLength={7}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        spellCheck={false}
      />
      {showReset && onReset && (
        <button type="button" className={styles.resetBtn} onClick={onReset}>
          Reset
        </button>
      )}
    </div>
  );
}
