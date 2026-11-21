# BUDSEI UI SPECIFICATION

## 1. Measured Design Tokens

### 1.1 Color Palette
- **Dark Theme Surface**: `#101013` (App background), `#151519` (Panels & NavRail), `#1c1c22` (Hover), `#18181e` (Cards), `#101014` (Inputs/Code)
- **Dark Theme Borders**: `#282832` (Hairline container borders), `#1e1e26` (Muted dividers)
- **Dark Theme Accent**: `#e87c9c` (Primary brand pink/crimson, button fill, active indicator)
- **Dark Theme Typography**: `#e8e8ee` (Primary text), `#9090a0` (Secondary/Code), `#646476` (Muted caps & labels)

- **Light Theme Surface**: `#f5f2eb` (App warm linen background), `#faf7f2` (TopBar & NavRail), `#ffffff` (Panels & Cards), `#f0ebe2` (Hover)
- **Light Theme Borders**: `#e2dcd5` (Warm hairline container borders), `#ede7df` (Muted dividers)
- **Light Theme Accent**: `#bd647d` (Primary brand dusty rose / berry pink, button fill, active indicator)
- **Light Theme Typography**: `#1c1c22` (Primary text), `#5e5e6e` (Secondary), `#888898` (Muted caps & labels)

### 1.2 Subsystem & Status Badges
- **REAL SQLITE**: Green (`#4ade80` dark / `#15803d` light, micro-badge with outlined border)
- **MODELED**: Amber (`#fbbf24` dark / `#b45309` light)
- **EMULATED**: Indigo/Blue (`#818cf8` dark / `#4338ca` light)
- **ERROR / SPLIT**: Red (`#f87171` dark / `#b91c1c` light)

### 1.3 Typography
- **Monospace**: `Space Mono` (with slashed zero `0x0000`, `8.0 KB`), fallback `JetBrains Mono, ui-monospace`.
- **Sans Serif**: `Inter`, fallback `system-ui, -apple-system`.
- **Stat Values**: 28px Bold Mono (`8.0 KB`, `1`, `0`).
- **Small Header/Tags**: 11px Uppercase Mono with `letter-spacing: 0.12em` (`SUBSYSTEM // STORAGE ENGINE`).
- **Brand**: Bold Space Mono, uppercase, wide letter-spacing (`0.22em`).

## 2. Layout Dimensions (1920×930 target)
- **TopBar**: `44px` height, full width hairline bottom border.
- **NavRail**: `274px` width, hairline right border, active item with `3px` accent left bar.
- **Console Column**: `~560px` width, hairline right border.
  - Split vertically into `SQL CONSOLE` and `QUERY RESULTS` at ~50%.
- **Subsystem Panel**: Flex 1 (scrolls vertically).
- **Bottom Drawer**: 2 tabs (`Execution Log`, `Time-Travel Timeline`), collapsible.
- **Status Footer**: `24px` height, hairline top border.
