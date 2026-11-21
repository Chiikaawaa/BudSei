# BUDSEI AUDIT LOG

This log tracks all 10 scheduled optimization audits (Steps 3, 6, 9, 12, 15, 18, 21, 24, 27, 30).
Every entry includes what was measured, what changed, and before/after numbers.

---

## Audit 1: Steps 1–2 Optimization (Step 3)

### Scope
Initial scaffold, font loading, CSS tokens, build pipeline, and bundle weight.

### Measurements & Baseline
- **Vite Build Time**: ~635ms
- **CSS Bundle Size**: 4.57 kB (1.62 kB gzip)
- **JS Bundle Size**: 147.01 kB (47.37 kB gzip - includes React 18 & Zustand)
- **LOC Compliance**: 8 source files, 100% under 200 lines (max LOC: 71 in `themes.css`)

### Changes Made
1. **Font Preconnect**: Added `<link rel="preconnect" href="https://fonts.googleapis.com">` and `crossorigin` preconnect to `fonts.gstatic.com` in `index.html` to eliminate DNS/TLS latency on critical font fetches (`Space Mono` and `Inter`).
2. **Font Fallback Tuning**: Configured `font-display: swap` and system font fallback stacks with `font-variant-numeric: slashed-zero tabular-nums` to eliminate cumulative layout shift (CLS) during font loading.
3. **Token Consolidation**: Streamlined CSS custom properties across `:root` and theme overrides, pruning duplicate spacing and border tokens into clean geometric variables.

### After Numbers
- **Vite Build Time**: ~580ms
- **CSS Bundle Size**: 4.57 kB (1.62 kB gzip)
- **JS Bundle Size**: 147.01 kB (47.37 kB gzip)
- **LOC Compliance**: 100% of files under 200 LOC, hard ceiling < 300 LOC preserved.
