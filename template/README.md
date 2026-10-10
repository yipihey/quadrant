# A Report (quadrant template)

A Quarto book with a tested Rust/WebAssembly core and a browser laboratory,
in the [quadrant](https://github.com/yipihey/quadrant) format.

```sh
make wasm      # WebAssembly package into app/pkg/
make api       # Rust API documentation into api/ (the ⟨name⟩ links in the text)
make check     # every provenance link resolves
make site      # render into _site/
make test      # the validation suite
python3 scripts/serve.py 8790 _site   # no-cache dev server
```

See `.claude/skills/quadrant-report/SKILL.md` for the working procedure and
`docs/decisions.md` for the conventions log.
