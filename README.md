# quadrant

**A format for interactive scientific reports that connect text, code, tests
and a browser laboratory.** quadrant is three things in one repository:

1. a **Quarto extension** (`_extensions/quadrant`) with three shortcodes that
   make provenance explicit and checkable: `{{< src >}}` links an equation to
   the function that evaluates it, `{{< test >}}` links a claim to the test
   that pins it, `{{< lab >}}` opens the laboratory in a given state;
2. a **project template** (`template/`): a Quarto book with a tested Rust core
   compiled to WebAssembly, a laboratory whose whole state lives in the URL,
   an interactive SVG plot kit (zoom, pan, lin/log, SVG/CSV export), notation
   and status appendices, a shared brand, build revision in the footer, a
   provenance link checker, and a CI workflow that builds, checks, renders and
   deploys;
3. a **skill** (`template/.claude/skills/quadrant-report`) that tells an agent
   how to work in the format: derive, test, write, link, verify, release.

The demo built from the template on every push: https://yipihey.github.io/quadrant/

## Use

Start a new report:

```sh
git clone https://github.com/yipihey/quadrant
sh quadrant/scripts/new-report.sh my-report yourname/my-report   # fills in repo and site URLs
cd my-report
make wasm api site            # needs Rust (wasm32 target), wasm-pack, Quarto ≥ 1.6
python3 scripts/serve.py 8790 _site
```

Add the shortcodes to an existing Quarto project:

```sh
quarto add yipihey/quadrant
```

and tell them where to look (all optional; the defaults are shown):

```yaml
quadrant:
  crate: my_core        # crate name as rustdoc spells it (default: first crate under api/)
  api: api              # rustdoc output copied into the project (cargo doc --no-deps; cp -r target/doc api)
  tests: core/tests     # test sources
  app: app/index.html   # the laboratory page
```

Then in the text:

```markdown
the logistic function{{< src logistic >}} satisfies the equation{{< test logistic_solves_the_ode "ODE residual" >}}
{{< lab "r=2&k=3" "Open in the lab" >}}
```

Targets are resolved against the files on disk at render time; a misspelled
item gives a warning and a link to the crate index instead of a dead link, and
`scripts/check_links.py` turns that into a build failure in CI.

# The standard

## 1. Shape of a report

A report is a repository with four parts and one pipeline.

```
_quarto.yml  _brand.yml  CITATION.cff  Makefile  README.md
chapters/    narrative (Quarto book chapters), references.bib, notation.qmd, status.qmd
core/        the numerical core: a tested library (Rust by default) compiled to WebAssembly
app/         the standalone laboratory and the chapter widgets (plain ES modules, no bundler)
docs/        decisions, audits, this standard
_extensions/yipihey/quadrant/   the Quarto extension: provenance and lab shortcodes, their CSS
scripts/     build_info.py, brand_to_css.py, check_links.py, serve.py
.github/workflows/publish.yml   build core → docs → check → render → deploy
```

The pipeline is one workflow: build the WebAssembly, build the API
documentation into `api/`, check the provenance links, render the book,
deploy. Locally `make all` does the same; `make check` runs the link check.

## 2. The text

- A Quarto **book** (not a website): chapters cross-reference each other's
  equations and sections, so every equation that is referred to has a
  label (`{#eq-…}`) and every section that is linked has an explicit id
  (`{#sec-…}`).
- Numbered sections to depth 2, numbered equations, KaTeX math, full-text
  search, light and dark themes, `code-fold` and `code-tools` (readers can
  see the chapter source), `repo-actions: [edit, source, issue]`,
  Hypothesis annotations, `date-modified: last-modified`.
- Two appendices are mandatory: **Notation and conventions** (symbols, units,
  signs, clocks, estimator windows) and **Status** (build revision, what is
  verified and where, lineage, how to cite, how to share and annotate).
- Every chapter that introduces an experiment has a **"Try it" callout**
  ending in a `{{< lab >}}` button whose hash reproduces the experiment.
- Every citation is verified against ADS (or the field's equivalent) before
  it enters `references.bib`; keep the bibcode or DOI in the entry.
- Prose names a file or function only when the reader has to go there;
  provenance links carry the rest (section 4).

## 3. The laboratory and the widgets

- The app is standalone: served from `app/` with its own `index.html`,
  plain ES modules, the WebAssembly package in `app/pkg/`, no build step
  beyond `wasm-pack`. The book copies it verbatim (`resources: app/**`).
- **All state lives in the URL hash**, encoded by one schema
  (`app/js/state.js` (or `app/js/lab/state.js`): `[stateKey, hashKey, type, range]`). Only
  non-default values are written. A hash is therefore a permalink, a
  preset, a regression fixture and a deep-link target at once.
- A **presets** list (`app/js/lab/presets.js`) names the experiments of the
  lab guide by their hashes.
- Every panel has a caption, a "§ book" back-link to the section that
  explains it, an `aria-label`, and an **Explain** note in the app.
- **Plots** are theme-aware SVG from one class (`app/js/viz/plot.js`):
  interactive (wheel zoom, drag pan, double-click reset, lin/log toggles,
  typed ranges) and exportable (SVG, CSV). Field panels export PNG. A
  copy-link button copies the permalink.
- **Capability tiers**: WebGPU compute and rendering when available,
  Canvas2D and WebAssembly fallbacks, a lite mode for weak GPUs, a
  self-test page that validates the GPU path against the WebAssembly
  reference. A head include marks the document with the detected tier.
- Chapter widgets use one loader contract: `<div class="hcc-widget"
  data-widget="name"></div>` plus one module script per page.

## 4. Provenance: text ↔ code ↔ tests

Three shortcodes, provided by the `quadrant` extension, make the connection explicit
and checkable:

| Shortcode | Renders | Resolves against |
|---|---|---|
| `{{< src module::item >}}` | subtle superscript ⟨item⟩ linking to the rustdoc page | `api/` (built by `make api`) |
| `{{< test test_name "label" >}}` | badge "✓ label" linking to the test source | `core/tests/*.rs` |
| `{{< lab "hash" "label" >}}` | button opening the lab with that state | `app/js/state.js` (or `app/js/lab/state.js`) keys |

Rules:

1. Every equation the code evaluates carries a `src` link in the sentence
   that introduces it. Every quantitative claim ("agrees to 10⁻³", "mass is
   conserved") carries a `test` badge naming the test that pins it.
2. The rustdoc of the core is published with the report (`api/`); doc
   comments are therefore part of the publication and are written for
   readers, with the equation numbers of the text.
3. `scripts/check_links.py` fails the build when a `src` target has no
   page, a `test` name has no function, or a `lab` hash uses an unknown
   key.

## 5. Appearance

- `_brand.yml` holds the palette (and, optionally, fonts and logo). Quarto
  applies it to the book; `scripts/brand_to_css.py` turns it into
  `app/css/brand.css` (CSS custom properties, `--brand-*` and the app's
  `--hcc-accent`) so the laboratory uses the same colours. Change colours in
  one file only.
- Theme-dependent styling uses `currentColor` and CSS variables; nothing
  hard-codes a background. Plots inherit the page colour.

## 6. Sharing

- Footer: build revision and date (`scripts/build_info.py` →
  `_variables.yml` → `{{< var build.sha >}}`).
- `CITATION.cff` in the repository; a DOI (Zenodo) once released; the
  status appendix shows "cite as".
- Hypothesis for annotations; GitHub issues and "Edit this page" for
  corrections. Giscus (Discussions) is optional and needs the repository's
  Discussions enabled.
- Lab permalinks, SVG/CSV/PNG exports, named presets.
- The original notebooks or data that the report grew from are included and
  linked from the status appendix.

## 7. Verification before publication

The report is publishable when all of the following hold:

1. `cargo test --release` passes and every `test` badge names a passing
   test.
2. `make check` passes (provenance links resolve).
3. `quarto render` produces no unresolved cross-reference or citation
   warnings.
4. The rendered pages have been looked at in a browser: equation widths,
   callouts, provenance marks, lab deep links, console errors in the app.
5. CI is green and the deployed site loads the laboratory.

## 8. Reference implementation

The Hopf–Cole Cosmology book (https://github.com/yipihey/hopf-cole-cosmology,
https://yipihey.github.io/hopf-cole-cosmology/) is the first report in this
format and the place to look for a full-size laboratory (WebGPU compute and
rendering, 3D, self-tests, presets, PNG export of field panels).
