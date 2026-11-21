import React from 'react';
import styles from './AllocationMap.module.css';
import { useStorageStore, PageFilterType } from './storageStore';
import { PageTileGrid } from './PageTileGrid';

interface LegendItem {
  id: PageFilterType;
  label: string;
  colorClass: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { id: 'TBL-LF', label: 'Table Leaf', colorClass: styles.leafTable },
  { id: 'TBL-IN', label: 'Table Interior', colorClass: styles.interiorTable },
  { id: 'IDX-LF', label: 'Index Leaf', colorClass: styles.leafIndex },
  { id: 'IDX-IN', label: 'Index Interior', colorClass: styles.interiorIndex },
  { id: 'FREE', label: 'Freelist', colorClass: styles.freelist },
];

export const AllocationMap = React.memo(function AllocationMap() {
  const { pages, activeFilters, toggleFilter } = useStorageStore();
  const totalPages = pages.length || 1;

  return (
    <div className={styles.mapCard}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.titleGroup}>
          <span className={styles.title}>PHYSICAL PAGE ALLOCATION MAP</span>
          <span className={styles.subtext}>
            {totalPages} physical page{totalPages > 1 ? 's' : ''} allocated
          </span>
        </div>

        {/* Legend checkboxes */}
        <div className={styles.legendGroup}>
          {LEGEND_ITEMS.map((item) => {
            const isChecked = activeFilters.has(item.id);
            return (
              <label key={item.id} className={styles.legendLabel}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFilter(item.id)}
                  className={styles.hiddenCheckbox}
                />
                <span className={`${styles.customCheckbox} ${item.colorClass} ${isChecked ? styles.checked : ''}`} />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Page Tile Grid */}
      <div className={styles.gridContainer}>
        <PageTileGrid />
      </div>
    </div>
  );
});
