# Development Roadmap

## Overview

**Status (2026-06-18):** MVP complete. All 4 phases shipped. Phase 5 (changes.md) complete.

**Principle:** Ship a working product in Phase 3. Phase 4 is polish. Phase 5 upgraded visualization, accessibility, and added the blueprint installer.

---

## Phase 1 — Foundation (Days 1-4) ✓ COMPLETE

Goal: Navigable shell with real persistence. No step content yet.

### Tasks

- [ ] `next.config.ts` — add `output: 'export'`
- [ ] `src/types/index.ts` — write ALL interfaces first. Nothing else until this is done.
- [ ] `src/store/wizardStore.ts` — Zustand store with all 5 data slices, localStorage persist, migration stub
- [ ] `src/store/defaults.ts` — sensible default values for all slices
- [ ] Install dependencies: `npm install zustand jszip lucide-react`
- [ ] `src/components/ui/` — all 14 UI primitives:
  - Button (variants: primary, secondary, ghost, destructive; sizes: sm, md, lg)
  - Badge (variants: default, warning, error, info)
  - Card
  - Checkbox
  - ColorPicker (HTML color input + hex text field, synced)
  - Input
  - Label
  - Progress
  - RadioGroup (card-style — main selection pattern for wizard choices)
  - Select (native `<select>` with custom chevron)
  - Slider (for spacing/radius scale)
  - Switch
  - Tabs
  - Tooltip (CSS absolute-positioned, hover-triggered)
- [ ] `src/components/wizard/WizardShell.tsx` — CSS Grid layout: aside (StepNav) | main | aside (AdvisorPanel)
- [ ] `src/components/wizard/StepNav.tsx` — vertical step list with completion dots; clicking completed step navigates
- [ ] `src/components/wizard/StepHeader.tsx` — h1 + description + step number badge
- [ ] `src/components/wizard/StepFooter.tsx` — sticky bar: Back | step counter | Next
- [ ] `src/app/page.tsx` — Home screen: "New Blueprint" + "Restore Session" (show if localStorage key exists)
- [ ] `src/app/wizard/page.tsx` — `'use client'`; reads `currentStep` from store, renders matching step component (placeholder divs for each step)
- [ ] Manual test: navigate through all steps (empty), verify localStorage saves/restores

**Deliverable:** Shell is navigable, state persists, each step shows a placeholder.

---

## Phase 2 — Wizard Steps (Days 5-9) ✓ COMPLETE

Goal: Complete wizard flow. No export, no rule engine.

### Tasks

- [ ] `ProjectStep.tsx` — all fields: projectName, framework, language, stateManagement (multi-select via RadioGroup), serverState, apiClient, apiStyle, formLibrary, validation, styling (multi-select), packageManager
- [ ] `ArchitectureStep.tsx` — folderStrategy, namingConvention, pathAliases + aliasRoot, envStrategy, barrelFiles
- [ ] `DesignSystemStep.tsx` — ColorPicker for accentColorHex, neutralPalette, fontFamily, radiusScale (Slider or RadioGroup), spacingBase, shadowDepth
- [ ] `StandardsStep.tsx` — errorHandling, retryPolicy, logging, testingUnit, testingE2E, linting (multi-select checkboxes), gitStrategy, authApproach, dateLibrary
- [ ] `UXPatternsStep.tsx` — loadingPattern, emptyStateStyle, successFeedback, confirmationPattern
- [ ] `PreviewStep.tsx` — call `deriveTokens()` + display:
  - Color swatches: 10-step accent palette grid
  - Typography sample: heading, body, code in selected font
  - Spacing visualization: row of boxes at each spacing step
  - Radius preview: corners showing each radius value
  - Shadow preview: cards showing each shadow depth
- [ ] `ExportStep.tsx` — file checklist (8 files, name + description + disabled Download button as placeholder)
- [ ] Wire step completion: each step has a `isComplete(data)` predicate; StepFooter disables Next when false
- [ ] `src/tokens/derive.ts` — full derivation function + HSL color scale math
- [ ] Manual test: complete entire flow, verify PreviewStep updates with design choices

**Deliverable:** Full wizard flow works end-to-end. Export button is visible but disabled.

---

## Phase 3 — Rule Engine + Export (Days 10-13) ✓ COMPLETE

Goal: Fully working product.

### Tasks

- [ ] `src/rules/types.ts` — Rule, Violation interfaces
- [ ] `src/rules/evaluate.ts` — pure evaluate() function
- [ ] `src/rules/rules.ts` — all 15 rules (see rule-engine.md for full list)
- [ ] Wire `evaluateRules` into every `update*` store action
- [ ] `src/components/wizard/AdvisorPanel.tsx` — collapsible panel with violation cards; badge count on trigger button
- [ ] Write all WHY.md rationale paragraphs (this is COPY, not code — budget a full day)
- [ ] `src/export/generators/guidelines.ts`
- [ ] `src/export/generators/aiContext.ts`
- [ ] `src/export/generators/why.ts`
- [ ] `src/export/generators/readme.ts`
- [ ] `src/export/generators/config.ts`
- [ ] `src/export/generators/tokensCss.ts`
- [ ] `src/export/generators/tokensTailwind.ts`
- [ ] `src/export/generators/gitignore.ts`
- [ ] `src/export/zip.ts` — JSZip bundler with lazy import
- [ ] Wire ExportStep "Download All" button to `triggerZipDownload()`
- [ ] Manual test: complete wizard → download ZIP → unzip → verify all 8 files have real content
- [ ] Manual test: trigger each of the 15 rules → verify correct violation appears in AdvisorPanel

**Deliverable:** Fully functional product. The product works.

---

## Phase 4 — Polish + Deploy (Days 14-16) ✓ COMPLETE

Goal: Public URL, accessible, professional.

### Tasks

- [ ] `src/app/layout.tsx` — update metadata (title, description, OG tags, favicon)
- [ ] Accessibility pass: keyboard navigation through all steps, focus management on step change, ARIA labels on icon-only buttons
- [ ] Responsive: test at 768px, 1024px, 1440px. Wizard is minimum 768px wide (dev tool, not mobile)
- [ ] Error states: empty projectName on export, invalid hex color, session restore failure
- [ ] Loading state: brief spinner while ZIP is generating (JSZip is async)
- [ ] `next.config.ts` — confirm `output: 'export'` is correct
- [ ] Run `npm run build` — fix any build errors (type errors, missing `'use client'` directives)
- [ ] `npm run lint` — fix all lint errors
- [ ] Deploy to Vercel (or GitHub Pages)
- [ ] Test deployed URL: full flow, ZIP download, restore session
- [ ] Update `README.md` in repo with: what the product is, how to run locally, how to deploy

**Deliverable:** Public URL, shareable.

---

---

## Phase 5 — changes.md Upgrades ✓ COMPLETE (2026-06-18)

Goal: Distributed preview philosophy, accessibility, and blueprint application.

### Delivered

- [x] **WCAG contrast** — `derive.ts` now computes AA/AAA/FAIL for all 10 accent shades vs white and black; exported as `contrastOnWhite` / `contrastOnBlack` on `DerivedTokens`
- [x] **DesignSystemStep live preview** — two-column layout; sticky right panel shows buttons, card, form input, badges, alerts, empty state, and contrast strip with accessibility badges; updates on every token change
- [x] **ArchitectureStep folder tree** — dark terminal-style tree in right panel; updates live with folder strategy, naming convention, alias settings
- [x] **StandardsStep quality summary** — quality tier badge (Comprehensive / Standard / Minimal) + 10 detail rows; updates on every change
- [x] **UXPatternsStep interaction examples** — animated skeleton/spinner/progress-bar, empty state variants, toast/snackbar/redirect, modal/inline confirmation; all CSS-only
- [x] **PreviewStep full visual system** — expanded to: accent scale, WCAG contrast table, typography, component gallery (buttons, card, form, badges, alerts), radius/shadow, spacing scale, UX pattern summary cards, standards summary table
- [x] **apply-blueprint.js** — new 9th export file; Node.js zero-dependency installer with `--dry-run`, Y/n prompt, additive-only writes, 7 scaffolding steps
- [x] **devmap.md** — architecture map written to `.claude/devmap.md`

---

## v1.1 Backlog (post-launch)

These are ready to implement once v1 ships:

1. **Stack Presets** — Modern React, Minimal, Enterprise. Pre-fill all wizard steps from preset data object.
2. **Share via URL** — Base64-encode wizard state in query param. No backend. Shareable between teammates.
3. **Copy file to clipboard** — Individual file copy button on ExportStep.
4. **Keyboard shortcut** — Cmd/Ctrl+Enter to advance wizard step.
5. **Import Blueprint** — Read `project-config.json` to restore all decisions (the JSON schema is already designed for this).
6. **More rules** — Community-submitted conflict rules beyond the initial 15.

---

## Technical Risks (Quick Reference)

| Risk | Mitigation |
|---|---|
| JSZip ~90KB bundle | `await import('jszip')` — lazy load on click only |
| Tailwind 4 vs Tailwind 3 confusion | Comment tokens clearly; ban `tailwind.config.js` |
| Zustand SSR mismatch | `'use client'` on wizard page — no `skipHydration` needed |
| Ugly accent color at extremes | Clamp HSL: L50=96%, L900=15%, saturation ≤85% |
| WHY.md feels generic | 2-4 sentences per option, written by hand — this is a copy problem |
| Missing `'use client'` on components that use browser APIs | Add to: wizard/page.tsx, AdvisorPanel, ExportStep, PreviewStep |

---

## Definition of Done (MVP)

- [ ] Complete wizard flow from Home to Export without errors
- [ ] All 8 export files in ZIP contain real, project-specific content
- [ ] AdvisorPanel shows violations when conflicting choices are made
- [ ] Session restored correctly after browser close/reopen
- [ ] `npm run build` passes with zero errors
- [ ] Deployed URL works without local Node.js server
