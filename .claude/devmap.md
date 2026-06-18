# Frontend Decision Engine — Developer Map

A navigation guide to the codebase. Updated after the changes.md implementation (2026-06-18).

---

## Product Philosophy

**Before:** Think → Document → Export

**After:** Think → Validate → Visualize → Document → Apply

The wizard is not a code generator. It produces documentation, design tokens, and an installer script that scaffolds a project using official framework tooling.

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout
│   ├── page.tsx                Landing page (/)
│   └── wizard/page.tsx         Wizard shell (/wizard)
│
├── components/
│   ├── steps/
│   │   ├── ProjectStep.tsx         Step 1 — framework, stack, language
│   │   ├── ArchitectureStep.tsx    Step 2 — folder strategy, naming, aliases
│   │   ├── DesignSystemStep.tsx    Step 3 — colors, fonts, radius, spacing
│   │   ├── StandardsStep.tsx       Step 4 — testing, linting, error handling
│   │   ├── UXPatternsStep.tsx      Step 5 — loading, empty, feedback, confirm
│   │   ├── PreviewStep.tsx         Step 6 — full visual system review
│   │   ├── ExportStep.tsx          Step 7 — file manifest + download
│   │   └── previews/               Contextual preview panels (one per step)
│   │       ├── DesignPreview.tsx   Live component gallery (Design System step)
│   │       ├── FolderTree.tsx      Live folder structure tree (Architecture step)
│   │       ├── QualitySummary.tsx  Quality tier + standards summary (Standards step)
│   │       └── UXExamples.tsx      Animated interaction examples (UX Patterns step)
│   │
│   ├── wizard/
│   │   ├── WizardShell.tsx     Main layout: header + sidebar + footer
│   │   ├── StepHeader.tsx      Step number, title, description
│   │   ├── StepNav.tsx         Left sidebar navigation with completion state
│   │   ├── StepFooter.tsx      Back/Next/Download buttons + progress bar
│   │   └── AdvisorPanel.tsx    Top-right violations panel (rule engine output)
│   │
│   └── ui/                     14 reusable primitives (no third-party library)
│       Button, Badge, Card, Checkbox, ColorPicker, Input, Label,
│       Progress, RadioGroup, Select, Slider, Switch, Tabs, Tooltip
│
├── export/
│   ├── index.ts                Re-exports triggerZipDownload
│   ├── zip.ts                  Assembles and downloads the ZIP (9 files)
│   └── generators/
│       ├── guidelines.ts       → PROJECT_GUIDELINES.md
│       ├── aiContext.ts        → AI_CONTEXT.md
│       ├── why.ts              → WHY.md
│       ├── readme.ts           → README.md
│       ├── config.ts           → project-config.json
│       ├── tokensCss.ts        → tokens.css
│       ├── tokensTailwind.ts   → tokens.tailwind.json
│       ├── gitignore.ts        → .gitignore
│       └── applyBlueprint.ts   → apply-blueprint.js  ← added in changes.md
│
├── rules/
│   ├── rules.ts                15 Rule objects (data-driven, no class hierarchy)
│   └── evaluate.ts             evaluate(state) → Violation[]
│
├── store/
│   ├── wizardStore.ts          useWizardStore — Zustand + persist middleware
│   ├── defaults.ts             Default values for all 5 step data objects
│   └── index.ts                Re-export
│
├── tokens/
│   └── derive.ts               Color math, WCAG contrast, token derivation
│
├── types/
│   └── index.ts                All shared TypeScript types + re-exports
│
└── lib/
    └── utils.ts                cn(), slugify()
```

---

## Key Patterns

### Step Layout (two-column)

Steps 2–5 now use a two-column layout:
- **Left** (`flex-1`): form controls (RadioGroup, ColorPicker, Checkbox, etc.)
- **Right** (`w-72 shrink-0 sticky top-4`): contextual preview panel

All preview panels are pure components — they receive props from the parent step, never access the store directly.

### Preview Panel Props

| Panel | Import | Props |
|---|---|---|
| `DesignPreview` | `previews/DesignPreview` | `{ designSystem: DesignSystemData }` |
| `FolderTree` | `previews/FolderTree` | `{ architecture: ArchitectureData }` |
| `QualitySummary` | `previews/QualitySummary` | `{ standards: StandardsData }` |
| `UXExamples` | `previews/UXExamples` | `{ uxPatterns: UXPatternsData }` |

### Token Derivation

`deriveTokens(ds: DesignSystemData)` in `src/tokens/derive.ts` returns `DerivedTokens`:

```typescript
{
  accent: Record<"50"|"100"|...|"900", string>  // hex values
  fontFamily: string                              // CSS font stack
  radius: Record<"sm"|"md"|"lg"|"xl"|"full", string>
  shadow: Record<"sm"|"md"|"lg", string>
  spacing: Record<"1"|"2"|...|"24", string>
  spacingBase: number
  contrastOnWhite: Record<string, "AAA"|"AA"|"FAIL">   // ← added
  contrastOnBlack: Record<string, "AAA"|"AA"|"FAIL">   // ← added
}
```

WCAG helpers (all exported from `derive.ts`):
- `getRelativeLuminance(hex)` — WCAG 2.1 linearization
- `getContrastRatio(hex1, hex2)` — (L1 + 0.05) / (L2 + 0.05)
- `getWCAGLevel(ratio)` → `"AAA" | "AA" | "FAIL"`

### Rule Engine

`evaluate({ project, architecture, standards })` → `Violation[]`

Rules live in `src/rules/rules.ts` as a flat array of `Rule` objects with a `check(state)` function. Add new rules by appending to the array — no class hierarchy, no registration step.

Only `updateProject`, `updateArchitecture`, and `updateStandards` trigger rule evaluation. Design system and UX patterns are not checked.

### Export Generator Pattern

All generators are pure functions:

```typescript
export function generateX(state: WizardState): string | object
```

To add a new export file:
1. Create `src/export/generators/yourFile.ts`
2. Export `generateYourFile(state: WizardState): string`
3. Import and call in `src/export/zip.ts` → `zip.file("your-file.ext", generateYourFile(state))`

### State Persistence

- Key: `fde-session-v1` (localStorage)
- `schemaVersion` field allows future migrations in the `onRehydrateStorage` hook in `wizardStore.ts`
- `violations` are excluded from persistence and recomputed on load

---

## ZIP Contents (9 files after changes.md)

| File | Generator | Purpose |
|---|---|---|
| `PROJECT_GUIDELINES.md` | `guidelines.ts` | Human-readable architecture reference |
| `AI_CONTEXT.md` | `aiContext.ts` | Paste into AI assistant context window |
| `WHY.md` | `why.ts` | Decision rationale |
| `README.md` | `readme.ts` | Quick-start guide with correct commands |
| `project-config.json` | `config.ts` | Machine-readable full state |
| `tokens.css` | `tokensCss.ts` | CSS custom properties |
| `tokens.tailwind.json` | `tokensTailwind.ts` | Tailwind 4 `@theme` block |
| `.gitignore` | `gitignore.ts` | Framework + PM aware ignore rules |
| `apply-blueprint.js` | `applyBlueprint.ts` | Node.js installer script ← **new** |

---

## apply-blueprint.js — How It Works

The installer is a self-contained Node.js CommonJS script (no dependencies). Users run it after unzipping the blueprint.

```
node apply-blueprint.js           # interactive (Y/n prompt)
node apply-blueprint.js --dry-run # print intentions, no files written
```

**Steps executed:**
1. Print blueprint summary
2. Y/n prompt (skipped in `--dry-run`)
3. Scaffold project via official create command
4. Install production dependencies (package manager aware)
5. Install dev dependencies
6. Create folder structure (based on `folderStrategy`)
7. Write placeholder files (`api.ts`, `constants.ts`, `queryClient.ts`, `store/index.ts`)
8. Copy `.md` docs to `{projectName}/docs/`
9. Copy `tokens.css` into `src/`; append `@import` to `globals.css`
10. Update `tsconfig.json` paths for aliases (if enabled)
11. Write `biome.json` / `.prettierrc` stubs (if selected)
12. Init husky (if selected)

**Philosophy:** every file write calls `writeIfMissing()` (checks `fs.existsSync` first). Config additions use `appendIfMissing()`. No destructive overwrites.

---

## What Is Intentionally Out of Scope

- Login pages, dashboards, CRUD, API logic, authentication implementation
- Business workflows or domain-specific components
- Team collaboration (requires backend — permanently out of scope)
- AI-generated content (deferred to v2)
- Dark mode (deferred to v1.1)
