import { useSettingsStore } from '../store/settingsStore';

export function useMascotEnabled() {
  return useSettingsStore((s) => s.mascotEnabled);
}
