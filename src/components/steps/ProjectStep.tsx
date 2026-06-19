"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Collapsible } from "@/components/ui/Collapsible";
import type { ProjectData, ProjectDnaData } from "@/types";

export function isProjectComplete(p: ProjectData): boolean {
  return !!p.projectName && !!p.framework && p.styling.length > 0;
}

const frameworks = [
  { value: "next", label: "Next.js", description: "SSR + RSC + App Router" },
  { value: "vite-react", label: "Vite + React", description: "Pure SPA, fast HMR" },
  { value: "remix", label: "Remix", description: "Fullstack with nested routes" },
  { value: "astro", label: "Astro", description: "Content-first, island arch" },
  { value: "sveltekit", label: "SvelteKit", description: "Svelte with SSR" },
];

const routingOptions = [
  { value: "react-router", label: "React Router", description: "Industry standard", recommended: true },
  { value: "tanstack-router", label: "TanStack Router", description: "Fully type-safe routes" },
  { value: "none", label: "None", description: "Single view, no routing" },
];

const stateOptions = [
  { value: "zustand", label: "Zustand", description: "Lightweight, simple", recommended: true },
  { value: "redux-toolkit", label: "Redux Toolkit", description: "Predictable, devtools" },
  { value: "jotai", label: "Jotai", description: "Atomic, RSC-friendly" },
  { value: "context-only", label: "Context only", description: "No extra library" },
  { value: "none", label: "None", description: "Server state only" },
];

const serverStateOptions = [
  { value: "react-query", label: "TanStack Query", description: "Full-featured caching", recommended: true },
  { value: "swr", label: "SWR", description: "Lightweight, REST-first" },
  { value: "none", label: "None", description: "Manual fetch / RSC" },
];

const apiStyleOptions = [
  { value: "rest", label: "REST", description: "JSON over HTTP" },
  { value: "graphql", label: "GraphQL", description: "Schema-first queries" },
  { value: "trpc", label: "tRPC", description: "End-to-end typesafe" },
];

const formOptions = [
  { value: "react-hook-form", label: "React Hook Form", description: "Performant, uncontrolled", recommended: true },
  { value: "tanstack-form", label: "TanStack Form", description: "Modern, type-safe" },
  { value: "formik", label: "Formik", description: "Mature (maintenance mode)" },
  { value: "none", label: "None", description: "Native HTML forms" },
];

const validationOptions = [
  { value: "zod", label: "Zod", description: "TypeScript-first schemas", recommended: true },
  { value: "yup", label: "Yup", description: "Object schema validation" },
  { value: "none", label: "None", description: "Manual validation" },
];

const stylingOptions = [
  { value: "tailwind", label: "Tailwind CSS", description: "Utility-first", recommended: true },
  { value: "css-modules", label: "CSS Modules", description: "Scoped local CSS" },
  { value: "scss", label: "SCSS", description: "Sass with nesting" },
  { value: "styled-components", label: "Styled Components", description: "CSS-in-JS runtime" },
  { value: "emotion", label: "Emotion", description: "CSS-in-JS, flexible" },
];

const pkgOptions = [
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm", description: "Fast, disk-efficient", recommended: true },
  { value: "bun", label: "Bun", description: "Ultra-fast" },
  { value: "yarn", label: "Yarn" },
];

const teamSizeOptions = [
  { value: "solo", label: "Solo", description: "Just me" },
  { value: "small", label: "Small team", description: "2–5 developers" },
  { value: "team", label: "Full team", description: "6+ developers" },
];

const projectScaleOptions = [
  { value: "mvp", label: "MVP", description: "Validate fast, iterate" },
  { value: "production", label: "Production", description: "Long-lived, maintained" },
  { value: "enterprise", label: "Enterprise", description: "Large-scale, multi-team" },
];

const seoOptions = [
  { value: "none", label: "Not needed", description: "Internal / auth-gated" },
  { value: "moderate", label: "Moderate", description: "Some public pages" },
  { value: "critical", label: "Critical", description: "SEO is a core goal" },
];

const complexityOptions = [
  { value: "simple", label: "Simple", description: "Few screens, basic CRUD" },
  { value: "moderate", label: "Moderate", description: "Multiple domains" },
  { value: "complex", label: "Complex", description: "Rich interactions, many flows" },
];

const longevityOptions = [
  { value: "short", label: "Short-lived", description: "< 1 year, throwaway" },
  { value: "long", label: "Long-term", description: "Maintained for years" },
];

function dnaSummary(dna: ProjectDnaData): string {
  const scale = { mvp: "MVP", production: "production app", enterprise: "enterprise system" }[dna.projectScale];
  const team = { solo: "for you alone", small: "for a small team", team: "for a full team" }[dna.teamSize];
  const longevity = dna.longevity === "long" ? "maintained long-term" : "short-lived";
  const seo = dna.seoImportance === "critical" ? " with critical SEO needs" : dna.seoImportance === "moderate" ? " with some SEO requirements" : "";
  return `A ${longevity} ${scale}${seo}, ${team}.`;
}

// Frameworks that handle routing themselves — hide routing picker for these
const FRAMEWORK_HAS_ROUTING = new Set(["next", "remix", "astro", "sveltekit"]);

export function ProjectStep() {
  const { project, projectDna, updateProject, updateProjectDna } = useWizardStore();

  const toggleStyling = (val: string) => {
    const current = project.styling as string[];
    const next = current.includes(val)
      ? current.filter((s) => s !== val)
      : [...current, val];
    updateProject({ styling: next as ProjectData["styling"] });
  };

  const toggleState = (val: string) => {
    const current = project.stateManagement as string[];
    const next = current.includes(val)
      ? current.filter((s) => s !== val)
      : [...current, val];
    updateProject({ stateManagement: next as ProjectData["stateManagement"] });
  };

  const showRouting = project.framework === "vite-react";

  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Project Setup"
        description="Choose your core technology stack. These decisions affect every layer of the project."
      />

      <div className="space-y-8">
        {/* ── Project DNA ── */}
        <Collapsible
          title="Project DNA"
          description="Shape recommendations without locking your choices"
          defaultOpen={true}
        >
          <div className="space-y-6 mt-4">
            <div>
              <Label>Team Size</Label>
              <RadioGroup
                options={teamSizeOptions}
                value={projectDna.teamSize}
                onChange={(v) => updateProjectDna({ teamSize: v as ProjectDnaData["teamSize"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>Project Scale</Label>
              <RadioGroup
                options={projectScaleOptions}
                value={projectDna.projectScale}
                onChange={(v) => updateProjectDna({ projectScale: v as ProjectDnaData["projectScale"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>SEO Importance</Label>
              <RadioGroup
                options={seoOptions}
                value={projectDna.seoImportance}
                onChange={(v) => updateProjectDna({ seoImportance: v as ProjectDnaData["seoImportance"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>Complexity</Label>
              <RadioGroup
                options={complexityOptions}
                value={projectDna.complexity}
                onChange={(v) => updateProjectDna({ complexity: v as ProjectDnaData["complexity"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>Longevity</Label>
              <RadioGroup
                options={longevityOptions}
                value={projectDna.longevity}
                onChange={(v) => updateProjectDna({ longevity: v as ProjectDnaData["longevity"] })}
                columns={2}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2">
              {dnaSummary(projectDna)}
            </p>
          </div>
        </Collapsible>

        {/* Project name */}
        <div>
          <Label required>Project Name</Label>
          <Input
            placeholder="my-awesome-app"
            value={project.projectName}
            onChange={(e) => updateProject({ projectName: e.target.value })}
          />
        </div>

        {/* Language */}
        <div>
          <Label>Language</Label>
          <RadioGroup
            options={[
              { value: "typescript", label: "TypeScript", description: "Strongly recommended", recommended: true },
              { value: "javascript", label: "JavaScript", description: "No type safety" },
            ]}
            value={project.language}
            onChange={(v) => updateProject({ language: v as ProjectData["language"] })}
            columns={2}
          />
        </div>

        {/* Framework */}
        <div>
          <Label required>Framework</Label>
          <RadioGroup
            options={frameworks}
            value={project.framework}
            onChange={(v) => {
              updateProject({ framework: v as ProjectData["framework"] });
              // Clear routing when switching to a framework with built-in routing
              if (FRAMEWORK_HAS_ROUTING.has(v)) {
                updateProject({ routing: "none" });
              }
            }}
            columns={3}
          />
        </div>

        {/* Routing (only for Vite + React) */}
        {showRouting && (
          <div>
            <Label>Routing Library</Label>
            <p className="text-xs text-zinc-400 mb-2 dark:text-zinc-500">
              Vite + React has no built-in router — choose one.
            </p>
            <RadioGroup
              options={routingOptions}
              value={project.routing}
              onChange={(v) => updateProject({ routing: v as ProjectData["routing"] })}
              columns={3}
            />
          </div>
        )}

        {/* Client state */}
        <div>
          <Label>Client State Management</Label>
          <p className="text-xs text-zinc-400 mb-2 dark:text-zinc-500">Select all that apply (pick one for clarity)</p>
          <RadioGroup
            options={stateOptions}
            value={project.stateManagement}
            onChange={toggleState}
            multi
            columns={3}
          />
        </div>

        {/* Server state */}
        <div>
          <Label>Server State / Data Fetching</Label>
          <RadioGroup
            options={serverStateOptions}
            value={project.serverState}
            onChange={(v) => updateProject({ serverState: v as ProjectData["serverState"] })}
            columns={3}
          />
        </div>

        {/* Forms */}
        <div>
          <Label>Form Library</Label>
          <RadioGroup
            options={formOptions}
            value={project.formLibrary}
            onChange={(v) => updateProject({ formLibrary: v as ProjectData["formLibrary"] })}
            columns={2}
          />
        </div>

        {/* Validation */}
        <div>
          <Label>Schema Validation</Label>
          <RadioGroup
            options={validationOptions}
            value={project.validation}
            onChange={(v) => updateProject({ validation: v as ProjectData["validation"] })}
            columns={3}
          />
        </div>

        {/* Styling */}
        <div>
          <Label>Styling Approach</Label>
          <p className="text-xs text-zinc-400 mb-2 dark:text-zinc-500">Select primary (and only secondary if truly needed)</p>
          <RadioGroup
            options={stylingOptions}
            value={project.styling}
            onChange={toggleStyling}
            multi
            columns={3}
          />
        </div>

        {/* Advanced options */}
        <Collapsible title="Advanced Options" description="API style, HTTP client, package manager">
          <div className="space-y-6 mt-4">
            <div>
              <Label>API Style</Label>
              <RadioGroup
                options={apiStyleOptions}
                value={project.apiStyle}
                onChange={(v) => updateProject({ apiStyle: v as ProjectData["apiStyle"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>HTTP Client</Label>
              <RadioGroup
                options={[
                  { value: "fetch", label: "Native Fetch", description: "No dependency", recommended: true },
                  { value: "axios", label: "Axios", description: "Interceptors, transforms" },
                ]}
                value={project.apiClient}
                onChange={(v) => updateProject({ apiClient: v as ProjectData["apiClient"] })}
                columns={2}
              />
            </div>
            <div>
              <Label>Package Manager</Label>
              <RadioGroup
                options={pkgOptions}
                value={project.packageManager}
                onChange={(v) => updateProject({ packageManager: v as ProjectData["packageManager"] })}
                columns={4}
              />
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
