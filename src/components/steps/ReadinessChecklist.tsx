"use client";

import type { WizardState } from "@/types";

interface ChecklistItem {
  label: string;
  done: boolean;
  note?: string;
}

function buildChecklist(state: WizardState): ChecklistItem[] {
  const { project, designSystem, standards, teamAgreements, sharedComponents } = state;

  return [
    {
      label: "Stack defined",
      done: !!project.framework && project.styling.length > 0,
      note: !project.framework ? "Select a framework" : project.styling.length === 0 ? "Select a styling approach" : undefined,
    },
    {
      label: "Design system configured",
      done: !!designSystem.accentColorHex && !!designSystem.fontFamily && !!designSystem.radiusScale,
    },
    {
      label: "Theme strategy selected",
      done: !!designSystem.themeStrategy,
      note: "Pick a theme policy in Design System → Icon Library & Theme",
    },
    {
      label: "Accessibility target defined",
      done: !!standards.accessibilityTarget,
      note: "Set a WCAG target in Standards → Quality Targets",
    },
    {
      label: "Testing strategy selected",
      done: standards.testingUnit !== "none" || standards.testingE2E !== "none",
      note: "No testing configured — add at least unit tests",
    },
    {
      label: "Linting configured",
      done: standards.linting.length > 0,
      note: "No code quality tools selected",
    },
    {
      label: "Shared components planned",
      done: sharedComponents.planned.length > 0,
      note: "Optional — plan your shared component library in UX Patterns",
    },
    {
      label: "Team agreements configured",
      done: Object.values(teamAgreements).some((v) => v === true),
      note: "Optional — add coding standards in Standards → Team Agreements",
    },
    {
      label: "AI context ready",
      done: true,
    },
    {
      label: "Localization strategy defined",
      done: !!project.localization,
      note: "Set in Project → Internationalization (choose None if single-language)",
    },
    {
      label: "Browser support defined",
      done: !!standards.browserSupport,
      note: "Set in Standards → Quality Targets",
    },
    {
      label: "Deployment target selected",
      done: !!project.deploymentTarget && project.deploymentTarget !== "not-decided",
      note: "Set in Project → Advanced Options",
    },
  ];
}

interface Props {
  state: WizardState;
}

export function ReadinessChecklist({ state }: Props) {
  const items = buildChecklist(state);
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  const pctColor =
    pct >= 90
      ? "text-emerald-700 dark:text-emerald-400"
      : pct >= 60
      ? "text-amber-700 dark:text-amber-400"
      : "text-red-700 dark:text-red-400";

  const barColor =
    pct >= 90
      ? "bg-emerald-500"
      : pct >= 60
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="rounded-xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Project Readiness Checklist
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Informational only — export is always available
          </p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <span className={`text-lg font-bold ${pctColor}`}>{pct}%</span>
          <p className="text-xs text-zinc-400">{doneCount}/{items.length} complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Items */}
      <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60 px-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 py-2.5">
            <span
              className={`mt-0.5 text-sm shrink-0 ${
                item.done ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"
              }`}
            >
              {item.done ? "✓" : "⚠"}
            </span>
            <div className="min-w-0">
              <p
                className={`text-xs font-medium ${
                  item.done
                    ? "text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {item.label}
              </p>
              {!item.done && item.note && (
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{item.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
