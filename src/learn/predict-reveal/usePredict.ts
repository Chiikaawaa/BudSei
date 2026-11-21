import { useCallback } from 'react';
import { usePredictStore } from './predictStore';
import { selectQuestionForSql } from './questions';

export function usePredict() {
  const { enabled, status, currentQuestion, startPrediction, dismiss } = usePredictStore();

  const checkPredictionForQuery = useCallback(
    (sql: string) => {
      if (!enabled) return null;
      const question = selectQuestionForSql(sql);
      if (question) {
        startPrediction(question);
        return question;
      }
      return null;
    },
    [enabled, startPrediction]
  );

  return {
    isPredictionEnabled: enabled,
    predictionStatus: status,
    activeQuestion: currentQuestion,
    checkPredictionForQuery,
    dismissPrediction: dismiss,
  };
}
