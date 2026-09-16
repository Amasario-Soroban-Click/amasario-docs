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

**Nothing is published to crates.io.** The engine and the specification are tagged,
reproducible source only. Publishing is a permanent promise about an API, and the honest
reason for waiting is that the reference contract workflow is not finished. Closing it is a
decision about appetite, not about mechanism.

**Test coverage is not measured in CI.** The suite is large and CI runs it on every change,
but there is no coverage job, so the project cannot state its own coverage number and this
page will not invent one. Closing it means adding coverage measurement to the pipeline and
publishing the figure — including if it is unflattering.

**The reference contract pair is not deployed.** Its contracts are built by a script whose
output digests are committed, and CI rebuilds them and compares, so the fixture is
reproducible evidence about a build. It is *not* a deployed Testnet contract, and no
on-chain contract ID is published anywhere in this organisation, because nothing has been
deployed. This matters mainly for how the claim is read: "we analysed a contract we built"
is a statement about the tool, whereas "we analysed a contract we deployed" is a statement
about a chain, and only the first one is currently true.

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
