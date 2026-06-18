"use client";

import { cn } from "@/lib/utils";
import { STEP_ORDER, STEP_LABELS } from "@/types";
import type { WizardStep } from "@/types";
import { Check } from "lucide-react";

interface StepNavProps {
  currentStep: Exclude<WizardStep, "home">;
  completedSteps: Partial<Record<WizardStep, boolean>>;
  onNavigate: (step: WizardStep) => void;
}

const WIZARD_STEPS = STEP_ORDER.filter((s) => s !== "home");

export function StepNav({ currentStep, completedSteps, onNavigate }: StepNavProps) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);

  return (
    <nav className="w-52 shrink-0 py-6 px-4 border-r border-zinc-100 bg-zinc-50/60">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 px-2">
        Blueprint
      </p>
      <ol className="space-y-0.5">
        {WIZARD_STEPS.map((step, idx) => {
          const isCompleted = !!completedSteps[step];
          const isCurrent = step === currentStep;
          const isAccessible = isCompleted || idx <= currentIndex;

          return (
            <li key={step}>
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onNavigate(step)}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isCurrent && "bg-indigo-50 text-indigo-700 font-medium",
                  !isCurrent && isAccessible && "text-zinc-700 hover:bg-zinc-100",
                  !isAccessible && "text-zinc-300 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                    isCompleted && "bg-indigo-600 text-white",
                    isCurrent && !isCompleted && "border-2 border-indigo-600 text-indigo-600",
                    !isCurrent && !isCompleted && isAccessible && "border-2 border-zinc-300 text-zinc-400",
                    !isAccessible && "border-2 border-zinc-200 text-zinc-300"
                  )}
                >
                  {isCompleted ? (
                    <Check size={10} strokeWidth={3} />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </span>
                <span className="truncate">{STEP_LABELS[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
