import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { ModeSwitch } from './ModeSwitch';
import { FrameStrip } from './FrameStrip';
import { CheckpointPanel } from './CheckpointPanel';
import { WalFrame } from '../../parsers/wal-frame';
import { sqliteRpc } from '../../engine/rpc';
import { useSessionStore } from '../../store/sessionStore';
import { registerExecutionListener } from '../../store/consoleStore';

export function JournalWalView() {
  const { journalMode, setJournalMode, pageSize } = useSessionStore();
  const [frames, setFrames] = useState<WalFrame[]>([
    { frameNo: 1, pageNo: 1, commitSize: 0, isCommit: false, salt1: 0x1234, salt2: 0x5678, checksum1: 0xaa, checksum2: 0xbb },
    { frameNo: 2, pageNo: 2, commitSize: 2, isCommit: true, salt1: 0x1234, salt2: 0x5678, checksum1: 0xcc, checksum2: 0xdd },
  ]);

  const refreshMode = useCallback(async () => {
    try {
      const mode = await sqliteRpc.pragma('journal_mode');
      if (mode && mode[0] && mode[0][0]) {
        setJournalMode(String(mode[0][0]).toUpperCase());
      }
    } catch (e) {
      console.error(e);
    }
  }, [setJournalMode]);

  useEffect(() => {
    refreshMode();
  }, [refreshMode]);

  useEffect(() => {
    return registerExecutionListener(() => {
      if (useSessionStore.getState().journalMode.toUpperCase() === 'WAL') {
        setFrames((prev) => {
          const nextNo = prev.length + 1;
          const newFrame: WalFrame = {
            frameNo: nextNo,
            pageNo: Math.max(1, (nextNo % 5) + 1),
            commitSize: nextNo,
            isCommit: true,
            salt1: 0x1234,
            salt2: 0x5678,
            checksum1: (nextNo * 0x1f) & 0xffffffff,
            checksum2: (nextNo * 0x3d) & 0xffffffff,
          };
          return [...prev, newFrame];
        });
      }
    });
  }, []);

  const handleSelectMode = async (mode: 'MEMORY' | 'DELETE' | 'TRUNCATE' | 'WAL') => {
    try {
      const res = await sqliteRpc.pragma('journal_mode', mode);
      const reported = res?.[0]?.[0] ? String(res[0][0]).toUpperCase() : mode;
      // SQLite :memory: rejects WAL and returns MEMORY. For interactive educational visualization,
      // allow user to toggle WAL mode to inspect frame strip and checkpointing.
      const targetMode = mode === 'WAL' ? 'WAL' : reported;
      setJournalMode(targetMode);
    } catch (e) {
      setJournalMode(mode);
    }
  };

  const handleCheckpoint = async (mode: 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE') => {
    try {
      await sqliteRpc.pragma('wal_checkpoint', mode);
    } catch (e) {
      console.error(e);
    }
    if (mode === 'TRUNCATE' || mode === 'RESTART' || mode === 'FULL') {
      setFrames([]);
    } else if (mode === 'PASSIVE') {
      setFrames((prev) => (prev.length > 1 ? prev.slice(-1) : []));
    }
  };

  const isWal = journalMode.toUpperCase() === 'WAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="real" title="REAL SQLITE: Rollback journal pragmas and mode changes executed directly on engine">REAL SQLITE</Badge>
        <Badge variant="emulated" title="EMULATED: WAL frame sequencing and checkpoints modeled for interactive simulation">EMULATED</Badge>
        <Badge variant="accent">SUBSYSTEM // JOURNAL & WAL</Badge>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em' }}>
          JOURNAL & WAL
        </h2>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Rollback journal crash recovery, Write-Ahead Logging frames, salt validation, and checkpoint scheduling.
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Stat value={journalMode} label="JOURNAL MODE" tooltip="Active SQLite transaction journal mode" />
        <Stat value={isWal ? frames.length : 0} label="WAL FRAMES" tooltip="Frames currently buffered in WAL" />
        <Stat value={isWal ? frames.filter((f) => f.isCommit).length : 0} label="COMMITS LOGGED" tooltip="Total commit transactions in WAL" />
        <Stat value={isWal ? `${Math.round((frames.length * (24 + pageSize)) / 1024)} KB` : '0 KB'} label="WAL FILE SIZE" tooltip="Total physical size of WAL log" />
      </div>

      {/* Mode Switcher */}
      <ModeSwitch currentMode={journalMode} onSelectMode={handleSelectMode} />

      {/* Frame Strip */}
      <FrameStrip frames={frames} isWalActive={isWal} />

      {/* Checkpoint controller */}
      <CheckpointPanel onCheckpoint={handleCheckpoint} isWal={isWal} />
    </div>
  );
}
