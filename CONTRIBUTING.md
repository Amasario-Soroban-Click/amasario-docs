# Contributing

## The one rule for what belongs here

A page belongs in this repository when answering its question requires reading **more than
one** of the other repositories. If one repository owns the answer, the page belongs beside
the code it describes, so that a behaviour change and its description land in the same diff
and are reviewed by the people who know the answer.

In practice that means this repository holds boundaries, policy, governance, the contributor
path and the gaps — and does not hold a CLI reference, a crate list or a schema. A pull
request that copies a table out of another repository into a page here will be asked to point
at it instead, because a number in two places is a number that will be wrong in one of them.

## Before you push

```bash
npm run check
```

which runs four checks, one job each in CI:

| Check | What it catches |
| --- | --- |
| `check:markdown` | Style, via a pinned markdownlint. |
| `check:links` | A link to a missing file, **and a link to a heading that was renamed**. |
| `check:index` | A page that exists but is not in the README's list, or the reverse. |
| `check:pages` | One H1 per page, distinct titles, lowercase-kebab names, no absolute host paths. |

External links are deliberately not fetched. A check that fails because someone else's site
is down is a red build nobody can fix, and a build people learn to ignore is worse than no
build.

## What a good page here says

Write what is true, including when the truth is that something is missing. This repository's
most useful page is [`docs/gaps.md`](docs/gaps.md), which lists what the project has not done
and why — a gap with a reason is a fact, and a hedge is noise. If you find that the pages here
and the behaviour of the other repositories have diverged, the behaviour is the fact and the
text is the bug: say so in the pull request, and fix the text.

## Style

`type(scope): what changed, stated as a fact`, with a body that says why. Prose is wrapped at
98 columns. Prefer a specific number, a named file or a named command over an adjective, and
prefer stating a limitation to describing an intention.
