import type { CheckState, Violation } from "@/types";
import { rules } from "./rules";

export function evaluate(state: CheckState): Violation[] {
  return rules
    .filter((rule) => rule.check(state))
    .map((rule) => ({
      ruleId: rule.id,
      severity: rule.severity,
      title: rule.title,
      message: rule.message,
      affectedSteps: rule.affectedSteps,
      field: rule.field,
    }));
}
