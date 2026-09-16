# Architecture across the layers

The engine's own `docs/architecture.md` describes the crate stack inside it, which is the
right place for that page: it changes whenever a crate changes. This page is about the
seams **between** repositories, which change far less often and which no single repository
can describe.

## The four layers

```text
   ┌──────────────────────────────────────────────────────────────┐
   │  amasario-explorer          presentation                     │
   │  renders documents; analyses nothing; contacts no network    │
   └───────────────────────────┬──────────────────────────────────┘
                               │  vendored documents + digests
   ┌───────────────────────────┴──────────────────────────────────┐
   │  amasario-provenance-engine    execution                     │
   │  observes, classifies, refuses, emits documents              │
   └───────────────────────────┬──────────────────────────────────┘
                               │  schemas, taxonomies, vectors
   ┌───────────────────────────┴──────────────────────────────────┐
   │  amasario-provenance-spec      normative                     │
   │  defines what a document means; implementation-agnostic      │
   └──────────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────────┐
   │  amasario-docs          cross-cutting: the seams above       │
   └──────────────────────────────────────────────────────────────┘
```

Read the arrows as "is validated against", not "imports". Each arrow is narrower than a
code dependency, and that is deliberate.

## The rules that hold the layers apart

**1. The specification does not know about implementations.** It contains schemas, models
and vectors, and no consumer. A specification that ships an implementation is a
specification with one consumer, and then it is simply that consumer's documentation. This
is also the reason it can be read by a team that will never write Rust.

**2. The engine does not redefine the normative model.** Where a Rust type is needed to
carry a normative concept — a status, a relationship, a basis — it is named after the
concept and validated against the specification's own vocabulary, rather than against a
locally convenient restatement. Duplicating a vocabulary is how a consumer and a
specification begin to disagree without anyone noticing.

**3. The explorer does not analyse.** It renders the engine's committed documents and
nothing else: no parsing of WebAssembly, no inference, no network call. Every document it
shows is vendored at a recorded commit, and its CI re-checks the digest of every copy. This
restriction is what makes it safe to look at: a tool that draws arrows is more persuasive
than the JSON underneath it, so the picture must not be able to claim more than the table
beside it.

**4. Read-only is a property of the whole stack, not a policy statement.** Nothing in any
layer holds a key, signs a transaction or deploys anything. The reference contract pair in
the engine repository exists to be *analysed* — it is a reproducible fixture with a
recorded digest, not a deployed service.

## What each layer promises the layer below

The arrows above are only useful if each one is a checkable claim. They are:

| Seam | The promise | How it is checked |
| --- | --- | --- |
| spec → engine | A document the engine emits validates against the specification's schema. | Schema validation in the engine's suite, and the specification's `vectors/` suite reproduced byte for byte. |
| engine → explorer | Every file the explorer displays is the engine's file, unchanged, at its recorded digest. | The explorer's `scripts/verify-manifest.mjs` re-hashes each vendored file against `docs/manifest.json`; a mismatch fails CI. |
| engine → explorer | Nothing the explorer draws was computed by the explorer. | The layout and diff modules in the explorer are pure functions over already-parsed documents, and are unit-tested as such. |
| spec → engine | A normative change is visible as a validation failure, not as a different result. | The compatibility policy in [`compatibility.md`](compatibility.md). |

That third row is the one worth pausing on. "The explorer does not analyse" is easy to
write and easy to erode — one convenient `parseInt` of a digest, one re-derived edge, and
the diagram has become a second implementation. The manifest check cannot catch a subtle
re-derivation, so the architectural rule is the check, and a reviewer is asked to treat
"computed in the browser" as the failure rather than as an optimisation.

## Where a change travels

A change that stays inside one layer is a normal pull request. A change that crosses a
layer is a sequence, and the order matters:

1. **Normative change** — what a document means changes. It starts in
   `amasario-provenance-spec`, as a schema and a vector change, and it is released as a new
   specification version.
2. **Execution change** — the engine adopts the new version, and the vectors it reproduces
   change or grow with it. The engine's suite is the evidence that adoption is complete.
3. **Presentation change** — the explorer re-vendors the engine's documents and updates its
   manifest. Its digest check then proves the display matches the new documents, rather
   than asserting it in prose.
4. **Cross-cutting change** — a policy or boundary moved, so the page describing it here
   moves too.

Steps 1 and 2 are separate releases on purpose. If they were one, a consumer of the
specification could not distinguish "the meaning changed" from "the implementation caught
up", and the second is not a breaking change in the same sense as the first.

## Why four repositories rather than one

The split is not a directory layout with more ceremony. Each boundary answers a question
that a reader would otherwise have to assume:

- **Is this meaning, or is this behaviour?** The specification boundary makes a schema
  change reviewable by people who do not read Rust, and makes an accidental meaning change
  fail loudly.
- **Is this observed, or is this drawn?** The engine/explorer boundary means a rendered
  graph can always be traced to the document it came from.
- **Is this about one component, or about the system?** The documentation boundary keeps
  pages about the seams from being buried in the repository whose code happens to be handiest,
  where they would be reviewed by the wrong people and updated by nobody.

The cost is real: four places to look, and a release order to respect. It buys a set of
claims that can be checked individually, which one repository cannot offer — inside one
repository, "the picture matches the data" is a review convention, and across repositories
it is a digest check.
