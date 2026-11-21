-- luacheck: read globals vim
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
                -- TODO: This may take some time and consume a lot of resources, consider disabling it if it's not worth it
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
                expr = string.format("(builtins.getFlake (builtins.toString ./.)).nixosConfigurations.%s.options", vim.fn.hostname()),
              },
              home_manager = {
                expr = string.format("(builtins.getFlake (builtins.toString ./.)).nixosConfigurations.%s.options.home-manager.users.type.getSubOptions []", vim.fn.hostname()),
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
