-- luacheck: read globals vim
local nixos_options = ("(builtins.getFlake (builtins.toString ./.)).nixosConfigurations.%s.options"):format(
  vim.fn.hostname()
)

return {
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
        enabled = vim.fn.executable("nil") == 1,
        mason = false,
        settings = {
          ['nil'] = {
            nix = {
              flake = {
                autoArchive = true,
                -- TODO: Consider disabling this if evaluating flake inputs gets too expensive.
                autoEvalInputs = true,
              }
            }
          }
        }
      },
      nixd = {
        enabled = vim.fn.executable("nixd") == 1,
        mason = false,
        settings = {
          ['nixd'] = {
            nixd = {
              formatting = {
                command = { "nixfmt" };
              }
            },
            options = {
              nixos = {
                expr = nixos_options,
              },
              home_manager = {
                expr = nixos_options .. ".home-manager.users.type.getSubOptions []",
              }
            }
          }
        }
      },
      copilot = {
        settings = {
          telemetry = {
            telemetryLevel = "off"
          },
        },
      },
    },
  },
}
