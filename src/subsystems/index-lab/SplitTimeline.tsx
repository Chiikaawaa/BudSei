import React from 'react';
import { Card } from '../../ui/Card';

export const SplitTimeline = React.memo(function SplitTimeline() {
  const steps = [
    {
      title: '1. Page Threshold Overflow',
      desc: "When an INSERT causes cell pointers and payloads to collide because the new cell doesn't fit in the remaining free space, a split is triggered.",
    },
    {
      title: '2. Sibling Page Allocation',
      desc: 'SQLite allocates a new page from the freelist or appends a physical page to the database file.',
    },
    {
      title: '3. Cell Balancing & Divider Promotion',
      desc: 'Cells are divided (~50/50 balance). The median divider key is promoted up to the interior parent router.',
    },
    {
      title: '4. Sequential vs Random Key Fill Factors',
      desc: 'Monotonically increasing keys yield ~100% fill factor on left pages. Random keys lead to repeated splits with ~67% average fill.',
    },
  ];

  return (
    <Card title="B-TREE LEAF SPLIT & BALANCING MECHANISM" subtitle="Physical Invariant">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ padding: '6px 8px', background: 'var(--bg-surface)', borderRadius: '2px', borderLeft: '3px solid var(--accent-color)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {s.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
