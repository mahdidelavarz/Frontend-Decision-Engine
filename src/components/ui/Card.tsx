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
        "rounded-xl border bg-white p-4 shadow-sm transition-all",
        hoverable && "cursor-pointer hover:shadow-md hover:border-indigo-300",
        selected && "border-indigo-500 ring-2 ring-indigo-200",
        !selected && "border-zinc-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
