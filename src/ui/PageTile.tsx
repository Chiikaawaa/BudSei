import React from 'react';
import styles from './PageTile.module.css';

export interface PageTileProps {
  pageNumber: number;
  typeAbbr: 'TBL-LF' | 'TBL-IN' | 'IDX-LF' | 'IDX-IN' | 'FREE' | 'UNK';
  cellCount: number;
  fillPercentage: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const PageTile = React.memo(function PageTile({
  pageNumber,
  typeAbbr,
  cellCount,
  fillPercentage,
  isSelected,
  onClick,
}: PageTileProps) {
  const typeClass =
    typeAbbr === 'TBL-LF'
      ? styles.tableLeaf
      : typeAbbr === 'TBL-IN'
      ? styles.tableInterior
      : typeAbbr === 'IDX-LF'
      ? styles.indexLeaf
      : typeAbbr === 'IDX-IN'
      ? styles.indexInterior
      : styles.freelist;

  return (
    <div
      className={`${styles.pageTile} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`Page ${pageNumber} (${typeAbbr}) - ${cellCount} cells, ${fillPercentage}% filled`}
    >
      <div className={styles.topRow}>
        <span className={styles.pageNumber}>P{pageNumber}</span>
        <span className={`${styles.typeBadge} ${typeClass}`}>{typeAbbr}</span>
      </div>

      <div className={styles.fillBarTrack}>
        <div
          className={`${styles.fillBarFill} ${typeClass}`}
          style={{ width: `${Math.max(4, fillPercentage)}%` }}
        />
      </div>

      <div className={styles.bottomRow}>
        <span className={styles.cellCount}>{cellCount}c</span>
        <span className={styles.percentage}>{fillPercentage}%</span>
      </div>
    </div>
  );
});
