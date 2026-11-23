-- luacheck: read globals vim LazyVim, globals vim.g.loaded_nvim_treesitter
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars then
  local function refresh(previous)
    local installed = LazyVim.treesitter.get_installed(true)
    for lang in pairs(installed) do
      if not previous[lang] then
        vim.treesitter.query.get:clear(lang, "highlights")
      end
    end
    for _, info in ipairs(vim.fn.getbufinfo({ bufloaded = 1 })) do
      local buf = info.bufnr
      local lang = vim.treesitter.language.get_lang(vim.bo[buf].filetype)
      if installed[lang] and not previous[lang] then
        vim.api.nvim_buf_call(buf, function()
          vim.api.nvim_exec_autocmds("FileType", { buffer = buf, group = "lazyvim_treesitter", modeline = false })
        end)
      end
    end
  end

  return {
    "nvim-treesitter/nvim-treesitter",
    -- An explicit install_dir puts the site on runtimepath even before it exists.
    opts = { install_dir = vim.fn.stdpath("data") .. "/site" },
    init = function(plugin)
      local config = plugin.config
      plugin.config = LazyVim.inject.args(config, function()
        plugin.config = config
        local installer = require("nvim-treesitter.install")
        local install, pending, previous = installer.install, 0, nil
        installer.install = function(...)
          if pending == 0 then
            previous = LazyVim.treesitter.get_installed()
          end
          pending = pending + 1
          local task = install(...)
          -- TSUpdate fires before installation; another install can still be writing its queries.
          task:await(function()
            pending = pending - 1
            if pending == 0 then
              refresh(previous)
            end
          end)
          return task
        end
      end)
    end,
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
