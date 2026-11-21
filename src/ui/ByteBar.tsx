import React, { useState } from 'react';
import styles from './ByteBar.module.css';
import { ParsedBtreePage } from '../parsers/btree-page';

interface ByteBarProps {
  page: ParsedBtreePage;
  onSelectSegment?: (segmentName: string, start: number, end: number) => void;
}

export const ByteBar = React.memo(function ByteBar({ page, onSelectSegment }: ByteBarProps) {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const pageSize = page.pageSize;
  const isPage1 = page.pageNumber === 1;

  const hdSize = isPage1 ? 100 : 0;
  const trSize = page.header.headerSize;
  const cpSize = page.cellPointers.length * 2;
  const cellContentStart = page.header.cellContentStart;
  const totalCellBytes = pageSize - cellContentStart;
  const freeSpace = Math.max(0, cellContentStart - (hdSize + trSize + cpSize));

  const toPct = (bytes: number) => `${Math.max(0.5, (bytes / pageSize) * 100)}%`;
  const hexStart = `0x${((page.pageNumber - 1) * pageSize).toString(16).padStart(4, '0').toUpperCase()}`;
  const hexEnd = `0x${(page.pageNumber * pageSize).toString(16).padStart(4, '0').toUpperCase()}`;
  const hexTree = isPage1 ? '0x0064' : hexStart;

  return (
    <div className={styles.byteBarWrapper}>
      {/* Non-overlapping clean offset labels above */}
      <div className={styles.offsetLabelsRow}>
        <span className={styles.offsetLabel}>{hexStart}</span>
        {isPage1 && <span className={styles.offsetLabelCenter}>{hexTree}</span>}
        <span className={styles.offsetLabelRight}>{hexEnd}</span>
      </div>

      {/* Main Byte Bar Container */}
      <div className={styles.barTrack}>
        {/* HD: File Header (Page 1 only) */}
        {isPage1 && (
          <div
            className={`${styles.segment} ${styles.segHd}`}
            style={{ width: toPct(hdSize) }}
            onClick={() => onSelectSegment?.('100-Byte File Header', 0, 100)}
            onMouseEnter={() => setHoveredInfo('HD: SQLite 100-byte file header (0x0000 - 0x0064)')}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            HD
          </div>
        )}

        {/* TR: Tree Page Header */}
        <div
          className={`${styles.segment} ${styles.segTr}`}
          style={{ width: toPct(trSize) }}
          onClick={() => onSelectSegment?.('B-Tree Page Header', hdSize, hdSize + trSize)}
          onMouseEnter={() => setHoveredInfo(`TR: B-Tree header (${trSize} bytes at 0x${hdSize.toString(16)})`)}
          onMouseLeave={() => setHoveredInfo(null)}
        >
          TR
        </div>

        {/* CP: Cell Pointer Array */}
        {cpSize > 0 && (
          <div
            className={`${styles.segment} ${styles.segCp}`}
            style={{ width: toPct(cpSize) }}
            onClick={() => onSelectSegment?.('Cell Pointer Array', hdSize + trSize, hdSize + trSize + cpSize)}
            onMouseEnter={() => setHoveredInfo(`CP: Cell pointers (${page.cellPointers.length} pointers, ${cpSize} bytes)`)}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            CP
          </div>
        )}

        {/* Center: Unallocated Free Gap */}
        <div
          className={`${styles.segment} ${styles.segFree}`}
          style={{ flex: 1 }}
          onClick={() => onSelectSegment?.('Unallocated Free Space', hdSize + trSize + cpSize, cellContentStart)}
          onMouseEnter={() => setHoveredInfo(`Unallocated gap: ${freeSpace} bytes between cell pointers & content`)}
          onMouseLeave={() => setHoveredInfo(null)}
        >
          UNALLOCATED FREE ({page.freeSpaceBytes} B)
        </div>

        {/* Cells Area (Filling backwards) */}
        {totalCellBytes > 0 && (
          <div
            className={`${styles.segment} ${styles.segCells}`}
            style={{ width: toPct(totalCellBytes) }}
            onClick={() => onSelectSegment?.('Cell Payloads Area', cellContentStart, pageSize)}
            onMouseEnter={() => setHoveredInfo(`Cells: ${page.cells.length} cells (${totalCellBytes} bytes)`)}
            onMouseLeave={() => setHoveredInfo(null)}
          >
            {page.cells.length > 0 ? `${page.cells.length} CELLS` : 'CELLS'}
          </div>
        )}

        {/* IT: Tail / Content Start marker */}
        <div
          className={`${styles.segment} ${styles.segIt}`}
          title={`Cell content start: 0x${cellContentStart.toString(16).toUpperCase()}`}
        >
          IT
        </div>
      </div>

      {hoveredInfo && <div className={styles.hoverTooltip}>{hoveredInfo}</div>}
    </div>
  );
});
