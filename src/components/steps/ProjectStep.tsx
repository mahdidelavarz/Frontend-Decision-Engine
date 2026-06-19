"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import type { ProjectData } from "@/types";

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

const stateOptions = [
  { value: "zustand", label: "Zustand", description: "Lightweight, simple" },
  { value: "redux-toolkit", label: "Redux Toolkit", description: "Predictable, devtools" },
  { value: "jotai", label: "Jotai", description: "Atomic, RSC-friendly" },
  { value: "context-only", label: "Context only", description: "No extra library" },
  { value: "none", label: "None", description: "Server state only" },
];

const serverStateOptions = [
  { value: "react-query", label: "TanStack Query", description: "Full-featured caching" },
  { value: "swr", label: "SWR", description: "Lightweight, REST-first" },
  { value: "none", label: "None", description: "Manual fetch / RSC" },
];

const apiStyleOptions = [
  { value: "rest", label: "REST", description: "JSON over HTTP" },
  { value: "graphql", label: "GraphQL", description: "Schema-first queries" },
  { value: "trpc", label: "tRPC", description: "End-to-end typesafe" },
];

const formOptions = [
  { value: "react-hook-form", label: "React Hook Form", description: "Performant, uncontrolled" },
  { value: "tanstack-form", label: "TanStack Form", description: "Modern, type-safe" },
  { value: "formik", label: "Formik", description: "Mature (maintenance mode)" },
  { value: "none", label: "None", description: "Native HTML forms" },
];

const validationOptions = [
  { value: "zod", label: "Zod", description: "TypeScript-first schemas" },
  { value: "yup", label: "Yup", description: "Object schema validation" },
  { value: "none", label: "None", description: "Manual validation" },
];

const stylingOptions = [
  { value: "tailwind", label: "Tailwind CSS", description: "Utility-first" },
  { value: "css-modules", label: "CSS Modules", description: "Scoped local CSS" },
  { value: "scss", label: "SCSS", description: "Sass with nesting" },
  { value: "styled-components", label: "Styled Components", description: "CSS-in-JS runtime" },
  { value: "emotion", label: "Emotion", description: "CSS-in-JS, flexible" },
];

const pkgOptions = [
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm", description: "Fast, disk-efficient" },
  { value: "bun", label: "Bun", description: "Ultra-fast" },
  { value: "yarn", label: "Yarn" },
];

export function ProjectStep() {
  const { project, updateProject } = useWizardStore();

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

  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Project Setup"
        description="Choose your core technology stack. These decisions affect every layer of the project."
      />

      <div className="space-y-8">
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
              { value: "typescript", label: "TypeScript", description: "Strongly recommended" },
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
            onChange={(v) => updateProject({ framework: v as ProjectData["framework"] })}
            columns={3}
          />
        </div>

        {/* Package manager */}
        <div>
          <Label>Package Manager</Label>
          <RadioGroup
            options={pkgOptions}
            value={project.packageManager}
            onChange={(v) => updateProject({ packageManager: v as ProjectData["packageManager"] })}
            columns={4}
          />
        </div>

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

        {/* API style */}
        <div>
          <Label>API Style</Label>
          <RadioGroup
            options={apiStyleOptions}
            value={project.apiStyle}
            onChange={(v) => updateProject({ apiStyle: v as ProjectData["apiStyle"] })}
            columns={3}
          />
        </div>

        {/* API client */}
        <div>
          <Label>HTTP Client</Label>
          <RadioGroup
            options={[
              { value: "fetch", label: "Native Fetch", description: "No dependency" },
              { value: "axios", label: "Axios", description: "Interceptors, transforms" },
            ]}
            value={project.apiClient}
            onChange={(v) => updateProject({ apiClient: v as ProjectData["apiClient"] })}
            columns={2}
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
      </div>
    </div>
  );
}
