"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useWizardStore } from "@/store";

interface SectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Anchor id — when the advisor's focusField matches, this section scrolls into view and highlights */
  id?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  icon,
  id,
  required,
  children,
  className,
}: SectionProps) {
  const focusField = useWizardStore((s) => s.focusField);
  const setFocusField = useWizardStore((s) => s.setFocusField);
  const ref = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (id && focusField === id && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlight(true);
      const clear = setTimeout(() => {
        setHighlight(false);
        setFocusField(null);
      }, 1600);
      return () => clearTimeout(clear);
    }
  }, [focusField, id, setFocusField]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "scroll-mt-6 rounded-xl transition-shadow duration-300",
        highlight && "ring-2 ring-indigo-400 ring-offset-4 ring-offset-white dark:ring-offset-zinc-950",
        className
      )}
    >
      <div className="mb-3 flex items-start gap-2.5">
        {icon && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
            {required && <span className="text-rose-500" aria-hidden>*</span>}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
