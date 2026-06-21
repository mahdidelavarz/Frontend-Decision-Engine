"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useWizardStore } from "@/store";
import type { Violation, WizardStep } from "@/types";
import {
  AlertTriangle,
  X,
  ShieldCheck,
  AlertCircle,
  Info,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface AdvisorPanelProps {
  violations: Violation[];
  onNavigate: (step: WizardStep) => void;
}

const SeverityIcon = ({ severity }: { severity: Violation["severity"] }) => {
  if (severity === "error") return <AlertCircle size={15} className="text-red-500 shrink-0" />;
  if (severity === "warning") return <AlertTriangle size={15} className="text-amber-500 shrink-0" />;
  if (severity === "recommendation") return <Lightbulb size={15} className="text-violet-500 shrink-0" />;
  if (severity === "excellent-match") return <Sparkles size={15} className="text-emerald-500 shrink-0" />;
  return <Info size={15} className="text-blue-500 shrink-0" />;
};

const severityRail: Record<Violation["severity"], string> = {
  error: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-blue-400",
  recommendation: "bg-violet-400",
  "excellent-match": "bg-emerald-400",
};

export function ViolationItem({
  v,
  onJump,
}: {
  v: Violation;
  onJump: (step: WizardStep, field?: string) => void;
}) {
  const targetStep = v.affectedSteps[0];
  return (
    <div className="relative flex gap-2.5 px-4 py-3">
      <span className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", severityRail[v.severity])} />
      <SeverityIcon severity={v.severity} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-900 leading-tight dark:text-zinc-100">
          {v.title}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed dark:text-zinc-400">
          {v.message}
        </p>
        {targetStep && v.severity !== "excellent-match" && (
          <button
            type="button"
            onClick={() => onJump(targetStep, v.field)}
            className="mt-2 inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          >
            {v.field ? "Jump to fix" : `Go to ${targetStep}`}
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AdvisorPanel({ violations, onNavigate }: AdvisorPanelProps) {
  const [open, setOpen] = useState(false);
  const setFocusField = useWizardStore((s) => s.setFocusField);

  const issues = violations.filter((v) => v.severity === "error" || v.severity === "warning" || v.severity === "info");
  const recommendations = violations.filter((v) => v.severity === "recommendation");
  const excellentMatches = violations.filter((v) => v.severity === "excellent-match");

  const errors = violations.filter((v) => v.severity === "error").length;
  const warnings = violations.filter((v) => v.severity === "warning").length;
  const issueCount = errors + warnings;

  const triggerBadgeVariant = errors > 0 ? "error" : warnings > 0 ? "warning" : "success";
  const hasPositive = recommendations.length > 0 || excellentMatches.length > 0;

  const handleJump = (step: WizardStep, field?: string) => {
    onNavigate(step);
    setFocusField(field ?? null);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          issueCount > 0
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400 dark:hover:bg-amber-950"
            : hasPositive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-950"
            : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-400 dark:hover:bg-zinc-700"
        )}
      >
        {issueCount > 0 ? <AlertTriangle size={12} /> : hasPositive ? <Sparkles size={12} /> : <ShieldCheck size={12} />}
        Advisor
        {issueCount > 0 && (
          <Badge variant={triggerBadgeVariant} className="text-[10px] px-1.5 py-0">
            {issueCount}
          </Badge>
        )}
        {issueCount === 0 && excellentMatches.length > 0 && (
          <Badge variant="success" className="text-[10px] px-1.5 py-0">
            {excellentMatches.length} ✓
          </Badge>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* click-away backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-96 z-50 rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60 overflow-hidden dark:border-zinc-600 dark:bg-zinc-800 dark:shadow-zinc-900 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Decision Advisor</p>
                <p className="text-xs text-zinc-500">
                  {issueCount === 0 && !hasPositive
                    ? "No issues detected"
                    : [
                        issueCount > 0 && `${issueCount} issue${issueCount !== 1 ? "s" : ""}`,
                        excellentMatches.length > 0 && `${excellentMatches.length} excellent match${excellentMatches.length !== 1 ? "es" : ""}`,
                        recommendations.length > 0 && `${recommendations.length} tip${recommendations.length !== 1 ? "s" : ""}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <X size={14} />
              </button>
            </div>

            <div className="overflow-y-auto">
              {violations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 mb-3">
                    <ShieldCheck size={24} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Looking good!</p>
                  <p className="text-xs text-zinc-400 mt-0.5">No conflicting decisions detected.</p>
                </div>
              ) : (
                <>
                  <Group label="Issues" tone="amber" show={issues.length > 0}>
                    {issues.map((v) => (
                      <ViolationItem key={v.ruleId} v={v} onJump={handleJump} />
                    ))}
                  </Group>
                  <Group label="Recommendations" tone="violet" show={recommendations.length > 0}>
                    {recommendations.map((v) => (
                      <ViolationItem key={v.ruleId} v={v} onJump={handleJump} />
                    ))}
                  </Group>
                  <Group label="Excellent Matches" tone="emerald" show={excellentMatches.length > 0}>
                    {excellentMatches.map((v) => (
                      <ViolationItem key={v.ruleId} v={v} onJump={handleJump} />
                    ))}
                  </Group>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Group({
  label,
  tone,
  show,
  children,
}: {
  label: string;
  tone: "amber" | "violet" | "emerald";
  show: boolean;
  children: React.ReactNode;
}) {
  const toneClass = {
    amber: "text-amber-600 dark:text-amber-400",
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[tone];
  if (!show) return null;
  return (
    <div>
      <div className="px-4 py-1.5 bg-zinc-50 border-y border-zinc-100 dark:bg-zinc-700/50 dark:border-zinc-700">
        <p className={cn("text-[10px] font-semibold uppercase tracking-wide", toneClass)}>{label}</p>
      </div>
      <div className="divide-y divide-zinc-50 dark:divide-zinc-700">{children}</div>
    </div>
  );
}
