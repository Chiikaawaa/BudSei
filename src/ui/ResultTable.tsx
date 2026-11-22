import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './ResultTable.module.css';

interface ResultTableProps {
  columns: string[];
  rows: (string | number | null | Uint8Array)[][];
  columnsData?: (string | number | null | Uint8Array)[][];
  rowHeight?: number;
}

export const ResultTable = React.memo(function ResultTable({
  columns,
  rows,
  columnsData,
  rowHeight = 24,
}: ResultTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(300);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalRows = rows.length > 0 ? rows.length : (columnsData?.[0]?.length ?? 0);
  const totalHeight = totalRows * rowHeight;
  const buffer = 8;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 2 * buffer;
  const endIndex = Math.min(totalRows, startIndex + visibleCount);

  const topOffset = startIndex * rowHeight;

  // Render rows either directly or by reading from columnar data arrays
  const visibleRows: (string | number | null | Uint8Array)[][] = [];
  for (let i = startIndex; i < endIndex; i++) {
    if (rows.length > i) {
      visibleRows.push(rows[i]!);
    } else if (columnsData && columnsData.length > 0) {
      visibleRows.push(columnsData.map((col) => col[i]));
    }
  }

  return (
    <div className={styles.tableContainer} ref={containerRef} onScroll={handleScroll}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.thRowNo}>#</th>
            {columns.map((col, idx) => (
              <th key={idx} className={styles.th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {topOffset > 0 && <tr style={{ height: `${topOffset}px` }}><td colSpan={columns.length + 1} /></tr>}
          {visibleRows.map((row, rIdx) => {
            const actualRowIdx = startIndex + rIdx;
            return (
              <tr key={actualRowIdx} className={styles.tr} style={{ height: `${rowHeight}px` }}>
                <td className={styles.tdRowNo}>{actualRowIdx + 1}</td>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={styles.td}>
                    {cell === null ? (
                      <span className={styles.nullValue}>NULL</span>
                    ) : cell instanceof Uint8Array ? (
                      <span className={styles.blobValue}>BLOB ({cell.byteLength}B)</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
          {totalHeight - (startIndex + visibleRows.length) * rowHeight > 0 && (
            <tr style={{ height: `${totalHeight - (startIndex + visibleRows.length) * rowHeight}px` }}>
              <td colSpan={columns.length + 1} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});
