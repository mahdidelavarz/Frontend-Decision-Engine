"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { QualitySummary } from "@/components/steps/previews/QualitySummary";
import type { StandardsData } from "@/types";

export function isStandardsComplete(_s: StandardsData): boolean {
  return true; // All fields have defaults; always completable
}

const errorOptions = [
  { value: "toast", label: "Toast", description: "Global non-blocking notifications" },
  { value: "inline", label: "Inline", description: "Field-level error messages" },
  { value: "hybrid", label: "Hybrid", description: "Both — field + toast for API" },
];

const retryOptions = [
  { value: "none", label: "None", description: "Fail fast, user retries" },
  { value: "manual", label: "Manual retry", description: "Show a Retry button" },
  { value: "automatic", label: "Automatic", description: "Exponential backoff" },
];

const loggingOptions = [
  { value: "console", label: "console.log", description: "Dev mode only" },
  { value: "sentry", label: "Sentry", description: "Error tracking in prod" },
  { value: "none", label: "None", description: "Silent errors" },
];

const unitOptions = [
  { value: "vitest", label: "Vitest", description: "Fast, Vite-native" },
  { value: "jest", label: "Jest", description: "Mature, large ecosystem" },
  { value: "none", label: "None", description: "Skip unit tests" },
];

const e2eOptions = [
  { value: "playwright", label: "Playwright", description: "Modern, multi-browser" },
  { value: "cypress", label: "Cypress", description: "Great DX, Chrome-first" },
  { value: "none", label: "None", description: "Skip E2E tests" },
];

const gitOptions = [
  { value: "conventional-commits", label: "Conventional Commits", description: "feat:, fix:, chore:…" },
  { value: "none", label: "Custom / None", description: "No enforced format" },
];

const authOptions = [
  { value: "none", label: "None", description: "Public app" },
  { value: "cookie", label: "Cookie-based", description: "HttpOnly, secure" },
  { value: "jwt", label: "JWT", description: "Manual implementation" },
];

const dateOptions = [
  { value: "native", label: "Native Date", description: "Zero dependency" },
  { value: "dayjs", label: "dayjs", description: "Moment-compatible, tiny" },
  { value: "date-fns", label: "date-fns", description: "Functional, tree-shakeable" },
];

const lintingChoices: { value: StandardsData["linting"][number]; label: string; description: string }[] = [
  { value: "eslint", label: "ESLint", description: "JS/TS linting" },
  { value: "biome", label: "Biome", description: "All-in-one, fast" },
  { value: "prettier", label: "Prettier", description: "Code formatting" },
  { value: "husky", label: "Husky", description: "Pre-commit hooks" },
];

export function StandardsStep() {
  const { standards, updateStandards } = useWizardStore();

  const toggleLinting = (val: StandardsData["linting"][number]) => {
    const current = standards.linting;
    const next = current.includes(val)
      ? current.filter((l) => l !== val)
      : [...current, val];
    updateStandards({ linting: next });
  };

  return (
    <div>
      <StepHeader
        stepNumber={4}
        title="Project Standards"
        description="Define how your team handles errors, testing, and code quality. These get documented in your guidelines."
      />

      <div className="flex gap-8 items-start">
      {/* ── Form controls ── */}
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Error Handling Strategy
          </label>
          <RadioGroup
            options={errorOptions}
            value={standards.errorHandling}
            onChange={(v) => updateStandards({ errorHandling: v as StandardsData["errorHandling"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            API Retry Policy
          </label>
          <RadioGroup
            options={retryOptions}
            value={standards.retryPolicy}
            onChange={(v) => updateStandards({ retryPolicy: v as StandardsData["retryPolicy"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Production Logging / Error Tracking
          </label>
          <RadioGroup
            options={loggingOptions}
            value={standards.logging}
            onChange={(v) => updateStandards({ logging: v as StandardsData["logging"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Unit Testing
          </label>
          <RadioGroup
            options={unitOptions}
            value={standards.testingUnit}
            onChange={(v) => updateStandards({ testingUnit: v as StandardsData["testingUnit"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            End-to-End Testing
          </label>
          <RadioGroup
            options={e2eOptions}
            value={standards.testingE2E}
            onChange={(v) => updateStandards({ testingE2E: v as StandardsData["testingE2E"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Code Quality Tools
          </label>
          <div className="grid grid-cols-2 gap-3">
            {lintingChoices.map((item) => (
              <Checkbox
                key={item.value}
                label={item.label}
                description={item.description}
                checked={standards.linting.includes(item.value)}
                onChange={() => toggleLinting(item.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Git Commit Strategy
          </label>
          <RadioGroup
            options={gitOptions}
            value={standards.gitStrategy}
            onChange={(v) => updateStandards({ gitStrategy: v as StandardsData["gitStrategy"] })}
            columns={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Authentication Approach
          </label>
          <RadioGroup
            options={authOptions}
            value={standards.authApproach}
            onChange={(v) => updateStandards({ authApproach: v as StandardsData["authApproach"] })}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Date / Time Library
          </label>
          <RadioGroup
            options={dateOptions}
            value={standards.dateLibrary}
            onChange={(v) => updateStandards({ dateLibrary: v as StandardsData["dateLibrary"] })}
            columns={3}
          />
        </div>
      </div>

        {/* ── Quality summary panel ── */}
        <div className="w-72 shrink-0 sticky top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Quality Summary
          </p>
          <QualitySummary standards={standards} />
        </div>
      </div>
    </div>
  );
}
