local spec = {
  "neovim/nvim-lspconfig",
  opts = {
    servers = {
      basedpyright = {
        settings = {
          basedpyright = {
            analysis = {
              autoSearchPaths = true,
              useLibraryCodeForTypes = true,
              typeCheckingMode = "standard",
              autoImportCompletions = true,
              reportMissingTypeStubs = false,
              diagnosticMode = "openFilesOnly"
            },
          },
        },
      },
    },
  },
}

-- Disable nil_ls (nix language server) on hosts that do not contain "nix" in the hostname
if string.match(vim.fn.hostname(), "nix") == nil then
  spec.opts.servers.nil_ls = { mason = false }
end

return spec
