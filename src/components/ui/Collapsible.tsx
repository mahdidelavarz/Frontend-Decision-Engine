"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Collapsible({
  title,
  description,
  defaultOpen = false,
  children,
  className,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border border-zinc-200 dark:border-zinc-700 rounded-lg", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
      >
        <div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
            {title}
          </span>
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
        <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-700/50">
          {children}
        </div>
      )}
    </div>
  );
}
