-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here
Snacks.toggle({
  name = "NES and inline_completion",
  get = function()
    return vim.g.sidekick_nes ~= false
  end,
  set = function(state)
    vim.g.sidekick_nes = state
    vim.lsp.inline_completion.enable(state)
  end,
}):map("<leader>uN")
