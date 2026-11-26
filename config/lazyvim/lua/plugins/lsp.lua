return {
  "neovim/nvim-lspconfig",
  ---@class PluginLspOpts
  opts = {
    ---@type lspconfig.options
    servers = {
      -- Mason's separate tool list supplies the fallback without delaying a project server.
      gopls = { mason = false },
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
        mason = false,
        settings = {
          ["nil"] = {
            nix = {
              flake = {
                autoArchive = false,
                autoEvalInputs = false,
              },
            },
          },
        },
      },
      nixd = {
        mason = false,
        settings = {
          nixd = {
            formatting = { command = { "nixfmt" } },
          },
        },
      },
      statix = false,
      copilot = {
        settings = {
          telemetry = {
            telemetryLevel = "off",
          },
        },
      },
    },
  },
}
