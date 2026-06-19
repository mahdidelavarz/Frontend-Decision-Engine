"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { FolderTree } from "@/components/steps/previews/FolderTree";
import type { ArchitectureData } from "@/types";

export function isArchitectureComplete(a: ArchitectureData): boolean {
  return !!a.folderStrategy && !!a.componentNaming && !!a.utilNaming;
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

const componentNamingOptions = [
  {
    value: "PascalCase",
    label: "PascalCase",
    description: "UserProfile.tsx — matches the exported component name",
    recommended: true,
  },
  {
    value: "kebab-case",
    label: "kebab-case",
    description: "user-profile.tsx — popular in monorepos and Linux toolchains",
  },
];

const utilNamingOptions = [
  {
    value: "camelCase",
    label: "camelCase",
    description: "useAuth.ts · authService.ts · formatDate.ts",
    recommended: true,
  },
  {
    value: "kebab-case",
    label: "kebab-case",
    description: "use-auth.ts · auth-service.ts · format-date.ts",
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

const REACT_FRAMEWORKS = new Set(["next", "vite-react", "remix"]);

function FrameworkRulesBox({ framework }: { framework: string }) {
  const isReact = REACT_FRAMEWORKS.has(framework);
  if (!framework) return null;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-3 text-xs text-blue-800 dark:text-blue-300 space-y-1">
      <p className="font-semibold text-blue-900 dark:text-blue-200">
        Framework-enforced rules — always apply regardless of your choices above
      </p>
      <ul className="space-y-1 mt-1">
        {isReact && (
          <>
            <li>• Component functions must be <strong>PascalCase</strong> — JSX uses this to distinguish custom components from HTML elements</li>
            <li>• TypeScript <code>interface</code> / <code>type</code> names are always <strong>PascalCase</strong> (e.g. <code>UserProfile</code>, <code>ApiResponse</code>)</li>
            <li>• Custom hooks must start with <strong><code>use</code></strong> — React lint rules depend on this prefix</li>
            <li>• A kebab-case file can still export a PascalCase component: <code>user-profile.tsx</code> → <code>export function UserProfile()</code></li>
          </>
        )}
        {framework === "next" && (
          <li>• Next.js route segments are fixed by convention: <code>page.tsx</code>, <code>layout.tsx</code>, <code>error.tsx</code>, <code>loading.tsx</code></li>
        )}
        {framework === "remix" && (
          <li>• Remix route files use dot-notation: <code>_auth.login.tsx</code>, <code>products.$id.tsx</code></li>
        )}
        {framework === "sveltekit" && (
          <>
            <li>• SvelteKit route files are fixed: <code>+page.svelte</code>, <code>+layout.svelte</code>, <code>+error.svelte</code></li>
            <li>• Svelte component files conventionally use PascalCase: <code>Button.svelte</code>, <code>Modal.svelte</code></li>
          </>
        )}
        {framework === "astro" && (
          <>
            <li>• Astro component files conventionally use PascalCase: <code>Button.astro</code>, <code>HeroSection.astro</code></li>
            <li>• Astro page routes conventionally use kebab-case: <code>contact-us.astro</code>, <code>blog-post.astro</code></li>
          </>
        )}
      </ul>
    </div>
  );
}

export function ArchitectureStep() {
  const { architecture, updateArchitecture, project } = useWizardStore();

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
                updateArchitecture({ folderStrategy: v as ArchitectureData["folderStrategy"] })
              }
              columns={3}
            />
          </div>

          {/* ── Naming conventions ── */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-300">
                Component File Naming
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                Applies to <code>.tsx</code> files. The component function inside is always PascalCase regardless.
              </p>
              <RadioGroup
                options={componentNamingOptions}
                value={architecture.componentNaming}
                onChange={(v) =>
                  updateArchitecture({ componentNaming: v as ArchitectureData["componentNaming"] })
                }
                columns={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-300">
                Utility, Hook &amp; Service File Naming
              </label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                Applies to <code>.ts</code> files — hooks, services, stores, utilities.
              </p>
              <RadioGroup
                options={utilNamingOptions}
                value={architecture.utilNaming}
                onChange={(v) =>
                  updateArchitecture({ utilNaming: v as ArchitectureData["utilNaming"] })
                }
                columns={2}
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3">
              <input
                id="file-suffixes"
                type="checkbox"
                checked={architecture.fileSuffixes}
                onChange={(e) => updateArchitecture({ fileSuffixes: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="file-suffixes" className="text-sm cursor-pointer">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">Use dot-suffix file conventions</span>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Each file declares its role in the name:{" "}
                  <code>auth.types.ts</code>, <code>auth.service.ts</code>, <code>auth.utils.ts</code>, <code>useAuth.hook.ts</code>
                </p>
              </label>
            </div>

            {project.framework && (
              <FrameworkRulesBox framework={project.framework} />
            )}
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
                updateArchitecture({ envStrategy: v as ArchitectureData["envStrategy"] })
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
                updateArchitecture({ barrelFiles: v as ArchitectureData["barrelFiles"] })
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
