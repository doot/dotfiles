# 💤 LazyVim

A starter template for [LazyVim](https://github.com/LazyVim/LazyVim).
Refer to the [documentation](https://lazyvim.github.io/installation) to get started.

## Java debugging without Mason

Put `jdtls` on the project's `PATH`, or set LazyVim's `cmd` or `full_cmd` to use
a custom launcher. For debugging, add the `share` directory of
`pkgs.vscode-extensions.vscjava.vscode-java-debug` to `XDG_DATA_DIRS`; for JUnit,
also add the one from `vscode-java-test`. Neither extension is needed for editing.

Pin compatible versions in the project: `vscode-java-test` 0.45.0 works with
JDTLS 1.58.0, but its ASM requirement prevents it from loading with stock JDTLS 1.63.0.
