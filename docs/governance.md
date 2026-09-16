# Governance

This project is small enough that governance could be a sentence — "the maintainers decide"
— and the honest version of this page is that the constraints below do more work than the
process does. They are written down because they are the parts a contributor can rely on
and predict, not because there is a committee.

## Who decides

Maintainers merge. A maintainer is someone with write access to the repository in question,
and the list is visible in the organisation's members rather than maintained by hand here,
because a hand-maintained list of who can merge is wrong within a month.

Two roles have a narrower scope on purpose:

- **Specification changes** are merged only in `amasario-provenance-spec`, and only with a
  vector alongside them. A schema change with no vector is a change nobody can check.
- **Cross-cutting policy** — this repository — is merged as documentation. It carries no
  code, so the bar is that the page still describes the other repositories accurately, and
  the failure mode to guard against is a page that is plausible and stale.

## The order that is not negotiable

Meaning changes start in the specification. This is the one procedural rule with teeth:
an engine pull request that alters what a field means, without a corresponding
specification change, is closed rather than merged. It is not a matter of seniority or of
the change being obviously correct — if the meaning moved, the document that defines the
meaning has to move, or the next person cannot tell which repository to believe.

The full sequence is in [architecture](architecture.md#where-a-change-travels).

## What a reviewer is asked to look for

Reviewers in this project are asked to weigh a short list above style, because the style is
already enforced by `fmt` and `clippy` and does not need a human:

1. **Did a failure become an empty result?** This is the governing rule of the project, and
   the single most important thing to catch. An error path that returns `[]` or `None`
   hands the reader a confident lie.
2. **Is a claim supported by an observation?** A value that was inferred and is presented
   as read is the bug class the whole design exists to prevent.
3. **Is a bound disclosed?** A search that stopped at its limit must say so, in the document,
   not only in a log line.
4. **Does the change to behaviour come with a change to the page beside it?** Documentation
   is owned next to the code it describes.
5. **Is the negative case tested?** A refusal is a feature here, so it needs a test.

## Changing this policy

Open a pull request against this repository that says what the current text fails to
capture. Governance pages rot in a particular way: they describe an intention nobody
followed. If the text and the practice have diverged, the practice is the fact and the text
is the bug, so the fix is usually to write down what actually happens — including when that
is less flattering than the process it replaces.

## What is deliberately absent

There is no roadmap with dates, no contributor licence agreement, no release train and no
foundation. Where a decision has been made to stay out of scope rather than to postpone
something, it is recorded in [gaps](gaps.md) — a list that is meant to be read, not
defended.
