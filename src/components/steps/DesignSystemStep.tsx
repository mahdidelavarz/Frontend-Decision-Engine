"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Section } from "@/components/ui/Section";
import { Collapsible } from "@/components/ui/Collapsible";
import { Field } from "@/components/ui/Field";
import { DesignPreview } from "@/components/steps/previews/DesignPreview";
import { Droplet, Contrast, Type, SquareRoundCorner, Ruler, Layers, Shapes, Library, SunMoon } from "lucide-react";
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

const iconOptions = [
  { value: "lucide", label: "Lucide", description: "Clean, consistent, tree-shakeable", recommended: true },
  { value: "heroicons", label: "Heroicons", description: "Tailwind team's icons" },
  { value: "tabler", label: "Tabler Icons", description: "500+ open-source icons" },
  { value: "phosphor", label: "Phosphor", description: "Flexible, multi-weight" },
  { value: "material", label: "Material Symbols", description: "Google's icon system" },
  { value: "iconify", label: "Iconify", description: "200k+ icons, universal adapter" },
  { value: "none", label: "None", description: "Custom SVGs only" },
];

const themeOptions = [
  { value: "light-only", label: "Light only", description: "Single light theme" },
  { value: "dark-only", label: "Dark only", description: "Single dark theme" },
  { value: "light-dark", label: "Light + Dark", description: "Ship both; user toggles" },
  { value: "system", label: "Follow system", description: "Auto via prefers-color-scheme" },
];

export function DesignSystemStep() {
  const { designSystem, updateDesignSystem } = useWizardStore();
  const onBack = useStepBack();

  return (
    <div>
      <StepHeader
        stepNumber={3}
        title="Design System"
        description="Define your visual foundation. These choices generate ready-to-use CSS tokens and a Tailwind config."
        onBack={onBack}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-12">
          <Section id="accentColor" title="Accent Color" icon={<Droplet size={18} />} iconColor="text-rose-600 dark:text-rose-400">
            <ColorPicker
              label=""
              value={designSystem.accentColorHex}
              onChange={(hex) => updateDesignSystem({ accentColorHex: hex })}
            />
          </Section>

          <Section id="neutralPalette" title="Neutral Palette" icon={<Contrast size={18} />} iconColor="text-zinc-600 dark:text-zinc-400">
            <RadioGroup
              options={neutralOptions}
              value={designSystem.neutralPalette}
              onChange={(v) =>
                updateDesignSystem({ neutralPalette: v as DesignSystemData["neutralPalette"] })
              }
              columns={4}
            />
          </Section>

          <Section id="fontFamily" title="Font Family" icon={<Type size={18} />} iconColor="text-blue-600 dark:text-blue-400">
            <RadioGroup
              options={fontOptions}
              value={designSystem.fontFamily}
              onChange={(v) =>
                updateDesignSystem({ fontFamily: v as DesignSystemData["fontFamily"] })
              }
              columns={4}
            />
          </Section>

          <Section id="radiusScale" title="Border Radius" icon={<SquareRoundCorner size={18} />} iconColor="text-teal-600 dark:text-teal-400">
            <RadioGroup
              options={radiusOptions}
              value={designSystem.radiusScale}
              onChange={(v) =>
                updateDesignSystem({ radiusScale: v as DesignSystemData["radiusScale"] })
              }
              columns={3}
            />
          </Section>

          <Section id="spacingBase" title="Spacing Base Unit" icon={<Ruler size={18} />} iconColor="text-indigo-600 dark:text-indigo-400">
            <RadioGroup
              options={spacingOptions}
              value={String(designSystem.spacingBase)}
              onChange={(v) =>
                updateDesignSystem({ spacingBase: Number(v) as DesignSystemData["spacingBase"] })
              }
              columns={4}
            />
          </Section>

          <Section id="shadowDepth" title="Shadow Depth" icon={<Layers size={18} />} iconColor="text-purple-600 dark:text-purple-400">
            <RadioGroup
              options={shadowOptions}
              value={designSystem.shadowDepth}
              onChange={(v) =>
                updateDesignSystem({ shadowDepth: v as DesignSystemData["shadowDepth"] })
              }
              columns={3}
            />
          </Section>

          {/* Optional: icon library + theme strategy */}
          <Collapsible
            title="Icon Library & Theme"
            description="Pick an icon set and your theme policy — both optional"
            icon={<Shapes size={20} />}
            iconColor="text-amber-600 dark:text-amber-400"
          >
            <div className="space-y-10 mt-4">
              <Field
                icon={<Library size={18} />}
                iconColor="text-violet-600 dark:text-violet-400"
                label="Icon Library"
                description="Pick one and stick to it — mixing libraries adds visual inconsistency"
              >
                <RadioGroup
                  options={iconOptions}
                  value={designSystem.iconLibrary}
                  onChange={(v) =>
                    updateDesignSystem({ iconLibrary: v as DesignSystemData["iconLibrary"] })
                  }
                  columns={3}
                />
                {designSystem.iconLibrary === "iconify" && (
                  <p className="mt-2 text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 rounded-lg px-3 py-2">
                    Iconify gives you access to 200,000+ icons via <code>@iconify/react</code>. Make sure your bundler tree-shakes unused icons — import individually, not from the root package.
                  </p>
                )}
              </Field>

              <Field
                icon={<SunMoon size={18} />}
                iconColor="text-amber-600 dark:text-amber-400"
                label="Theme Strategy"
                description="Project-level decision — documents the intended theme policy, not a full implementation"
              >
                <RadioGroup
                  options={themeOptions}
                  value={designSystem.themeStrategy}
                  onChange={(v) =>
                    updateDesignSystem({ themeStrategy: v as DesignSystemData["themeStrategy"] })
                  }
                  columns={2}
                />
              </Field>
            </div>
          </Collapsible>
        </div>

        {/* ── Live preview panel ── */}
        <div className="w-full lg:w-110 lg:shrink-0 lg:sticky lg:top-4">
          <DesignPreview designSystem={designSystem} />
        </div>
      </div>
    </div>
  );
}
