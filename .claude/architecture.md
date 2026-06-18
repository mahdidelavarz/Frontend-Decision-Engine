# Architecture Overview

## Product Mission

Frontend Decision Engine is a **decision-making tool**, not a code generator. It helps developers make and document all critical frontend architecture decisions before writing code. Outputs are documentation files, not generated projects.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Configured as static export |
| Language | TypeScript 5 (strict) | Interfaces defined first in `src/types/index.ts` |
| Styling | Tailwind CSS 4 | Uses `@theme inline` in CSS — no `tailwind.config.js` |
| State | Zustand + persist middleware | localStorage key: `fde-session-v1` |
| Icons | Lucide React | Tree-shakeable |
| Export | JSZip (lazy-loaded) | Dynamic import — only on export click |
| Font | Geist (already in layout) | Variable font, Google Fonts |

**No:** form libraries, UI component libraries, color libraries, animation libraries, date libraries, backend, auth, database.

---

## Static Export Configuration

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
};
```

This generates a static `out/` folder deployable to GitHub Pages, Cloudflare Pages, Netlify, Vercel.

---

## Routing

Two routes only:

- `/` — Home screen (New Blueprint / Restore Session)
- `/wizard` — Wizard shell (all steps, step driven by Zustand `currentStep`)

No per-step URLs. Browser Back from `/wizard` goes to `/`.

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, Geist font, metadata
│   ├── page.tsx                # Home screen
│   ├── globals.css             # Tailwind 4 + wizard UI design tokens
│   └── wizard/
│       └── page.tsx            # 'use client' — wizard shell
│
├── components/
│   ├── ui/                     # 14 generic primitives (no library)
│   ├── wizard/                 # WizardShell, StepNav, StepHeader, StepFooter, AdvisorPanel
│   └── steps/                  # One file per wizard step (8 total)
│
├── store/
│   └── wizardStore.ts          # Zustand store
│
├── rules/
│   ├── types.ts                # Rule, Violation types
│   ├── rules.ts                # 15+ rule definitions
│   └── evaluate.ts             # Pure function: state → Violation[]
│
├── export/
│   ├── generators/             # 8 generator functions (template literals)
│   └── zip.ts                  # JSZip bundler
│
├── tokens/
│   ├── derive.ts               # DesignSystemData → DerivedTokens (pure)
│   └── constants.ts            # HSL lightness maps, spacing maps
│
├── lib/
│   ├── utils.ts                # cn() helper
│   └── constants.ts            # Step order, option lists
│
└── types/
    └── index.ts                # ALL TypeScript interfaces — write this first
```

---

## SSR / Client Boundary

The wizard uses localStorage. Mark `src/app/wizard/page.tsx` as `'use client'`. This prevents SSR hydration mismatches with Zustand's persist middleware.

Do NOT use `skipHydration` — `'use client'` boundary is simpler and equally correct.

---

## Tailwind 4 Token Layer

`globals.css` has two distinct sections:

```css
/* 1. Wizard UI tokens (this product's own design system) */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... wizard UI tokens here */
}

/* 2. User-configured preview tokens (applied inline on PreviewStep container) */
/* DO NOT put user tokens in @theme — they're applied as inline styles */
```

User's design token choices are applied as `style={{ '--accent-500': '#3b82f6' }}` on the `PreviewStep` container div — never touching the wizard's own theme.
