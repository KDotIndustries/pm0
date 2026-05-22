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

async function createFileIfMissing(filePath, contents) {
  try {
    await writeFile(filePath, contents, { encoding: "utf8", flag: "wx" });
    return true;
  } catch (error) {
    if (error?.code === "EEXIST") {
      return false;
    }
    throw error;
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
  if (await createFileIfMissing(projectPath, projectTemplate(options))) {
    created.push(".pm0/project.md");
  }

  const indexPath = path.join(pm0Root, "surfaces", "index.md");
  if (await createFileIfMissing(indexPath, surfaceIndexTemplate(options.surfaces || []))) {
    created.push(".pm0/surfaces/index.md");
  }

  return { root, created };
}

function usage() {
  return [
    "Usage: node skills/pm0/scripts/scaffold-pm0.mjs [--product-name <name>] [--one-liner <text>] [--surfaces <comma-separated-surfaces>]",
    "",
    "Options:",
    "  --product-name <name>                 Product name for .pm0/project.md",
    "  --one-liner <text>                    Product one-liner for .pm0/project.md",
    "  --surfaces <comma-separated-surfaces> Initial product surfaces"
  ].join("\n");
}

function optionValue(args, optionName, description) {
  const index = args.indexOf(optionName);
  if (index < 0) {
    return undefined;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${optionName} requires ${description}.\n\n${usage()}`);
  }

  return value;
}

async function main() {
  const args = process.argv.slice(2);
  const productName = optionValue(args, "--product-name", "a value");
  const productOneLiner = optionValue(args, "--one-liner", "a value");
  const surfaces = optionValue(args, "--surfaces", "a comma-separated value");

  const result = await scaffoldPm0({
    root: process.cwd(),
    productName,
    productOneLiner,
    surfaces: surfaces ? surfaces.split(",") : []
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
