"use client";

import { deriveTokens } from "@/tokens/derive";
import type { DesignSystemData } from "@/types";
import type { CSSProperties } from "react";

interface Props {
  designSystem: DesignSystemData;
}

export function DesignPreview({ designSystem }: Props) {
  const tokens = deriveTokens(designSystem);

  const cssVars: CSSProperties = {
    "--ds-accent-50": tokens.accent["50"],
    "--ds-accent-100": tokens.accent["100"],
    "--ds-accent-200": tokens.accent["200"],
    "--ds-accent-300": tokens.accent["300"],
    "--ds-accent-400": tokens.accent["400"],
    "--ds-accent-500": tokens.accent["500"],
    "--ds-accent-600": tokens.accent["600"],
    "--ds-accent-700": tokens.accent["700"],
    "--ds-accent-800": tokens.accent["800"],
    "--ds-accent-900": tokens.accent["900"],
    "--ds-radius": tokens.radius.md,
    "--ds-radius-lg": tokens.radius.lg,
    "--ds-radius-sm": tokens.radius.sm,
    "--ds-shadow": tokens.shadow.md,
    "--ds-shadow-sm": tokens.shadow.sm,
    "--ds-font": tokens.fontFamily,
  } as CSSProperties;

  const SHADE_KEYS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;

  return (
    <div style={cssVars} className="space-y-5">
      {/* ─── Buttons ──────────────────────────────────────────── */}
      <PreviewCard title="Buttons">
        <div className="flex flex-wrap gap-2">
          <button
            style={{
              background: "var(--ds-accent-600)",
              color: "#fff",
              borderRadius: "var(--ds-radius)",
              boxShadow: "var(--ds-shadow-sm)",
              border: "none",
              padding: "0.45rem 1rem",
              fontFamily: "var(--ds-font)",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "default",
            }}
          >
            Primary
          </button>
          <button
            style={{
              background: "var(--ds-accent-50)",
              color: "var(--ds-accent-700)",
              borderRadius: "var(--ds-radius)",
              border: "1px solid var(--ds-accent-200)",
              padding: "0.45rem 1rem",
              fontFamily: "var(--ds-font)",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "default",
            }}
          >
            Secondary
          </button>
          <button
            style={{
              background: "transparent",
              color: "var(--ds-accent-600)",
              borderRadius: "var(--ds-radius)",
              border: "1px solid transparent",
              padding: "0.45rem 1rem",
              fontFamily: "var(--ds-font)",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "default",
            }}
          >
            Ghost
          </button>
          <button
            style={{
              background: "#ef4444",
              color: "#fff",
              borderRadius: "var(--ds-radius)",
              border: "none",
              padding: "0.45rem 1rem",
              fontFamily: "var(--ds-font)",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "default",
            }}
          >
            Danger
          </button>
        </div>
      </PreviewCard>

      {/* ─── Card ─────────────────────────────────────────────── */}
      <PreviewCard title="Card">
        <div
          style={{
            borderRadius: "var(--ds-radius-lg)",
            border: "1px solid #e4e4e7",
            boxShadow: "var(--ds-shadow)",
            overflow: "hidden",
            fontFamily: "var(--ds-font)",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid #e4e4e7",
              background: "#fafafa",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#18181b" }}>
              Card Title
            </span>
          </div>
          <div style={{ padding: "0.75rem 1rem" }}>
            <p style={{ fontSize: "0.8rem", color: "#71717a", margin: 0 }}>
              Card body content with your chosen shadow depth and border radius.
            </p>
          </div>
        </div>
      </PreviewCard>

      {/* ─── Form Input ───────────────────────────────────────── */}
      <PreviewCard title="Form Input">
        <div style={{ fontFamily: "var(--ds-font)" }}>
          <label
            style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#3f3f46", marginBottom: "0.35rem" }}
          >
            Email address
          </label>
          <input
            readOnly
            value="user@example.com"
            style={{
              width: "100%",
              padding: "0.45rem 0.75rem",
              borderRadius: "var(--ds-radius)",
              border: "1px solid var(--ds-accent-300)",
              fontSize: "0.875rem",
              color: "#18181b",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "var(--ds-font)",
              background: "white",
            }}
          />
          <p style={{ fontSize: "0.75rem", color: "#71717a", marginTop: "0.35rem", marginBottom: 0 }}>
            We&apos;ll never share your email.
          </p>
        </div>
      </PreviewCard>

      {/* ─── Badges ───────────────────────────────────────────── */}
      <PreviewCard title="Badges">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Primary", bg: "var(--ds-accent-100)", color: "var(--ds-accent-700)" },
            { label: "Success", bg: "#dcfce7", color: "#15803d" },
            { label: "Warning", bg: "#fef9c3", color: "#a16207" },
            { label: "Danger", bg: "#fee2e2", color: "#b91c1c" },
            { label: "Neutral", bg: "#f4f4f5", color: "#52525b" },
          ].map(({ label, bg, color }) => (
            <span
              key={label}
              style={{
                background: bg,
                color,
                borderRadius: "9999px",
                padding: "0.2rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                fontFamily: "var(--ds-font)",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </PreviewCard>

      {/* ─── Alerts ───────────────────────────────────────────── */}
      <PreviewCard title="Alerts">
        <div className="space-y-2">
          <div
            style={{
              background: "var(--ds-accent-50)",
              border: "1px solid var(--ds-accent-200)",
              borderRadius: "var(--ds-radius)",
              padding: "0.6rem 0.85rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "var(--ds-accent-600)", fontSize: "0.9rem", flexShrink: 0 }}>ℹ</span>
            <span style={{ fontSize: "0.8rem", color: "var(--ds-accent-800)", fontFamily: "var(--ds-font)" }}>
              Your settings have been saved successfully.
            </span>
          </div>
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "var(--ds-radius)",
              padding: "0.6rem 0.85rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "#dc2626", fontSize: "0.9rem", flexShrink: 0 }}>✕</span>
            <span style={{ fontSize: "0.8rem", color: "#991b1b", fontFamily: "var(--ds-font)" }}>
              An error occurred. Please try again.
            </span>
          </div>
        </div>
      </PreviewCard>

      {/* ─── Empty State ──────────────────────────────────────── */}
      <PreviewCard title="Empty State">
        <div
          style={{
            textAlign: "center",
            padding: "1.25rem 1rem",
            border: "1px dashed #d4d4d8",
            borderRadius: "var(--ds-radius-lg)",
            fontFamily: "var(--ds-font)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--ds-accent-100)",
              margin: "0 auto 0.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            📂
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#18181b", margin: "0 0 0.2rem" }}>
            No results found
          </p>
          <p style={{ fontSize: "0.78rem", color: "#71717a", margin: "0 0 0.75rem" }}>
            Try adjusting your search or filters.
          </p>
          <button
            style={{
              background: "var(--ds-accent-600)",
              color: "#fff",
              borderRadius: "var(--ds-radius)",
              border: "none",
              padding: "0.35rem 0.85rem",
              fontFamily: "var(--ds-font)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "default",
            }}
          >
            Add item
          </button>
        </div>
      </PreviewCard>

      {/* ─── Contrast Strip ───────────────────────────────────── */}
      <PreviewCard title="Accent Scale + Contrast">
        <div className="space-y-1">
          {SHADE_KEYS.map((shade) => {
            const hex = tokens.accent[shade];
            const onWhite = tokens.contrastOnWhite[shade];
            const onBlack = tokens.contrastOnBlack[shade];
            const textColor = parseInt(shade) >= 500 ? "#ffffff" : "#18181b";
            return (
              <div
                key={shade}
                style={{
                  background: hex,
                  color: textColor,
                  borderRadius: "var(--ds-radius-sm)",
                  padding: "0.25rem 0.6rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--ds-font)",
                  fontSize: "0.75rem",
                }}
              >
                <span style={{ fontWeight: 500 }}>{shade}</span>
                <span style={{ opacity: 0.7 }}>{hex}</span>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <ContrastBadge level={onWhite} label="W" />
                  <ContrastBadge level={onBlack} label="B" />
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: "0.7rem", color: "#71717a", marginTop: "0.4rem", marginBottom: 0 }}>
          W = on white · B = on black · AA ≥ 4.5 · AAA ≥ 7
        </p>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.4rem" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function ContrastBadge({ level, label }: { level: "AAA" | "AA" | "FAIL"; label: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    AAA: { bg: "#166534", color: "#fff" },
    AA: { bg: "#15803d", color: "#fff" },
    FAIL: { bg: "#7f1d1d", color: "#fff" },
  };
  const s = styles[level];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: "3px",
        padding: "0 0.3rem",
        fontSize: "0.65rem",
        fontWeight: 700,
        lineHeight: "1.5",
      }}
    >
      {label}:{level}
    </span>
  );
}
