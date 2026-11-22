export type ThemeMode = 'dark' | 'light';

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16) || 0,
      parseInt(h[1] + h[1], 16) || 0,
      parseInt(h[2] + h[2], 16) || 0,
    ];
  }
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) =>
    Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')
  ).join('');
}

export function darken(hex: string, pct: number): string {
  const f = 1 - pct;
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * f, g * f, b * f);
}

export function lighten(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * pct, g + (255 - g) * pct, b + (255 - b) * pct);
}

export function applyThemeToDom(theme: ThemeMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function applyAccentToDom(hex: string | null, theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const props = [
    '--accent-color', '--accent-hover', '--accent-active', '--accent-text',
    '--accent-tint', '--accent-tint-subtle', '--accent-border', '--border-focus',
    '--nav-active-bg', '--nav-active-text', '--badge-accent-bg', '--badge-accent-text',
  ];
  if (!hex) {
    props.forEach((p) => root.style.removeProperty(p));
    return;
  }
  const [r, g, b] = hexToRgb(hex);
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;

  root.style.setProperty('--accent-color', hex);
  root.style.setProperty('--accent-hover', darken(hex, 0.12));
  root.style.setProperty('--accent-active', darken(hex, 0.24));
  root.style.setProperty('--accent-text', '#ffffff');
  root.style.setProperty('--border-focus', hex);
  root.style.setProperty('--accent-border', rgba(0.40));
  root.style.setProperty('--accent-tint-subtle', rgba(0.10));

  if (theme === 'dark') {
    root.style.setProperty('--accent-tint', rgba(0.25));
    root.style.setProperty('--nav-active-bg', rgba(0.25));
    root.style.setProperty('--nav-active-text', lighten(hex, 0.35));
    root.style.setProperty('--badge-accent-bg', rgba(0.18));
    root.style.setProperty('--badge-accent-text', lighten(hex, 0.20));
  } else {
    root.style.setProperty('--accent-tint', rgba(0.15));
    root.style.setProperty('--nav-active-bg', rgba(0.18));
    root.style.setProperty('--nav-active-text', darken(hex, 0.28));
    root.style.setProperty('--badge-accent-bg', rgba(0.12));
    root.style.setProperty('--badge-accent-text', darken(hex, 0.20));
  }
}

export function applyBackgroundToDom(bgHex: string | null, theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const bgProps = [
    '--bg-app', '--bg-surface', '--bg-surface-hover', '--bg-surface-active',
    '--bg-panel', '--bg-card', '--border-color', '--border-muted',
  ];
  if (!bgHex) {
    bgProps.forEach((p) => root.style.removeProperty(p));
    return;
  }
  root.style.setProperty('--bg-app', bgHex);
  if (theme === 'dark') {
    root.style.setProperty('--bg-surface', lighten(bgHex, 0.05));
    root.style.setProperty('--bg-surface-hover', lighten(bgHex, 0.10));
    root.style.setProperty('--bg-surface-active', lighten(bgHex, 0.07));
    root.style.setProperty('--bg-panel', bgHex);
    root.style.setProperty('--bg-card', lighten(bgHex, 0.05));
    root.style.setProperty('--border-color', lighten(bgHex, 0.12));
    root.style.setProperty('--border-muted', lighten(bgHex, 0.07));
  } else {
    root.style.setProperty('--bg-surface', '#ffffff');
    root.style.setProperty('--bg-surface-hover', darken(bgHex, 0.04));
    root.style.setProperty('--bg-surface-active', darken(bgHex, 0.03));
    root.style.setProperty('--bg-panel', bgHex);
    root.style.setProperty('--bg-card', '#ffffff');
    root.style.setProperty('--border-color', darken(bgHex, 0.09));
    root.style.setProperty('--border-muted', darken(bgHex, 0.05));
  }
}

export function applyCatColorToDom(hex: string | null) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!hex) {
    root.style.removeProperty('--cat-color');
    root.style.removeProperty('--cat-glow');
    return;
  }
  const [r, g, b] = hexToRgb(hex);
  root.style.setProperty('--cat-color', hex);
  root.style.setProperty('--cat-glow', `rgba(${r},${g},${b},0.55)`);
}
