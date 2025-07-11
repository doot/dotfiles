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
vim.g.lazyvim_python_ruff = "ruff"

-- Dedicated venv that has pynvim installed. Specifying this explicitly reduces startup time.
vim.g.python3_host_prog = "~/.dotfiles/pynvim.venv/.venv/bin/python3"

-- Better vimdiff options
vim.opt.diffopt="internal,filler,closeoff,indent-heuristic,linematch:60,algorithm:histogram"

-- Shortcusts for to get shit to and from system clipboard
 vim.keymap.set('n', '<leader>y', '"+y')
 vim.keymap.set('n', '<leader>p', '"+p')
 vim.keymap.set('n', '<leader>P', '"+P')
 vim.keymap.set('v', '<leader>y', '"+y')
 vim.keymap.set('v', '<leader>p', '"+p')
 vim.keymap.set('v', '<leader>P', '"+P')
