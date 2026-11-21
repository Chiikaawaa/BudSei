import { create } from 'zustand';

interface UiState {
  navRailCollapsed: boolean;
  bottomDrawerOpen: boolean;
  bottomDrawerTab: 'execution-log' | 'timeline';
  bottomDrawerHeight: number;
  consoleSplitRatio: number;
  theoryDrawerOpen: boolean;
  commandPaletteOpen: boolean;
  toggleNavRail: () => void;
  toggleBottomDrawer: () => void;
  setBottomDrawerTab: (tab: 'execution-log' | 'timeline') => void;
  setConsoleSplitRatio: (ratio: number) => void;
  toggleTheoryDrawer: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  navRailCollapsed: false,
  bottomDrawerOpen: false,
  bottomDrawerTab: 'execution-log',
  bottomDrawerHeight: 180,
  consoleSplitRatio: 0.5,
  theoryDrawerOpen: false,
  commandPaletteOpen: false,

  toggleNavRail: () => set((s) => ({ navRailCollapsed: !s.navRailCollapsed })),
  toggleBottomDrawer: () => set((s) => ({ bottomDrawerOpen: !s.bottomDrawerOpen })),
  setBottomDrawerTab: (tab) => set({ bottomDrawerTab: tab, bottomDrawerOpen: true }),
  setConsoleSplitRatio: (ratio) => set({ consoleSplitRatio: Math.min(0.85, Math.max(0.15, ratio)) }),
  toggleTheoryDrawer: () => set((s) => ({ theoryDrawerOpen: !s.theoryDrawerOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
