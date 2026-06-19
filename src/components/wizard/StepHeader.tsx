import { cn } from "@/lib/utils";

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
  className?: string;
}

export function StepHeader({ stepNumber, title, description, className }: StepHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
        Step {stepNumber}
      </span>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
      <p className="mt-1.5 text-sm text-zinc-500 max-w-prose dark:text-zinc-400">{description}</p>
    </div>
  );
}
