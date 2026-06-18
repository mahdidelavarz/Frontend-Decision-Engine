"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { DesignPreview } from "@/components/steps/previews/DesignPreview";
import type { DesignSystemData } from "@/types";

export function isDesignSystemComplete(d: DesignSystemData): boolean {
  return !!d.accentColorHex && !!d.fontFamily && !!d.radiusScale;
}

const neutralOptions = [
  { value: "zinc", label: "Zinc", description: "Cool-toned gray" },
  { value: "slate", label: "Slate", description: "Blue-tinted gray" },
  { value: "gray", label: "Gray", description: "True neutral gray" },
  { value: "stone", label: "Stone", description: "Warm-toned gray" },
];

const fontOptions = [
  { value: "geist", label: "Geist", description: "Vercel's modern sans" },
  { value: "inter", label: "Inter", description: "UI standard, ubiquitous" },
  { value: "roboto", label: "Roboto", description: "Google's classic" },
  { value: "system", label: "System UI", description: "No web font, fastest" },
];

const radiusOptions = [
  { value: "none", label: "Sharp", description: "0px — hard corners" },
  { value: "sm", label: "Subtle", description: "2–4px radius" },
  { value: "md", label: "Rounded", description: "6–8px radius (default)" },
  { value: "lg", label: "Soft", description: "12–16px radius" },
  { value: "full", label: "Pill", description: "9999px for buttons" },
];

const spacingOptions = [
  { value: "4", label: "Base 4px", description: "Default Tailwind scale" },
  { value: "8", label: "Base 8px", description: "More breathing room" },
  { value: "12", label: "Base 12px", description: "Spacious layouts" },
  { value: "16", label: "Base 16px", description: "Large/editorial UI" },
];

const shadowOptions = [
  { value: "flat", label: "Flat", description: "No shadows, borders only" },
  { value: "subtle", label: "Subtle", description: "Light, modern shadows" },
  { value: "elevated", label: "Elevated", description: "Material-style depth" },
];

export function DesignSystemStep() {
  const { designSystem, updateDesignSystem } = useWizardStore();

  return (
    <div>
      <StepHeader
        stepNumber={3}
        title="Design System"
        description="Define your visual foundation. These choices generate ready-to-use CSS tokens and a Tailwind config."
      />

      <div className="flex gap-8 items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-8">
          <div>
            <ColorPicker
              label="Accent Color"
              value={designSystem.accentColorHex}
              onChange={(hex) => updateDesignSystem({ accentColorHex: hex })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Neutral Palette
            </label>
            <RadioGroup
              options={neutralOptions}
              value={designSystem.neutralPalette}
              onChange={(v) =>
                updateDesignSystem({
                  neutralPalette: v as DesignSystemData["neutralPalette"],
                })
              }
              columns={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Font Family
            </label>
            <RadioGroup
              options={fontOptions}
              value={designSystem.fontFamily}
              onChange={(v) =>
                updateDesignSystem({
                  fontFamily: v as DesignSystemData["fontFamily"],
                })
              }
              columns={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Border Radius
            </label>
            <RadioGroup
              options={radiusOptions}
              value={designSystem.radiusScale}
              onChange={(v) =>
                updateDesignSystem({
                  radiusScale: v as DesignSystemData["radiusScale"],
                })
              }
              columns={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Spacing Base Unit
            </label>
            <RadioGroup
              options={spacingOptions}
              value={String(designSystem.spacingBase)}
              onChange={(v) =>
                updateDesignSystem({
                  spacingBase: Number(v) as DesignSystemData["spacingBase"],
                })
              }
              columns={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Shadow Depth
            </label>
            <RadioGroup
              options={shadowOptions}
              value={designSystem.shadowDepth}
              onChange={(v) =>
                updateDesignSystem({
                  shadowDepth: v as DesignSystemData["shadowDepth"],
                })
              }
              columns={3}
            />
          </div>
        </div>

        {/* ── Live preview panel ── */}
        <div className="w-72 shrink-0 sticky top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Live Preview
          </p>
          <DesignPreview designSystem={designSystem} />
        </div>
      </div>
    </div>
  );
}
