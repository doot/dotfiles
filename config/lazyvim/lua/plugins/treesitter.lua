-- luacheck: read globals vim, globals vim.g.loaded_nvim_treesitter
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars or grammars == "" then
  return {
    "nvim-treesitter/nvim-treesitter",
    -- An explicit install_dir puts the site on runtimepath even before it exists.
    opts = { install_dir = vim.fn.stdpath("data") .. "/site" },
  }
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
