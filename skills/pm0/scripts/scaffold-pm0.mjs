import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeSurface(surface) {
  return String(surface || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectTemplate({ productName, productOneLiner }) {
  const name = productName || "Product";
  const oneLiner = productOneLiner || "Unverified: product one-liner needs founder confirmation.";
  return `# ${name}

## One-Liner

${oneLiner}

## Target Users

- Unverified: confirm primary user segment.

## Problem

- Unverified: confirm the painful product problem PM0 should preserve.

## Business Model

- Unverified: confirm business model.

## Current Stage

- Unverified: confirm current product stage.

## Current Goals

- Unverified: confirm near-term product goals.

## Product Principles

- Keep product context close to the code.
- Prefer small, reversible product changes.
- Treat external sources as evidence, not truth.

## Assumptions To Confirm

- Product name
- Target users
- Important product surfaces
- Success metrics
`;
}

function surfaceIndexTemplate(surfaces) {
  const normalized = surfaces.map(normalizeSurface).filter(Boolean);
  const lines = normalized.length
    ? normalized.map((surface) => `- \`${surface}\`: Unverified surface detected during init.`)
    : ["- Unverified: add product surfaces such as `onboarding`, `pricing`, or `dashboard`."];

  return `# Product Surfaces

Each surface is a product area or flow with durable memory.

${lines.join("\n")}
`;
}

export async function scaffoldPm0(options = {}) {
  const root = options.root || process.cwd();
  const pm0Root = path.join(root, ".pm0");
  const created = [];

  for (const dir of ["contexts", "surfaces", "proposals", "prds"]) {
    const dirPath = path.join(pm0Root, dir);
    if (!(await pathExists(dirPath))) {
      await mkdir(dirPath, { recursive: true });
      created.push(path.posix.join(".pm0", dir));
    }
  }

  const projectPath = path.join(pm0Root, "project.md");
  if (!(await pathExists(projectPath))) {
    await writeFile(projectPath, projectTemplate(options), "utf8");
    created.push(".pm0/project.md");
  }

  const indexPath = path.join(pm0Root, "surfaces", "index.md");
  if (!(await pathExists(indexPath))) {
    await writeFile(indexPath, surfaceIndexTemplate(options.surfaces || []), "utf8");
    created.push(".pm0/surfaces/index.md");
  }

  return { root, created };
}

async function main() {
  const args = process.argv.slice(2);
  const productNameIndex = args.indexOf("--product-name");
  const oneLinerIndex = args.indexOf("--one-liner");
  const surfacesIndex = args.indexOf("--surfaces");

  const result = await scaffoldPm0({
    root: process.cwd(),
    productName: productNameIndex >= 0 ? args[productNameIndex + 1] : undefined,
    productOneLiner: oneLinerIndex >= 0 ? args[oneLinerIndex + 1] : undefined,
    surfaces: surfacesIndex >= 0 ? args[surfacesIndex + 1].split(",") : []
  });

  console.log(JSON.stringify(result, null, 2));
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
