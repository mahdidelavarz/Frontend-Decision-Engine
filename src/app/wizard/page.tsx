"use client";

import { useEffect } from "react";
import { useWizardStore } from "@/store";
import { WizardShell } from "@/components/wizard/WizardShell";
import { ProjectStep, isProjectComplete } from "@/components/steps/ProjectStep";
import { ArchitectureStep, isArchitectureComplete } from "@/components/steps/ArchitectureStep";
import { DesignSystemStep, isDesignSystemComplete } from "@/components/steps/DesignSystemStep";
import { StandardsStep, isStandardsComplete } from "@/components/steps/StandardsStep";
import { UXPatternsStep } from "@/components/steps/UXPatternsStep";
import { PreviewStep } from "@/components/steps/PreviewStep";
import { ExportStep } from "@/components/steps/ExportStep";
import type { WizardStep } from "@/types";

function StepContent({ currentStep }: { currentStep: Exclude<WizardStep, "home"> }) {
  switch (currentStep) {
    case "project":      return <ProjectStep />;
    case "architecture": return <ArchitectureStep />;
    case "design-system": return <DesignSystemStep />;
    case "standards":    return <StandardsStep />;
    case "ux-patterns":  return <UXPatternsStep />;
    case "preview":      return <PreviewStep />;
    case "export":       return <ExportStep />;
  }
}

export default function WizardPage() {
  const currentStep = useWizardStore((s) => s.currentStep);
  const setStep     = useWizardStore((s) => s.setStep);
  const project     = useWizardStore((s) => s.project);
  const architecture = useWizardStore((s) => s.architecture);
  const designSystem = useWizardStore((s) => s.designSystem);
  const standards   = useWizardStore((s) => s.standards);
  // Move side-effect out of render body — never call setters during render
  useEffect(() => {
    if (currentStep === "home") {
      setStep("project");
    }
  }, [currentStep, setStep]);

  const activeStep: Exclude<WizardStep, "home"> =
    currentStep === "home" ? "project" : currentStep;

  const canProceed = (() => {
    switch (activeStep) {
      case "project":      return isProjectComplete(project);
      case "architecture": return isArchitectureComplete(architecture);
      case "design-system": return isDesignSystemComplete(designSystem);
      case "standards":    return isStandardsComplete(standards);
      case "ux-patterns":
      case "preview":
      case "export":       return true;
    }
  })();

  return (
    <WizardShell currentStep={activeStep} canProceed={canProceed}>
      <StepContent currentStep={activeStep} />
    </WizardShell>
  );
}
