"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Violation, WizardStep } from "@/types";
import {
  AlertTriangle,
  X,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Info,
  Lightbulb,
  Sparkles,
} from "lucide-react";

interface AdvisorPanelProps {
  violations: Violation[];
  onNavigate: (step: WizardStep) => void;
}

const SeverityIcon = ({ severity }: { severity: Violation["severity"] }) => {
  if (severity === "error") return <AlertCircle size={14} className="text-red-500 shrink-0" />;
  if (severity === "warning") return <AlertTriangle size={14} className="text-amber-500 shrink-0" />;
  if (severity === "recommendation") return <Lightbulb size={14} className="text-violet-500 shrink-0" />;
  if (severity === "excellent-match") return <Sparkles size={14} className="text-emerald-500 shrink-0" />;
  return <Info size={14} className="text-blue-500 shrink-0" />;
};

const severityBorderClass: Record<Violation["severity"], string> = {
  error: "border-red-400",
  warning: "border-amber-400",
  info: "border-blue-400",
  recommendation: "border-violet-400",
  "excellent-match": "border-emerald-400",
};

function ViolationItem({
  v,
  onNavigate,
  onClose,
}: {
  v: Violation;
  onNavigate: (step: WizardStep) => void;
  onClose: () => void;
}) {
  return (
    <div className={cn("px-4 py-3 border-l-2", severityBorderClass[v.severity])}>
      <div className="flex items-start gap-2">
        <SeverityIcon severity={v.severity} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-900 leading-tight dark:text-zinc-100">
            {v.title}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            {v.message}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {v.affectedSteps.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  onNavigate(step);
                  onClose();
                }}
                className="inline-flex items-center gap-0.5 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
              >
                Go to {step}
                <ChevronRight size={9} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdvisorPanel({ violations, onNavigate }: AdvisorPanelProps) {
  const [open, setOpen] = useState(false);

  const issues = violations.filter((v) => v.severity === "error" || v.severity === "warning" || v.severity === "info");
  const recommendations = violations.filter((v) => v.severity === "recommendation");
  const excellentMatches = violations.filter((v) => v.severity === "excellent-match");

  const errors = violations.filter((v) => v.severity === "error").length;
  const warnings = violations.filter((v) => v.severity === "warning").length;
  const issueCount = errors + warnings;

  const triggerBadgeVariant =
    errors > 0 ? "error" : warnings > 0 ? "warning" : "success";

  const hasPositive = recommendations.length > 0 || excellentMatches.length > 0;

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
            : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
        )}
      >
        {issueCount > 0 ? (
          <AlertTriangle size={12} />
        ) : hasPositive ? (
          <Sparkles size={12} />
        ) : (
          <ShieldCheck size={12} />
        )}
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
        <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-zinc-950">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
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
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <X size={14} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {violations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <ShieldCheck size={28} className="text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Looking good!</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  No conflicting decisions detected.
                </p>
              </div>
            ) : (
              <>
                {/* Issues (errors, warnings, info) */}
                {issues.length > 0 && (
                  <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                    {issues.map((v) => (
                      <ViolationItem key={v.ruleId} v={v} onNavigate={onNavigate} onClose={() => setOpen(false)} />
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <>
                    {issues.length > 0 && (
                      <div className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                          Recommendations
                        </p>
                      </div>
                    )}
                    {issues.length === 0 && (
                      <div className="px-4 py-1.5 bg-violet-50 dark:bg-violet-950/30">
                        <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                          Recommendations
                        </p>
                      </div>
                    )}
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {recommendations.map((v) => (
                        <ViolationItem key={v.ruleId} v={v} onNavigate={onNavigate} onClose={() => setOpen(false)} />
                      ))}
                    </div>
                  </>
                )}

                {/* Excellent Matches */}
                {excellentMatches.length > 0 && (
                  <>
                    <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Excellent Matches
                      </p>
                    </div>
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {excellentMatches.map((v) => (
                        <ViolationItem key={v.ruleId} v={v} onNavigate={onNavigate} onClose={() => setOpen(false)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
