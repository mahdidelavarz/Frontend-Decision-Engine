"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { FolderTree } from "@/components/steps/previews/FolderTree";
import type { ArchitectureData } from "@/types";

export function isArchitectureComplete(a: ArchitectureData): boolean {
  return !!a.folderStrategy && !!a.namingConvention;
}

const folderOptions = [
  {
    value: "feature-based",
    label: "Feature-based",
    description: "Group by domain (auth/, products/, dashboard/)",
  },
  {
    value: "layer-based",
    label: "Layer-based",
    description: "Group by type (components/, hooks/, services/)",
  },
  {
    value: "simple",
    label: "Simple / Flat",
    description: "Minimal nesting, small projects",
  },
];

const namingOptions = [
  {
    value: "PascalCase",
    label: "PascalCase",
    description: "UserProfile.tsx (components)",
  },
  {
    value: "kebab-case",
    label: "kebab-case",
    description: "user-profile.tsx (files)",
  },
  {
    value: "camelCase",
    label: "camelCase",
    description: "userProfile.ts (utilities)",
  },
];

const aliasOptions = [
  { value: "@", label: "@/*", description: "Most common alias" },
  { value: "~", label: "~/*", description: "Alternative style" },
  { value: "src", label: "src/*", description: "Explicit src prefix" },
  { value: "none", label: "None", description: "Relative imports only" },
];

const envOptions = [
  {
    value: "dotenv-only",
    label: "dotenv only",
    description: ".env files, no validation",
  },
  {
    value: "schema-validated",
    label: "Schema-validated",
    description: "t3-env, type-safe at build time",
  },
];

const barrelOptions = [
  {
    value: "always",
    label: "Always",
    description: "Every folder has index.ts",
  },
  {
    value: "feature-level-only",
    label: "Feature-level",
    description: "Only at feature boundaries",
  },
  {
    value: "never",
    label: "Never",
    description: "Direct imports everywhere",
  },
];

export function ArchitectureStep() {
  const { architecture, updateArchitecture } = useWizardStore();

  return (
    <div>
      <StepHeader
        stepNumber={2}
        title="Architecture"
        description="Define how your codebase is organized. These decisions affect discoverability and maintainability."
      />

      <div className="flex gap-8 items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-8">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Folder Strategy
            </label>
            <RadioGroup
              options={folderOptions}
              value={architecture.folderStrategy}
              onChange={(v) =>
                updateArchitecture({
                  folderStrategy: v as ArchitectureData["folderStrategy"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              File Naming Convention
            </label>
            <RadioGroup
              options={namingOptions}
              value={architecture.namingConvention}
              onChange={(v) =>
                updateArchitecture({
                  namingConvention: v as ArchitectureData["namingConvention"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Path Alias
            </label>
            <RadioGroup
              options={aliasOptions}
              value={architecture.aliasRoot}
              onChange={(v) =>
                updateArchitecture({
                  aliasRoot: v as ArchitectureData["aliasRoot"],
                  pathAliases: v !== "none",
                })
              }
              columns={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Environment Variables
            </label>
            <RadioGroup
              options={envOptions}
              value={architecture.envStrategy}
              onChange={(v) =>
                updateArchitecture({
                  envStrategy: v as ArchitectureData["envStrategy"],
                })
              }
              columns={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
              Barrel Files (index.ts re-exports)
            </label>
            <RadioGroup
              options={barrelOptions}
              value={architecture.barrelFiles}
              onChange={(v) =>
                updateArchitecture({
                  barrelFiles: v as ArchitectureData["barrelFiles"],
                })
              }
              columns={3}
            />
          </div>
        </div>

        {/* ── Live folder tree ── */}
        <div className="w-72 shrink-0 sticky top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Folder Structure
          </p>
          <FolderTree architecture={architecture} />
        </div>
      </div>
    </div>
  );
}
