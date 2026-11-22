import React, { useState, useEffect } from 'react';
import styles from './StartupAnimation.module.css';
import { CatSprite } from '../../mascot/catSprite.svg';
import { useSettingsStore } from '../../store/settingsStore';

interface ScatteredCat {
  id: number;
  top: string;
  left: string;
  size: number;
  rotation: number;
  opacity: number;
  flip?: boolean;
}

const SCATTERED_CATS: ScatteredCat[] = [
  { id: 1, top: '7%', left: '8%', size: 44, rotation: -18, opacity: 0.6 },
  { id: 2, top: '20%', left: '16%', size: 30, rotation: 24, opacity: 0.5 },
  { id: 3, top: '10%', left: '34%', size: 52, rotation: -8, opacity: 0.55, flip: true },
  { id: 4, top: '8%', left: '72%', size: 56, rotation: 15, opacity: 0.55 },
  { id: 5, top: '17%', left: '88%', size: 36, rotation: -26, opacity: 0.5 },
  { id: 6, top: '30%', left: '80%', size: 66, rotation: 10, opacity: 0.65, flip: true },
  { id: 7, top: '44%', left: '6%', size: 60, rotation: -30, opacity: 0.6 },
  { id: 8, top: '60%', left: '16%', size: 34, rotation: 14, opacity: 0.45 },
  { id: 9, top: '46%', left: '89%', size: 48, rotation: -12, opacity: 0.55 },
  { id: 10, top: '64%', left: '78%', size: 32, rotation: 22, opacity: 0.5, flip: true },
  { id: 11, top: '79%', left: '8%', size: 54, rotation: 28, opacity: 0.6 },
  { id: 12, top: '88%', left: '26%', size: 40, rotation: -15, opacity: 0.45 },
  { id: 13, top: '72%', left: '38%', size: 28, rotation: 35, opacity: 0.4 },
  { id: 14, top: '82%', left: '66%', size: 58, rotation: -20, opacity: 0.6, flip: true },
  { id: 15, top: '86%', left: '86%', size: 36, rotation: 18, opacity: 0.45 },
  { id: 16, top: '76%', left: '52%', size: 42, rotation: -6, opacity: 0.5 },
  { id: 17, top: '28%', left: '5%', size: 26, rotation: 40, opacity: 0.35 },
  { id: 18, top: '36%', left: '93%', size: 54, rotation: -34, opacity: 0.5, flip: true },
];

export function StartupAnimation() {
  const theme = useSettingsStore((s) => s.theme);
  const [stage, setStage] = useState<'enter' | 'center' | 'glide' | 'fadeout' | 'done'>('enter');

  useEffect(() => {
    const tCenter = setTimeout(() => setStage('center'), 50);
    const tGlide = setTimeout(() => setStage('glide'), 1150);
    const tFade = setTimeout(() => setStage('fadeout'), 1750);
    const tDone = setTimeout(() => setStage('done'), 3050);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStage('done');
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(tCenter);
      clearTimeout(tGlide);
      clearTimeout(tFade);
      clearTimeout(tDone);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (stage === 'done') return null;

  const isGliding = stage === 'glide' || stage === 'fadeout';
  const isFading = stage === 'fadeout';
  const isLight = theme === 'light';

  return (
    <div
      className={`${styles.overlay} ${isLight ? styles.overlayLight : styles.overlayDark} ${
        isFading ? styles.overlayFading : ''
      }`}
      onClick={() => setStage('done')}
      role="presentation"
      aria-hidden="true"
    >
      {/* Scattered cats with organic slow floating and drifting motion */}
      <div className={styles.catsContainer}>
        {SCATTERED_CATS.map((cat) => {
          const catStyle: React.CSSProperties = {
            top: cat.top,
            left: cat.left,
            width: cat.size,
            height: cat.size,
            opacity: cat.opacity,
            animationDuration: `${3.4 + (cat.id % 4) * 0.5}s`,
            animationDelay: `-${(cat.id * 0.7) % 3.5}s`,
            ['--rot' as any]: `${cat.rotation}deg`,
            ['--flip' as any]: cat.flip ? 'scaleX(-1)' : 'none',
          };

          return (
            <div
              key={cat.id}
              className={`${styles.catWrapper} ${cat.id % 2 === 0 ? styles.floatA : styles.floatB}`}
              style={catStyle}
            >
              <CatSprite width={cat.size} height={cat.size} />
            </div>
          );
        })}
      </div>

      <div className={styles.ambientAura} />

      <div className={`${styles.brandContainer} ${isGliding ? styles.gliding : styles.centered}`}>
        <div className={styles.brandTitle}>
          <span className={isLight ? styles.budLight : styles.bud}>Bud</span>
          <span className={isLight ? styles.seiLight : styles.sei}>Sei</span>
        </div>
        <div className={`${styles.subtitleWrapper} ${isGliding ? styles.subtitleHidden : ''}`}>
          <div className={isLight ? styles.hairlineLight : styles.hairline} />
          <span className={isLight ? styles.subtextLight : styles.subtext}>
            SQLITE INTERNALS LABORATORY
          </span>
          <div className={isLight ? styles.hairlineLight : styles.hairline} />
        </div>
      </div>
    </div>
  );
}
