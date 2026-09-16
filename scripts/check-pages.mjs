#!/usr/bin/env node
/**
 * Three structural rules for the pages under docs/, each one a rule that is obvious to
 * state and easy to break silently.
 *
 * 1. Exactly one H1 per page, and no two pages share that H1. The H1 is the page's identity
 *    in search results and in the explorer's table of contents, so a duplicate makes two
 *    different questions look like one answer.
 * 2. Lowercase-kebab file names. A reader can type the URL of a page they have seen
 *    referenced; `Architecture.md` and `architecture.md` are two files on a
 *    case-sensitive checkout and one on a case-insensitive one, which is how a link works
 *    for one contributor and is broken for another.
 * 3. No absolute host paths. A page that quotes `/home/someone/...` or a build directory
 *    from the machine it was written on is a page no reader can follow, and this project has
 *    already shipped one: a machine-specific path baked into a compiled contract's bytes.
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");

const pages = (await readdir(docs, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();

const problems = [];
const titles = new Map();

for (const page of pages) {
  const shown = `docs/${page}`;
  const markdown = await readFile(join(docs, page), "utf8");

  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(page)) {
    problems.push(`${shown}  file name is not lowercase-kebab`);
  }

  const headings = [];
  let fenced = false;
  markdown.split("\n").forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;
    const match = /^#\s+(.*?)\s*#*\s*$/.exec(line);
    if (match !== null) headings.push({ text: match[1], line: index + 1 });
  });

  if (headings.length !== 1) {
    problems.push(`${shown}  has ${headings.length} top-level heading(s), expected 1`);
  } else {
    const title = headings[0].text;
    const other = titles.get(title);
    if (other !== undefined) problems.push(`${shown}  repeats the title of ${other}: ${title}`);
    else titles.set(title, shown);
  }
  if (headings.length > 0 && headings[0].line !== 1) {
    problems.push(`${shown}  does not start with its title (first heading on line ${headings[0].line})`);
  }

  const absolute = [...markdown.matchAll(/(?:^|[\s(])(\/(?:home|Users|workspaces|tmp)\/[^\s)`]*)/g)];
  for (const [, path] of absolute) {
    problems.push(`${shown}  quotes the absolute path ${path}, which no reader can follow`);
  }

  const reference = [...markdown.matchAll(/^\[[^\]]+\]:\s+\S+/gm)];
  if (reference.length > 0) {
    problems.push(`${shown}  uses ${reference.length} reference-style link definition(s), which the link check does not follow`);
  }
}

if (problems.length > 0) {
  process.stderr.write(`${problems.length} structural problem(s):\n`);
  for (const problem of problems) process.stderr.write(`  ${problem}\n`);
  process.exit(1);
}

const headings = pages.length;
process.stdout.write(
  `${headings} page(s): one H1 each, all titles distinct, all names lowercase-kebab,\n` +
    `no absolute host paths, no reference-style links.\n`,
);
