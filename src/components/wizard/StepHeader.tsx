import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
  /** When provided, renders a back button to the left of the title */
  onBack?: () => void;
  className?: string;
}

export function StepHeader({ stepNumber, title, description, onBack, className }: StepHeaderProps) {
  return (
    <div className={cn("mb-8 border-b border-zinc-100 pb-6 dark:border-zinc-800", className)}>
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go to previous step"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1 dark:text-indigo-400">
            Step {stepNumber}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
          <p className="mt-2 text-sm text-zinc-500 max-w-prose dark:text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
