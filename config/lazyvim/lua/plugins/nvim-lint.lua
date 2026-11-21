-- luacheck: read globals vim
return {
  "mfussenegger/nvim-lint",
  opts = {
    linters = {
      statix = {
        condition = function()
          return vim.fn.executable("statix") == 1
        end,
      },
      ["markdownlint-cli2"] = {
        prepend_args = { "--config", vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"), "--" },
      },
    },
  },
}
