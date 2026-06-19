import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, className, showLabel }: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-zinc-500 text-right">{pct}%</p>
      )}
    </div>
  );
}
