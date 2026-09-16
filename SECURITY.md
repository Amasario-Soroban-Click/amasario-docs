# Security

## What this repository is

Documentation: Markdown files, and three dependency-free Node scripts that check them. Nothing
here executes in a user's environment, holds a credential, or is deployed as anything other
than text on a forge.

## In scope

- **A script in this repository that does something other than read and report.** The three
  checkers walk the tree and print; a contribution that makes one of them write, fetch or
  execute would be a security change, not a tooling one.
- **A link that is not what it says it is.** This repository exists to be followed, and a link
  whose text describes one destination and points at another is a defect that a reader has no
  way to detect. External links are not fetched by CI, which is a deliberate limitation, and it
  makes the text of a link the only thing protecting a reader.
- **Instructions that are unsafe if followed literally** — a command that would destroy data,
  exfiltrate a credential or run unpinned code from the network.

## Out of scope

- The behaviour of any other repository. A vulnerability in the engine belongs in
  [`amasario-provenance-engine`](https://github.com/Amasario-Soroban-Click/amasario-provenance-engine);
  one in the site belongs in
  [`amasario-explorer`](https://github.com/Amasario-Soroban-Click/amasario-explorer).
- A page being wrong. That is a documentation defect, and it is welcome as an ordinary issue
  with the correction attached.

## Reporting

Open a private security advisory on this repository, or email the maintainer address in the
organisation profile. Include the file and the line, and what a reader would believe if they
followed it.
