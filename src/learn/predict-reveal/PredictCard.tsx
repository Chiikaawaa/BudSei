import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { usePredictStore } from './predictStore';

interface PredictCardProps {
  onConfirmExecution: (choice: string) => void;
}

export const PredictCard = React.memo(function PredictCard({ onConfirmExecution }: PredictCardProps) {
  const { status, currentQuestion, streak, isCorrect, correctAnswer, explanation, userChoice, dismiss } =
    usePredictStore();

  if (status === 'idle' || !currentQuestion) return null;

  return (
    <div style={{ margin: '8px 10px' }}>
      <Card
        title={status === 'predicting' ? 'PREDICT BEFORE EXECUTION' : 'TRUTH REVEALED'}
        subtitle={`Pedagogical Hypothesis Test · Current Streak: ${streak} 🔥`}
        headerRight={
          <button onClick={dismiss} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}>
            ✕ Skip
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentQuestion.prompt}
          </div>

          {status === 'predicting' ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentQuestion.options.map((opt) => (
                <Button key={opt} variant="outline" onClick={() => onConfirmExecution(opt)}>
                  {opt}
                </Button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isCorrect ? '#10b981' : '#ef4444',
                }}
              >
                <span>{isCorrect ? '✓ CORRECT PREDICTION!' : '✗ INCORRECT'}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                  (Your pick: {userChoice} | Engine reality: {correctAnswer})
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {explanation}
              </div>
              <Button variant="primary" style={{ alignSelf: 'flex-start', marginTop: '4px' }} onClick={dismiss}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});
