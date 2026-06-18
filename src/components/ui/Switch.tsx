import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      {(label || description) && (
        <div>
          {label && (
            <span className="text-sm font-medium text-zinc-800">{label}</span>
          )}
          {description && (
            <p className="text-xs text-zinc-500">{description}</p>
          )}
        </div>
      )}
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            "h-5 w-9 rounded-full transition-colors",
            checked ? "bg-indigo-600" : "bg-zinc-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    </label>
  );
}
