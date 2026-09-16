# Amasario — documentation

[![Walkthrough](https://img.shields.io/badge/%E2%96%B6_watch-the_5--minute_walkthrough-58a6ff)](https://amasario-explorer.vercel.app/pitch/amasario-pitch-v2.mp4)

[![Press play: the five-minute walkthrough](https://amasario-explorer.vercel.app/pitch/amasario-pitch-thumbnail.png)](https://amasario-explorer.vercel.app/pitch/amasario-pitch-v2.mp4)

Amasario is four repositories, and this is the one that is about the other three. It holds
what belongs to no single layer: how the layers fit together, what each promises the others,
how a change travels between them, and what the project has not done yet.

| Repository | Layer | Owns |
| --- | --- | --- |
| [`amasario-provenance-spec`](https://github.com/Amasario-Soroban-Click/amasario-provenance-spec) | Normative | What a document *means*: schemas, taxonomies, models, rules, fixtures and deterministic vectors. |
| [`amasario-provenance-engine`](https://github.com/Amasario-Soroban-Click/amasario-provenance-engine) | Execution | What was *observed* and what was *refused*: a Rust workspace that inspects contracts and produces the documents. |
| [`amasario-explorer`](https://github.com/Amasario-Soroban-Click/amasario-explorer) | Presentation | Rendering those documents in a browser — [live at amasario-explorer.vercel.app](https://amasario-explorer.vercel.app). |
| `amasario-docs` | Cross-cutting | This repository: the seams, the policy, the contributor path and the gaps. |

## What belongs in this repository

A page belongs here when answering its question requires reading **more than one** of the
other repositories. That is the whole rule, and it is worth stating as a table because the
failure mode is a page that quietly duplicates something that already has an owner.

| Question | Where the answer lives |
| --- | --- |
| What does an impact-analysis document mean? | The specification — normative, versioned, with vectors. |
| Which flag produces one, and what exit code does it return? | The engine's [`docs/`](https://github.com/Amasario-Soroban-Click/amasario-provenance-engine/tree/main/docs). |
| How is it drawn? | The explorer's README. |
| Why is the analysis split across twelve crates, and which of them may touch a network? | **Here** — [architecture](docs/architecture.md). |
| What happens to the engine when the specification changes a field? | **Here** — [compatibility](docs/compatibility.md). |
| What has the project deliberately not done? | **Here** — [gaps](docs/gaps.md). |

The test is not "is this interesting" but "would this page change if a *different*
repository changed". If one repository owns the answer, the page belongs beside the code it
describes, so that a behaviour change and its description land in the same diff and the same
review. This repository is the residual — the pages that span the seams, where no single
repository can be the authority.

That is also why none of these pages repeats a test count, a crate list or a flag table. A
number copied into a second repository is a number that will be wrong in one of them, and
there is no CI that can tell you which.

## The pages

| Page | Question it answers |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | What are the four layers, which direction may a dependency point, and why is the split where it is? |
| [`docs/compatibility.md`](docs/compatibility.md) | What is a breaking change, and what happens downstream when one lands? |
| [`docs/contributing.md`](docs/contributing.md) | I want to change something — which repository, in what order, and what must pass? |
| [`docs/governance.md`](docs/governance.md) | Who decides, how is a normative change proposed, and what does a reviewer look for? |
| [`docs/releases.md`](docs/releases.md) | What is in a release, how is it tagged, and what does a version number promise? |
| [`docs/gaps.md`](docs/gaps.md) | What is known to be missing, unproven or deliberately out of scope? |
| [`docs/glossary.md`](docs/glossary.md) | What do these words mean here, where they mean something else elsewhere? |

## The one sentence

Read-only provenance, dependency and impact analysis for Soroban contracts: the tool reports
what it observed, names the boundary where observation stopped, and distinguishes "nothing
was found" from "nothing looked" — because those two are the same word in almost every tool
that does this, and they are not the same fact.

## Licence

Apache-2.0, as the rest of the organisation.
