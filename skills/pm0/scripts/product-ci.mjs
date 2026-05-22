import { readdir, stat } from "node:fs/promises";
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

async function listMarkdownFiles(dir) {
  if (!(await pathExists(dir))) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);
}

function slugFromFile(fileName) {
  return fileName.replace(/\.md$/, "");
}

function inferSurface(changedFiles, surfaceSlugs) {
  for (const surface of surfaceSlugs) {
    if (changedFiles.some((file) => file.toLowerCase().includes(surface))) {
      return surface;
    }
  }
  return null;
}

function extractPm0Links(prBody) {
  const links = [];
  const pattern = /\.pm0\/(?:proposals|prds)\/[A-Za-z0-9._/-]+\.md/g;
  for (const match of String(prBody || "").matchAll(pattern)) {
    links.push(match[0]);
  }
  return links;
}

export async function runProductCi({ root = process.cwd(), changedFiles = [], prBody = "" } = {}) {
  const surfaceFiles = await listMarkdownFiles(path.join(root, ".pm0", "surfaces"));
  const surfaceSlugs = surfaceFiles
    .map(slugFromFile)
    .filter((slug) => slug !== "index");

  const inferredSurface = inferSurface(changedFiles, surfaceSlugs);
  const links = extractPm0Links(prBody);
  const findings = [];

  if (!inferredSurface) {
    return { result: "pass", surface: null, findings };
  }

  if (links.length === 0) {
    findings.push({
      level: "warning",
      message: `Changes appear to affect the ${inferredSurface} surface, but the PR body does not link a PM0 proposal or PRD.`
    });
  }

  for (const link of links) {
    if (!(await pathExists(path.join(root, link)))) {
      findings.push({
        level: "warning",
        message: `Linked PM0 artifact does not exist: ${link}`
      });
    }
  }

  return {
    result: findings.length ? "warning" : "pass",
    surface: inferredSurface,
    findings
  };
}

async function main() {
  const changedFiles = (process.env.PM0_CHANGED_FILES || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const prBody = process.env.PM0_PR_BODY || "";
  const result = await runProductCi({ changedFiles, prBody });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
