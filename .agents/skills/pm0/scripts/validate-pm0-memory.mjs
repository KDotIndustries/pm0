import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SURFACE_REQUIRED_SECTIONS = [
  "## Product Role",
  "## Target Users / Jobs",
  "## Current Behavior",
  "## Product Principles",
  "## Known Problems / Tensions",
  "## Metrics / Signals",
  "## Active Proposals",
  "## Accepted PRDs",
  "## Rejected Proposals",
  "## Open Questions",
  "## Evidence",
  "## Agent Notes"
];

const PROPOSAL_REQUIRED_SECTIONS = [
  "## Problem Or Opportunity",
  "## Why Now",
  "## Target Users Or Segment",
  "## Current Behavior",
  "## Desired Outcome",
  "## Evidence And Caveats",
  "## Proposed Scope",
  "## Non-Goals",
  "## Success Criteria",
  "## Risks And Tradeoffs",
  "## Open Questions",
  "## Build Notes",
  "## Handoff Readiness"
];

const PRD_REQUIRED_SECTIONS = [
  "## Product Intent",
  "## Background And Strategic Fit",
  "## Problem",
  "## Users And Jobs",
  "## Current Behavior",
  "## Desired Behavior",
  "## Evidence",
  "## Requirements",
  "## User Flows / UX Notes",
  "## Scope",
  "## Non-Goals",
  "## Metrics And Instrumentation",
  "## Rollout / Migration Notes",
  "## Risks, Tradeoffs, And Assumptions",
  "## Open Questions",
  "## Engineering Notes",
  "## Verification Expectations"
];

const READINESS_ITEMS = [
  "Problem is clear",
  "Target user is clear",
  "Scope is small enough for one engineering pass",
  "Acceptance criteria are testable",
  "Metrics or learning signal is defined",
  "Major open questions are resolved or explicitly accepted"
];

const PLACEHOLDER_PATTERNS = [
  /Unverified surface detected during init/i,
  /Unverified: add product surfaces/i,
  /product one-liner needs founder confirmation/i,
  /confirm primary user segment/i,
  /confirm the painful product problem/i,
  /TODO\b/i,
  /TBD\b/i
];

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
    .map((entry) => entry.name)
    .sort();
}

async function readIfExists(filePath) {
  if (!(await pathExists(filePath))) {
    return null;
  }
  return readFile(filePath, "utf8");
}

function hasSection(text, section) {
  return new RegExp(`^${escapeRegExp(section)}\\s*$`, "m").test(text);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addMissingSectionFindings(findings, { artifactType, fileName, text, sections }) {
  for (const section of sections) {
    if (!hasSection(text, section)) {
      findings.push({
        level: "warning",
        file: fileName,
        message: `${artifactType} ${fileName} is missing required section: ${section}`
      });
    }
  }
}

function addPlaceholderFindings(findings, { fileName, text, artifactType = "PM0 artifact" }) {
  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text))) {
    findings.push({
      level: "warning",
      file: fileName,
      message: `${artifactType} ${path.basename(fileName)} contains scaffold placeholder residue.`
    });
  }
}

function requirementsTableIsPresent(text) {
  return /\|\s*Requirement\s*\|\s*Priority\s*\|\s*User Value\s*\|\s*Acceptance Criteria\s*\|\s*Notes\s*\|/i.test(text);
}

function prdLink(fileName) {
  return `.pm0/prds/${fileName}`;
}

export async function validatePm0Memory({ root = process.cwd() } = {}) {
  const pm0Root = path.join(root, ".pm0");
  const findings = [];

  if (!(await pathExists(pm0Root))) {
    return {
      result: "warning",
      findings: [{
        level: "warning",
        file: ".pm0",
        message: "PM0 memory directory is missing: .pm0"
      }]
    };
  }

  const projectPath = path.join(pm0Root, "project.md");
  const projectText = await readIfExists(projectPath);
  if (projectText === null) {
    findings.push({
      level: "warning",
      file: ".pm0/project.md",
      message: "PM0 project memory is missing: .pm0/project.md"
    });
  } else {
    addPlaceholderFindings(findings, {
      fileName: ".pm0/project.md",
      text: projectText,
      artifactType: "Project"
    });
  }

  const surfaceDir = path.join(pm0Root, "surfaces");
  const surfaceFiles = await listMarkdownFiles(surfaceDir);
  const surfaceTexts = [];
  for (const fileName of surfaceFiles) {
    const relativeName = `.pm0/surfaces/${fileName}`;
    const text = await readFile(path.join(surfaceDir, fileName), "utf8");
    surfaceTexts.push({ fileName: relativeName, text });

    addPlaceholderFindings(findings, {
      fileName: relativeName,
      text,
      artifactType: "Surface"
    });

    if (fileName !== "index.md") {
      addMissingSectionFindings(findings, {
        artifactType: "Surface",
        fileName,
        text,
        sections: SURFACE_REQUIRED_SECTIONS
      });
    }
  }

  const proposalDir = path.join(pm0Root, "proposals");
  for (const fileName of await listMarkdownFiles(proposalDir)) {
    const text = await readFile(path.join(proposalDir, fileName), "utf8");
    addPlaceholderFindings(findings, {
      fileName: `.pm0/proposals/${fileName}`,
      text,
      artifactType: "Proposal"
    });
    addMissingSectionFindings(findings, {
      artifactType: "Proposal",
      fileName,
      text,
      sections: PROPOSAL_REQUIRED_SECTIONS
    });

    for (const readinessItem of READINESS_ITEMS) {
      if (!text.includes(readinessItem)) {
        findings.push({
          level: "warning",
          file: fileName,
          message: `Proposal ${fileName} is missing handoff readiness item: ${readinessItem}`
        });
      }
    }
  }

  const prdDir = path.join(pm0Root, "prds");
  for (const fileName of await listMarkdownFiles(prdDir)) {
    const text = await readFile(path.join(prdDir, fileName), "utf8");
    addPlaceholderFindings(findings, {
      fileName: `.pm0/prds/${fileName}`,
      text,
      artifactType: "PRD"
    });
    addMissingSectionFindings(findings, {
      artifactType: "PRD",
      fileName,
      text,
      sections: PRD_REQUIRED_SECTIONS
    });

    if (!requirementsTableIsPresent(text)) {
      findings.push({
        level: "warning",
        file: fileName,
        message: `PRD ${fileName} is missing the required Requirements table.`
      });
    }

    const linkedFromSurface = surfaceTexts.some(({ text: surfaceText }) =>
      surfaceText.includes(prdLink(fileName))
    );
    if (!linkedFromSurface) {
      findings.push({
        level: "warning",
        file: fileName,
        message: `PRD ${fileName} is not linked from any surface Accepted PRDs section.`
      });
    }
  }

  return {
    result: findings.length ? "warning" : "pass",
    findings
  };
}

async function main() {
  const result = await validatePm0Memory();
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
