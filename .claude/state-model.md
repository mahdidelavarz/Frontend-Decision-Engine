# State Model

Complete TypeScript interfaces for the Zustand store. Write `src/types/index.ts` first — everything else imports from here.

---

## Schema Versioning

```typescript
export const SCHEMA_VERSION = 1;
```

On localStorage rehydration, check `state.schemaVersion < SCHEMA_VERSION` and call a `migrate()` function. In v1, migrate is a no-op. Add cases as the schema evolves.

---

## Step Enum

```typescript
export type WizardStep =
  | 'home'
  | 'project'
  | 'architecture'
  | 'design-system'
  | 'standards'
  | 'ux-patterns'
  | 'preview'
  | 'export';

export const STEP_ORDER: WizardStep[] = [
  'home', 'project', 'architecture', 'design-system',
  'standards', 'ux-patterns', 'preview', 'export'
];
```

---

## Step Data Interfaces

### ProjectData

```typescript
export interface ProjectData {
  projectName: string;
  framework: 'next' | 'vite-react' | 'remix' | 'astro' | 'sveltekit' | '';
  language: 'typescript' | 'javascript';
  stateManagement: Array<'zustand' | 'redux-toolkit' | 'jotai' | 'context-only' | 'none'>;
  serverState: 'react-query' | 'swr' | 'none';
  apiClient: 'axios' | 'fetch';
  apiStyle: 'rest' | 'graphql' | 'trpc';
  formLibrary: 'react-hook-form' | 'formik' | 'tanstack-form' | 'none';
  validation: 'zod' | 'yup' | 'none';
  styling: Array<'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'scss'>;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
}
```

### ArchitectureData

```typescript
export interface ArchitectureData {
  folderStrategy: 'feature-based' | 'layer-based' | 'simple';
  namingConvention: 'PascalCase' | 'kebab-case' | 'camelCase';
  pathAliases: boolean;
  aliasRoot: '@' | '~' | 'src' | 'none';
  envStrategy: 'dotenv-only' | 'schema-validated';
  barrelFiles: 'always' | 'never' | 'feature-level-only';
}
```

### DesignSystemData

```typescript
export interface DesignSystemData {
  accentColorHex: string;          // '#3b82f6' etc
  neutralPalette: 'zinc' | 'slate' | 'gray' | 'stone';
  fontFamily: 'geist' | 'inter' | 'roboto' | 'system';
  radiusScale: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacingBase: 4 | 8 | 12 | 16;   // base unit in px
  shadowDepth: 'flat' | 'subtle' | 'elevated';
}
```

### StandardsData

```typescript
export interface StandardsData {
  errorHandling: 'inline' | 'toast' | 'hybrid';
  retryPolicy: 'none' | 'manual' | 'automatic';
  logging: 'console' | 'sentry' | 'none';
  testingUnit: 'vitest' | 'jest' | 'none';
  testingE2E: 'playwright' | 'cypress' | 'none';
  linting: Array<'eslint' | 'biome' | 'prettier' | 'husky'>;
  gitStrategy: 'conventional-commits' | 'none';
  authApproach: 'jwt' | 'cookie' | 'none';
  dateLibrary: 'native' | 'dayjs' | 'date-fns';
}
```

### UXPatternsData

```typescript
export interface UXPatternsData {
  loadingPattern: 'skeleton' | 'spinner' | 'progress-bar';
  emptyStateStyle: 'illustration' | 'icon-text' | 'text-only';
  successFeedback: 'toast' | 'snackbar' | 'redirect';
  confirmationPattern: 'modal' | 'inline' | 'none';
}
```

---

## Rule Types

```typescript
export type RuleSeverity = 'error' | 'warning' | 'info';

export interface Violation {
  ruleId: string;
  severity: RuleSeverity;
  title: string;
  message: string;
  affectedSteps: WizardStep[];
}

export interface Rule {
  id: string;
  severity: RuleSeverity;
  title: string;
  message: string;
  affectedSteps: WizardStep[];
  check: (state: Pick<WizardState, 'project' | 'architecture' | 'standards'>) => boolean;
}
```

---

## Root Store Shape

```typescript
export type StepCompletion = Partial<Record<WizardStep, boolean>>;

export interface WizardState {
  // Meta
  schemaVersion: number;
  sessionId: string;
  createdAt: string;
  updatedAt: string;

  // Navigation
  currentStep: WizardStep;
  completedSteps: StepCompletion;

  // Step data
  project: ProjectData;
  architecture: ArchitectureData;
  designSystem: DesignSystemData;
  standards: StandardsData;
  uxPatterns: UXPatternsData;

  // Computed
  violations: Violation[];

  // Actions
  setStep: (step: WizardStep) => void;
  markStepComplete: (step: WizardStep) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateArchitecture: (data: Partial<ArchitectureData>) => void;
  updateDesignSystem: (data: Partial<DesignSystemData>) => void;
  updateStandards: (data: Partial<StandardsData>) => void;
  updateUXPatterns: (data: Partial<UXPatternsData>) => void;
  resetSession: () => void;
}
```

---

## Default Values

```typescript
// src/store/defaults.ts
export const defaultProject: ProjectData = {
  projectName: '',
  framework: '',
  language: 'typescript',
  stateManagement: [],
  serverState: 'none',
  apiClient: 'fetch',
  apiStyle: 'rest',
  formLibrary: 'react-hook-form',
  validation: 'zod',
  styling: ['tailwind'],
  packageManager: 'npm',
};

export const defaultDesignSystem: DesignSystemData = {
  accentColorHex: '#3b82f6',
  neutralPalette: 'zinc',
  fontFamily: 'geist',
  radiusScale: 'md',
  spacingBase: 4,
  shadowDepth: 'subtle',
};
// ... etc
```
