"use client";

import { useWizardStore } from "@/store";
import { ViolationItem } from "./AdvisorPanel";
import type { WizardStep } from "@/types";
import { ShieldCheck, AlertTriangle, Lightbulb } from "lucide-react";

/**
 * Compact advisor list shown on the Preview and Export steps so the user can
 * click a hint/warning to jump straight to the owning field (ARCH-7).
 */
export function AdvisorInline() {
  const violations = useWizardStore((s) => s.violations);
  const setStep = useWizardStore((s) => s.setStep);
  const setFocusField = useWizardStore((s) => s.setFocusField);

  const actionable = violations.filter((v) => v.severity !== "excellent-match");

  const handleJump = (step: WizardStep, field?: string) => {
    setStep(step);
    setFocusField(field ?? null);
  };

  if (actionable.length === 0) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 dark:text-emerald-400" />
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          No conflicts or open recommendations — your blueprint is consistent.
        </p>
      </div>
    );
  }

  const issues = actionable.filter((v) => v.severity === "error" || v.severity === "warning" || v.severity === "info");
  const tips = actionable.filter((v) => v.severity === "recommendation");

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-amber-100 dark:border-amber-900/40">
        {issues.length > 0 ? (
          <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
        ) : (
          <Lightbulb size={15} className="text-violet-600 dark:text-violet-400" />
        )}
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Before you export — {actionable.length} item{actionable.length !== 1 ? "s" : ""} to review
        </p>
        <span className="ml-auto text-xs text-zinc-500">Click to fix in place</span>
      </div>
      <div className="divide-y divide-amber-100/70 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
        {[...issues, ...tips].map((v) => (
          <ViolationItem key={v.ruleId} v={v} onJump={handleJump} />
        ))}
      </div>
    </div>
  );
}
