import { cn } from "@/lib/utils";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
}

const PRESETS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#6366f1", // indigo
];

function isValidHex(str: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(str);
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [inputVal, setInputVal] = useState(value);

  const handleTextChange = (raw: string) => {
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    setInputVal(hex);
    if (isValidHex(hex)) onChange(hex);
  };

  const handleNativeChange = (hex: string) => {
    setInputVal(hex);
    onChange(hex);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="block text-sm font-medium text-zinc-700">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={isValidHex(value) ? value : "#3b82f6"}
            onChange={(e) => handleNativeChange(e.target.value)}
            className="h-9 w-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5 bg-white"
            title="Pick a color"
          />
        </div>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => {
            if (!isValidHex(inputVal)) setInputVal(value);
          }}
          placeholder="#3b82f6"
          className="w-28 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setInputVal(preset);
              onChange(preset);
            }}
            title={preset}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              value === preset ? "border-zinc-900 scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
    </div>
  );
}
