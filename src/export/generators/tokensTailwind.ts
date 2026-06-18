import type { WizardState } from "@/types";
import { deriveTokens } from "@/tokens/derive";

export function generateTokensTailwind(state: WizardState): object {
  const tokens = deriveTokens(state.designSystem);

  const accentEntries = Object.fromEntries(
    Object.entries(tokens.accent).map(([k, v]) => [`--color-accent-${k}`, v])
  );

  const radiusEntries = Object.fromEntries(
    Object.entries(tokens.radius).map(([k, v]) => [`--radius-${k}`, v])
  );

  const shadowEntries = Object.fromEntries(
    Object.entries(tokens.shadow).map(([k, v]) => [`--shadow-${k}`, v])
  );

  return {
    _comment: "Paste these values into your globals.css @theme block for Tailwind 4",
    ...accentEntries,
    "--font-sans": tokens.fontFamily,
    "--font-mono": "ui-monospace, 'Cascadia Code', monospace",
    ...radiusEntries,
    ...shadowEntries,
  };
}
