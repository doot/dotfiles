return {
  "mfussenegger/nvim-lint",
  opts = {
    linters = {
      ["markdownlint-cli2"] = {
        prepend_args = { "--config", vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"), "--" },
      },
    },
  },
}
