import type { WizardState } from "@/types";
import { slugify } from "@/lib/utils";
import { generateGuidelines } from "./generators/guidelines";
import { generateAIContext } from "./generators/aiContext";
import { generateWhy } from "./generators/why";
import { generateReadme } from "./generators/readme";
import { generateConfig } from "./generators/config";
import { generateTokensCss } from "./generators/tokensCss";
import { generateTokensTailwind } from "./generators/tokensTailwind";
import { generateGitignore } from "./generators/gitignore";
import { generateApplyBlueprint } from "./generators/applyBlueprint";
import { generateAiToolConfig } from "./generators/aiToolConfig";

export async function triggerZipDownload(state: WizardState): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  zip.file("PROJECT_GUIDELINES.md", generateGuidelines(state));
  zip.file("AI_CONTEXT.md", generateAIContext(state));
  zip.file("WHY.md", generateWhy(state));
  zip.file("README.md", generateReadme(state));
  zip.file("project-config.json", JSON.stringify(generateConfig(state), null, 2));
  zip.file("tokens.css", generateTokensCss(state));
  zip.file("tokens.tailwind.json", JSON.stringify(generateTokensTailwind(state), null, 2));
  zip.file(".gitignore", generateGitignore(state));
  zip.file("apply-blueprint.js", generateApplyBlueprint(state));

  // AI coding tool config file (conditional on tool selection)
  const aiConfig = generateAiToolConfig(state);
  if (aiConfig) {
    zip.file(aiConfig.path, aiConfig.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(state.project.projectName || "project")}-blueprint.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
