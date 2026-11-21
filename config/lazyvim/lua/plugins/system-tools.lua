if not vim.g.lazyvim_system_tools then
  return {}
end

local specs = {
  { "mason-org/mason.nvim", cond = false },
  { "mason-org/mason-lspconfig.nvim", cond = false },
  { "jay-babu/mason-nvim-dap.nvim", cond = false },
  {
    "mfussenegger/nvim-lint",
    opts = { linters = { statix = {
      condition = function()
        return vim.fn.executable("statix") == 1
      end,
    } } },
  },
  {
    "neovim/nvim-lspconfig",
    opts = function(_, opts)
      -- These servers use Lua launchers rather than an argv list in lspconfig.
      local launchers = { jsonls = "vscode-json-language-server", yamlls = "yaml-language-server" }
      for name, server in pairs(opts.servers) do
        if name ~= "*" and server ~= false then
          local config = vim.lsp.config[name] or {}
          local cmd = type(server) == "table" and server.cmd or config.cmd
          local exe = type(cmd) == "table" and cmd[1] or launchers[name]
          if not exe or vim.fn.executable(exe) == 0 then
            opts.servers[name] = false
          end
        end
      end
    end,
  },
}

if not require("lazyvim.util.treesitter").check() then
  table.insert(specs, {
    "nvim-treesitter/nvim-treesitter",
    build = false,
    opts = function(_, opts)
      opts.ensure_installed = {}
    end,
  })
end

return specs
