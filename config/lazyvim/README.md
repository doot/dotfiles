# 💤 LazyVim

A starter template for [LazyVim](https://github.com/LazyVim/LazyVim).
Refer to the [documentation](https://lazyvim.github.io/installation) to get started.

On `nix-slopfucker`, `doot`'s `lvim` uses tools from `PATH` instead of Mason. Start it inside the project's `devenv shell` for language support. For example, to edit Python and install missing Tree-sitter parsers without changing the host configuration:

```sh
nix shell nixpkgs#gcc nixpkgs#tree-sitter nixpkgs#ruff nixpkgs#basedpyright \
  -c env NVIM_APPNAME=lazyvim nvim
```

Without the parser toolchain, existing parsers still work; new ones are not installed automatically.
