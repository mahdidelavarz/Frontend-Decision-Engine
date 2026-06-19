"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store";
import { Plus, RotateCcw, ArrowRight, Cpu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HomePage() {
  const router = useRouter();
  const resetSession  = useWizardStore((s) => s.resetSession);
  const projectName   = useWizardStore((s) => s.project.projectName);
  const createdAt     = useWizardStore((s) => s.createdAt);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fde-session-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHasSession(
          !!parsed?.state?.project?.projectName || !!parsed?.state?.createdAt
        );
      } catch {
        setHasSession(false);
      }
    }
  }, []);

  const handleNew = () => {
    resetSession();
    router.push("/wizard");
  };

  const handleRestore = () => {
    router.push("/wizard");
  };

  const sessionDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-indigo-50/30 flex flex-col items-center justify-center p-6 dark:from-zinc-950 dark:to-indigo-950/20">
      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-3 mb-12">
        <div className="rounded-2xl bg-indigo-600 p-3">
          <Cpu size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Frontend Decision Engine
          </h1>
          <p className="text-sm text-zinc-500">
            Architecture planning for serious projects
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <button
          type="button"
          onClick={handleNew}
          className="flex-1 group rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-6 text-left transition-all hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:shadow-indigo-950/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-indigo-50 p-2.5 group-hover:bg-indigo-100 transition-colors dark:bg-indigo-950/60 dark:group-hover:bg-indigo-950">
              <Plus size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <ArrowRight
              size={16}
              className="text-zinc-300 group-hover:text-indigo-500 transition-all dark:text-zinc-600"
            />
          </div>
          <h2 className="text-base font-semibold text-zinc-900 mb-1 dark:text-zinc-100">
            New Blueprint
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Start fresh. Make all your frontend architecture decisions before
            writing a single line of code.
          </p>
        </button>

        {hasSession && (
          <button
            type="button"
            onClick={handleRestore}
            className="flex-1 group rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:shadow-indigo-950/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-zinc-100 p-2.5 group-hover:bg-indigo-50 transition-colors dark:bg-zinc-800 dark:group-hover:bg-indigo-950/60">
                <RotateCcw
                  size={20}
                  className="text-zinc-600 group-hover:text-indigo-600 transition-colors dark:text-zinc-400 dark:group-hover:text-indigo-400"
                />
              </div>
              <ArrowRight
                size={16}
                className="text-zinc-300 group-hover:text-indigo-500 transition-all dark:text-zinc-600"
              />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 mb-1 dark:text-zinc-100">
              Continue Session
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {projectName
                ? `Resume "${projectName}"`
                : "Resume your previous blueprint"}
              {sessionDate && (
                <span className="block text-xs text-zinc-400 mt-1">
                  Last edited {sessionDate}
                </span>
              )}
            </p>
          </button>
        )}
      </div>

      <div className="mt-12 max-w-xl w-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center mb-3">
          What you&apos;ll get
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "PROJECT_GUIDELINES.md",
            "AI_CONTEXT.md",
            "WHY.md",
            "README.md",
            "project-config.json",
            "tokens.css",
            "tokens.tailwind.json",
            ".gitignore",
          ].map((file) => (
            <span
              key={file}
              className="rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-xs font-mono text-zinc-600 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"
            >
              {file}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-10 text-xs text-zinc-400 text-center max-w-sm">
        100% local. No account. No cloud. All decisions stay in your browser.
      </p>
    </div>
  );
}
