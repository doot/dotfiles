-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

-- Disable auto-format
vim.g.autoformat = false

-- Disable relative line numbers
vim.opt.relativenumber = false

-- Disable yanking to system clipboard, what the fuck is this shit?
vim.opt.clipboard = ""

vim.opt.textwidth = 160

-- Change the terminal's title
vim.opt.title = true
vim.opt.titleold = "bash"

-- Switch from pyright to basedpyright
vim.g.lazyvim_python_lsp = "basedpyright"
