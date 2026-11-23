-- luacheck: read globals vim LazyVim
return {
  "mfussenegger/nvim-lint",
  opts = function(_, opts)
    -- The Go adapter probes both commands for its arguments when first required.
    require("lint").linters.golangcilint = setmetatable({
      condition = function()
        return vim.fn.executable("golangci-lint") == 1 and vim.fn.executable("go") == 1
      end,
    }, {
      __index = function(_, key)
        return require("lint.linters.golangcilint")[key]
      end,
    })

    -- The Elixir extra replaces linters_by_ft after the Docker extra registers Hadolint.
    if LazyVim.has_extra("lang.docker") then
      opts.linters_by_ft.dockerfile = opts.linters_by_ft.dockerfile or { "hadolint" }
    end

    for _, cmd in ipairs({ "hadolint", "markdownlint-cli2", "sqlfluff", "statix" }) do
      opts.linters[cmd] = opts.linters[cmd] or {}
      opts.linters[cmd].condition = function()
        return vim.fn.executable(cmd) == 1
      end
    end
    opts.linters["markdownlint-cli2"].prepend_args = {
      "--config",
      vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"),
      "--",
    }
  end,
}
