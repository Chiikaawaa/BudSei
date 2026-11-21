import React from 'react';
import { Card } from '../../ui/Card';
import { OPCODES_GLOSSARY } from './ops-glossary';

export interface VdbeInstruction {
  addr: number;
  opcode: string;
  p1: number;
  p2: number;
  p3: number;
  p4: string;
  p5: string;
  comment: string;
}

interface BytecodeTableProps {
  instructions: VdbeInstruction[];
  currentAddr: number;
  onSelectInstruction: (addr: number) => void;
}

export const BytecodeTable = React.memo(function BytecodeTable({
  instructions,
  currentAddr,
  onSelectInstruction,
}: BytecodeTableProps) {
  if (instructions.length === 0) {
    return (
      <Card title="VDBE BYTECODE DISASSEMBLY" subtitle="No bytecode instructions available">
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '12px' }}>
          Execute an EXPLAIN query to inspect virtual machine instructions.
        </div>
      </Card>
    );
  }

  return (
    <Card title="VDBE BYTECODE DISASSEMBLY (EXPLAIN)" subtitle={`${instructions.length} virtual machine instructions`}>
      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
              <th style={{ width: '40px', padding: '4px' }}>Addr</th>
              <th style={{ width: '100px', padding: '4px' }}>Opcode</th>
              <th style={{ width: '40px', padding: '4px' }}>P1</th>
              <th style={{ width: '40px', padding: '4px' }}>P2</th>
              <th style={{ width: '40px', padding: '4px' }}>P3</th>
              <th style={{ padding: '4px' }}>P4</th>
              <th style={{ padding: '4px' }}>Comment</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((inst) => {
              const isCurrent = inst.addr === currentAddr;
              const doc = OPCODES_GLOSSARY[inst.opcode];
              const isJump = ['Goto', 'Next', 'Rewind', 'SeekGE', 'If'].includes(inst.opcode);

              return (
                <tr
                  key={inst.addr}
                  onClick={() => onSelectInstruction(inst.addr)}
                  style={{
                    backgroundColor: isCurrent ? 'var(--accent-tint)' : 'transparent',
                    borderBottom: '1px solid var(--border-muted)',
                    cursor: 'pointer',
                    height: '22px',
                  }}
                  title={doc?.summary}
                >
                  <td style={{ color: isCurrent ? 'var(--accent-color)' : 'var(--text-dim)', padding: '4px', fontWeight: isCurrent ? 700 : 400 }}>
                    {inst.addr}
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600, padding: '4px' }}>
                    {inst.opcode}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', padding: '4px' }}>{inst.p1}</td>
                  <td style={{ color: isJump ? '#f59e0b' : 'var(--text-secondary)', padding: '4px' }}>
                    {inst.p2} {isJump ? '↵' : ''}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', padding: '4px' }}>{inst.p3}</td>
                  <td style={{ color: 'var(--text-muted)', padding: '4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inst.p4}
                  </td>
                  <td style={{ color: 'var(--text-dim)', padding: '4px' }}>{inst.comment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
