-- luacheck: globals vim
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars then
  -- An explicit install_dir makes new parsers visible without a restart.
  return { "nvim-treesitter/nvim-treesitter", opts = { install_dir = vim.fn.stdpath("data") .. "/site" } }
end

return {
  "nvim-treesitter/nvim-treesitter",
  build = false,
  -- The plugin script registers :TS commands that manage a writable parser site.
  init = function()
    vim.g.loaded_nvim_treesitter = true
  end,
  cmd = function()
    return {}
  end,
  opts = function(_, opts)
    opts.install_dir = grammars
    opts.ensure_installed = {}
  end,
}
