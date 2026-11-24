-- luacheck: read globals vim LazyVim
local tools = {
  credo = { "mix" },
  golangcilint = { "go", "golangci-lint" },
  hadolint = { "hadolint" },
  ["markdownlint-cli2"] = { "markdownlint-cli2" },
  sqlfluff = { "sqlfluff" },
  statix = { "statix" },
}

return {
  "mfussenegger/nvim-lint",
  opts = {
    linters = {
      ["markdownlint-cli2"] = {
        prepend_args = { "--config", vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"), "--" },
      },
    },
  },
  init = function()
    if LazyVim.has("mason.nvim") then
      return
    end
    LazyVim.on_load("nvim-lint", function()
      local linters = LazyVim.opts("nvim-lint").linters
      local by_ft = require("lint").linters_by_ft
      for ft, names in pairs(by_ft) do
        by_ft[ft] = vim.tbl_filter(function(name)
          local config = linters[name]
          -- Project launchers resolve their own commands, directories and environment.
          if type(config) == "function" or (config and (config.cmd or config.cwd or config.env)) then
            return true
          end
          return vim.iter(tools[name] or {}):all(function(cmd)
            return vim.fn.executable(cmd) == 1
          end)
        end, names)
      end
    end)
  end,
}
