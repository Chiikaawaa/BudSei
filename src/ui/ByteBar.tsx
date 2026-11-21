import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ByteBar.module.css';
import { ParsedBtreePage } from '../parsers/btree-page';
import { findCellAtOffset } from './bytebar-utils';

interface ByteBarProps {
  page: ParsedBtreePage;
  onSelectSegment?: (segmentName: string, start: number, end: number) => void;
}

export const ByteBar = React.memo(function ByteBar({ page, onSelectSegment }: ByteBarProps) {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageSize = page.pageSize;
  const isPage1 = page.pageNumber === 1;

  const hdSize = isPage1 ? 100 : 0;
  const trSize = page.header.headerSize;
  const cpSize = page.cellPointers.length * 2;
  const cellContentStart = page.header.cellContentStart;

  const hexStart = `0x${((page.pageNumber - 1) * pageSize).toString(16).padStart(4, '0').toUpperCase()}`;
  const hexEnd = `0x${(page.pageNumber * pageSize).toString(16).padStart(4, '0').toUpperCase()}`;
  const hexTree = isPage1 ? '0x0064' : hexStart;

  // Draw high-density canvas for instant <16ms 5k-cell render
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const xHd = (hdSize / pageSize) * width;
    const xTr = ((hdSize + trSize) / pageSize) * width;
    const xCp = ((hdSize + trSize + cpSize) / pageSize) * width;
    const xContent = (cellContentStart / pageSize) * width;

    // HD
    if (hdSize > 0) {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 0, xHd, height);
    }
    // TR
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(xHd, 0, xTr - xHd, height);
    // CP
    if (cpSize > 0) {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(xTr, 0, xCp - xTr, height);
    }
    // Free space
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(xCp, 0, xContent - xCp, height);
    // Cells
    ctx.fillStyle = '#10b981';
    ctx.fillRect(xContent, 0, width - xContent - 2, height);
    // Tail IT
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(width - 20, 0, 20, height);
  }, [hdSize, trSize, cpSize, cellContentStart, pageSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;
      const offset = Math.floor(ratio * pageSize);

      if (offset < hdSize) {
        setHoveredInfo(`HD: File Header (0x${offset.toString(16).padStart(2, '0')})`);
      } else if (offset < hdSize + trSize) {
        setHoveredInfo(`TR: B-Tree Page Header (0x${offset.toString(16)})`);
      } else if (offset < hdSize + trSize + cpSize) {
        setHoveredInfo(`CP: Cell Pointer Area (0x${offset.toString(16)})`);
      } else if (offset < cellContentStart) {
        setHoveredInfo(`Unallocated Free Space: ${page.freeSpaceBytes} B`);
      } else {
        const found = findCellAtOffset(page.cells, offset);
        if (found) {
          setHoveredInfo(`Cell at 0x${found.offset.toString(16)} (Size: ${found.size}B, RowID: ${found.rowid ?? 'idx'})`);
        } else {
          setHoveredInfo(`Cell Content Area (0x${offset.toString(16)})`);
        }
      }
    },
    [hdSize, trSize, cpSize, cellContentStart, page.freeSpaceBytes, page.cells, pageSize]
  );

  return (
    <div className={styles.byteBarWrapper}>
      <div className={styles.offsetLabelsRow}>
        <span className={styles.offsetLabel}>{hexStart}</span>
        {isPage1 && <span className={styles.offsetLabelCenter}>{hexTree}</span>}
        <span className={styles.offsetLabelRight}>{hexEnd}</span>
      </div>

      <div className={styles.barTrack}>
        <canvas
          ref={canvasRef}
          width={800}
          height={46}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredInfo(null)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const off = Math.floor(ratio * pageSize);
            onSelectSegment?.('Selected Byte Range', Math.max(0, off - 32), Math.min(pageSize, off + 32));
          }}
        />
      </div>

      {hoveredInfo && <div className={styles.hoverTooltip}>{hoveredInfo}</div>}
    </div>
  );
});
