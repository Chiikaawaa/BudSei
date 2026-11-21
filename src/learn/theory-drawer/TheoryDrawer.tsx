import React, { useState } from 'react';
import styles from './TheoryDrawer.module.css';
import { ModeToggle, TheoryMode } from './ModeToggle';
import { SUBSYSTEM_THEORY } from './theoryContent';
import { useSessionStore } from '../../store/sessionStore';
import { useUiStore } from '../../store/uiStore';

export const TheoryDrawer = React.memo(function TheoryDrawer() {
  const { theoryDrawerOpen, toggleTheoryDrawer } = useUiStore();
  const activeSubsystem = useSessionStore((s) => s.activeSubsystem);
  const [mode, setMode] = useState<TheoryMode>('intuitive');

  if (!theoryDrawerOpen) return null;

  const topics = SUBSYSTEM_THEORY[activeSubsystem] || SUBSYSTEM_THEORY['storage']!;

  return (
    <div className={styles.overlay} onClick={toggleTheoryDrawer}>
      <div className={styles.drawerPane} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.tag}>WHY // DATABASE THEORY</span>
            <span className={styles.subsystemName}>{activeSubsystem.toUpperCase()}</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={toggleTheoryDrawer}>
            ✕
          </button>
        </div>

        {/* Intuitive vs C-Source Invariants Mode Toggle */}
        <div className={styles.toggleRow}>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        {/* Topics List */}
        <div className={styles.topicsList}>
          {topics.map((t) => (
            <div key={t.id} className={styles.topicCard}>
              <div className={styles.topicTitle}>{t.title}</div>
              <div className={styles.topicBody}>
                {mode === 'intuitive' ? t.intuitive : t.invariants}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
