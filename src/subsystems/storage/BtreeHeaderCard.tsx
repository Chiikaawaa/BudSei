import React from 'react';
import { Card } from '../../ui/Card';
import { BtreePageHeader } from '../../parsers/btree-page';

interface BtreeHeaderCardProps {
  header: BtreePageHeader;
}

export const BtreeHeaderCard = React.memo(function BtreeHeaderCard({ header }: BtreeHeaderCardProps) {
  const offsetHex = `0x${header.headerOffset.toString(16).padStart(4, '0').toUpperCase()}`;

  const rows = [
    { label: 'Page Type Flag', value: `${header.pageType} (0x${header.rawType.toString(16).padStart(2, '0')})` },
    { label: 'First Freeblock', value: `0x${header.firstFreeblock.toString(16).padStart(4, '0')}` },
    { label: 'Cell Count', value: header.cellCount },
    {
      label: 'Cell Content Start',
      value: header.cellCount === 0
        ? `0x${header.cellContentStart.toString(16).padStart(4, '0')} (${header.cellContentStart} — no cells yet)`
        : `0x${header.cellContentStart.toString(16).padStart(4, '0')} (${header.cellContentStart})`,
    },
    { label: 'Fragmented Free Bytes', value: header.fragmentedBytes },
    ...(header.rightChildPage !== undefined
      ? [{ label: 'Right-most Child Pointer', value: `Page ${header.rightChildPage}` }]
      : []),
  ];

  return (
    <Card title="B-TREE PAGE HEADER" subtitle={`Offset ${offsetHex}`}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-muted)', height: '22px' }}>
              <td style={{ color: 'var(--text-muted)', width: '55%' }}>{r.label}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
});
