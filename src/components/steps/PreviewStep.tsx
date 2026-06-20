"use client";

import { useState } from "react";
import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { AdvisorInline } from "@/components/wizard/AdvisorInline";
import { deriveTokens, getContrastRatio, getWCAGLevel } from "@/tokens/derive";
import type { DesignSystemData } from "@/types";
import { Sun, Moon } from "lucide-react";

const FONT_LABEL: Record<DesignSystemData["fontFamily"], string> = {
  geist: "Geist",
  inter: "Inter",
  roboto: "Roboto",
  system: "System UI",
};

const SHADE_KEYS = ["50","100","200","300","400","500","600","700","800","900"] as const;

export function isPreviewComplete(): boolean {
  return true;
}

interface Palette {
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  label: string;
}

const PALETTES: Record<"light" | "dark", Palette> = {
  light: { surface: "#ffffff", surfaceAlt: "#fafafa", text: "#18181b", textMuted: "#71717a", border: "#e4e4e7", label: "#a1a1aa" },
  dark: { surface: "#18181b", surfaceAlt: "#27272a", text: "#fafafa", textMuted: "#a1a1aa", border: "#3f3f46", label: "#71717a" },
};

function titleCase(v: string): string {
  return v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function orNotSet(v: string | undefined | null): string {
  return v ? titleCase(v) : "Not specified";
}

export function PreviewStep() {
  const { project, designSystem, uxPatterns, standards } = useWizardStore();
  const onBack = useStepBack();
  const tokens = deriveTokens(designSystem);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const p = PALETTES[theme];

  const cssVars: Record<string, string> = {
    "--pv-accent-50":  tokens.accent["50"],
    "--pv-accent-100": tokens.accent["100"],
    "--pv-accent-200": tokens.accent["200"],
    "--pv-accent-300": tokens.accent["300"],
    "--pv-accent-400": tokens.accent["400"],
    "--pv-accent-500": tokens.accent["500"],
    "--pv-accent-600": tokens.accent["600"],
    "--pv-accent-700": tokens.accent["700"],
    "--pv-accent-800": tokens.accent["800"],
    "--pv-accent-900": tokens.accent["900"],
    "--pv-font":       tokens.fontFamily,
    "--pv-radius":     tokens.radius.md,
    "--pv-radius-lg":  tokens.radius.lg,
    "--pv-radius-sm":  tokens.radius.sm,
    "--pv-shadow":     tokens.shadow.md,
    "--pv-shadow-sm":  tokens.shadow.sm,
    "--pv-shadow-lg":  tokens.shadow.lg,
  };

  const stackChips = [
    project.framework && titleCase(project.framework),
    titleCase(project.language),
    ...project.styling.map(titleCase),
    ...project.stateManagement.filter((s) => s !== "none").map(titleCase),
  ].filter(Boolean) as string[];

  const themeLabel = ({ "light-only": "Light only", "dark-only": "Dark only", "light-dark": "Light + Dark", system: "Follow system" } as Record<string, string>)[designSystem.themeStrategy] ?? "Not specified";

  return (
    <div>
      <StepHeader
        stepNumber={6}
        title="Visual System Review"
        description="Review your complete design system before exporting. This is your sign-off — every token, component, and decision in one place."
        onBack={onBack}
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {project.projectName || "Untitled Project"}
          </span>
          {stackChips.slice(0, 6).map((chip) => (
            <span key={chip} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {chip}
            </span>
          ))}
        </div>
        <div className="inline-flex shrink-0 rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${theme === "light" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"}`}
          >
            <Sun size={12} /> Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${theme === "dark" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"}`}
          >
            <Moon size={12} /> Dark
          </button>
        </div>
      </div>

      <AdvisorInline />

      <div
        style={{ ...(cssVars as React.CSSProperties), background: p.surface, borderColor: p.border, color: p.text }}
        className="space-y-12 rounded-2xl border p-6 transition-colors"
      >
        {/* ── Accent color palette ── */}
        <section>
          <SectionTitle palette={p}>Accent Color Scale</SectionTitle>
          <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${p.border}` }}>
            {SHADE_KEYS.map((step) => (
              <div key={step} className="flex-1 flex flex-col items-center py-4 gap-1" style={{ backgroundColor: tokens.accent[step] }}>
                <span className="text-[10px] font-mono font-medium" style={{ color: Number(step) >= 500 ? tokens.accent["50"] : tokens.accent["900"] }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WCAG contrast table ── */}
        <section>
          <SectionTitle palette={p}>Accessibility — WCAG Contrast</SectionTitle>
          <div className="rounded-xl overflow-x-auto" style={{ border: `1px solid ${p.border}` }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: p.surfaceAlt, color: p.textMuted }}>
                  <th className="text-left px-3 py-2">Shade</th>
                  <th className="text-left px-3 py-2">Hex</th>
                  <th className="text-center px-3 py-2">vs White</th>
                  <th className="text-center px-3 py-2">vs Black</th>
                </tr>
              </thead>
              <tbody>
                {SHADE_KEYS.map((shade) => {
                  const hex = tokens.accent[shade];
                  const onWhite = getWCAGLevel(getContrastRatio(hex, "#ffffff"));
                  const onBlack = getWCAGLevel(getContrastRatio(hex, "#000000"));
                  return (
                    <tr key={shade} style={{ borderTop: `1px solid ${p.border}` }}>
                      <td className="px-3 py-1.5 font-mono" style={{ color: p.textMuted }}>{shade}</td>
                      <td className="px-3 py-1.5 font-mono" style={{ color: p.textMuted }}>{hex}</td>
                      <td className="px-3 py-1.5 text-center"><WCAGBadge level={onWhite} /></td>
                      <td className="px-3 py-1.5 text-center"><WCAGBadge level={onBlack} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-3 py-2 text-[10px]" style={{ background: p.surfaceAlt, color: p.textMuted, borderTop: `1px solid ${p.border}` }}>
              AA ≥ 4.5 : 1 (normal text) · AAA ≥ 7 : 1 (enhanced)
            </div>
          </div>
        </section>

        {/* ── Typography ── */}
        <section>
          <SectionTitle palette={p}>Typography — {FONT_LABEL[designSystem.fontFamily]}</SectionTitle>
          <div className="rounded-xl p-5 space-y-3" style={{ border: `1px solid ${p.border}`, background: p.surface, fontFamily: "var(--pv-font)" }}>
            <p className="text-3xl font-bold leading-tight" style={{ color: p.text }}>The quick brown fox</p>
            <p className="text-xl font-semibold" style={{ color: p.text }}>Architecture decisions matter</p>
            <p className="text-base leading-relaxed" style={{ color: p.textMuted }}>
              Frontend Decision Engine helps you choose the right tools before writing a single line of code. Body text at 16px.
            </p>
            <code className="text-xs font-mono px-2 py-1 rounded" style={{ color: "var(--pv-accent-700)", background: "var(--pv-accent-50)" }}>
              {`const engine = new DecisionEngine({ typed: true })`}
            </code>
          </div>
        </section>

        {/* ── Component gallery ── */}
        <section>
          <SectionTitle palette={p}>Component Gallery</SectionTitle>
          <div className="rounded-xl p-5 space-y-5" style={{ border: `1px solid ${p.border}`, background: p.surface, fontFamily: "var(--pv-font)" }}>
            <div>
              <MicroLabel palette={p}>Buttons</MicroLabel>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Primary",   bg: "var(--pv-accent-600)", color: "#fff", border: "transparent" },
                  { label: "Secondary", bg: "var(--pv-accent-50)",  color: "var(--pv-accent-700)", border: "var(--pv-accent-200)" },
                  { label: "Ghost",     bg: "transparent",          color: "var(--pv-accent-600)", border: "transparent" },
                  { label: "Danger",    bg: "#ef4444",              color: "#fff", border: "transparent" },
                ].map(({ label, bg, color, border }) => (
                  <button key={label} style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: "var(--pv-radius)", padding: "0.45rem 1rem", fontSize: "0.875rem", fontWeight: 500, cursor: "default", boxShadow: label === "Primary" ? "var(--pv-shadow-sm)" : "none" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <MicroLabel palette={p}>Card</MicroLabel>
              <div style={{ borderRadius: "var(--pv-radius-lg)", border: `1px solid ${p.border}`, boxShadow: "var(--pv-shadow)", overflow: "hidden" }}>
                <div style={{ padding: "0.7rem 1rem", background: p.surfaceAlt, borderBottom: `1px solid ${p.border}` }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: p.text }}>Card Title</span>
                </div>
                <div style={{ padding: "0.7rem 1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: p.textMuted, margin: 0 }}>Card body with your shadow and radius settings applied.</p>
                </div>
                <div style={{ padding: "0.6rem 1rem", borderTop: `1px solid ${p.border}`, display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button style={{ background: "transparent", border: "none", color: p.textMuted, fontSize: "0.8rem", cursor: "default" }}>Cancel</button>
                  <button style={{ background: "var(--pv-accent-600)", color: "#fff", border: "none", borderRadius: "var(--pv-radius-sm)", padding: "0.3rem 0.75rem", fontSize: "0.8rem", cursor: "default" }}>Confirm</button>
                </div>
              </div>
            </div>

            <div>
              <MicroLabel palette={p}>Badges</MicroLabel>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Primary", bg: "var(--pv-accent-100)", color: "var(--pv-accent-700)" },
                  { label: "Success", bg: "#dcfce7", color: "#15803d" },
                  { label: "Warning", bg: "#fef9c3", color: "#a16207" },
                  { label: "Danger",  bg: "#fee2e2", color: "#b91c1c" },
                ].map(({ label, bg, color }) => (
                  <span key={label} style={{ background: bg, color, borderRadius: 9999, padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 500 }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Radius & Shadow ── */}
        <section>
          <SectionTitle palette={p}>Radius &amp; Shadow</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {(["sm","md","lg"] as const).map((key) => (
              <div key={key} className="p-4 flex flex-col items-center gap-1.5" style={{ borderRadius: tokens.radius[key], boxShadow: tokens.shadow[key], border: `1px solid ${p.border}`, background: p.surface }}>
                <div className="h-8 w-8" style={{ borderRadius: tokens.radius[key], backgroundColor: tokens.accent["500"] }} />
                <span className="text-xs" style={{ color: p.textMuted }}>radius-{key}</span>
                <span className="text-[10px] font-mono" style={{ color: p.label }}>{tokens.radius[key]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spacing scale ── */}
        <section>
          <SectionTitle palette={p}>Spacing Scale — base {designSystem.spacingBase}px</SectionTitle>
          <div className="flex items-end gap-2 rounded-xl p-4" style={{ border: `1px solid ${p.border}`, background: p.surface }}>
            {Object.entries(tokens.spacing).map(([key, val]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="rounded" style={{ width: val, height: val, backgroundColor: tokens.accent["400"], minWidth: "4px", minHeight: "4px", maxWidth: "48px", maxHeight: "48px" }} />
                <span className="text-[9px] font-mono" style={{ color: p.label }}>{key}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── UX Pattern summary ── */}
        <section>
          <SectionTitle palette={p}>UX Pattern Decisions</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Loading",      value: orNotSet(uxPatterns.loadingPattern) },
              { label: "Empty state",  value: orNotSet(uxPatterns.emptyStateStyle) },
              { label: "Success",      value: orNotSet(uxPatterns.successFeedback) },
              { label: "Error state",  value: orNotSet(uxPatterns.errorState) },
              { label: "Confirmation", value: uxPatterns.confirmationPattern === "none" ? "Immediate (no confirm)" : orNotSet(uxPatterns.confirmationPattern) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-3" style={{ border: `1px solid ${p.border}`, background: p.surface }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: p.label }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: p.text }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Standards summary ── */}
        <section>
          <SectionTitle palette={p}>Standards at a Glance</SectionTitle>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.border}` }}>
            {[
              { label: "Unit testing",   value: orNotSet(standards.testingUnit) },
              { label: "E2E testing",    value: orNotSet(standards.testingE2E) },
              { label: "Linting",        value: standards.linting.length ? standards.linting.join(", ") : "None" },
              { label: "Error handling", value: orNotSet(standards.errorHandling) },
              { label: "Git strategy",   value: standards.gitStrategy === "conventional-commits" ? "Conventional Commits" : "None" },
              { label: "Auth approach",  value: orNotSet(standards.authApproach) },
              { label: "Accessibility",  value: standards.accessibilityTarget === "wcag-aa" ? "WCAG AA" : standards.accessibilityTarget === "wcag-aaa" ? "WCAG AAA" : standards.accessibilityTarget === "basic" ? "Basic" : "Not specified" },
              { label: "Browser support",value: standards.browserSupport === "legacy" ? "Legacy (IE11+)" : standards.browserSupport === "modern" ? "Modern browsers" : "Not specified" },
              { label: "Theme strategy", value: themeLabel },
            ].map(({ label, value }, i) => (
              <div key={label} className="flex justify-between items-center px-4 py-2.5" style={{ borderTop: i === 0 ? "none" : `1px solid ${p.border}`, background: p.surface }}>
                <span className="text-sm" style={{ color: p.textMuted }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: p.text }}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children, palette }: { children: React.ReactNode; palette: Palette }) {
  return <h3 className="text-sm font-semibold mb-3" style={{ color: palette.text }}>{children}</h3>;
}

function MicroLabel({ children, palette }: { children: React.ReactNode; palette: Palette }) {
  return <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: palette.label }}>{children}</p>;
}

function WCAGBadge({ level }: { level: "AAA" | "AA" | "FAIL" }) {
  const styles = {
    AAA:  { background: "#166534", color: "#fff" },
    AA:   { background: "#15803d", color: "#fff" },
    FAIL: { background: "#991b1b", color: "#fff" },
  };
  return (
    <span style={{ ...styles[level], borderRadius: 4, padding: "0.1rem 0.4rem", fontSize: "0.65rem", fontWeight: 700, display: "inline-block" }}>
      {level}
    </span>
  );
}
