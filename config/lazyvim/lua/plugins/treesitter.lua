-- luacheck: read globals vim LazyVim, globals vim.g.loaded_nvim_treesitter
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars then
  local queries = { "highlights", "indents", "folds", "textobjects" }

  local function missing_queries(installed)
    local dir = require("nvim-treesitter.config").get_install_dir("queries")
    local missing = {}
    for lang in pairs(installed) do
      missing[lang] = {}
      for _, query in ipairs(queries) do
        local path = vim.fs.joinpath(dir, lang, query .. ".scm")
        if not vim.uv.fs_stat(path) then
          missing[lang][query] = path
        end
      end
    end
    return missing
  end

  local function refresh(previous, missing)
    local installed = LazyVim.treesitter.get_installed(true)
    local changed = {}
    for lang in pairs(installed) do
      for _, query in ipairs(queries) do
        local path = missing and missing[lang] and missing[lang][query]
        if not previous[lang] or (path and vim.uv.fs_stat(path)) then
          vim.treesitter.query.get:clear(lang, query)
          changed[lang] = true
        end
      end
    end
    for _, info in ipairs(vim.fn.getbufinfo({ bufloaded = 1 })) do
      local buf = info.bufnr
      local lang = vim.treesitter.language.get_lang(vim.bo[buf].filetype)
      if changed[lang] then
        vim.api.nvim_buf_call(buf, function()
          for _, group in ipairs({ "lazyvim_treesitter", "lazyvim_treesitter_textobjects" }) do
            if vim.fn.exists("#" .. group .. "#FileType") == 1 then
              vim.api.nvim_exec_autocmds("FileType", { buffer = buf, group = group, modeline = false })
            end
          end
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
        local install, pending = installer.install, 0
        local previous, missing
        installer.install = function(languages, options)
          if pending == 0 then
            previous = LazyVim.treesitter.get_installed(true)
            missing = nil
          end
          -- A forced install can restore queries without adding a parser, including for dependencies.
          if options and options.force and not missing then
            missing = missing_queries(previous)
          end
          pending = pending + 1
          local task = install(languages, options)
          -- TSUpdate fires before installation; another install can still be writing its queries.
          task:await(function()
            pending = pending - 1
            if pending == 0 then
              refresh(previous, missing)
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
