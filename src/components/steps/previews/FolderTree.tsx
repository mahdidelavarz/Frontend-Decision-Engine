"use client";

import type { ArchitectureData } from "@/types";

interface Props {
  architecture: ArchitectureData;
}

type TreeNode = { name: string; children?: TreeNode[] };

function componentFile(base: string, architecture: ArchitectureData): string {
  const ext = ".tsx";
  if (architecture.componentNaming === "PascalCase") {
    return base.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase()) + ext;
  }
  return base + ext; // kebab-case
}

function utilFile(base: string, architecture: ArchitectureData, suffix?: string): string {
  const ext = ".ts";
  const name =
    architecture.utilNaming === "camelCase"
      ? base.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      : base; // kebab-case
  if (architecture.fileSuffixes && suffix) {
    return `${name}.${suffix}${ext}`;
  }
  return name + ext;
}

function buildTree(architecture: ArchitectureData): TreeNode[] {
  const c = (base: string) => componentFile(base, architecture);
  const u = (base: string, suffix?: string) => utilFile(base, architecture, suffix);

  if (architecture.folderStrategy === "feature-based") {
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
                  { name: "components/", children: [{ name: c("login-form") }, { name: c("auth-guard") }] },
                  { name: "hooks/", children: [{ name: u("use-auth", "hook") }] },
                  { name: "services/", children: [{ name: u("auth", "service") }] },
                  ...(architecture.fileSuffixes ? [{ name: u("auth", "types") }] : []),
                ],
              },
              {
                name: "dashboard/",
                children: [
                  { name: "components/", children: [{ name: c("dashboard-layout") }] },
                  { name: "hooks/", children: [{ name: u("use-dashboard", "hook") }] },
                ],
              },
            ],
          },
          {
            name: "shared/",
            children: [
              { name: "ui/", children: [{ name: c("button") }, { name: c("card") }] },
              { name: "hooks/", children: [{ name: u("use-debounce", "hook") }] },
              { name: "utils/", children: [{ name: u("format-date", "utils") }] },
            ],
          },
          { name: "app/" },
        ],
      },
    ];
  }

  if (architecture.folderStrategy === "layer-based") {
    return [
      {
        name: "src/",
        children: [
          {
            name: "components/",
            children: [{ name: c("button") }, { name: c("card") }, { name: c("layout") }],
          },
          {
            name: "hooks/",
            children: [{ name: u("use-store", "hook") }, { name: u("use-auth", "hook") }],
          },
          {
            name: "services/",
            children: [{ name: u("api", "service") }, { name: u("auth", "service") }],
          },
          { name: "store/", children: [{ name: "index.ts" }] },
          {
            name: "types/",
            children: [
              architecture.fileSuffixes
                ? { name: u("user", "types") }
                : { name: "index.ts" },
            ],
          },
          { name: "utils/", children: [{ name: u("format-date", "utils") }] },
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
        {
          name: "components/",
          children: [{ name: c("button") }, { name: c("card") }, { name: c("nav") }],
        },
        { name: "hooks/", children: [{ name: u("use-auth", "hook") }] },
        { name: "utils/", children: [{ name: u("helpers", "utils") }] },
        ...(architecture.fileSuffixes ? [{ name: u("app", "types") }] : [{ name: "constants.ts" }]),
      ],
    },
  ];
}

function renderTree(nodes: TreeNode[], prefix = ""): string[] {
  const lines: string[] = [];
  nodes.forEach((node, i) => {
    const last = i === nodes.length - 1;
    const connector = last ? "└── " : "├── ";
    const childPrefix = prefix + (last ? "    " : "│   ");
    lines.push(prefix + connector + node.name);
    if (node.children?.length) {
      lines.push(...renderTree(node.children, childPrefix));
    }
  });
  return lines;
}

export function FolderTree({ architecture }: Props) {
  const tree = buildTree(architecture);
  const lines = renderTree(tree);

  const root = architecture.aliasRoot !== "none" ? architecture.aliasRoot : "@";
  const showAliases = architecture.pathAliases && architecture.aliasRoot !== "none";

  const aliasMap = showAliases
    ? [
        ["components", "src/components/"],
        ["hooks",      "src/hooks/"],
        ["lib",        "src/lib/"],
        ["utils",      "src/utils/"],
        ["store",      "src/store/"],
        ["services",   "src/services/"],
      ]
    : [];

  const maxAlias = Math.max(...aliasMap.map(([a]) => (`${root}/${a}`).length));

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
        {showAliases && (
          <pre
            style={{
              margin: "0.6rem 0 0",
              paddingTop: "0.6rem",
              borderTop: "1px solid #3f3f46",
              whiteSpace: "pre",
              color: "#a1a1aa",
            }}
          >
            {`// Alias Preview\n`}
            {aliasMap.map(([alias, target]) => {
              const key = `${root}/${alias}`;
              const pad = " ".repeat(Math.max(0, maxAlias - key.length + 2));
              return `${key}${pad}→  ${target}`;
            }).join("\n")}
          </pre>
        )}
      </div>
      <p style={{ fontSize: "0.7rem", color: "#a1a1aa", marginTop: "0.35rem", marginBottom: 0 }}>
        Updates live as you change strategy and naming.
      </p>
    </div>
  );
}
