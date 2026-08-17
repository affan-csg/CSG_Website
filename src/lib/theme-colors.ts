/**
 * Canonical sRGB hex for the `--gold`/`--electric` design token (`src/styles.css`,
 * currently `oklch(0.7 0.145 259)`). CSS consumers read the token directly via
 * `var(--gold)`; this constant exists only for the handful of non-CSS contexts
 * (WebGL material colors, canvas 2D fillStyle, static SVG) that can't.
 *
 * If the token's color changes, update it here too, then re-derive:
 * - `ACCENT_HEX` — recompute via the OKLab->linear-sRGB matrix (see CHANGELOG
 *   "Filter re-solve method" for the conversion approach), not by eyeballing
 * - `public/favicon.svg` — static file, can't import this; update its `fill` by hand
 * - CSG logo tint filters in `index.tsx` / `site-nav.tsx` / `site-footer.tsx` —
 *   re-solve the `filter:` chain against the new target color (script-based
 *   color match against the real logo PNG, see CHANGELOG for the method)
 */
export const ACCENT_HEX = "#659ef7";

/** Same color as {@link ACCENT_HEX}, as "r, g, b" for building `rgba(...)` strings. */
export const ACCENT_RGB = "101, 158, 247";

/**
 * Original golden particle color (used for particle backgrounds for visual continuity
 * with the prior design state). Particles use this; text/UI use ACCENT_HEX instead.
 */
export const PARTICLE_HEX = "#c8ab6e";
export const PARTICLE_RGB = "200, 171, 110";
