import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  displayValue?: string;
}

export function Slider({ label, displayValue, className, ...props }: SliderProps) {
  return (
    <div className="w-full">
      {(label || displayValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-zinc-700">{label}</span>}
          {displayValue && (
            <span className="text-sm text-zinc-500">{displayValue}</span>
          )}
        </div>
      )}
      <input
        type="range"
        className={cn(
          "w-full h-1.5 rounded-full bg-zinc-200 appearance-none cursor-pointer accent-indigo-600",
          className
        )}
        {...props}
      />
    </div>
  );
}
