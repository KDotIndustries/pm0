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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function surfaceAliases(surface) {
  return [...new Set([
    surface,
    surface.replace(/-/g, " "),
    surface.replace(/-/g, "_")
  ])];
}

function textMentionsSurface(text, surface) {
  const haystack = String(text || "");
  return surfaceAliases(surface).some((alias) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`, "i");
    return pattern.test(haystack);
  });
}

function inferSurface(changedFiles, surfaceSlugs, prBody = "") {
  for (const surface of surfaceSlugs) {
    if (
      changedFiles.some((file) => textMentionsSurface(file, surface)) ||
      textMentionsSurface(prBody, surface)
    ) {
      return surface;
    }
  }
  return null;
}

function extractPm0Links(prBody) {
  const links = new Set();
  const pattern = /(?<![A-Za-z0-9._-])\/?(?:[A-Za-z0-9._-]+\/)*\.pm0\/(?:proposals|prds)\/[A-Za-z0-9._/-]+\.md/g;
  for (const match of String(prBody || "").matchAll(pattern)) {
    links.add(match[0]);
  }
  return [...links];
}

function isSubpath(filePath, dir) {
  const relative = path.relative(dir, filePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function normalizePm0ArtifactLink(root, link) {
  const segments = link.split("/");
  const normalized = path.posix.normalize(link);

  if (path.posix.isAbsolute(link) || segments.includes("..")) {
    return { valid: false, normalized };
  }

  if (
    !normalized.startsWith(".pm0/proposals/") &&
    !normalized.startsWith(".pm0/prds/")
  ) {
    return { valid: false, normalized };
  }

  const resolved = path.resolve(root, normalized);
  const proposalsDir = path.resolve(root, ".pm0", "proposals");
  const prdsDir = path.resolve(root, ".pm0", "prds");

  return {
    valid: isSubpath(resolved, proposalsDir) || isSubpath(resolved, prdsDir),
    normalized
  };
}

export async function runProductCi({ root = process.cwd(), changedFiles = [], prBody = "" } = {}) {
  const surfaceFiles = await listMarkdownFiles(path.join(root, ".pm0", "surfaces"));
  const surfaceSlugs = surfaceFiles
    .map(slugFromFile)
    .filter((slug) => slug !== "index");

  const inferredSurface = inferSurface(changedFiles, surfaceSlugs, prBody);
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
    const artifact = normalizePm0ArtifactLink(root, link);
    if (!artifact.valid) {
      findings.push({
        level: "warning",
        message: `Invalid PM0 artifact link: ${link}`
      });
      continue;
    }

    if (!(await pathExists(path.join(root, artifact.normalized)))) {
      findings.push({
        level: "warning",
        message: `Linked PM0 artifact does not exist: ${artifact.normalized}`
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
