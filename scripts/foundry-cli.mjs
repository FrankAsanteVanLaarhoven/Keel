import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && !/\.[cm]?[jt]s$/.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { readModelFile, checkModel, sketchLanguage, htmlNotes, diagramSvg, isSketchLanguage } = await import("../lib/foundry-model.ts");

const args = process.argv.slice(2);
let file = "";
let mode = "";
let language = "";
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--code") {
    mode = "code";
    const next = args[index + 1] || "";
    if (!isSketchLanguage(next)) {
      console.error("Name a language: java, cs, cpp, py, php, js, ts, ruby, sql, or graphql.");
      process.exit(2);
    }
    language = next;
    index += 1;
    continue;
  }
  if (arg === "--check" || arg === "--html" || arg === "--svg") {
    mode = arg.slice(2);
    continue;
  }
  if (!arg.startsWith("--") && !file) file = arg;
}

if (!file || !mode) {
  console.error("Usage: node --experimental-strip-types scripts/foundry-cli.mjs drawing.json --check|--code java|cs|cpp|py|php|js|ts|ruby|sql|graphql|--html|--svg");
  process.exit(2);
}

let value;
try {
  value = JSON.parse(readFileSync(file, "utf8"));
} catch {
  console.error("This file is not a Foundry drawing. Open a JSON file saved from this lab.");
  process.exit(2);
}

const sheets = readModelFile(value);
if (!Array.isArray(sheets)) {
  console.error(sheets.error);
  process.exit(2);
}

if (mode === "check") {
  const issues = checkModel(sheets);
  if (issues.length === 0) {
    console.log("Checked. No notes.");
    process.exit(0);
  }
  for (const issue of issues) console.log(issue.message);
  process.exit(1);
}

if (mode === "html") {
  console.log(htmlNotes(sheets, sheets[0]?.name || "Foundry notes"));
  process.exit(0);
}

if (mode === "svg") {
  console.log(diagramSvg(sheets[0]));
  process.exit(0);
}

console.log(sketchLanguage(sheets, language));
