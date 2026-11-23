-- luacheck: read globals vim
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

    opts.linters = vim.tbl_deep_extend("force", opts.linters, {
      sqlfluff = {
        condition = function()
          return vim.fn.executable("sqlfluff") == 1
        end,
      },
      statix = {
        condition = function()
          return vim.fn.executable("statix") == 1
        end,
      },
      ["markdownlint-cli2"] = {
        prepend_args = { "--config", vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"), "--" },
      },
    })
  end,
}
