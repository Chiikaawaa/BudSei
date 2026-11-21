import React from 'react';
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select className={`${styles.select} ${className}`} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className={styles.option}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
