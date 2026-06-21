"use client";

import { useState } from "react";
import { useWizardStore } from "@/store";
import { StepNav } from "./StepNav";
import { StepFooter } from "./StepFooter";
import { AdvisorPanel } from "./AdvisorPanel";
import { STEP_ORDER } from "@/types";
import type { WizardStep } from "@/types";
import { triggerZipDownload } from "@/export";
import { Cpu, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

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
  const [navOpen, setNavOpen] = useState(false);

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
    <div className="flex h-screen flex-col bg-white overflow-hidden dark:bg-zinc-950">
      {/* Mobile nav overlay */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile nav drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 transition-transform duration-300 ease-in-out lg:hidden",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Blueprint</span>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>
        <StepNav
          currentStep={currentStep}
          completedSteps={completedSteps}
          onNavigate={(step) => { setStep(step); setNavOpen(false); }}
        />
      </div>

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 bg-white z-10 dark:bg-zinc-950 dark:border-zinc-800 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <Cpu size={18} className="text-indigo-600 shrink-0" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
            FrontForge
          </span>
          {projectName && (
            <span className="hidden sm:inline text-sm text-zinc-400 dark:text-zinc-500 truncate">— {projectName}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <AdvisorPanel violations={violations} onNavigate={setStep} />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar — hidden on mobile/tablet */}
        <div className="hidden lg:block">
          <StepNav
            currentStep={currentStep}
            completedSteps={completedSteps}
            onNavigate={setStep}
          />
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl lg:max-w-none">{children}</div>
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
