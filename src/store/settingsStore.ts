import { create } from 'zustand';
import {
  ThemeMode,
  applyThemeToDom,
  applyAccentToDom,
  applyBackgroundToDom,
  applyCatColorToDom,
} from './themeUtils';

export type { ThemeMode };

export const DEFAULT_ACCENT_DARK = '#e87c9c';
export const DEFAULT_ACCENT_LIGHT = '#b8284f';
export const DEFAULT_CAT_COLOR = '#ff73a5';

export const ACCENT_PRESETS = [
  '#e87c9c', '#7c8dfa', '#4ade80', '#fb923c',
  '#f472b6', '#38bdf8', '#a78bfa', '#facc15',
];

export const DARK_BG_PRESETS = [
  { label: 'Charcoal', hex: '#0e0e10' },
  { label: 'Deep Black', hex: '#141418' },
  { label: 'OLED Black', hex: '#0a0a0a' },
  { label: 'Navy', hex: '#0f172a' },
];

export const LIGHT_BG_PRESETS = [
  { label: 'Studio', hex: '#f7f7f9' },
  { label: 'Pure White', hex: '#ffffff' },
  { label: 'Soft Slate', hex: '#f1f5f9' },
  { label: 'Paper', hex: '#f8f6f2' },
];

export const CAT_PRESETS = [
  '#ff73a5', '#38bdf8', '#4ade80', '#facc15',
  '#a78bfa', '#fb923c', '#f87171', '#ffffff',
];

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('budsei_theme') as ThemeMode;
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const initialTheme = getInitialTheme();
applyThemeToDom(initialTheme);

// Clear stored custom colors on refresh/load so refreshing resets colour customizations
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('budsei_accent');
    localStorage.removeItem('budsei_bg');
    localStorage.removeItem('budsei_cat_color');
  } catch {
    // ignore
  }
}

interface SettingsState {
  theme: ThemeMode;
  mascotEnabled: boolean;
  accentColor: string;
  isCustomAccent: boolean;
  bgColor: string | null;
  catColor: string;
  isCustomCatColor: boolean;
  menuOpen: boolean;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMascotEnabled: (enabled: boolean) => void;
  toggleMascot: () => void;
  setAccentColor: (hex: string) => void;
  resetAccentColor: () => void;
  setBgColor: (hex: string) => void;
  resetBgColor: () => void;
  setCatColor: (hex: string) => void;
  resetCatColor: () => void;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: initialTheme,
  mascotEnabled: typeof window !== 'undefined' ? localStorage.getItem('budsei_mascot') !== 'false' : true,
  accentColor: initialTheme === 'dark' ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT_LIGHT,
  isCustomAccent: false,
  bgColor: null,
  catColor: DEFAULT_CAT_COLOR,
  isCustomCatColor: false,
  menuOpen: false,

  setTheme: (theme) => {
    localStorage.setItem('budsei_theme', theme);
    applyThemeToDom(theme);
    const { isCustomAccent, accentColor, bgColor } = get();
    if (isCustomAccent) {
      applyAccentToDom(accentColor, theme);
    } else {
      applyAccentToDom(null, theme);
    }
    applyBackgroundToDom(bgColor, theme);
    set({
      theme,
      accentColor: isCustomAccent
        ? accentColor
        : theme === 'dark'
        ? DEFAULT_ACCENT_DARK
        : DEFAULT_ACCENT_LIGHT,
    });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setMascotEnabled: (enabled) => {
    localStorage.setItem('budsei_mascot', String(enabled));
    set({ mascotEnabled: enabled });
  },

  toggleMascot: () => {
    const next = !get().mascotEnabled;
    localStorage.setItem('budsei_mascot', String(next));
    set({ mascotEnabled: next });
  },

  setAccentColor: (hex) => {
    applyAccentToDom(hex, get().theme);
    set({ accentColor: hex, isCustomAccent: true });
  },

  resetAccentColor: () => {
    applyAccentToDom(null, get().theme);
    set({
      accentColor: get().theme === 'dark' ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT_LIGHT,
      isCustomAccent: false,
    });
  },

  setBgColor: (hex) => {
    applyBackgroundToDom(hex, get().theme);
    set({ bgColor: hex });
  },

  resetBgColor: () => {
    applyBackgroundToDom(null, get().theme);
    set({ bgColor: null });
  },

  setCatColor: (hex) => {
    applyCatColorToDom(hex);
    set({ catColor: hex, isCustomCatColor: true });
  },

  resetCatColor: () => {
    applyCatColorToDom(null);
    set({ catColor: DEFAULT_CAT_COLOR, isCustomCatColor: false });
  },

  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));
