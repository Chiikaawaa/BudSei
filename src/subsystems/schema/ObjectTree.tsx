import React from 'react';
import { Card } from '../../ui/Card';

export interface SchemaObject {
  type: 'table' | 'index' | 'view' | 'trigger';
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string;
}

interface ObjectTreeProps {
  objects: SchemaObject[];
  selectedName: string;
  onSelectObject: (obj: SchemaObject) => void;
}

export const ObjectTree = React.memo(function ObjectTree({
  objects,
  selectedName,
  onSelectObject,
}: ObjectTreeProps) {
  const categories = ['table', 'index', 'view', 'trigger'] as const;

  return (
    <Card title="SCHEMA OBJECTS" subtitle={`${objects.length} total objects in catalog`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((cat) => {
          const list = objects.filter((o) => o.type === cat);
          if (list.length === 0) return null;

          return (
            <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {cat}s ({list.length})
              </div>
              {list.map((obj) => {
                const isSelected = obj.name === selectedName;
                return (
                  <button
                    key={obj.name}
                    type="button"
                    onClick={() => onSelectObject(obj)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      background: isSelected ? 'var(--accent-tint)' : 'var(--bg-surface)',
                      borderLeft: `3px solid ${isSelected ? 'var(--accent-color)' : 'transparent'}`,
                      borderRadius: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    <span>{obj.name}</span>
                    {obj.rootpage > 0 && (
                      <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>
                        P{obj.rootpage}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
});
