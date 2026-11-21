import React from 'react';
import { Card } from '../../ui/Card';
import { BtreeCell } from '../../parsers/cells';

interface CellListProps {
  cells: BtreeCell[];
  onSelectCell?: (cell: BtreeCell) => void;
}

export const CellList = React.memo(function CellList({ cells, onSelectCell }: CellListProps) {
  if (cells.length === 0) {
    return null;
  }

  return (
    <Card title="DECODED CELLS & PAYLOADS" subtitle={`${cells.length} cells stored`}>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
              <th style={{ width: '35px', padding: '4px' }}>#</th>
              <th style={{ width: '70px', padding: '4px' }}>Offset</th>
              <th style={{ width: '60px', padding: '4px' }}>Size</th>
              <th style={{ width: '70px', padding: '4px' }}>RowID</th>
              <th style={{ padding: '4px' }}>Columns Payload</th>
            </tr>
          </thead>
          <tbody>
            {cells.map((cell, idx) => (
              <tr
                key={idx}
                onClick={() => onSelectCell?.(cell)}
                style={{ borderBottom: '1px solid var(--border-muted)', cursor: 'pointer', height: '24px' }}
              >
                <td style={{ color: 'var(--text-dim)', padding: '4px' }}>{idx + 1}</td>
                <td style={{ color: 'var(--accent-color)', padding: '4px' }}>
                  0x{cell.offset.toString(16).padStart(4, '0')}
                </td>
                <td style={{ color: 'var(--text-muted)', padding: '4px' }}>{cell.size} B</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '4px' }}>
                  {cell.rowid ?? '-'}
                </td>
                <td style={{ color: 'var(--text-secondary)', padding: '4px' }}>
                  {cell.columns
                    ? cell.columns.map((c) => `${c.typeLabel}: ${String(c.value)}`).join(' | ')
                    : `Payload: ${cell.payloadSize} B`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
