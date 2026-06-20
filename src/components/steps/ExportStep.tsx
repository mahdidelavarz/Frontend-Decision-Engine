"use client";

import { useState } from "react";
import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { AdvisorInline } from "@/components/wizard/AdvisorInline";
import { FilePreviewModal } from "@/components/wizard/FilePreviewModal";
import { ReadinessChecklist } from "@/components/steps/ReadinessChecklist";
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
  Eye,
} from "lucide-react";

const FILE_META = [
  {
    filename: "PROJECT_GUIDELINES.md",
    description: "Human-readable architecture decisions for the team",
    icon: FileText,
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50",
    previewable: true,
  },
  {
    filename: "AI_CONTEXT.md",
    description: "Paste into AI assistants at the start of every coding session",
    icon: Bot,
    color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50",
    previewable: true,
  },
  {
    filename: "WHY.md",
    description: "Rationale behind each decision for future reference",
    icon: HelpCircle,
    color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50",
    previewable: true,
  },
  {
    filename: "README.md",
    description: "Project overview with stack summary and getting-started guide",
    icon: BookOpen,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
    previewable: false,
  },
  {
    filename: "project-config.json",
    description: "Machine-readable config for tooling and future import",
    icon: Settings2,
    color: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800",
    previewable: false,
  },
  {
    filename: "tokens.css",
    description: "CSS custom properties — drop into your project's globals.css",
    icon: Palette,
    color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50",
    previewable: false,
  },
  {
    filename: "tokens.tailwind.json",
    description: "Tailwind 4 @theme variables — paste into your CSS or import directly",
    icon: Code2,
    color: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/50",
    previewable: false,
  },
  {
    filename: ".gitignore",
    description: "Pre-configured for your framework and package manager",
    icon: GitBranch,
    color: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800",
    previewable: false,
  },
];

function countLines(s: string): number {
  return s.split("\n").length;
}

export function ExportStep() {
  const state = useWizardStore();
  const onBack = useStepBack();
  const [previewFile, setPreviewFile] = useState<{ filename: string; content: string } | null>(null);

  const fullContent: Record<string, string> = {
    "PROJECT_GUIDELINES.md": generateGuidelines(state),
    "AI_CONTEXT.md": generateAIContext(state),
    "WHY.md": generateWhy(state),
    "README.md": generateReadme(state),
    "tokens.css": generateTokensCss(state),
    ".gitignore": generateGitignore(state),
  };

  const previews: Record<string, string> = Object.fromEntries(
    Object.entries(fullContent).map(([k, v]) => [k, v.slice(0, 400) + "…"])
  );

  return (
    <div>
      <StepHeader
        stepNumber={7}
        title="Export Blueprint"
        description="Your architecture decisions are ready. Download the ZIP to get all files."
        onBack={onBack}
      />

      <AdvisorInline />

      <ReadinessChecklist state={state} />

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 mb-6 flex items-center gap-3 dark:border-indigo-800 dark:bg-indigo-950/40">
        <Check size={16} className="text-indigo-600 shrink-0 dark:text-indigo-400" />
        <p className="text-sm text-indigo-800 font-medium dark:text-indigo-300">
          Blueprint complete for{" "}
          <span className="font-bold">{state.project.projectName || "your project"}</span>.
          Click &quot;Download ZIP&quot; in the footer to export.
        </p>
      </div>

      <div className="space-y-2">
        {FILE_META.map(({ filename, description, icon: Icon, color, previewable }) => (
          <div
            key={filename}
            className="rounded-xl border border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 font-mono dark:text-zinc-100 truncate min-w-0">
                    {filename}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {fullContent[filename] && (
                      <span className="text-xs text-zinc-400">
                        ~{countLines(fullContent[filename])} lines
                      </span>
                    )}
                    {previewable && fullContent[filename] && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewFile({ filename, content: fullContent[filename] })
                        }
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium transition-colors"
                      >
                        <Eye size={12} />
                        Preview
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
                {previews[filename] && (
                  <pre className="mt-2 text-[10px] leading-relaxed text-zinc-500 bg-zinc-50 rounded-lg p-2 overflow-hidden max-h-16 font-mono whitespace-pre-wrap dark:bg-zinc-800 dark:text-zinc-400">
                    {previews[filename].slice(0, 200)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <FilePreviewModal
          filename={previewFile.filename}
          content={previewFile.content}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
