import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'real' | 'modeled' | 'emulated' | 'error' | 'neutral' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Badge({ variant = 'neutral', children, title, className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} title={title}>
      {children}
    </span>
  );
}
