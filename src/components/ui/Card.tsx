import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  selected?: boolean;
}

export function Card({ hoverable, selected, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-zinc-800 dark:shadow-zinc-900",
        hoverable && "cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500",
        selected && "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900",
        !selected && "border-zinc-200 dark:border-zinc-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
