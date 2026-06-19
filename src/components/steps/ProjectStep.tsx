"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Collapsible } from "@/components/ui/Collapsible";
import {
  Fingerprint,
  Type,
  Boxes,
  Route,
  Layers,
  Database,
  ClipboardList,
  ShieldCheck,
  Palette,
  Settings2,
  Globe,
} from "lucide-react";
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

const deploymentOptions = [
  { value: "vercel", label: "Vercel", description: "Zero-config, Next.js native" },
  { value: "netlify", label: "Netlify", description: "JAMstack, forms, edge" },
  { value: "cloudflare-pages", label: "Cloudflare Pages", description: "Global CDN, Workers" },
  { value: "static-hosting", label: "Static hosting", description: "S3, GitHub Pages, etc." },
  { value: "self-hosted", label: "Self-hosted", description: "Own server / VPS" },
  { value: "not-decided", label: "Not decided yet", description: "Decide later" },
];

const seoStrategyOptions = [
  { value: "not-needed", label: "Not needed", description: "Internal / auth-gated app" },
  { value: "basic", label: "Basic SEO", description: "Title, meta, OG tags" },
  { value: "advanced", label: "Advanced SEO", description: "Sitemap, structured data, SSR" },
];

const imageHandlingOptions = [
  { value: "framework-default", label: "Framework default", description: "next/image, etc." },
  { value: "native-img", label: "Native <img>", description: "No abstraction layer" },
  { value: "external-optimization", label: "External optimization", description: "Cloudinary, Imgix, etc." },
  { value: "not-important", label: "Not important", description: "Minimal images in this app" },
];

const localizationOptions = [
  { value: "none", label: "None", description: "Single language only" },
  { value: "i18next", label: "i18next", description: "Most widely used i18n library" },
  { value: "next-intl", label: "next-intl", description: "Next.js App Router native" },
  { value: "paraglide", label: "Paraglide", description: "Type-safe, compile-time i18n" },
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

function dnaSummary(dna: ProjectDnaData): string | null {
  const parts: string[] = [];
  if (dna.longevity) parts.push(dna.longevity === "long" ? "maintained long-term" : "short-lived");
  if (dna.projectScale) {
    parts.push({ mvp: "MVP", production: "production app", enterprise: "enterprise system" }[dna.projectScale]!);
  }
  if (dna.seoImportance === "critical") parts.push("with critical SEO needs");
  else if (dna.seoImportance === "moderate") parts.push("with some SEO requirements");
  if (dna.teamSize) {
    parts.push({ solo: "for you alone", small: "for a small team", team: "for a full team" }[dna.teamSize]!);
  }
  if (parts.length === 0) return null;
  return `A ${parts.join(", ")}.`;
}

// Frameworks that handle routing themselves — hide routing picker for these
const FRAMEWORK_HAS_ROUTING = new Set(["next", "remix", "astro", "sveltekit"]);

export function ProjectStep() {
  const { project, projectDna, updateProject, updateProjectDna } = useWizardStore();
  const onBack = useStepBack();

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
  const dna = dnaSummary(projectDna);

  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Project Setup"
        description="Choose your core technology stack. These decisions affect every layer of the project."
        onBack={onBack}
      />

      <div className="space-y-10">
        {/* ── Project DNA (optional) ── */}
        <Collapsible
          title="Project DNA"
          description="Shape recommendations without locking your choices — leave blank to skip"
          icon={<Fingerprint size={16} />}
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
            {dna && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2">
                {dna}
              </p>
            )}
          </div>
        </Collapsible>

        {/* Project name */}
        <Section id="projectName" title="Project Name" required>
          <Input
            placeholder="my-awesome-app"
            value={project.projectName}
            onChange={(e) => updateProject({ projectName: e.target.value })}
          />
        </Section>

        {/* Language */}
        <Section id="language" title="Language" icon={<Type size={14} />}>
          <RadioGroup
            options={[
              { value: "typescript", label: "TypeScript", description: "Strongly recommended", recommended: true },
              { value: "javascript", label: "JavaScript", description: "No type safety" },
            ]}
            value={project.language}
            onChange={(v) => updateProject({ language: v as ProjectData["language"] })}
            columns={2}
          />
        </Section>

        {/* Framework */}
        <Section id="framework" title="Framework" required icon={<Boxes size={14} />}>
          <RadioGroup
            options={frameworks}
            value={project.framework}
            onChange={(v) => {
              updateProject({ framework: v as ProjectData["framework"] });
              if (FRAMEWORK_HAS_ROUTING.has(v)) {
                updateProject({ routing: "none" });
              }
            }}
            columns={3}
          />
        </Section>

        {/* Routing (only for Vite + React) */}
        {showRouting && (
          <Section
            id="routing"
            title="Routing Library"
            description="Vite + React has no built-in router — choose one."
            icon={<Route size={14} />}
          >
            <RadioGroup
              options={routingOptions}
              value={project.routing}
              onChange={(v) => updateProject({ routing: v as ProjectData["routing"] })}
              columns={3}
            />
          </Section>
        )}

        {/* Client state */}
        <Section
          id="stateManagement"
          title="Client State Management"
          description="Select all that apply (pick one for clarity)"
          icon={<Layers size={14} />}
        >
          <RadioGroup
            options={stateOptions}
            value={project.stateManagement}
            onChange={toggleState}
            multi
            columns={3}
          />
        </Section>

        {/* Server state */}
        <Section id="serverState" title="Server State / Data Fetching" icon={<Database size={14} />}>
          <RadioGroup
            options={serverStateOptions}
            value={project.serverState}
            onChange={(v) => updateProject({ serverState: v as ProjectData["serverState"] })}
            columns={3}
          />
        </Section>

        {/* Forms */}
        <Section id="formLibrary" title="Form Library" icon={<ClipboardList size={14} />}>
          <RadioGroup
            options={formOptions}
            value={project.formLibrary}
            onChange={(v) => updateProject({ formLibrary: v as ProjectData["formLibrary"] })}
            columns={2}
          />
        </Section>

        {/* Validation */}
        <Section id="validation" title="Schema Validation" icon={<ShieldCheck size={14} />}>
          <RadioGroup
            options={validationOptions}
            value={project.validation}
            onChange={(v) => updateProject({ validation: v as ProjectData["validation"] })}
            columns={3}
          />
        </Section>

        {/* Styling */}
        <Section
          id="styling"
          title="Styling Approach"
          required
          description="Select primary (and only secondary if truly needed)"
          icon={<Palette size={14} />}
        >
          <RadioGroup
            options={stylingOptions}
            value={project.styling}
            onChange={toggleStyling}
            multi
            columns={3}
          />
        </Section>

        {/* Advanced options (optional) */}
        <Collapsible
          title="Advanced Options"
          description="API style, HTTP client, package manager, deployment, SEO, images"
          icon={<Settings2 size={16} />}
        >
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
              <div className="mt-2">
                <Checkbox
                  label="Enforce this package manager"
                  description="Document in guidelines and AI context — team must not use others"
                  checked={project.enforcePackageManager}
                  onChange={() => updateProject({ enforcePackageManager: !project.enforcePackageManager })}
                />
              </div>
            </div>
            <div>
              <Label>Deployment Target</Label>
              <RadioGroup
                options={deploymentOptions}
                value={project.deploymentTarget}
                onChange={(v) => updateProject({ deploymentTarget: v as ProjectData["deploymentTarget"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>SEO Strategy</Label>
              <RadioGroup
                options={seoStrategyOptions}
                value={project.seoStrategy}
                onChange={(v) => updateProject({ seoStrategy: v as ProjectData["seoStrategy"] })}
                columns={3}
              />
            </div>
            <div>
              <Label>Image Handling</Label>
              <RadioGroup
                options={imageHandlingOptions}
                value={project.imageHandling}
                onChange={(v) => updateProject({ imageHandling: v as ProjectData["imageHandling"] })}
                columns={2}
              />
            </div>
          </div>
        </Collapsible>

        {/* Internationalization (optional) */}
        <Collapsible
          title="Internationalization"
          description="Localization library and RTL language support"
          icon={<Globe size={16} />}
        >
          <div className="space-y-6 mt-4">
            <div>
              <Label>Localization Library</Label>
              <RadioGroup
                options={localizationOptions}
                value={project.localization}
                onChange={(v) => updateProject({ localization: v as ProjectData["localization"] })}
                columns={2}
              />
              {project.localization === "next-intl" && project.framework === "next" && (
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg px-3 py-2">
                  next-intl is built for the Next.js App Router — native support for server components and routing.
                </p>
              )}
              {project.localization === "next-intl" && project.framework && project.framework !== "next" && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                  next-intl is optimized for Next.js — consider i18next for other frameworks.
                </p>
              )}
            </div>
            <div>
              <Label>RTL Support</Label>
              <Checkbox
                label="Project must support right-to-left languages"
                description="Arabic, Hebrew, Persian, Urdu — requires logical CSS properties (margin-inline-start, not margin-left)"
                checked={project.rtlSupport}
                onChange={() => updateProject({ rtlSupport: !project.rtlSupport })}
              />
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
