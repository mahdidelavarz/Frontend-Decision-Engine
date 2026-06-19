"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { UXExamples } from "@/components/steps/previews/UXExamples";
import type { UXPatternsData } from "@/types";

export function isUXPatternsComplete(_u: UXPatternsData): boolean {
  return true;
}

const loadingOptions = [
  {
    value: "skeleton",
    label: "Skeleton",
    description: "Placeholder shapes while loading",
  },
  {
    value: "spinner",
    label: "Spinner",
    description: "Circular loading indicator",
  },
  {
    value: "progress-bar",
    label: "Progress Bar",
    description: "Top-of-page NProgress style",
  },
];

const emptyOptions = [
  {
    value: "illustration",
    label: "Illustration",
    description: "SVG art for zero-state pages",
  },
  {
    value: "icon-text",
    label: "Icon + Text",
    description: "Simple icon with message",
  },
  {
    value: "text-only",
    label: "Text only",
    description: "Minimal, just copy",
  },
];

const successOptions = [
  {
    value: "toast",
    label: "Toast",
    description: "Non-blocking, auto-dismisses",
  },
  {
    value: "snackbar",
    label: "Snackbar",
    description: "Bottom-bar with optional action",
  },
  {
    value: "redirect",
    label: "Redirect",
    description: "Navigate to success page",
  },
];

const confirmOptions = [
  {
    value: "modal",
    label: "Modal dialog",
    description: "\"Are you sure?\" pattern",
  },
  {
    value: "inline",
    label: "Inline confirm",
    description: "Button becomes confirm/cancel",
  },
  {
    value: "none",
    label: "None",
    description: "Destructive actions are immediate",
  },
];

export function UXPatternsStep() {
  const { uxPatterns, updateUXPatterns } = useWizardStore();

  return (
    <div>
      <StepHeader
        stepNumber={5}
        title="UX Patterns"
        description="Define how your UI communicates with users. Consistent patterns reduce cognitive load."
      />

      <div className="flex gap-8 items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-8">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Loading State Pattern
            </label>
            <RadioGroup
              options={loadingOptions}
              value={uxPatterns.loadingPattern}
              onChange={(v) =>
                updateUXPatterns({
                  loadingPattern: v as UXPatternsData["loadingPattern"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Empty State Style
            </label>
            <RadioGroup
              options={emptyOptions}
              value={uxPatterns.emptyStateStyle}
              onChange={(v) =>
                updateUXPatterns({
                  emptyStateStyle: v as UXPatternsData["emptyStateStyle"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Success Feedback
            </label>
            <RadioGroup
              options={successOptions}
              value={uxPatterns.successFeedback}
              onChange={(v) =>
                updateUXPatterns({
                  successFeedback: v as UXPatternsData["successFeedback"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Destructive Action Confirmation
            </label>
            <RadioGroup
              options={confirmOptions}
              value={uxPatterns.confirmationPattern}
              onChange={(v) =>
                updateUXPatterns({
                  confirmationPattern: v as UXPatternsData["confirmationPattern"],
                })
              }
              columns={3}
            />
          </div>
        </div>

        {/* ── Interaction examples panel ── */}
        <div className="w-72 shrink-0 sticky top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Interaction Examples
          </p>
          <UXExamples uxPatterns={uxPatterns} />
        </div>
      </div>
    </div>
  );
}
