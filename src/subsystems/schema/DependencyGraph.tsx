import React from 'react';
import { Card } from '../../ui/Card';
import { SchemaObject } from './ObjectTree';

interface DependencyGraphProps {
  objects: SchemaObject[];
  schemaCookie: number;
}

export const DependencyGraph = React.memo(function DependencyGraph({
  objects,
  schemaCookie,
}: DependencyGraphProps) {
  const tables = objects.filter((o) => o.type === 'table');
  const indexes = objects.filter((o) => o.type === 'index');

  return (
    <Card
      title="RELATIONAL DEPENDENCIES & METADATA"
      subtitle={`Schema Cookie: ${schemaCookie} (bumps on every DDL change)`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tables.map((tbl) => {
          const tblIndexes = indexes.filter((idx) => idx.tbl_name === tbl.name);
          return (
            <div
              key={tbl.name}
              style={{
                padding: '6px 10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>TABLE {tbl.name}</span>
                <span style={{ color: 'var(--text-dim)' }}>➔</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {tblIndexes.length > 0
                    ? `${tblIndexes.length} index${tblIndexes.length > 1 ? 'es' : ''} (${tblIndexes.map((i) => i.name).join(', ')})`
                    : 'No secondary indexes'}
                </span>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>
                Root P{tbl.rootpage}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
