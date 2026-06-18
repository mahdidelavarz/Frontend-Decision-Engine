"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { generateGuidelines } from "@/export/generators/guidelines";
import { generateAIContext } from "@/export/generators/aiContext";
import { generateWhy } from "@/export/generators/why";
import { generateReadme } from "@/export/generators/readme";
import { generateTokensCss } from "@/export/generators/tokensCss";
import { generateGitignore } from "@/export/generators/gitignore";
import {
  FileText,
  Bot,
  HelpCircle,
  BookOpen,
  Settings2,
  Palette,
  Code2,
  GitBranch,
  Check,
} from "lucide-react";

const FILE_META = [
  {
    filename: "PROJECT_GUIDELINES.md",
    description: "Human-readable architecture decisions for the team",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
  },
  {
    filename: "AI_CONTEXT.md",
    description: "Paste into AI assistants at the start of every coding session",
    icon: Bot,
    color: "text-violet-600 bg-violet-50",
  },
  {
    filename: "WHY.md",
    description: "Rationale behind each decision for future reference",
    icon: HelpCircle,
    color: "text-amber-600 bg-amber-50",
  },
  {
    filename: "README.md",
    description: "Project overview with stack summary and getting-started guide",
    icon: BookOpen,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    filename: "project-config.json",
    description: "Machine-readable config for tooling and future import",
    icon: Settings2,
    color: "text-zinc-600 bg-zinc-100",
  },
  {
    filename: "tokens.css",
    description: "CSS custom properties — drop into your project's globals.css",
    icon: Palette,
    color: "text-rose-600 bg-rose-50",
  },
  {
    filename: "tokens.tailwind.json",
    description: "Tailwind 4 @theme variables — paste into your CSS or import directly",
    icon: Code2,
    color: "text-sky-600 bg-sky-50",
  },
  {
    filename: ".gitignore",
    description: "Pre-configured for your framework and package manager",
    icon: GitBranch,
    color: "text-zinc-600 bg-zinc-100",
  },
];

function countLines(s: string): number {
  return s.split("\n").length;
}

export function ExportStep() {
  const state = useWizardStore();

  const previews: Record<string, string> = {
    "PROJECT_GUIDELINES.md": generateGuidelines(state).slice(0, 400) + "…",
    "AI_CONTEXT.md": generateAIContext(state).slice(0, 400) + "…",
    "WHY.md": generateWhy(state).slice(0, 400) + "…",
    "README.md": generateReadme(state).slice(0, 400) + "…",
    "tokens.css": generateTokensCss(state).slice(0, 400) + "…",
    ".gitignore": generateGitignore(state).slice(0, 400) + "…",
  };

  return (
    <div>
      <StepHeader
        stepNumber={7}
        title="Export Blueprint"
        description="Your architecture decisions are ready. Download the ZIP to get all 8 files."
      />

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 mb-6 flex items-center gap-3">
        <Check size={16} className="text-indigo-600 shrink-0" />
        <p className="text-sm text-indigo-800 font-medium">
          Blueprint complete for{" "}
          <span className="font-bold">{state.project.projectName || "your project"}</span>.
          Click &quot;Download ZIP&quot; in the footer to export.
        </p>
      </div>

      <div className="space-y-2">
        {FILE_META.map(({ filename, description, icon: Icon, color }) => (
          <div
            key={filename}
            className="rounded-xl border border-zinc-100 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900 font-mono">
                    {filename}
                  </p>
                  {previews[filename] && (
                    <span className="text-xs text-zinc-400">
                      ~{countLines(previews[filename] || "")} lines
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
                {previews[filename] && (
                  <pre className="mt-2 text-[10px] leading-relaxed text-zinc-500 bg-zinc-50 rounded-lg p-2 overflow-hidden max-h-16 font-mono whitespace-pre-wrap">
                    {previews[filename].slice(0, 200)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
