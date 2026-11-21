import styles from './Stat.module.css';

interface StatProps {
  value: string | number;
  label: string;
  tooltip?: string;
  accentBorder?: boolean;
}

export function Stat({ value, label, tooltip, accentBorder = true }: StatProps) {
  return (
    <div className={`${styles.statCard} ${accentBorder ? styles.withAccent : ''}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label} title={tooltip}>
        {label}
      </div>
    </div>
  );
}
