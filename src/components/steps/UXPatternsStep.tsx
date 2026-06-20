"use client";

import { useWizardStore } from "@/store";
import { StepHeader } from "@/components/wizard/StepHeader";
import { useStepBack } from "@/components/wizard/useStepBack";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Checkbox } from "@/components/ui/Checkbox";
import { Collapsible } from "@/components/ui/Collapsible";
import { Section } from "@/components/ui/Section";
import { UXExamples } from "@/components/steps/previews/UXExamples";
import { Loader, Inbox, CircleCheck, CircleAlert, Component, Smartphone, SlidersHorizontal } from "lucide-react";
import type { UXPatternsData, SharedComponentsData } from "@/types";

export function isUXPatternsComplete(_u: UXPatternsData): boolean {
  return true;
}

const loadingOptions = [
  { value: "skeleton", label: "Skeleton", description: "Placeholder shapes while loading", recommended: true },
  { value: "spinner", label: "Spinner", description: "Circular loading indicator" },
  { value: "progress-bar", label: "Progress Bar", description: "Top-of-page NProgress style" },
];

const emptyOptions = [
  { value: "illustration", label: "Illustration", description: "SVG art for zero-state pages" },
  { value: "icon-text", label: "Icon + Text", description: "Simple icon with message", recommended: true },
  { value: "text-only", label: "Text only", description: "Minimal, just copy" },
];

const successOptions = [
  { value: "toast", label: "Toast", description: "Non-blocking, auto-dismisses", recommended: true },
  { value: "snackbar", label: "Snackbar", description: "Bottom-bar with optional action" },
  { value: "redirect", label: "Redirect", description: "Navigate to success page" },
];

const confirmOptions = [
  { value: "modal", label: "Modal dialog", description: "\"Are you sure?\" pattern", recommended: true },
  { value: "inline", label: "Inline confirm", description: "Button becomes confirm/cancel" },
  { value: "none", label: "None", description: "Destructive actions are immediate" },
];

const errorStateOptions = [
  { value: "toast", label: "Toast", description: "Non-intrusive notification" },
  { value: "inline", label: "Inline", description: "Error displayed near the trigger" },
  { value: "full-page", label: "Full-page", description: "Dedicated error view" },
];

const paginationOptions = [
  { value: "offset", label: "Offset / Pages", description: "Page 1, 2, 3…", recommended: true },
  { value: "cursor", label: "Cursor-based", description: "Scalable for large datasets" },
  { value: "infinite-scroll", label: "Infinite Scroll", description: "Load more on scroll" },
];

const modalDrawerOptions = [
  { value: "modal", label: "Prefer Modal", description: "Centered dialog overlay" },
  { value: "drawer", label: "Prefer Drawer", description: "Side-panel overlay" },
  { value: "context", label: "Context-dependent", description: "Decide per use case" },
];

const fileUploadOptions = [
  { value: "native", label: "Native input", description: "Standard <input type=file>" },
  { value: "drag-drop", label: "Drag & drop", description: "Dropzone with visual feedback" },
  { value: "none", label: "Not needed", description: "No file uploads in this app" },
];

const filteringOptions = [
  { value: "toolbar", label: "Toolbar", description: "Filters above the list", recommended: true },
  { value: "sidebar", label: "Sidebar", description: "Filter panel on the left" },
  { value: "inline", label: "Inline", description: "Filters inside the list/table" },
];

const mobileNavOptions = [
  { value: "hamburger", label: "Hamburger", description: "Top-right menu icon" },
  { value: "bottom-bar", label: "Bottom bar", description: "Mobile tab navigation" },
  { value: "drawer", label: "Drawer", description: "Slide-in side menu" },
];

const layoutStrategyOptions = [
  { value: "mobile-first", label: "Mobile first", description: "Design for small screens, scale up", recommended: true },
  { value: "desktop-first", label: "Desktop first", description: "Design for large screens, scale down" },
];

const breakpointStrategyOptions = [
  { value: "framework-defaults", label: "Framework defaults", description: "Use Tailwind sm/md/lg/xl breakpoints", recommended: true },
  { value: "custom", label: "Custom breakpoints", description: "Define your own breakpoint scale" },
];

const SHARED_COMPONENTS: SharedComponentsData["planned"] = [
  "Button", "Input", "Select", "Modal", "Table", "DataTable",
  "Toast", "Tabs", "Card", "Avatar", "Pagination",
];

export function UXPatternsStep() {
  const { uxPatterns, sharedComponents, updateUXPatterns, updateSharedComponents } = useWizardStore();
  const onBack = useStepBack();

  const toggleComponent = (name: SharedComponentsData["planned"][number]) => {
    const current = sharedComponents.planned;
    const next = current.includes(name)
      ? current.filter((c) => c !== name)
      : [...current, name];
    updateSharedComponents({ planned: next });
  };

  return (
    <div>
      <StepHeader
        stepNumber={5}
        title="UX Patterns"
        description="Define how your UI communicates with users. Consistent patterns reduce cognitive load."
        onBack={onBack}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
        {/* ── Form controls ── */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* Shared Components */}
          <Collapsible
            title="Planned Shared Components"
            description="Which UI components will you build into a shared library?"
            icon={<Component size={16} />}
          >
            <div className="grid grid-cols-2 gap-2 mt-4 sm:grid-cols-3">
              {SHARED_COMPONENTS.map((name) => (
                <Checkbox
                  key={name}
                  label={name}
                  checked={sharedComponents.planned.includes(name)}
                  onChange={() => toggleComponent(name)}
                />
              ))}
            </div>
            {sharedComponents.planned.length > 0 && (
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {sharedComponents.planned.length} component{sharedComponents.planned.length !== 1 ? "s" : ""} planned: {sharedComponents.planned.join(", ")}
              </p>
            )}
          </Collapsible>

          {/* Core UX patterns */}
          <Section id="loadingPattern" title="Loading State Pattern" icon={<Loader size={14} />}>
            <RadioGroup
              options={loadingOptions}
              value={uxPatterns.loadingPattern}
              onChange={(v) => updateUXPatterns({ loadingPattern: v as UXPatternsData["loadingPattern"] })}
              columns={3}
            />
          </Section>

          <Section id="emptyStateStyle" title="Empty State Style" icon={<Inbox size={14} />}>
            <RadioGroup
              options={emptyOptions}
              value={uxPatterns.emptyStateStyle}
              onChange={(v) => updateUXPatterns({ emptyStateStyle: v as UXPatternsData["emptyStateStyle"] })}
              columns={3}
            />
          </Section>

          <Section id="successFeedback" title="Success Feedback" icon={<CircleCheck size={14} />}>
            <RadioGroup
              options={successOptions}
              value={uxPatterns.successFeedback}
              onChange={(v) => updateUXPatterns({ successFeedback: v as UXPatternsData["successFeedback"] })}
              columns={3}
            />
          </Section>

          <Section id="confirmationPattern" title="Destructive Action Confirmation" icon={<CircleAlert size={14} />}>
            <RadioGroup
              options={confirmOptions}
              value={uxPatterns.confirmationPattern}
              onChange={(v) => updateUXPatterns({ confirmationPattern: v as UXPatternsData["confirmationPattern"] })}
              columns={3}
            />
          </Section>

          {/* Responsive Design */}
          <Collapsible
            title="Responsive Design"
            description="Layout philosophy and breakpoint approach"
            icon={<Smartphone size={16} />}
          >
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Layout Strategy
                </label>
                <RadioGroup
                  options={layoutStrategyOptions}
                  value={uxPatterns.layoutStrategy}
                  onChange={(v) => updateUXPatterns({ layoutStrategy: v as UXPatternsData["layoutStrategy"] })}
                  columns={2}
                />
                {uxPatterns.layoutStrategy === "mobile-first" && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Mobile first aligns with Tailwind&apos;s default responsive utilities (sm:, md:, lg:) — styles apply from small up.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Breakpoint Strategy
                </label>
                <RadioGroup
                  options={breakpointStrategyOptions}
                  value={uxPatterns.breakpointStrategy}
                  onChange={(v) => updateUXPatterns({ breakpointStrategy: v as UXPatternsData["breakpointStrategy"] })}
                  columns={2}
                />
              </div>
            </div>
          </Collapsible>

          {/* Frontend Conventions */}
          <Collapsible
            title="Frontend Conventions"
            description="Standardize recurring UI decisions across the whole app"
            icon={<SlidersHorizontal size={16} />}
          >
            {/* errorState anchor for jump-to-field */}
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Error State Display
                </label>
                <RadioGroup
                  options={errorStateOptions}
                  value={uxPatterns.errorState}
                  onChange={(v) => updateUXPatterns({ errorState: v as UXPatternsData["errorState"] })}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Pagination Style
                </label>
                <RadioGroup
                  options={paginationOptions}
                  value={uxPatterns.paginationStyle}
                  onChange={(v) => updateUXPatterns({ paginationStyle: v as UXPatternsData["paginationStyle"] })}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Modal vs Drawer Preference
                </label>
                <RadioGroup
                  options={modalDrawerOptions}
                  value={uxPatterns.modalVsDrawer}
                  onChange={(v) => updateUXPatterns({ modalVsDrawer: v as UXPatternsData["modalVsDrawer"] })}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  File Upload
                </label>
                <RadioGroup
                  options={fileUploadOptions}
                  value={uxPatterns.fileUpload}
                  onChange={(v) => updateUXPatterns({ fileUpload: v as UXPatternsData["fileUpload"] })}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  List / Table Filtering Pattern
                </label>
                <RadioGroup
                  options={filteringOptions}
                  value={uxPatterns.filteringPattern}
                  onChange={(v) => updateUXPatterns({ filteringPattern: v as UXPatternsData["filteringPattern"] })}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2 dark:text-zinc-300">
                  Mobile Navigation
                </label>
                <RadioGroup
                  options={mobileNavOptions}
                  value={uxPatterns.mobileNavigation}
                  onChange={(v) => updateUXPatterns({ mobileNavigation: v as UXPatternsData["mobileNavigation"] })}
                  columns={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Checkbox
                  label="Search debounce"
                  description="Debounce all search inputs (300ms default)"
                  checked={uxPatterns.searchDebounce}
                  onChange={() => updateUXPatterns({ searchDebounce: !uxPatterns.searchDebounce })}
                />
                <Checkbox
                  label="Breadcrumbs"
                  description="Show breadcrumb navigation on deep pages"
                  checked={uxPatterns.breadcrumbs}
                  onChange={() => updateUXPatterns({ breadcrumbs: !uxPatterns.breadcrumbs })}
                />
              </div>
            </div>
          </Collapsible>
        </div>

        {/* ── Interaction examples panel ── */}
        <div className="w-full lg:w-110 lg:shrink-0 lg:sticky lg:top-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Interaction Examples
          </p>
          <UXExamples uxPatterns={uxPatterns} />
        </div>
      </div>
    </div>
  );
}
