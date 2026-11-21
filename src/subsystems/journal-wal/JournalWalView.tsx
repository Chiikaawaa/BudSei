import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../ui/Badge';
import { Stat } from '../../ui/Stat';
import { ModeSwitch } from './ModeSwitch';
import { FrameStrip } from './FrameStrip';
import { CheckpointPanel } from './CheckpointPanel';
import { WalFrame } from '../../parsers/wal-frame';
import { sqliteRpc } from '../../engine/rpc';
import { useSessionStore } from '../../store/sessionStore';

export function JournalWalView() {
  const { journalMode, setJournalMode } = useSessionStore();
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

  const handleSelectMode = async (mode: 'MEMORY' | 'DELETE' | 'TRUNCATE' | 'WAL') => {
    try {
      const res = await sqliteRpc.pragma('journal_mode', mode);
      const newMode = res?.[0]?.[0] ? String(res[0][0]).toUpperCase() : mode;
      setJournalMode(newMode);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckpoint = async (mode: 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE') => {
    try {
      await sqliteRpc.pragma('wal_checkpoint', mode);
      if (mode === 'TRUNCATE' || mode === 'RESTART' || mode === 'FULL') {
        setFrames([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isWal = journalMode.toUpperCase() === 'WAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Badge variant="real">REAL SQLITE</Badge>
        <Badge variant="emulated">EMULATED</Badge>
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
        <Stat value={isWal ? `${frames.length * 8} KB` : '0 KB'} label="WAL FILE SIZE" tooltip="Total physical size of WAL log" />
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
