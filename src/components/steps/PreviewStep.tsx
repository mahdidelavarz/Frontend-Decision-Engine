"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { deriveTokens, getContrastRatio, getWCAGLevel } from "@/tokens/derive";
import type { DesignSystemData } from "@/types";

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

export function PreviewStep() {
  const { designSystem, uxPatterns, standards } = useWizardStore();
  const tokens = deriveTokens(designSystem);

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

  return (
    <div>
      <StepHeader
        stepNumber={6}
        title="Visual System Review"
        description="Review your complete design system before exporting. This is your sign-off — every token, component, and decision in one place."
      />

      <div style={cssVars as React.CSSProperties} className="space-y-10">

        {/* ── Accent color palette ── */}
        <section>
          <SectionTitle>Accent Color Scale</SectionTitle>
          <div className="flex rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
            {SHADE_KEYS.map((step) => (
              <div
                key={step}
                className="flex-1 flex flex-col items-center py-4 gap-1"
                style={{ backgroundColor: tokens.accent[step] }}
              >
                <span
                  className="text-[10px] font-mono font-medium"
                  style={{ color: Number(step) >= 500 ? tokens.accent["50"] : tokens.accent["900"] }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-1 mt-1">
            <span className="text-[10px] text-zinc-400 font-mono dark:text-zinc-500">{tokens.accent["50"]}</span>
            <span className="text-[10px] text-zinc-400 font-mono dark:text-zinc-500">{tokens.accent["900"]}</span>
          </div>
        </section>

        {/* ── WCAG contrast table ── */}
        <section>
          <SectionTitle>Accessibility — WCAG Contrast</SectionTitle>
          <div className="rounded-xl border border-zinc-100 overflow-hidden dark:border-zinc-800">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 font-medium dark:bg-zinc-800/60 dark:text-zinc-400">
                  <th className="text-left px-3 py-2">Shade</th>
                  <th className="text-left px-3 py-2">Hex</th>
                  <th className="text-center px-3 py-2">vs White</th>
                  <th className="text-center px-3 py-2">vs Black</th>
                  <th className="text-center px-3 py-2">Swatch</th>
                </tr>
              </thead>
              <tbody>
                {SHADE_KEYS.map((shade, i) => {
                  const hex = tokens.accent[shade];
                  const onWhite = getWCAGLevel(getContrastRatio(hex, "#ffffff"));
                  const onBlack = getWCAGLevel(getContrastRatio(hex, "#000000"));
                  return (
                    <tr key={shade} className={i % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/50 dark:bg-zinc-800/30"}>
                      <td className="px-3 py-1.5 font-mono text-zinc-600 dark:text-zinc-400">{shade}</td>
                      <td className="px-3 py-1.5 font-mono text-zinc-500 dark:text-zinc-400">{hex}</td>
                      <td className="px-3 py-1.5 text-center">
                        <WCAGBadge level={onWhite} />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <WCAGBadge level={onBlack} />
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="w-6 h-4 rounded mx-auto" style={{ background: hex, border: "1px solid #e4e4e7" }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-100 text-[10px] text-zinc-400 dark:bg-zinc-800/60 dark:border-zinc-800">
              AA ≥ 4.5 : 1 (normal text) · AAA ≥ 7 : 1 (enhanced)
            </div>
          </div>
        </section>

        {/* ── Typography ── */}
        <section>
          <SectionTitle>Typography — {FONT_LABEL[designSystem.fontFamily]}</SectionTitle>
          <div
            className="rounded-xl border border-zinc-100 p-5 space-y-3 bg-white dark:bg-zinc-900 dark:border-zinc-800"
            style={{ fontFamily: "var(--pv-font)" }}
          >
            <p className="text-3xl font-bold text-zinc-900 leading-tight dark:text-zinc-100">The quick brown fox</p>
            <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Architecture decisions matter</p>
            <p className="text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
              Frontend Decision Engine helps you choose the right tools before writing a single line of code. Body text at 16px.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">Small text — labels, captions, metadata.</p>
            <code className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded dark:text-indigo-400 dark:bg-indigo-950/50">
              {`const engine = new DecisionEngine({ typed: true })`}
            </code>
          </div>
        </section>

        {/* ── Component gallery ── */}
        <section>
          <SectionTitle>Component Gallery</SectionTitle>
          <div className="rounded-xl border border-zinc-100 p-5 space-y-5 bg-white dark:bg-zinc-900 dark:border-zinc-800" style={{ fontFamily: "var(--pv-font)" }}>

            {/* Buttons */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Buttons</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Primary",   bg: "var(--pv-accent-600)", color: "#fff", border: "transparent" },
                  { label: "Secondary", bg: "var(--pv-accent-50)",  color: "var(--pv-accent-700)", border: "var(--pv-accent-200)" },
                  { label: "Ghost",     bg: "transparent",          color: "var(--pv-accent-600)", border: "transparent" },
                  { label: "Danger",    bg: "#ef4444",              color: "#fff", border: "transparent" },
                ].map(({ label, bg, color, border }) => (
                  <button
                    key={label}
                    style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: "var(--pv-radius)", padding: "0.45rem 1rem", fontSize: "0.875rem", fontWeight: 500, cursor: "default", boxShadow: label === "Primary" ? "var(--pv-shadow-sm)" : "none" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Card</p>
              <div style={{ borderRadius: "var(--pv-radius-lg)", border: "1px solid #e4e4e7", boxShadow: "var(--pv-shadow)", overflow: "hidden" }}>
                <div style={{ padding: "0.7rem 1rem", background: "#fafafa", borderBottom: "1px solid #e4e4e7" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#18181b" }}>Card Title</span>
                </div>
                <div style={{ padding: "0.7rem 1rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "#71717a", margin: 0 }}>Card body with your shadow and radius settings applied.</p>
                </div>
                <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button style={{ background: "transparent", border: "none", color: "#71717a", fontSize: "0.8rem", cursor: "default" }}>Cancel</button>
                  <button style={{ background: "var(--pv-accent-600)", color: "#fff", border: "none", borderRadius: "var(--pv-radius-sm)", padding: "0.3rem 0.75rem", fontSize: "0.8rem", cursor: "default" }}>Confirm</button>
                </div>
              </div>
            </div>

            {/* Form row */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Form Input</p>
              <div style={{ maxWidth: 320 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#3f3f46", marginBottom: "0.3rem" }}>Email address</label>
                <input readOnly value="user@example.com" style={{ width: "100%", padding: "0.45rem 0.75rem", borderRadius: "var(--pv-radius)", border: "1px solid var(--pv-accent-300)", fontSize: "0.875rem", boxSizing: "border-box", fontFamily: "var(--pv-font)", background: "white", outline: "none" }} />
                <p style={{ fontSize: "0.75rem", color: "#71717a", margin: "0.3rem 0 0" }}>We&apos;ll never share your email.</p>
              </div>
            </div>

            {/* Badges */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Badges</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Primary", bg: "var(--pv-accent-100)", color: "var(--pv-accent-700)" },
                  { label: "Success", bg: "#dcfce7", color: "#15803d" },
                  { label: "Warning", bg: "#fef9c3", color: "#a16207" },
                  { label: "Danger",  bg: "#fee2e2", color: "#b91c1c" },
                  { label: "Neutral", bg: "#f4f4f5", color: "#52525b" },
                ].map(({ label, bg, color }) => (
                  <span key={label} style={{ background: bg, color, borderRadius: 9999, padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 500 }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Alerts</p>
              <div className="space-y-2">
                <div style={{ background: "var(--pv-accent-50)", border: "1px solid var(--pv-accent-200)", borderRadius: "var(--pv-radius)", padding: "0.55rem 0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--pv-accent-600)", flexShrink: 0 }}>ℹ</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--pv-accent-800)" }}>Your blueprint has been saved successfully.</span>
                </div>
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "var(--pv-radius)", padding: "0.55rem 0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#dc2626", flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: "0.8rem", color: "#991b1b" }}>An error occurred. Please try again.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Radius & Shadow ── */}
        <section>
          <SectionTitle>Radius &amp; Shadow</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {(["sm","md","lg"] as const).map((key) => (
              <div key={key} className="bg-white p-4 flex flex-col items-center gap-1.5 dark:bg-zinc-900 dark:border-zinc-700" style={{ borderRadius: tokens.radius[key], boxShadow: tokens.shadow[key], border: "1px solid #e4e4e7" }}>
                <div className="h-8 w-8" style={{ borderRadius: tokens.radius[key], backgroundColor: tokens.accent["500"] }} />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">radius-{key}</span>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">{tokens.radius[key]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spacing scale ── */}
        <section>
          <SectionTitle>Spacing Scale — base {designSystem.spacingBase}px</SectionTitle>
          <div className="flex items-end gap-2 bg-white rounded-xl border border-zinc-100 p-4 dark:bg-zinc-900 dark:border-zinc-800">
            {Object.entries(tokens.spacing).map(([key, val]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="rounded" style={{ width: val, height: val, backgroundColor: tokens.accent["400"], minWidth: "4px", minHeight: "4px", maxWidth: "48px", maxHeight: "48px" }} />
                <span className="text-[9px] text-zinc-400 font-mono">{key}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── UX Pattern summary ── */}
        <section>
          <SectionTitle>UX Pattern Decisions</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Loading",      value: uxPatterns.loadingPattern.replace("-", " ") },
              { label: "Empty state",  value: uxPatterns.emptyStateStyle.replace("-", " ") },
              { label: "Success",      value: uxPatterns.successFeedback },
              { label: "Confirmation", value: uxPatterns.confirmationPattern === "none" ? "Immediate (no confirm)" : uxPatterns.confirmationPattern },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-lg border border-zinc-100 p-3 dark:bg-zinc-900 dark:border-zinc-800">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium text-zinc-800 capitalize dark:text-zinc-200">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Standards summary ── */}
        <section>
          <SectionTitle>Standards at a Glance</SectionTitle>
          <div className="bg-white rounded-xl border border-zinc-100 divide-y divide-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:divide-zinc-800">
            {[
              { label: "Unit testing",    value: standards.testingUnit },
              { label: "E2E testing",     value: standards.testingE2E },
              { label: "Linting",         value: standards.linting.length ? standards.linting.join(", ") : "None" },
              { label: "Error handling",  value: standards.errorHandling },
              { label: "Git strategy",    value: standards.gitStrategy === "conventional-commits" ? "Conventional Commits" : "None" },
              { label: "Auth approach",   value: standards.authApproach },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-4 py-2.5">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className="text-sm font-medium text-zinc-800 capitalize dark:text-zinc-200">{value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-zinc-700 mb-3 dark:text-zinc-300">{children}</h3>;
}

function WCAGBadge({ level }: { level: "AAA" | "AA" | "FAIL" }) {
  const styles = {
    AAA:  { background: "#166534", color: "#fff" },
    AA:   { background: "#15803d", color: "#fff" },
    FAIL: { background: "#991b1b", color: "#fff" },
  };
  return (
    <span
      style={{
        ...styles[level],
        borderRadius: 4,
        padding: "0.1rem 0.4rem",
        fontSize: "0.65rem",
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {level}
    </span>
  );
}
