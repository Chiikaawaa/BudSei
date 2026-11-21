import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { ByteBar } from '../../ui/ByteBar';
import { BtreeHeaderCard } from './BtreeHeaderCard';
import { FileHeaderCard } from './FileHeaderCard';
import { CellList } from './CellList';
import { HexDumpDrawer } from './HexDumpDrawer';
import { useStorageStore } from './storageStore';

export const PageDetail = React.memo(function PageDetail() {
  const { pages, selectedPageNo, header, rawImage } = useStorageStore();
  const [hexSelection, setHexSelection] = useState<{
    title: string;
    start: number;
    end: number;
  } | null>(null);

  const page = pages.find((p) => p.pageNumber === selectedPageNo) || pages[0];
  if (!page) return null;

  const startByte = (page.pageNumber - 1) * page.pageSize;
  const endByte = page.pageNumber * page.pageSize;
  const hexRange = `Bytes 0x${startByte.toString(16).padStart(4, '0')} — 0x${endByte.toString(16).padStart(4, '0')}`;

  const badgeVariant =
    page.header.pageType === 'TABLE_LEAF'
      ? 'real'
      : page.header.pageType === 'TABLE_INTERIOR'
      ? 'modeled'
      : page.header.pageType === 'INDEX_LEAF'
      ? 'error'
      : 'emulated';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Page detail top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>
            Page {page.pageNumber}
          </span>
          <Badge variant={badgeVariant}>{page.header.pageType.replace('_', ' ')}</Badge>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            {hexRange}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Cell Count: {page.header.cellCount}</span>
          <span style={{ color: 'var(--text-secondary)' }}>Free Space: {page.freeSpaceBytes} B</span>
        </div>
      </div>

      {/* ByteBar visualization */}
      <ByteBar
        page={page}
        onSelectSegment={(title, start, end) => setHexSelection({ title, start, end })}
      />

      {/* Hex Dump drawer if segment clicked */}
      {hexSelection && rawImage && (
        <HexDumpDrawer
          title={hexSelection.title}
          buffer={rawImage}
          startOffset={startByte + hexSelection.start}
          endOffset={startByte + hexSelection.end}
          onClose={() => setHexSelection(null)}
        />
      )}

      {/* Side-by-side header cards */}
      <div style={{ display: 'grid', gridTemplateColumns: page.pageNumber === 1 && header ? '1fr 1fr' : '1fr', gap: '12px' }}>
        <BtreeHeaderCard header={page.header} />
        {page.pageNumber === 1 && header && <FileHeaderCard header={header} />}
      </div>

      {/* Cell Payloads list */}
      {page.cells.length > 0 && (
        <CellList
          cells={page.cells}
          onSelectCell={(cell) =>
            setHexSelection({
              title: `Cell at 0x${cell.offset.toString(16)}`,
              start: cell.offset,
              end: cell.offset + cell.size,
            })
          }
        />
      )}
    </div>
  );
});
