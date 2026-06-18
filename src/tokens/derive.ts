import type { DesignSystemData } from "@/types";

// ─── Color math ──────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return [Math.round(h * 60 + 360) % 360, Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

const LIGHTNESS_MAP: Record<string, number> = {
  "50": 96, "100": 92, "200": 82, "300": 70, "400": 58,
  "500": 48, "600": 40, "700": 32, "800": 24, "900": 15,
};

export function generateAccentScale(hex: string): Record<string, string> {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#3b82f6";
  const [h, s] = hexToHsl(safeHex);
  const cappedS = Math.min(s, 85);
  return Object.fromEntries(
    Object.entries(LIGHTNESS_MAP).map(([key, l]) => [key, hslToHex(h, cappedS, l)])
  );
}

// ─── Radius maps ─────────────────────────────────────────────────────────────

const RADIUS_MAP: Record<DesignSystemData["radiusScale"], Record<string, string>> = {
  none:  { sm: "0", md: "0", lg: "0", xl: "0", full: "0" },
  sm:    { sm: "0.125rem", md: "0.25rem", lg: "0.375rem", xl: "0.5rem", full: "9999px" },
  md:    { sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", full: "9999px" },
  lg:    { sm: "0.375rem", md: "0.75rem", lg: "1rem", xl: "1.5rem", full: "9999px" },
  full:  { sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", full: "9999px" },
};

// ─── Shadow maps ─────────────────────────────────────────────────────────────

const SHADOW_MAP: Record<DesignSystemData["shadowDepth"], Record<string, string>> = {
  flat:     { sm: "none", md: "none", lg: "none" },
  subtle:   { sm: "0 1px 2px 0 rgb(0 0 0/0.05)", md: "0 4px 6px -1px rgb(0 0 0/0.1)", lg: "0 10px 15px -3px rgb(0 0 0/0.1)" },
  elevated: { sm: "0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)", md: "0 4px 6px -1px rgb(0 0 0/0.15)", lg: "0 20px 25px -5px rgb(0 0 0/0.15)" },
};

// ─── Font maps ────────────────────────────────────────────────────────────────

const FONT_MAP: Record<DesignSystemData["fontFamily"], string> = {
  geist: "'Geist', system-ui, sans-serif",
  inter: "'Inter', system-ui, sans-serif",
  roboto: "'Roboto', system-ui, sans-serif",
  system: "system-ui, -apple-system, sans-serif",
};

// ─── Spacing ─────────────────────────────────────────────────────────────────

function generateSpacingScale(base: number): Record<string, string> {
  const b = base / 16;
  return {
    "1": `${b * 0.25}rem`,
    "2": `${b * 0.5}rem`,
    "3": `${b * 0.75}rem`,
    "4": `${b}rem`,
    "6": `${b * 1.5}rem`,
    "8": `${b * 2}rem`,
    "12": `${b * 3}rem`,
    "16": `${b * 4}rem`,
    "24": `${b * 6}rem`,
  };
}

// ─── WCAG contrast ───────────────────────────────────────────────────────────

export type ContrastLevel = "AAA" | "AA" | "FAIL";

function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex: string): number {
  const r = toLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = toLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = toLinear(parseInt(hex.slice(5, 7), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWCAGLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "FAIL";
}

function buildContrastMap(
  scale: Record<string, string>,
  background: string
): Record<string, ContrastLevel> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, hex]) => [
      key,
      getWCAGLevel(getContrastRatio(hex, background)),
    ])
  );
}

// ─── Exported types ───────────────────────────────────────────────────────────

export interface DerivedTokens {
  accent: Record<string, string>;
  fontFamily: string;
  radius: Record<string, string>;
  shadow: Record<string, string>;
  spacing: Record<string, string>;
  spacingBase: number;
  contrastOnWhite: Record<string, ContrastLevel>;
  contrastOnBlack: Record<string, ContrastLevel>;
}

export function deriveTokens(ds: DesignSystemData): DerivedTokens {
  const accent = generateAccentScale(ds.accentColorHex);
  return {
    accent,
    fontFamily: FONT_MAP[ds.fontFamily],
    radius: RADIUS_MAP[ds.radiusScale],
    shadow: SHADOW_MAP[ds.shadowDepth],
    spacing: generateSpacingScale(ds.spacingBase),
    spacingBase: ds.spacingBase,
    contrastOnWhite: buildContrastMap(accent, "#ffffff"),
    contrastOnBlack: buildContrastMap(accent, "#000000"),
  };
}
