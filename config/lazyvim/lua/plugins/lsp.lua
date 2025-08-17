local spec = {
  "neovim/nvim-lspconfig",
  ---@class PluginLspOpts
  opts = {
    ---@type lspconfig.options
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
              diagnosticMode = "openFilesOnly",
              reportUnannotatedClassAttribute = false,
              reportUndefinedVariable = "off", -- Ruff
              reportUnusedImport = false, -- Ruff
              disableOrganizeImports = false, -- Ruff/isort
            },
          },
        },
      },
      nil_ls = {
        settings = {
          ['nil'] = {
            nix = {
              flake = {
                autoArchive = true,
                -- TODO: This may take some time and consume a lot of resources, consider disabling it if it's not worth it
                autoEvalInputs = true,
              }
            }
          }
        }
      }
    },
  },
}

-- Disable nil_ls (nix language server) on hosts that do not contain "nix" in the hostname
if string.match(vim.fn.hostname(), "nix") == nil then
  spec.opts.servers.nil_ls = { mason = false }
end

return spec
