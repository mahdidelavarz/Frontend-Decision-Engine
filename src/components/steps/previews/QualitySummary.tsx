"use client";

import type { StandardsData } from "@/types";

interface Props {
  standards: StandardsData;
}

type Tier = "Comprehensive" | "Standard" | "Minimal";

function deriveTier(s: StandardsData): Tier {
  const hasUnit = s.testingUnit !== "none";
  const hasE2E = s.testingE2E !== "none";
  const hasConventional = s.gitStrategy === "conventional-commits";
  if (hasUnit && hasE2E && s.linting.length >= 2 && hasConventional) return "Comprehensive";
  if ((hasUnit || hasE2E) && s.linting.length >= 1) return "Standard";
  return "Minimal";
}

const TIER_STYLES: Record<Tier, { bg: string; color: string; border: string }> = {
  Comprehensive: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
  Standard:      { bg: "#fef9c3", color: "#a16207", border: "#fde047" },
  Minimal:       { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
};

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid #f4f4f5" }}>
      <span style={{ fontSize: "0.78rem", color: "#52525b" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", fontWeight: 500, color: ok ? "#15803d" : "#71717a" }}>
        <span>{ok ? "✓" : "–"}</span>
        {value}
      </span>
    </div>
  );
}

export function QualitySummary({ standards }: Props) {
  const tier = deriveTier(standards);
  const ts = TIER_STYLES[tier];

  const hasUnit = standards.testingUnit !== "none";
  const hasE2E = standards.testingE2E !== "none";
  const hasAuth = standards.authApproach === "cookie" || standards.authApproach === "jwt";
  const hasMonitoring = standards.logging === "sentry";

  const testingLabel = [
    hasUnit ? standards.testingUnit : null,
    hasE2E ? standards.testingE2E : null,
  ]
    .filter(Boolean)
    .join(" + ") || "None";

  const lintingLabel = standards.linting.length > 0
    ? standards.linting.join(", ")
    : "None";

  const errorLabel: Record<StandardsData["errorHandling"], string> = {
    toast: "Toast (global)",
    inline: "Inline (field-level)",
    hybrid: "Hybrid",
  };

  return (
    <div>
      {/* Tier badge */}
      <div
        style={{
          background: ts.bg,
          border: `1px solid ${ts.border}`,
          borderRadius: "0.5rem",
          padding: "0.6rem 0.85rem",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: ts.color }}>
          {tier}
        </span>
        <span style={{ fontSize: "0.7rem", color: ts.color, opacity: 0.8 }}>
          Quality tier
        </span>
      </div>

      {/* Detail rows */}
      <div style={{ background: "#fafafa", borderRadius: "0.5rem", border: "1px solid #e4e4e7", padding: "0 0.85rem" }}>
        <Row label="Unit testing"   value={hasUnit ? standards.testingUnit : "None"} ok={hasUnit} />
        <Row label="E2E testing"    value={hasE2E  ? standards.testingE2E  : "None"} ok={hasE2E} />
        <Row label="Test coverage"  value={testingLabel} ok={hasUnit && hasE2E} />
        <Row label="Linting"        value={lintingLabel} ok={standards.linting.length > 0} />
        <Row label="Git strategy"   value={standards.gitStrategy === "conventional-commits" ? "Conventional" : "None"} ok={standards.gitStrategy === "conventional-commits"} />
        <Row label="Error handling" value={errorLabel[standards.errorHandling]} ok={standards.errorHandling === "hybrid"} />
        <Row label="Monitoring"     value={hasMonitoring ? "Sentry" : standards.logging === "console" ? "Console only" : "None"} ok={hasMonitoring} />
        <Row label="Authentication" value={hasAuth ? (standards.authApproach === "cookie" ? "Cookie (HttpOnly)" : "JWT") : standards.authApproach === "none" ? "None (public)" : "Not set"} ok={hasAuth} />
        <Row label="Retry policy"   value={standards.retryPolicy === "" ? "Not set" : standards.retryPolicy === "none" ? "None" : standards.retryPolicy === "manual" ? "Manual retry" : "Auto backoff"} ok={standards.retryPolicy === "manual" || standards.retryPolicy === "automatic"} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0" }}>
          <span style={{ fontSize: "0.78rem", color: "#52525b" }}>Date library</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#52525b" }}>{standards.dateLibrary || "Not set"}</span>
        </div>
      </div>
    </div>
  );
}
