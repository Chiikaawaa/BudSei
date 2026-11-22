import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { SchemaObject } from './ObjectTree';
import { useSessionStore } from '../../store/sessionStore';
import { useStorageStore } from '../storage/storageStore';

export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: string | null;
  pk: boolean;
}

interface SchemaDetailProps {
  object: SchemaObject | null;
  columns: ColumnInfo[];
}

export const SchemaDetail = React.memo(function SchemaDetail({
  object,
  columns,
}: SchemaDetailProps) {
  const setActiveSubsystem = useSessionStore((s) => s.setActiveSubsystem);
  const setSelectedPageNo = useStorageStore((s) => s.setSelectedPageNo);

  if (!object) {
    return (
      <Card title="OBJECT INSPECTOR" subtitle="Select a schema object to view definitions">
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '12px' }}>
          No schema object selected.
        </div>
      </Card>
    );
  }

  const handleJumpToStorage = () => {
    if (object.rootpage > 0) {
      setSelectedPageNo(object.rootpage);
      setActiveSubsystem('storage');
      window.location.hash = '#storage';
    }
  };

  const isInternal = object.name.startsWith('sqlite_');

  return (
    <Card
      title={`${object.type.toUpperCase()}: ${object.name}${isInternal ? ' (INTERNAL)' : ''}`}
      subtitle={isInternal ? 'Internal SQLite master catalog table' : `Table target: ${object.tbl_name}`}
      headerRight={
        object.rootpage > 0 ? (
          <Button variant="primary" onClick={handleJumpToStorage}>
            Jump to Rootpage P{object.rootpage} ➔
          </Button>
        ) : undefined
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Columns table if table */}
        {columns.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Column Specifications ({columns.length})
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
                  <th style={{ width: '30px', padding: '4px' }}>#</th>
                  <th style={{ padding: '4px' }}>Name</th>
                  <th style={{ padding: '4px' }}>Type</th>
                  <th style={{ padding: '4px' }}>Nullable</th>
                  <th style={{ padding: '4px' }}>PK</th>
                  <th style={{ padding: '4px' }}>Default</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => (
                  <tr key={col.cid} style={{ borderBottom: '1px solid var(--border-muted)', height: '22px' }}>
                    <td style={{ color: 'var(--text-dim)', padding: '4px' }}>{col.cid}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '4px' }}>{col.name}</td>
                    <td style={{ color: 'var(--accent-color)', padding: '4px' }}>{col.type || 'BLOB'}</td>
                    <td style={{ color: 'var(--text-secondary)', padding: '4px' }}>{col.notnull ? 'NO' : 'YES'}</td>
                    <td style={{ color: col.pk ? '#10b981' : 'var(--text-dim)', fontWeight: col.pk ? 700 : 400, padding: '4px' }}>{col.pk ? 'PK' : '—'}</td>
                    <td style={{ color: 'var(--text-muted)', padding: '4px' }}>{col.dflt_value ?? 'NULL'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DDL Definition SQL */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            DDL Schema Definition
          </div>
          <pre
            style={{
              padding: '8px 10px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {object.sql || '-- Internal system catalog relation'}
          </pre>
        </div>
      </div>
    </Card>
  );
});
