import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
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
    <div className={cn("grid gap-2", colClass, className)}>
      {options.map((opt) => {
        const selected = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              selected
                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:border-indigo-400 dark:bg-indigo-950/60 dark:ring-indigo-900"
                : "border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30"
            )}
          >
            {opt.icon && (
              <span className={cn("text-lg", selected ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-400")}>
                {opt.icon}
              </span>
            )}
            <span
              className={cn(
                "text-sm font-medium",
                selected ? "text-indigo-800 dark:text-indigo-300" : "text-zinc-800 dark:text-zinc-200"
              )}
            >
              {opt.label}
            </span>
            {opt.description && (
              <span className="text-xs text-zinc-500 leading-tight dark:text-zinc-400">
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
