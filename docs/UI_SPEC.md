# BUDSEI UI SPECIFICATION

## 1. Measured Design Tokens

### 1.1 Color Palette
- **Dark Theme Surface**: `#0e0e10` (App background), `#141418` (Panels & Cards), `#191920` (Hover), `#101014` (Inputs/Code)
- **Dark Theme Borders**: `#262630` (Hairline container borders), `#1c1c24` (Muted dividers)
- **Dark Theme Accent**: `#e87c9c` (Primary brand pink/crimson, button fill, active indicator)
- **Dark Theme Typography**: `#e6e6ec` (Primary text), `#9090a0` (Secondary/Code), `#646476` (Muted caps & labels)

- **Light Theme Surface**: `#f7f7f9` (App background), `#ffffff` (Panels & Cards), `#f2f2f6` (Hover)
- **Light Theme Borders**: `#dfdfe6` (Hairline container borders), `#eaebee` (Muted dividers)
- **Light Theme Accent**: `#b8284f` (Primary brand crimson, button fill, active indicator)
- **Light Theme Typography**: `#19191d` (Primary text), `#5e5e6e` (Secondary), `#828294` (Muted caps & labels)

### 1.2 Subsystem & Status Badges
- **REAL SQLITE**: Green (`#4ade80` dark / `#15803d` light, micro-badge with outlined border)
- **MODELED**: Amber (`#fbbf24` dark / `#b45309` light)
- **EMULATED**: Indigo/Blue (`#818cf8` dark / `#4338ca` light)
- **ERROR / SPLIT**: Red (`#f87171` dark / `#dc2626` light)

### 1.3 Typography
- **Monospace**: `Space Mono` (with slashed zero `0x0000`, `8.0 KB`), fallback `JetBrains Mono, ui-monospace`.
- **Sans Serif**: `Inter`, fallback `system-ui, -apple-system`.
- **Stat Values**: 28px Bold Mono (`8.0 KB`, `1`, `0`).
- **Small Header/Tags**: 10-11px Uppercase Mono with `letter-spacing: 0.08em - 0.12em` (`SUBSYSTEM // STORAGE ENGINE`).
- **Brand**: Bold Space Mono, uppercase, wide letter-spacing (`0.22em`).

## 2. Layout Dimensions (1920×930 target)
- **TopBar**: `44px` height, full width hairline bottom border.
- **NavRail**: `274px` width, hairline right border, active item with `3px` accent left bar.
- **Console Column**: `~560px` width, hairline right border.
  - Split vertically into `SQL CONSOLE` and `QUERY RESULTS` at ~50%.
- **Subsystem Panel**: Flex 1 (scrolls vertically).
- **Bottom Drawer**: 2 tabs (`Execution Log`, `Time-Travel Timeline`), collapsible.
- **Status Footer**: `24px` height, hairline top border.
