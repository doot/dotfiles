return {
  {
    "xiantang/darcula-dark.nvim",
    -- config = function()
    --   vim.cmd("colorscheme darcula-dark")
    -- end,
    dependencies = {
      "nvim-treesitter/nvim-treesitter",
    },
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "darcula-dark",
    },
  },
}
