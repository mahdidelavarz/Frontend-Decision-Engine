"use client";

import type { ArchitectureData } from "@/types";

interface Props {
  architecture: ArchitectureData;
}

type TreeNode = { name: string; children?: TreeNode[] };

function fileName(base: string, ext: string, convention: ArchitectureData["namingConvention"]): string {
  if (convention === "PascalCase") {
    return base.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase()) + ext;
  }
  if (convention === "camelCase") {
    return base.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + ext;
  }
  return base + ext; // kebab-case
}

function buildTree(architecture: ArchitectureData): TreeNode[] {
  const { folderStrategy, namingConvention } = architecture;
  const f = (base: string, ext = ".tsx") => fileName(base, ext, namingConvention);

  if (folderStrategy === "feature-based") {
    return [
      {
        name: "src/",
        children: [
          {
            name: "features/",
            children: [
              {
                name: "auth/",
                children: [
                  { name: "components/", children: [{ name: f("login-form") }, { name: f("auth-guard") }] },
                  { name: "hooks/", children: [{ name: f("use-auth", ".ts") }] },
                  { name: "services/", children: [{ name: f("auth-service", ".ts") }] },
                ],
              },
              {
                name: "dashboard/",
                children: [
                  { name: "components/", children: [{ name: f("dashboard-layout") }] },
                  { name: "hooks/", children: [{ name: f("use-dashboard", ".ts") }] },
                ],
              },
            ],
          },
          {
            name: "shared/",
            children: [
              { name: "ui/", children: [{ name: f("button") }, { name: f("card") }] },
              { name: "hooks/", children: [{ name: f("use-debounce", ".ts") }] },
              { name: "utils/", children: [{ name: f("helpers", ".ts") }] },
            ],
          },
          { name: "app/" },
        ],
      },
    ];
  }

  if (folderStrategy === "layer-based") {
    return [
      {
        name: "src/",
        children: [
          { name: "components/", children: [{ name: f("button") }, { name: f("card") }, { name: f("layout") }] },
          { name: "hooks/", children: [{ name: f("use-store", ".ts") }, { name: f("use-auth", ".ts") }] },
          { name: "services/", children: [{ name: f("api-service", ".ts") }, { name: f("auth-service", ".ts") }] },
          { name: "store/", children: [{ name: "index.ts" }] },
          { name: "types/", children: [{ name: "index.ts" }] },
          { name: "utils/", children: [{ name: f("helpers", ".ts") }] },
          { name: "app/" },
        ],
      },
    ];
  }

  // simple
  return [
    {
      name: "src/",
      children: [
        { name: "components/", children: [{ name: f("button") }, { name: f("card") }, { name: f("nav") }] },
        { name: "pages/", children: [{ name: f("home") }, { name: f("about") }] },
        { name: "utils/", children: [{ name: f("helpers", ".ts") }] },
        { name: "constants.ts" },
      ],
    },
  ];
}

function renderTree(nodes: TreeNode[], prefix = "", isLast = false): string[] {
  const lines: string[] = [];
  nodes.forEach((node, i) => {
    const last = i === nodes.length - 1;
    const connector = last ? "└── " : "├── ";
    const childPrefix = prefix + (last ? "    " : "│   ");
    lines.push(prefix + connector + node.name);
    if (node.children?.length) {
      lines.push(...renderTree(node.children, childPrefix, last));
    }
  });
  return lines;
}

export function FolderTree({ architecture }: Props) {
  const tree = buildTree(architecture);
  const lines = renderTree(tree);

  const aliasHint =
    architecture.pathAliases && architecture.aliasRoot !== "none"
      ? `\n// import\nimport { ... } from "${architecture.aliasRoot}/features/auth"`
      : null;

  return (
    <div>
      <div
        style={{
          background: "#18181b",
          borderRadius: "0.5rem",
          padding: "0.85rem 1rem",
          fontFamily: "'Geist Mono', 'Fira Code', monospace",
          fontSize: "0.75rem",
          lineHeight: "1.65",
          color: "#d4d4d8",
          overflowX: "auto",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre" }}>
          {lines.join("\n")}
        </pre>
        {aliasHint && (
          <pre
            style={{
              margin: "0.6rem 0 0",
              paddingTop: "0.6rem",
              borderTop: "1px solid #3f3f46",
              whiteSpace: "pre",
              color: "#a1a1aa",
            }}
          >
            {aliasHint}
          </pre>
        )}
      </div>
      <p style={{ fontSize: "0.7rem", color: "#a1a1aa", marginTop: "0.35rem", marginBottom: 0 }}>
        Updates live as you change strategy and naming convention.
      </p>
    </div>
  );
}
