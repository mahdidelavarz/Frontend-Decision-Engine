import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer group", className)}>
      <div className="mt-0.5 shrink-0">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          {...props}
        />
      </div>
      <div>
        <span className="text-sm font-medium text-zinc-800 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-100">
          {label}
        </span>
        {description && (
          <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">{description}</p>
        )}
      </div>
    </label>
  );
}
