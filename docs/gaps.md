# Gaps

What the project has not done, cannot do, or has decided not to do. This page is meant to be
read rather than defended, and it is deliberately the most concrete page here: a gap with no
detail is a hedge, and hedges are worse than gaps.

Each entry says what is missing, and either what would close it or why it is permanent.

## Deliberate, and permanent

**The engine is read-only, and always will be.** It holds no key, signs no transaction, and
deploys nothing. This is a property of the whole stack rather than a setting, and it is the
reason its documents can be trusted as observations: a tool that can also act has an
incentive to describe its action favourably. If you want deployment, this is not that tool,
and adding it would not be a feature.

**The explorer does not analyse.** It renders documents the engine committed, at digests
recorded in a manifest. There is no query box that takes a contract ID, because the moment
there is one, the arrow drawing becomes an implementation of the analysis instead of a
rendering of it. This is a real limitation and it is not going to be lifted.

**Off-chain facts are out of scope.** A dependency recorded on chain can be observed. A
GitHub release, a build log, a maintainer's intent cannot, and the engine does not guess at
them. Where an off-chain fact is needed, a document is handed to the engine as input rather
than fetched by it, so the boundary stays where the operator put it.

## Known, with a path to close

**Nothing is tagged and nothing is published.** The engine and the specification are
reproducible source only. This paragraph used to say they were "tagged", and that was wrong:
neither repository has ever had a tag. What exists is a release workflow in each, gated on a
`v*` tag, and a `release.sh` that reads the same version out of the manifest — so the
mechanism is written and has never been exercised, which is a different statement from
having released something.

The workflow refuses a tag that disagrees with `Cargo.toml`, and dispatching it by hand on a
branch is rejected for exactly that reason, so the first real release is the first time that
gate runs for real. Publication also needs a `CARGO_REGISTRY_TOKEN` secret that is not
configured, so the publish step would fail until one is added. Publishing is a permanent
promise about an API, and the honest reason for waiting is that the reference contract
workflow is not finished. Closing this means pushing a tag and adding the secret — a
decision about appetite, not about mechanism.

**Coverage is measured, and is not yet a gate.** The engine now states its coverage —
88.14% of lines, 89.25% of regions — with the command that reproduces it, and per crate
between 79.79% and 97.39% for eleven of the twelve. What is still missing is the enforcement:
no workflow fails when the figure drops, so the number is a fact about one afternoon rather
than a property the project holds. Two of the figures also carry caveats that matter more
than the number, and both are published rather than rounded: `amasario-cli` reports about
24% because the binary it is tested through is built separately from the instrumented run,
and the snapshot suite needs a `cargo build` that coverage does not perform. Closing this
means fixing the harness first and gating second, in that order — a gate built on a run that
cannot execute the suite is a gate that excludes the tests most likely to catch a change.

**The reference contract pair is deployed, and the scheduled live suite still does not use
it.** The pair is live on Testnet — the callee at
`CBMPDHYWBGBJ4JAUKNLE6OTC4LQTLV3XFVMAN72MCFSMN2EOJPYEXK6N` and the caller at
`CBNCEDVA7SQ2NSNGG7RGQOK4VESBN2YSCLJ6DSHRL6QH72VPR5MYIVCA`, with both deployed modules
hashing to the committed fixtures — so "we analysed a contract we built" has become "we
analysed a contract we deployed", which is a statement about a chain rather than about a
tool. What has *not* changed is which contract CI's live run analyses:
`scripts/live-target.env` still names a third-party market, because the assertion there is
that a contract in ordinary use yields a verified `INVOCATES` edge, and a pair that is
called only when someone runs the deploy script is quiet by default. So the engine can
analyse its own contract, and has — the record is in the engine's `docs/testnet.md` — but
the scheduled run does not, and a reader who assumes otherwise has been misled by the word
"deployed" rather than by anything the tools say. Closing this means moving the deployment
into a pipeline rather than leaving it a maintainer's command, which is a decision about
whose key signs rather than about mechanism.

**Bounded searches are disclosed but still bounded.** A path search that reaches its limit
reports truncation rather than silently returning a short list — a bug of exactly the
opposite kind used to exist here and was found by the fuzzer. The bound itself remains a
bound: a default depth is a default, and a reader who wants a different one has to ask.

**The documentation is markdown, not a site.** The explorer renders the pages, which is
enough for reading them and not the same as a searchable documentation site with versioned
snapshots. Nobody has needed the latter yet.

**Interactive graph exploration is limited to what was vendored.** Graphs beyond roughly the
sizes in the committed fixtures are drawn with a layout that was written for graph reading,
not for graph *work*, and the viewer will be slow on documents an order of magnitude larger
than the fixtures it ships with. The engine's `all_paths_bounded` will be the first thing to
notice.

## Unproven, and worth saying so

**The specification has one implementation.** It is written to be implementation-agnostic and
it is validated by vectors, but a second independent implementation has never been attempted,
and until one exists the specification's neutrality is an intention rather than a
demonstrated property. This is the gap with the highest information value in the list: the
first person to write a second consumer will find out where the model leaked Rust-shaped
assumptions, and that feedback is worth more than any amount of internal review.

**Adoption is not measured.** There is no telemetry, by design, so there is no way to know
whether anyone outside the organisation uses the engine. Any statement about usage would be
a guess.
