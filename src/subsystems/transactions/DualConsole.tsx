import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface DualConsoleProps {
  onAction: (conn: 'A' | 'B', action: any) => void;
  onReset: () => void;
}

export const DualConsole = React.memo(function DualConsole({ onAction, onReset }: DualConsoleProps) {
  const actions = [
    { id: 'BEGIN_DEFERRED', label: 'BEGIN (DEFERRED)' },
    { id: 'BEGIN_IMMEDIATE', label: 'BEGIN IMMEDIATE' },
    { id: 'SELECT', label: 'SELECT * (SHARED)' },
    { id: 'UPDATE', label: 'UPDATE (RESERVED)' },
    { id: 'COMMIT', label: 'COMMIT (EXCLUSIVE)' },
    { id: 'ROLLBACK', label: 'ROLLBACK' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {/* Conn A */}
      <Card title="CONNECTION A" subtitle="Session 1 Controller" headerRight={<Button variant="outline" onClick={onReset}>Reset</Button>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {actions.map((act) => (
            <Button key={act.id} variant="outline" onClick={() => onAction('A', act.id)}>
              {act.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Conn B */}
      <Card title="CONNECTION B" subtitle="Session 2 Controller">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {actions.map((act) => (
            <Button key={act.id} variant="outline" onClick={() => onAction('B', act.id)}>
              {act.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
});
