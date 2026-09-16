#!/usr/bin/env node
/**
 * Verifies that the README's list of pages is the list of pages.
 *
 * An index is the one document that goes stale in a way no reader notices: every link in it
 * still resolves, because a page that was renamed is a broken link and one that was merely
 * *added* is not. The failure is silence, so the check has to be the other way round from a
 * link check - it holds the table against the directory in both directions.
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");

const readme = await readFile(join(root, "README.md"), "utf8");
const present = (await readdir(docs, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();

const indexed = [...readme.matchAll(/\]\(docs\/([^)#]+\.md)\)/g)].map((match) => match[1]);
const listed = [...new Set(indexed)].sort();

const missing = present.filter((page) => !listed.includes(page));
const extra = listed.filter((page) => !present.includes(page));

if (missing.length > 0 || extra.length > 0) {
  if (missing.length > 0) {
    process.stderr.write(`On disk but not indexed in README.md:\n`);
    for (const page of missing) process.stderr.write(`  docs/${page}\n`);
  }
  if (extra.length > 0) {
    process.stderr.write(`Indexed in README.md but not on disk:\n`);
    for (const page of extra) process.stderr.write(`  docs/${page}\n`);
  }
  process.exit(1);
}

process.stdout.write(
  `README.md indexes all ${present.length} page(s) in docs/, and names nothing else.\n`,
);
