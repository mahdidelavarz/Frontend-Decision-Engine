"use client";

import { useWizardStore } from "@/store";
import { STEP_ORDER } from "@/types";

const WIZARD_STEPS = STEP_ORDER.filter((s) => s !== "home");

/**
 * Returns a back handler for the current wizard step, or undefined when there
 * is no previous step (first step). Used by StepHeader to render a back button
 * next to the page title.
 */
export function useStepBack(): (() => void) | undefined {
  const currentStep = useWizardStore((s) => s.currentStep);
  const setStep = useWizardStore((s) => s.setStep);

  const idx = WIZARD_STEPS.indexOf(currentStep as (typeof WIZARD_STEPS)[number]);
  const prev = idx > 0 ? WIZARD_STEPS[idx - 1] : undefined;

  if (!prev) return undefined;
  return () => setStep(prev);
}
