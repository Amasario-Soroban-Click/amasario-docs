# Contributing

Most of this page is about *where* to make a change, because the most common way a
contribution stalls in a multi-repository project is that it was opened in the wrong one and
the reviewer on duty cannot merge it.

## The repository is a signal, not just a destination

| The change is about | Open it against |
| --- | --- |
| What a field, status or relationship *means* | `amasario-provenance-spec` |
| What the engine observes, refuses, or emits — and anything about the CLI | `amasario-provenance-engine` |
| How a document is displayed | `amasario-explorer` |
| A boundary, a policy, or a page that spans repositories | `amasario-docs` |

If a change spans two, it is a sequence rather than one pull request — see
[architecture](architecture.md#where-a-change-travels). Split it, land the normative part
first, and reference the sibling pull requests from each. A specification change with an
engine change attached is the case that gets merged anyway and then cannot be read six
months later.

## What must pass before review

Each repository runs its own checks, and they are the ones that decide — run them locally
rather than discovering them in the review:

| Repository | Locally, before you push |
| --- | --- |
| Engine | `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets --all-features -- -D warnings`, `cargo test --workspace`, and the documentation build. |
| Explorer | `npm run typecheck`, `npm test`, `npm run build`. |
| Spec | Its schema validation and vector reproduction, as described in its own README. |
| Docs | `npx markdownlint-cli2` and the link check, both of which run in CI. |

Two engine-specific habits are worth internalising, because they are where review comments
actually land:

- **A new behaviour needs a test that fails without it.** Not a test that passes with it —
  one that fails without it. The distinguishing case is usually the negative one, and the
  engine's suite is full of tests whose names describe a refusal rather than a success.
- **Do not convert a failure into an empty result.** This is the rule the whole project is
  built on. If your change makes an error path produce `[]`, `None` or an empty map, it is
  a regression regardless of how green the suite is.

## Commit and pull-request conventions

Commit subjects are `type(scope): what changed, stated as a fact`. The body explains *why* —
specifically, what was wrong before and what a reader would have believed instead. A commit
that says what it did and not why is reviewed on trust, and cannot be reviewed later at all.

`type` is one of `feat`, `fix`, `docs`, `test`, `perf`, `refactor`, `ci`, `build`, `chore`.
The scope names a crate, a repository-level concern (`readme`, `release`), or a layer
(`reference`). Imperative mood, no trailing period, subject under about 72 characters.

Pull requests should say **what was wrong**, not only what the diff does. If your change
alters an output document, include the before and after of the affected bytes — reviewers
in this project read documents, and a pasted diff of the JSON is more convincing than a
description of it.

## Where the authoritative description lives

Documentation is owned next to the code it describes. That is a rule with a cost — it means
this repository does **not** hold the CLI reference, the crate layout or the schema — and a
benefit: a behaviour change and its description land in one diff, reviewed together, instead
of drifting in two repositories until somebody notices.

So: change behaviour, change the page beside it. Change a boundary, change the page here.

## Reporting something that is wrong

A bug report that includes the exact command, the observed exit code and the verbatim output
is usually diagnosable without a round trip; the exit codes are documented in the engine's
`docs/troubleshooting.md` and exist so that a report can name its failure mode rather than
paste a stack trace. If the engine reported a result you believe is not supported by what it
observed — for example a dependency it inferred rather than read — that is the most valuable
kind of issue this project can receive, and it should be filed against the engine with the
input and the document attached.
