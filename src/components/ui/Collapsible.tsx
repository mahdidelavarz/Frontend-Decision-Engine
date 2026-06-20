"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  /** Tailwind text-color classes for the icon. Defaults to zinc. */
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function Collapsible({
  title,
  description,
  defaultOpen = false,
  icon,
  iconColor,
  children,
  className,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        open
          ? "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/40",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
      >
        {icon && (
          <span className={cn("shrink-0", iconColor ?? "text-zinc-500 dark:text-zinc-400")}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
              {title}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Optional
            </span>
          </div>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-zinc-400 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
}
