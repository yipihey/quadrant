# Changelog

## 0.1.2 — 2026-10-09

Fix: configured paths (`api`, `tests`, `app`) are taken relative to the project root even though Quarto rewrites
them per document; file checks use the project directory. Chapters in subdirectories got `../../api` links before.

## 0.1.1 — 2026-10-09

`test` badges honour `repo-subdir`; `new-report.sh DIR OWNER/REPO` fills in the repository; the demo is built for the
real repository with `repo-subdir: template`.

## 0.1.0 — 2026-10-09

First release: the `quadrant` Quarto extension (`src`, `test`, `lab` shortcodes
with on-disk resolution), the project template (tested Rust/WASM core, hash-state
laboratory, interactive plot kit, appendices, brand, build info, link checker,
CI), the `quadrant-report` skill, and the specification (README).
