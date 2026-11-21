import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, title, subtitle, headerRight, className = '', style }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      {(title || headerRight) && (
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            {title && <span className={styles.title}>{title}</span>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {headerRight && <div className={styles.headerRight}>{headerRight}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
