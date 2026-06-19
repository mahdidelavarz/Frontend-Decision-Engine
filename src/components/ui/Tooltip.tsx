import { cn } from "@/lib/utils";
import { HTMLAttributes, useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max max-w-xs">
          <div className="rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-zinc-700">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
        </div>
      )}
    </div>
  );
}
