import { writeFileSync, readFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LINE =
  "Section 14.3: by using this toaster, you agree that your bread may be lightly judged, and that all crumbs become property of the company.";

// Competition gate: the entry must be 1 to MAX_CHARS characters.
const MAX_CHARS = 200;

const outputPath = fileURLToPath(new URL("/output/entry.txt", import.meta.url));
// The temp file must live in the output directory itself: /output is a
// different filesystem from the entry folder, so a cross-device rename fails.
const tempPath = join(dirname(outputPath), `.entry-${process.pid}.tmp`);

writeFileSync(tempPath, LINE, "utf8");
renameSync(tempPath, outputPath);

const readBack = readFileSync(outputPath, "utf8");
if (readBack !== LINE) throw new Error("[byte-equality] output does not match the expected line");
if (readBack.length < 1 || readBack.length > MAX_CHARS) {
  throw new Error("[length] entry must be 1 to 200 characters");
}
if (readBack.includes("\n")) throw new Error("[single-line] entry must be a single line");
if (readBack.trim().length === 0) throw new Error("[non-whitespace] entry must not be only whitespace");
for (const ch of readBack) {
  if (ch.charCodeAt(0) < 0x20) {
    throw new Error("[control-character] entry contains a control character");
  }
}
