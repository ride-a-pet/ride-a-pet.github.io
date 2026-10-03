import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const skippedDirs = new Set([".git", ".next", "node_modules", "out", ".playwright-cli", ".agent", ".agents"]);
const skippedFiles = new Set(["package-lock.json", "audit-clean.mjs"]);
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".css", ".html", ".txt", ".yml", ".yaml"]);
const legacyLabels = [
  ["Scary", "Shawarma"].join(" "),
  ["Crazy", "Cattle"].join(" "),
  ["Steal", "An", "Egg"].join(" "),
  ["Ab", "solum"].join(""),
];
const findings = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (skippedDirs.has(name)) continue;
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (textExtensions.has(extname(name)) && !skippedFiles.has(name)) inspect(path);
  }
}

function inspect(path) {
  const text = readFileSync(path, "utf8");
  const displayPath = relative(root, path);
  for (const label of legacyLabels) {
    if (text.toLowerCase().includes(label.toLowerCase())) findings.push(`${displayPath}: legacy identity '${label}'`);
  }
  const emails = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [];
  for (const email of emails) {
    if (displayPath === "content/generated/site.json" && email.toLowerCase() === "support@ride-a-pet.com") continue;
    findings.push(`${displayPath}: hardcoded email '${email}'`);
  }
  const publisherIds = text.match(/\bca-pub-\d{8,}\b/gi) ?? [];
  for (const id of publisherIds) findings.push(`${displayPath}: hardcoded advertising publisher ID '${id}'`);
  if (/data-code=["'][A-Za-z0-9_-]{16,}["']/.test(text)) findings.push(`${displayPath}: hardcoded analytics code`);
  const containerIds = text.match(/container-[a-f0-9]{24,}/gi) ?? [];
  for (const id of containerIds) {
    // This site's current Adsterra GET CODE requires its exact Native container ID.
    if (displayPath === "components/integrations/native-banner.tsx" && id === "container-33a818bf9cce13b55018ef8ecceb580c") continue;
    findings.push(`${displayPath}: hardcoded advertising container ID`);
  }
}

walk(root);

if (findings.length) {
  console.error("Cleanliness audit failed:\n" + findings.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Cleanliness audit passed: no legacy identity, real email or embedded third-party ID found.");
