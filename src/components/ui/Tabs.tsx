import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-0 border-b border-zinc-200 dark:border-zinc-700", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus-visible:outline-none",
            value === tab.value
              ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-500"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
