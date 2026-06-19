import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  recommended?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string | string[];
  onChange: (value: string) => void;
  multi?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  multi = false,
  columns = 3,
  className,
}: RadioGroupProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  return (
    <div className={cn("grid gap-2.5", colClass, className)}>
      {options.map((opt) => {
        const selected = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-zinc-950",
              selected
                ? "border-indigo-500 bg-linear-to-b from-indigo-50 to-indigo-100/60 shadow-sm shadow-indigo-100 dark:border-indigo-400 dark:from-indigo-950/70 dark:to-indigo-900/40 dark:shadow-none"
                : "border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-950/20"
            )}
          >
            {/* Check badge — top-right when selected */}
            <span
              className={cn(
                "absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-150",
                selected
                  ? "scale-100 bg-indigo-600 text-white dark:bg-indigo-500"
                  : "scale-0 bg-transparent"
              )}
            >
              <Check size={11} strokeWidth={3.5} />
            </span>

            {opt.icon && (
              <span
                className={cn(
                  "flex h-5 items-center text-lg transition-colors",
                  selected
                    ? "text-indigo-600 dark:text-indigo-300"
                    : "text-zinc-400 group-hover:text-indigo-500 dark:text-zinc-500"
                )}
              >
                {opt.icon}
              </span>
            )}

            <span className="flex items-center gap-1.5 flex-wrap pr-5">
              <span
                className={cn(
                  "text-sm font-semibold",
                  selected
                    ? "text-indigo-900 dark:text-indigo-100"
                    : "text-zinc-800 dark:text-zinc-200"
                )}
              >
                {opt.label}
              </span>
              {opt.recommended && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 leading-none">
                  Recommended
                </span>
              )}
            </span>

            {opt.description && (
              <span
                className={cn(
                  "text-xs leading-snug",
                  selected
                    ? "text-indigo-700/80 dark:text-indigo-300/70"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
