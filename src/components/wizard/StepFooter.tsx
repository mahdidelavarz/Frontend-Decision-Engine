"use client";

import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { STEP_ORDER } from "@/types";
import type { WizardStep } from "@/types";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

interface StepFooterProps {
  currentStep: Exclude<WizardStep, "home">;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onExport?: () => void;
  isExporting?: boolean;
}

const WIZARD_STEPS = STEP_ORDER.filter((s) => s !== "home");

export function StepFooter({
  currentStep,
  canProceed,
  onBack,
  onNext,
  onExport,
  isExporting,
}: StepFooterProps) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);
  const total = WIZARD_STEPS.length;
  const isFirst = currentIndex === 0;
  const isLast = currentStep === "export";
  const isPreview = currentStep === "preview";

  return (
    <div className="border-t border-zinc-100 bg-white px-4 py-3 flex items-center justify-between gap-2 sm:px-6 sm:py-4 sm:gap-4 dark:border-zinc-700 dark:bg-zinc-900">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        disabled={isFirst}
        className="gap-1.5"
      >
        <ArrowLeft size={14} />
        Back
      </Button>

      <div className="flex-1 max-w-20 sm:max-w-48">
        <Progress value={currentIndex + 1} max={total} />
        <p className="text-xs text-zinc-400 text-center mt-1">
          {currentIndex + 1} / {total}
        </p>
      </div>

      {isLast ? (
        <Button
          variant="primary"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
          className="gap-1.5"
        >
          <Download size={14} />
          {isExporting ? "Generating…" : "Download ZIP"}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={onNext}
          disabled={!canProceed}
          className="gap-1.5"
        >
          {isPreview ? "Review Export" : "Continue"}
          <ArrowRight size={14} />
        </Button>
      )}
    </div>
  );
}
