# Rule Engine Design

The rule engine is the product's primary differentiator — conflict detection that a senior architect would catch.

---

## Architecture

**Pure function only.** No classes, no registry, no event system.

```
rules.ts (data) → evaluate.ts (function) → violations: Violation[]
```

`evaluate()` is called inside every `update*` store action automatically. No manual trigger needed.

---

## Types

```typescript
// src/rules/types.ts
export type RuleSeverity = 'error' | 'warning' | 'info';

export interface Rule {
  id: string;
  severity: RuleSeverity;
  title: string;
  message: string;              // Human-readable explanation + recommendation
  affectedSteps: WizardStep[];  // Which step tabs to highlight
  check: (state: CheckState) => boolean; // true = rule fires (violation found)
}

type CheckState = Pick<WizardState, 'project' | 'architecture' | 'standards'>;
```

---

## Evaluate Function

```typescript
// src/rules/evaluate.ts
import { rules } from './rules';

export function evaluate(state: CheckState): Violation[] {
  return rules
    .filter((rule) => rule.check(state))
    .map((rule) => ({
      ruleId: rule.id,
      severity: rule.severity,
      title: rule.title,
      message: rule.message,
      affectedSteps: rule.affectedSteps,
    }));
}
```

---

## Store Integration

```typescript
// In every update action in wizardStore.ts:
updateProject: (data) => {
  set((s) => ({
    project: { ...s.project, ...data },
    updatedAt: new Date().toISOString(),
  }));
  set((s) => ({ violations: evaluate(s) }));
},
```

Note: Two separate `set()` calls so the second reads the updated state from the first.

---

## The 15 MVP Rules

| ID | Severity | When it fires | User message |
|---|---|---|---|
| `dual-state-managers` | error | `stateManagement.length > 1` | "Multiple state managers selected. Choose one — combining Zustand and Redux Toolkit creates competing data flows and doubles bundle size." |
| `dual-form-libraries` | error | Multiple form libs selected (not 'none') | "Multiple form libraries selected. React Hook Form and Formik solve the same problem. Pick one." |
| `css-in-js-with-tailwind` | error | Tailwind + styled-components or emotion both selected | "CSS-in-JS and Tailwind conflict in practice. They create duplicate style systems and fight over specificity. Choose one." |
| `multiple-styling-systems` | error | `styling.length > 2` OR two opinionated systems both selected | "Too many styling solutions. Three styling approaches create unmaintainable CSS. Settle on one primary system." |
| `zod-with-yup` | error | Both Zod and Yup selected | "Zod and Yup are both schema validation libraries. There's no reason to use both. Zod is recommended (TypeScript-first)." |
| `formik-deprecated` | warning | Formik selected | "Formik is in maintenance mode with no active development. React Hook Form or TanStack Form are actively maintained alternatives." |
| `redux-with-rsc` | warning | Redux Toolkit selected + framework is 'next' | "Redux Toolkit stores state in a singleton that's incompatible with React Server Components. Consider Zustand or server state only." |
| `swr-with-graphql` | warning | SWR + GraphQL | "SWR was designed for REST. For GraphQL, React Query with a GraphQL client (urql, Apollo) is a better fit." |
| `no-testing` | warning | `testingUnit === 'none' && testingE2E === 'none'` | "No testing selected. Without tests, you have no safety net for refactors. Vitest is fast and easy to add." |
| `no-linting` | warning | `linting.length === 0` | "No linting configured. ESLint with a baseline config catches bugs before code review." |
| `e2e-no-unit` | info | E2E selected but `testingUnit === 'none'` | "E2E tests are slow feedback. Consider adding unit tests (Vitest) for fast inner-loop feedback alongside E2E." |
| `barrel-files-with-simple` | info | `barrelFiles === 'always' && folderStrategy === 'simple'` | "Barrel files in a flat folder structure add indirection with no benefit. Only use barrel files in feature-based structures." |
| `no-env-validation-with-next` | info | `envStrategy === 'dotenv-only' && framework === 'next'` | "Consider t3-env for runtime environment validation. Raw dotenv gives no type safety or startup error detection." |
| `no-date-lib-with-ssr` | info | `dateLibrary === 'native' && (framework === 'next' || framework === 'remix')` | "The native Date API has timezone inconsistencies between server and client. dayjs or date-fns handle this correctly." |
| `jwt-manual` | info | `authApproach === 'jwt'` | "Manual JWT implementation has many security footguns (storage, refresh, rotation). Consider NextAuth.js or Clerk instead." |

---

## Rule Object Example

```typescript
// src/rules/rules.ts
import type { Rule } from './types';

export const rules: Rule[] = [
  {
    id: 'dual-state-managers',
    severity: 'error',
    title: 'Multiple state managers',
    message: 'Multiple state managers selected. Choose one — combining Zustand and Redux Toolkit creates competing data flows and doubles bundle size.',
    affectedSteps: ['project'],
    check: ({ project }) => project.stateManagement.filter((s) => s !== 'none').length > 1,
  },
  {
    id: 'css-in-js-with-tailwind',
    severity: 'error',
    title: 'CSS-in-JS conflicts with Tailwind',
    message: 'CSS-in-JS and Tailwind conflict in practice. They create duplicate style systems and fight over specificity. Choose one.',
    affectedSteps: ['project'],
    check: ({ project }) =>
      project.styling.includes('tailwind') &&
      (project.styling.includes('styled-components') || project.styling.includes('emotion')),
  },
  // ... 13 more
];
```

---

## AdvisorPanel Behavior

- Default state: **collapsed**
- Shows badge with violation count (red = has errors, yellow = warnings only, gray = no issues)
- Expanding shows a card per violation with severity color coding:
  - `error` → red left border + red badge
  - `warning` → amber left border + amber badge
  - `info` → blue left border + blue badge
- Each card shows: title, message, chip showing affected step name(s)
- Clicking affected step chip navigates to that step (`setStep()`)
