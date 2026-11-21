import React from 'react';
import { Card } from '../../ui/Card';

interface HexDumpDrawerProps {
  title: string;
  buffer: Uint8Array;
  startOffset: number;
  endOffset: number;
  onClose: () => void;
}

export const HexDumpDrawer = React.memo(function HexDumpDrawer({
  title,
  buffer,
  startOffset,
  endOffset,
  onClose,
}: HexDumpDrawerProps) {
  const safeStart = Math.max(0, startOffset);
  const safeEnd = Math.min(buffer.length, endOffset);
  const slice = buffer.subarray(safeStart, safeEnd);

  const lines: { offset: string; hex: string; ascii: string }[] = [];
  for (let i = 0; i < slice.length; i += 16) {
    const chunk = slice.subarray(i, i + 16);
    const hexArr: string[] = [];
    let asciiStr = '';
    for (let j = 0; j < chunk.length; j++) {
      const b = chunk[j]!;
      hexArr.push(b.toString(16).padStart(2, '0'));
      asciiStr += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
    }
    const lineOffset = `0x${(safeStart + i).toString(16).padStart(4, '0').toUpperCase()}`;
    lines.push({
      offset: lineOffset,
      hex: hexArr.join(' ').padEnd(47, ' '),
      ascii: asciiStr,
    });
  }

  return (
    <Card
      title={`HEX DUMP // ${title}`}
      subtitle={`Bytes 0x${safeStart.toString(16)} — 0x${safeEnd.toString(16)} (${safeEnd - safeStart} B)`}
      headerRight={
        <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}>
          ✕ Close
        </button>
      }
    >
      <div style={{ maxHeight: '180px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: '1.4' }}>
        {lines.map((line, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: 'var(--text-dim)', userSelect: 'none' }}>{line.offset}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{line.hex}</span>
            <span style={{ color: 'var(--text-primary)', borderLeft: '1px solid var(--border-color)', paddingLeft: '8px' }}>
              {line.ascii}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
});
