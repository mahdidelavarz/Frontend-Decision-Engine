"use client";

import { cn } from "@/lib/utils";

interface FieldProps {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ icon, iconColor, label, description, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-start gap-2.5">
        <span className={cn("mt-0.5 shrink-0", iconColor)}>{icon}</span>
        <div className="min-w-0">
          <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          {description && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
