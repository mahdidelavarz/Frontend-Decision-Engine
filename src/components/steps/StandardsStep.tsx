"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { Collapsible } from "@/components/ui/Collapsible";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { QualitySummary } from "@/components/steps/previews/QualitySummary";
import {
  TriangleAlert,
  FlaskConical,
  TestTube,
  Wrench,
  GitBranch,
  Bot,
  Settings2,
  Target,
  Users,
} from "lucide-react";
import type { StandardsData, TeamAgreementsData } from "@/types";

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
  { value: "vitest", label: "Vitest", description: "Fast, Vite-native", recommended: true },
  { value: "jest", label: "Jest", description: "Mature, large ecosystem" },
  { value: "none", label: "None", description: "Skip unit tests" },
];

const e2eOptions = [
  { value: "playwright", label: "Playwright", description: "Modern, multi-browser", recommended: true },
  { value: "cypress", label: "Cypress", description: "Great DX, Chrome-first" },
  { value: "none", label: "None", description: "Skip E2E tests" },
];

const gitOptions = [
  { value: "conventional-commits", label: "Conventional Commits", description: "feat:, fix:, chore:…", recommended: true },
  { value: "none", label: "Custom / None", description: "No enforced format" },
];

const authOptions = [
  { value: "none", label: "None", description: "Public app" },
  { value: "cookie", label: "Cookie-based", description: "HttpOnly, secure", recommended: true },
  { value: "jwt", label: "JWT", description: "Manual implementation" },
];

const dateOptions = [
  { value: "native", label: "Native Date", description: "Zero dependency" },
  { value: "dayjs", label: "dayjs", description: "Moment-compatible, tiny", recommended: true },
  { value: "date-fns", label: "date-fns", description: "Functional, tree-shakeable" },
];

const lintingChoices: { value: StandardsData["linting"][number]; label: string; description: string }[] = [
  { value: "eslint", label: "ESLint", description: "JS/TS linting" },
  { value: "biome", label: "Biome", description: "All-in-one, fast" },
  { value: "prettier", label: "Prettier", description: "Code formatting" },
  { value: "husky", label: "Husky", description: "Pre-commit hooks" },
];

const aiToolOptions = [
  {
    value: "claude-code",
    label: "Claude Code",
    description: "Generates .claude/CLAUDE.md",
  },
  {
    value: "cursor",
    label: "Cursor",
    description: "Generates .cursor/rules/project.mdc",
  },
  {
    value: "copilot",
    label: "GitHub Copilot",
    description: "Generates .github/copilot-instructions.md",
  },
  {
    value: "windsurf",
    label: "Windsurf",
    description: "Generates .windsurfrules",
  },
  {
    value: "cline",
    label: "Cline",
    description: "Generates .clinerules",
  },
  {
    value: "none",
    label: "None",
    description: "Skip AI tool config",
  },
];

const accessibilityOptions = [
  { value: "basic", label: "Basic", description: "Semantic HTML, keyboard nav" },
  { value: "wcag-aa", label: "WCAG AA", description: "4.5:1 contrast, full keyboard" },
  { value: "wcag-aaa", label: "WCAG AAA", description: "7:1 contrast — highest bar" },
];

const browserSupportOptions = [
  { value: "modern", label: "Modern browsers", description: "Last 2 versions, no IE" },
  { value: "legacy", label: "Legacy support", description: "IE11+ / older mobile browsers" },
];

const teamAgreementItems: { key: keyof Omit<TeamAgreementsData, "maxFileLines">; label: string; description: string }[] = [
  { key: "noAny", label: "No any", description: "Ban TypeScript any — use unknown or proper types" },
  { key: "preferInterfaces", label: "Prefer interfaces", description: "Use interface over type for object shapes" },
  { key: "namedExports", label: "Named exports only", description: "No default exports — easier to refactor" },
  { key: "hooksNaming", label: "use prefix for hooks", description: "All hooks must start with use" },
  { key: "componentOrganization", label: "Component file order", description: "types → component → export (no mixing)" },
  { key: "importOrdering", label: "Import ordering", description: "Enforce: node → external → internal → relative" },
];

export function StandardsStep() {
  const { standards, teamAgreements, updateStandards, updateTeamAgreements } = useWizardStore();
  const onBack = useStepBack();

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
        onBack={onBack}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-10">
          <Section id="errorHandling" title="Error Handling Strategy" icon={<TriangleAlert size={14} />}>
            <RadioGroup
              options={errorOptions}
              value={standards.errorHandling}
              onChange={(v) => updateStandards({ errorHandling: v as StandardsData["errorHandling"] })}
              columns={3}
            />
          </Section>

          <Section id="testingUnit" title="Unit Testing" icon={<FlaskConical size={14} />}>
            <RadioGroup
              options={unitOptions}
              value={standards.testingUnit}
              onChange={(v) => updateStandards({ testingUnit: v as StandardsData["testingUnit"] })}
              columns={3}
            />
          </Section>

          <Section id="testingE2E" title="End-to-End Testing" icon={<TestTube size={14} />}>
            <RadioGroup
              options={e2eOptions}
              value={standards.testingE2E}
              onChange={(v) => updateStandards({ testingE2E: v as StandardsData["testingE2E"] })}
              columns={3}
            />
          </Section>

          <Section id="linting" title="Code Quality Tools" icon={<Wrench size={14} />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </Section>

          <Section id="gitStrategy" title="Git Commit Strategy" icon={<GitBranch size={14} />}>
            <RadioGroup
              options={gitOptions}
              value={standards.gitStrategy}
              onChange={(v) => updateStandards({ gitStrategy: v as StandardsData["gitStrategy"] })}
              columns={2}
            />
          </Section>

          {/* AI Coding Tool */}
          <Section
            id="aiCodingTool"
            title="AI Coding Tool"
            description="We'll generate the config file pre-filled with your architecture decisions."
            icon={<Bot size={14} />}
          >
            <RadioGroup
              options={aiToolOptions}
              value={standards.aiCodingTool}
              onChange={(v) => updateStandards({ aiCodingTool: v as StandardsData["aiCodingTool"] })}
              columns={3}
            />
          </Section>

          {/* Advanced: Auth, retry, logging, date */}
          <Collapsible title="Advanced Options" description="Auth, retry policy, logging, date library" icon={<Settings2 size={16} />}>
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
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
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
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
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
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
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
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
          </Collapsible>

          {/* Quality Targets */}
          <Collapsible
            title="Quality Targets"
            description="Accessibility compliance level and browser support expectations"
            icon={<Target size={16} />}
          >
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Accessibility Target
                </label>
                <RadioGroup
                  options={accessibilityOptions}
                  value={standards.accessibilityTarget}
                  onChange={(v) => updateStandards({ accessibilityTarget: v as StandardsData["accessibilityTarget"] })}
                  columns={3}
                />
                {standards.accessibilityTarget === "wcag-aaa" && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                    WCAG AAA requires 7:1 contrast ratio and strict timing/motion controls — typically required for government or public-sector projects.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Browser Support
                </label>
                <RadioGroup
                  options={browserSupportOptions}
                  value={standards.browserSupport}
                  onChange={(v) => updateStandards({ browserSupport: v as StandardsData["browserSupport"] })}
                  columns={2}
                />
                {standards.browserSupport === "legacy" && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                    Legacy support limits use of modern CSS (container queries, :has(), grid subgrid). Verify your styling choices are compatible.
                  </p>
                )}
              </div>
            </div>
          </Collapsible>

          {/* Team Agreements */}
          <Collapsible
            title="Team Agreements"
            description="Coding standards included in AI_CONTEXT.md as explicit rules"
            icon={<Users size={16} />}
          >
            <div className="space-y-3 mt-4">
              {teamAgreementItems.map((item) => (
                <Checkbox
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  checked={teamAgreements[item.key] as boolean}
                  onChange={() =>
                    updateTeamAgreements({ [item.key]: !teamAgreements[item.key] })
                  }
                />
              ))}
              <div className="pt-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-300">
                  Maximum file size (lines)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 300 (leave blank for no limit)"
                  value={teamAgreements.maxFileLines ?? ""}
                  onChange={(e) =>
                    updateTeamAgreements({
                      maxFileLines: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </Collapsible>
        </div>

        {/* ── Quality summary panel ── */}
        <div className="w-full lg:w-110 lg:shrink-0 lg:sticky lg:top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Quality Summary
          </p>
          <QualitySummary standards={standards} />
        </div>
      </div>
    </div>
  );
}
