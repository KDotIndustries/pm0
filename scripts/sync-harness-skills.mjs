import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const targets = [
  ".agents/skills/pm0",
  ".claude/skills/pm0",
  ".cursor/skills/pm0",
  ".gemini/skills/pm0",
  ".github/skills/pm0",
  ".kiro/skills/pm0",
  ".opencode/skills/pm0",
  ".pi/skills/pm0",
  ".qoder/skills/pm0",
  ".rovodev/skills/pm0",
  ".trae-cn/skills/pm0",
  ".trae/skills/pm0"
];

const source = path.join(process.cwd(), "skills", "pm0");

for (const target of targets) {
  const destination = path.join(process.cwd(), target);
  await mkdir(path.dirname(destination), { recursive: true });
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
  console.log(`synced ${target}`);
}
