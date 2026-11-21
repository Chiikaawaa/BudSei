import React from 'react';
import { Card } from '../../ui/Card';

export const AcidCards = React.memo(function AcidCards() {
  const cards = [
    {
      letter: 'A',
      title: 'Atomicity',
      desc: 'All-or-nothing rollback journal / WAL frames guarantee aborted writes never partially corrupt pages.',
    },
    {
      letter: 'C',
      title: 'Consistency',
      desc: 'Schema cookies, foreign keys, and unique indexes are validated prior to transaction commit.',
    },
    {
      letter: 'I',
      title: 'Isolation',
      desc: 'Serializable snapshot isolation via PENDING & EXCLUSIVE locks prevents dirty reads and non-repeatable writes.',
    },
    {
      letter: 'D',
      title: 'Durability',
      desc: 'Fsync barriers flush dirty page buffers and journal headers before reporting success.',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      {cards.map((c) => (
        <Card key={c.letter}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--accent-color)',
              }}
            >
              {c.letter}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
              {c.title}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {c.desc}
          </div>
        </Card>
      ))}
    </div>
  );
});
