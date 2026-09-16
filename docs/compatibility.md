# Compatibility

Two version numbers move independently across this organisation, and confusing them is the
most likely way a consumer gets hurt.

- **The specification's version** — what a document *means*. Normative.
- **The engine's version** — the implementation that produces one.

An engine release that changes nothing about meaning is not a specification event. A
specification release that changes a field is an engine event, and the engine's job is to
make it fail rather than to guess.

## What the engine promises

The engine carries one constant, `SUPPORTED_SPEC_VERSION`, and behaves as follows:

| The document says | The engine |
| --- | --- |
| The supported version | Proceeds. |
| A **different major** version | Refuses outright. The document is the wrong shape; nothing is inferred from it. |
| A **newer minor** version | Refuses rather than guessing at a field it does not implement. An unread field is a fact the engine did not observe, and reporting it as observed would be a lie in the most dangerous direction. |
| An older minor version | Accepts, because a documented field that has since been added is absent rather than unknown. |

Every document the engine emits is stamped with both numbers — the specification version it
was produced against, and the engine's own — under a versioned API envelope
(`amasario.dev/v1`). A consumer therefore never has to infer which contract a document was
written under, and a stored document remains interpretable after both tools move on.

The general principle underneath all four rows is the engine's governing rule:

> The engine must never convert a failure into an empty result.

A version mismatch is not an empty analysis. It is a refusal, and it is reported as one.

## What counts as breaking

The interesting cases are not function signatures. They are meaning changes, which are
invisible to a type checker and very visible to someone reading a dashboard.

**Breaking, even though it compiles:**

- A status word changes what it establishes. If `VERIFIED` came to mean "the digests
  matched" rather than what it means now, every stored document has quietly changed meaning.
- Two concepts are merged. The five verification statuses are deliberately not degrees of one
  scale — `UNVERIFIED` and `CONFLICTING` mean opposite things, and collapsing them would make
  "we could not check" read as "we checked and it was worse".
- A field becomes populated that used to be absent, with a different implication. "No
  dependency was found" and "no search for dependencies was performed" must never converge
  into the same JSON.
- A default bound changes. An analysis that searched to depth 3 and found nothing is not the
  same claim as one that searched to depth 10, and the document has to say which it was.

**Not breaking:**

- A new optional field, and a new failure mode that could not previously occur.
- A new command, a new flag, a new output format.
- A performance change with identical output.

**A new failure mode is worth a second look even though it is compatible.** It is compatible
in the sense that nothing that used to validate stops validating, and it may still change an
operator's night: a pipeline that previously always produced a result now has a way to be
refused. The engine's rule makes this happen on purpose — refusing is correct when the
alternative is an empty result — but it is called out in the changelog so it is not
discovered at 3am.

## How the policy is enforced, not merely stated

A policy with no mechanism is a preference. Each seam has one:

| Claim | Mechanism |
| --- | --- |
| The engine conforms to the specification. | The specification's `vectors/` suite: each vector has a canonical serialisation and a digest, and the engine reproduces them byte for byte. |
| Documents are stable across runs. | Determinism tests in the engine: identical inputs produce identical bytes, including key order and floating-point-free formatting. |
| The explorer shows the engine's actual output. | A manifest of digest-pinned vendored documents, re-verified in the explorer's CI. |
| The supported version is real. | It is a constant with tests over malformed and unsupported version strings, and the versions the engine rejects are enumerated rather than sampled. |

Byte-for-byte reproducibility is the load-bearing part. It is what turns "the engine
implements the specification" from a claim into a comparison, and it is also what makes the
explorer's digest pinning meaningful — a digest is only a contract if the bytes behind it
are stable.

## Deprecation

There is no removal without a period of being wrong loudly. A field or flag is marked
deprecated in the specification first, documented as deprecated by the engine, and removed
no earlier than the next major version — with the specification version carrying the
authority. Quiet removal is exactly the change this policy exists to prevent: it is the one
form of breakage that no vector, no digest and no schema check can catch after the fact,
because the document with the old field is still on disk and still looks valid.
