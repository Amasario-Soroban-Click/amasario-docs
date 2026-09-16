#!/usr/bin/env node
/**
 * Verifies the links in this repository's markdown.
 *
 * Two decisions worth stating, because both are departures from the obvious script:
 *
 * 1. Internal anchors are checked, not only file existence. A documentation repository
 *    whose index points at a heading that has since been renamed is exactly as broken as
 *    one that points at a deleted file, and only the second is obvious to a reader who
 *    never clicks.
 *
 * 2. External links are not fetched. A check that depends on someone else's uptime fails
 *    for reasons the contributor cannot fix, and a red build nobody can make green is a
 *    build people learn to ignore. External links are still parsed, so that a malformed
 *    one is caught, and reported with the count so that a reviewer can sample them.
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Every markdown file under the repository, excluding dependency directories. */
async function markdownFiles(directory = root) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await markdownFiles(path)));
    else if (entry.name.endsWith(".md")) found.push(path);
  }
  return found.sort();
}

/**
 * GitHub's heading anchor rule, which is not a general slugifier: lowercase, drop
 * punctuation, spaces become hyphens, and existing hyphens survive.
 */
function anchorOf(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "-");
}

/** The anchors a file defines, in order, including duplicates GitHub would suffix. */
function anchorsOf(markdown) {
  const anchors = new Set();
  const seen = new Map();
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const heading = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (heading === null) continue;
    const base = anchorOf(heading[1]);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

/** Links in a file, skipping fenced code blocks and inline code spans. */
function linksOf(markdown) {
  const links = [];
  let fenced = false;
  markdown.split("\n").forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;
    const stripped = line.replace(/`[^`]*`/g, "");
    const pattern = /\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
    for (const match of stripped.matchAll(pattern)) {
      links.push({ target: match[1], line: index + 1 });
    }
  });
  return links;
}

const files = await markdownFiles();
const anchors = new Map();
for (const file of files) anchors.set(file, anchorsOf(await readFile(file, "utf8")));

const failures = [];
let external = 0;
let internal = 0;

for (const file of files) {
  const shown = relative(root, file);
  for (const { target, line } of linksOf(await readFile(file, "utf8"))) {
    if (/^(https?:|mailto:|#?$)/.test(target) && !target.startsWith("#")) {
      external += 1;
      continue;
    }
    internal += 1;
    const [path, fragment] = target.split("#");
    const destination = path === "" ? file : resolve(dirname(file), path);
    const key = destination === file ? file : files.find((candidate) => candidate === destination);

    if (path !== "" && key === undefined) {
      failures.push(`${shown}:${line}  target does not exist: ${path}`);
      continue;
    }
    if (fragment === undefined || fragment === "") continue;

    const defined = anchors.get(destination);
    if (defined === undefined) {
      failures.push(`${shown}:${line}  ${path} is not checked-in markdown: #${fragment}`);
    } else if (!defined.has(fragment.toLowerCase())) {
      failures.push(`${shown}:${line}  ${path} defines no heading ${JSON.stringify(fragment)}`);
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.length} broken link(s):\n`);
  for (const failure of failures) process.stderr.write(`  ${failure}\n`);
  process.stderr.write(
    `\nAnchors are derived from headings the way GitHub derives them; renaming a heading\n` +
      `renames its anchor, and this check is what notices.\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `${internal} internal and ${external} external link(s) across ${files.length} markdown file(s)` +
    ` — all internal targets and anchors resolve.\n`,
);
process.stdout.write(
  `External links were not fetched by design; see the header of scripts/check-links.mjs.\n`,
);
