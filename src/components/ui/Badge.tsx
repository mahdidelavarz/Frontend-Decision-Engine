import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Variant = "default" | "warning" | "error" | "info" | "success";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-zinc-100 text-zinc-700",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
