# Releases

Four repositories, two version numbers, and one rule: **a release is a claim about bytes,
and it is only a release if the bytes can be reproduced.**

## What moves independently

| Artifact | Versioned by | What the number promises |
| --- | --- | --- |
| `amasario-provenance-spec` | Its own tags | The meaning of documents: schemas, vocabularies, vectors. |
| `amasario-provenance-engine` | Its own tags, plus `SUPPORTED_SPEC_VERSION` | The implementation, and which specification version it conforms to. |
| `amasario-explorer` | Continuous deployment | Nothing — it renders pinned documents, so its release is a commit, not a promise. |
| `amasario-docs` | None | Nothing. It is prose; it is corrected in place. |

The two that carry promises are the spec and the engine, and they move separately on
purpose. A consumer of the specification needs to distinguish "the meaning changed" from
"the implementation caught up", because only the first is breaking in a way that invalidates
something they have already stored.

The engine refuses a document from a newer minor specification version rather than guessing
at a field it does not implement, and refuses a different major family outright. That
behaviour is what makes the version number worth reading — see
[compatibility](compatibility.md).

## The order

1. **Specification release.** Schema and vector change, merged with vectors, tagged.
2. **Engine release**, if it consumes the change: adopt the version, reproduce the vectors,
   update `SUPPORTED_SPEC_VERSION`, and note the new failure modes the adoption creates.
3. **Explorer re-vendors** the engine's documents and re-pins digests. Automated; it is the
   digest check, not a human, that decides whether the display still matches.
4. **Docs are amended in place** if a boundary or policy moved.

Steps 1 and 2 must not be one release. That is the point of the split.

## What a release notes

The engine's `CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and calls out, separately from ordinary entries, the two categories that a version number
does not convey on its own:

- **Meaning changes** — anything that alters what a document says, which is breaking for a
  consumer even when every function signature is unchanged.
- **New failure modes** — additions that are compatible by the letter of the policy and can
  still change an operator's night, because a pipeline that always produced a result now has
  a way to be refused.

Reproducibility is part of the release, not a separate concern. The reference contract pair
in the engine repository is built by a script whose digests are committed, and CI rebuilds
and compares them: if the same source produces different bytes on another machine, the
fixtures are not evidence and the release does not mean what it says. That check exists
because it once failed — an absolute path from the build machine had been baked into a
contract's bytes — which is also why the pinning is a rebuild-and-diff rather than a stored
digest alone.

## Publishing status

**Nothing here is tagged and nothing is published.** Neither the engine nor the specification
has ever had a tag, and no version of either has been published to crates.io. The engine's
`CHANGELOG.md` agrees and says so in its own words: its `1.0.0` heading is marked
*unreleased*, followed by "No version of this engine has been published yet".

What exists is the mechanism, not a release. Each repository carries a `release.yml` gated on
a `v*` tag, and a `release.sh` that reads the version out of the manifest rather than being
told it. That workflow has never run, because no tag has been pushed — dispatching it by hand
on a branch is refused by its own version check, which is the gate working rather than a
fault. Publication additionally needs a `CARGO_REGISTRY_TOKEN` secret that is not configured,
so the publish step would fail until one is added.

This is a deliberate gap rather than an oversight, and it is recorded in [gaps](gaps.md) with
what would have to change for it to close: a crates.io release is a permanent promise about
an API, and this project would rather make that promise once the reference contract's story
is finished than make it early and negotiate afterwards.

An earlier version of this page said the engine and the specification were "released as
tagged, reproducible source". Reproducible source is right; tagged was not, and a reader
checking the releases list against this page would have found the page wrong in the direction
that flatters the project. The distinction is worth keeping in the document rather than
quietly editing away, because "we have a release process" and "we have made a release" are
the two sentences this whole page exists to keep apart.
