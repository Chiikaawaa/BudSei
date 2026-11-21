import { create } from 'zustand';
import { PredictQuestion } from './questions';

export type RevealStatus = 'idle' | 'predicting' | 'revealed';

interface PredictState {
  enabled: boolean;
  streak: number;
  status: RevealStatus;
  currentQuestion: PredictQuestion | null;
  userChoice: string | null;
  correctAnswer: string | null;
  explanation: string | null;
  isCorrect: boolean | null;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  startPrediction: (q: PredictQuestion) => void;
  submitChoice: (choice: string, preState: any, postState: any) => void;
  dismiss: () => void;
}

export const usePredictStore = create<PredictState>((set, get) => ({
  enabled: true,
  streak: 0,
  status: 'idle',
  currentQuestion: null,
  userChoice: null,
  correctAnswer: null,
  explanation: null,
  isCorrect: null,

  setEnabled: (enabled) => set({ enabled }),
  toggleEnabled: () => set((s) => ({ enabled: !s.enabled })),

  startPrediction: (q) =>
    set({
      currentQuestion: q,
      status: 'predicting',
      userChoice: null,
      correctAnswer: null,
      explanation: null,
      isCorrect: null,
    }),

  submitChoice: (choice, preState, postState) => {
    const q = get().currentQuestion;
    if (!q) return;

    const { answer, explanation } = q.getCorrectAnswer(preState, postState);
    const correct = choice === answer;

    set((state) => ({
      status: 'revealed',
      userChoice: choice,
      correctAnswer: answer,
      explanation,
      isCorrect: correct,
      streak: correct ? state.streak + 1 : 0,
    }));
  },

  dismiss: () =>
    set({
      status: 'idle',
      currentQuestion: null,
      userChoice: null,
      correctAnswer: null,
      explanation: null,
      isCorrect: null,
    }),
}));
