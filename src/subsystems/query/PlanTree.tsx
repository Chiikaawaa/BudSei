import React from 'react';
import { Card } from '../../ui/Card';

export interface PlanNode {
  id: number;
  parent: number;
  detail: string;
}

interface PlanTreeProps {
  nodes: PlanNode[];
}

export const PlanTree = React.memo(function PlanTree({ nodes }: PlanTreeProps) {
  if (nodes.length === 0) {
    return (
      <Card title="EXPLAIN QUERY PLAN TREE" subtitle="No execution plan loaded">
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '12px' }}>
          Execute EXPLAIN QUERY PLAN to visualize scan, search, and index routing trees.
        </div>
      </Card>
    );
  }

  return (
    <Card title="EXPLAIN QUERY PLAN TREE" subtitle={`${nodes.length} plan operators`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {nodes.map((node) => {
          const isScan = node.detail.includes('SCAN');
          const isSearch = node.detail.includes('SEARCH');
          const isIndex = node.detail.includes('USING INDEX') || node.detail.includes('USING COVERING INDEX');

          const badgeColor = isIndex ? '#10b981' : isSearch ? '#3b82f6' : isScan ? '#f59e0b' : 'var(--text-secondary)';

          return (
            <div
              key={node.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                background: 'var(--bg-surface)',
                borderLeft: `3px solid ${badgeColor}`,
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>#{node.id}</span>
              <span style={{ color: badgeColor, fontWeight: 700 }}>
                {isIndex ? 'INDEX SEEK' : isSearch ? 'SEARCH' : isScan ? 'FULL SCAN' : 'OPERATOR'}
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{node.detail}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
