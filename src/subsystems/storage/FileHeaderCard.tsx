import React from 'react';
import { Card } from '../../ui/Card';
import { SqliteHeader100 } from '../../parsers/header100';

interface FileHeaderCardProps {
  header: SqliteHeader100;
}

export const FileHeaderCard = React.memo(function FileHeaderCard({ header }: FileHeaderCardProps) {
  return (
    <Card title="SQLITE 100-BYTE FILE HEADER" subtitle="Bytes 0 — 100">
      <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
              <th style={{ width: '45px', padding: '2px 4px' }}>Off</th>
              <th style={{ padding: '2px 4px' }}>Field</th>
              <th style={{ padding: '2px 4px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {header.fields.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-muted)', height: '20px' }}>
                <td style={{ color: 'var(--text-dim)', padding: '2px 4px' }}>
                  0x{f.offset.toString(16).padStart(2, '0')}
                </td>
                <td style={{ color: 'var(--text-muted)', padding: '2px 4px' }} title={f.description}>
                  {f.name}
                </td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '2px 4px' }}>
                  {String(f.rawValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
