import React from 'react';
import { Card } from '../../ui/Card';
import { BtreeNode } from '../../sim/btree-model';

interface NodeInspectorProps {
  node: BtreeNode | null;
}

export const NodeInspector = React.memo(function NodeInspector({ node }: NodeInspectorProps) {
  if (!node) {
    return (
      <Card title="NODE INSPECTOR" subtitle="Click any node in the tree diagram to inspect">
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '8px' }}>
          No node selected.
        </div>
      </Card>
    );
  }

  const rows = [
    { label: 'Page Number', value: `Page ${node.pageNo}` },
    { label: 'Node Classification', value: node.type },
    { label: 'Leaf or Interior', value: node.isLeaf ? 'Leaf Node (Key/Payload)' : 'Interior Router (Key/Child Pointers)' },
    { label: 'Total Stored Cells', value: `${node.cellCount} cells` },
    { label: 'Allocated Fill Factor', value: `${node.fillPercentage}%` },
    { label: 'Free Space Available', value: `${node.freeSpaceBytes} bytes` },
    { label: 'Routing Keys', value: node.keys.length > 0 ? node.keys.join(', ') : 'None' },
  ];

  return (
    <Card title="NODE INSPECTOR" subtitle={`Page P${node.pageNo} Inspection`}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-muted)', height: '24px' }}>
              <td style={{ color: 'var(--text-muted)', width: '40%' }}>{r.label}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
});
