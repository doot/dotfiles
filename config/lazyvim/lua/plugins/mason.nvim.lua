-- luacheck: read globals vim LazyVim
if vim.fn.has("mac") == 0 or vim.fn.executable("nix") == 1 then
  return {
    { "mason-org/mason.nvim", cond = false },
    { "mason-org/mason-lspconfig.nvim", cond = false },
    { "jay-babu/mason-nvim-dap.nvim", cond = false },
  }
end

return {
  "mason-org/mason.nvim",
  specs = {
    {
      "mason-org/mason-lspconfig.nvim",
      optional = true,
      init = function()
        LazyVim.on_load("nvim-lspconfig", function()
          local settings = require("mason-lspconfig.settings").current
          local excluded = vim.tbl_get(settings, "automatic_enable", "exclude")
          if not excluded then
            return
          end
          -- A project server need not wait for Mason to finish installing its own copy.
          local servers = LazyVim.opts("nvim-lspconfig").servers
          local available = vim.tbl_filter(function(name)
            if not servers[name] or vim.tbl_get(servers, name, "mason") ~= nil then
              return false
            end
            if vim.lsp.is_enabled(name) or vim.tbl_contains(excluded, name) then
              return false
            end
            local cmd = vim.tbl_get(vim.lsp.config, name, "cmd", 1)
            return type(cmd) == "string" and vim.fn.executable(cmd) == 1
          end, settings.ensure_installed)
          if #available > 0 then
            vim.lsp.enable(available)
          end
        end)
      end,
    },
  },
  opts = {
    PATH = "append", -- Allow any locally installed tools to take precedence over mason
    ensure_installed = {
      "autotools-language-server",
      "bacon-ls",
      "bacon",
      "basedpyright",
      "bash-language-server",
      "checkmake",
      "cmakelang",
      "cmakelint",
      "codelldb",
      "copilot-language-server",
      "debugpy",
      "delve",
      "docker-compose-language-service",
      "dockerfile-language-server",
      "elixir-ls",
      "flake8",
      "gitui",
      "gofumpt",
      "goimports",
      "gomodifytags",
      "gopls",
      "hadolint",
      "helm-ls",
      "impl",
      "js-debug-adapter",
      "json-lsp",
      "lua-language-server",
      "markdown-toc",
      "markdownlint-cli2",
      "marksman",
      "mypy",
      "neocmakelsp",
      "ruff",
      "rust-analyzer",
      "shellcheck",
      "shfmt",
      "sqlfluff",
      "stylua",
      "taplo",
      "texlab",
      "vtsls",
      "yaml-language-server",
      "helm-ls",
      "sqls",
    },
  },
}
