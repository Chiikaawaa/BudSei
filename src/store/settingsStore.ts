import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface SettingsState {
  theme: ThemeMode;
  mascotEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMascotEnabled: (enabled: boolean) => void;
  toggleMascot: () => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('budsei_theme') as ThemeMode;
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

const initialTheme = getInitialTheme();
applyThemeToDom(initialTheme);

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: initialTheme,
  mascotEnabled: typeof window !== 'undefined'
    ? localStorage.getItem('budsei_mascot') !== 'false'
    : true,
  setTheme: (theme) => {
    localStorage.setItem('budsei_theme', theme);
    applyThemeToDom(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('budsei_theme', next);
      applyThemeToDom(next);
      return { theme: next };
    });
  },
  setMascotEnabled: (enabled) => {
    localStorage.setItem('budsei_mascot', String(enabled));
    set({ mascotEnabled: enabled });
  },
  toggleMascot: () => {
    set((state) => {
      const next = !state.mascotEnabled;
      localStorage.setItem('budsei_mascot', String(next));
      return { mascotEnabled: next };
    });
  },
}));
