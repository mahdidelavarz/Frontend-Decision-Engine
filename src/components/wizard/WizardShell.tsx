"use client";

import { useState } from "react";
import { useWizardStore } from "@/store";
import { StepNav } from "./StepNav";
import { StepFooter } from "./StepFooter";
import { AdvisorPanel } from "./AdvisorPanel";
import { STEP_ORDER } from "@/types";
import type { WizardStep } from "@/types";
import { triggerZipDownload } from "@/export";
import { Cpu } from "lucide-react";

interface WizardShellProps {
  children: React.ReactNode;
  currentStep: Exclude<WizardStep, "home">;
  canProceed: boolean;
}

const WIZARD_STEPS = STEP_ORDER.filter((s) => s !== "home");

export function WizardShell({ children, currentStep, canProceed }: WizardShellProps) {
  // Targeted selectors — each only re-renders this component when its slice changes
  const setStep         = useWizardStore((s) => s.setStep);
  const markStepComplete = useWizardStore((s) => s.markStepComplete);
  const completedSteps  = useWizardStore((s) => s.completedSteps);
  const violations      = useWizardStore((s) => s.violations);
  const projectName     = useWizardStore((s) => s.project.projectName);

  const [isExporting, setIsExporting] = useState(false);

  const currentIndex = WIZARD_STEPS.indexOf(currentStep);

  const handleNext = () => {
    markStepComplete(currentStep);
    const next = WIZARD_STEPS[currentIndex + 1];
    if (next) setStep(next);
  };

  const handleBack = () => {
    const prev = WIZARD_STEPS[currentIndex - 1];
    if (prev) setStep(prev);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await triggerZipDownload(useWizardStore.getState());
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-3 bg-white z-10">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-indigo-600" />
          <span className="text-sm font-semibold text-zinc-800">
            Frontend Decision Engine
          </span>
          {projectName && (
            <span className="text-sm text-zinc-400">— {projectName}</span>
          )}
        </div>
        <AdvisorPanel violations={violations} onNavigate={setStep} />
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <StepNav
          currentStep={currentStep}
          completedSteps={completedSteps}
          onNavigate={setStep}
        />

        <main className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          <div className="max-w-2xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <StepFooter
        currentStep={currentStep}
        canProceed={canProceed}
        onBack={handleBack}
        onNext={handleNext}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
}
