-- luacheck: read globals vim, globals vim.g.loaded_nvim_treesitter vim.opt.rtp
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars or grammars == "" then
  -- lazy.nvim drops nonexistent runtime directories when it loads plugins.
  vim.fn.mkdir(vim.fn.stdpath("data") .. "/site", "p")
  return {}
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
    -- Set the inventory here so LazyVim's setup doesn't prepend it over user queries.
    local site = vim.fs.normalize(grammars)
    require("nvim-treesitter").setup({ install_dir = site })
    local paths = vim.tbl_filter(function(path)
      return path ~= site
    end, vim.opt.rtp:get())
    table.insert(paths, vim.fn.index(paths, vim.fn.stdpath("config")) + 2, site)
    vim.opt.rtp = paths
    opts.install_dir = nil
    opts.ensure_installed = {}
  end,
}
