-- luacheck: read globals vim LazyVim, globals vim.g.loaded_nvim_treesitter
local grammars = vim.env.NVIM_TREESITTER_GRAMMARS
if not grammars then
  local queries = { "highlights", "indents", "folds", "textobjects" }

  local function query_additions(pattern)
    local dir = require("nvim-treesitter.config").get_install_dir("queries")
    local function paths()
      return vim.fn.globpath(dir, pattern, true, true)
    end
    local before = {}
    for _, path in ipairs(paths()) do
      before[path] = true
    end
    return function(added)
      for _, path in ipairs(paths()) do
        if not before[path] then
          added[path] = true
        end
      end
    end
  end

  local function refresh(previous, added)
    local installed = LazyVim.treesitter.get_installed(true)
    local changed = {}
    local function restored(lang, query)
      if not next(added) then
        return false
      end
      local ok, files = pcall(vim.treesitter.query.get_files, lang, query)
      return ok and vim.iter(files):any(function(path)
        return added[path] or added[vim.fs.dirname(path)]
      end)
    end
    for lang in pairs(installed) do
      for _, query in ipairs(queries) do
        if not previous[lang] or restored(lang, query) then
          vim.treesitter.query.get:clear(lang, query)
          changed[lang] = changed[lang] or {}
          changed[lang][query] = true
        end
      end
    end
    for _, info in ipairs(vim.fn.getbufinfo({ bufloaded = 1 })) do
      local buf = info.bufnr
      local lang = vim.treesitter.language.get_lang(vim.bo[buf].filetype)
      if changed[lang] then
        vim.api.nvim_buf_call(buf, function()
          -- start() reuses an attached highlighter, including its cached partial query.
          if changed[lang].highlights and vim.treesitter.highlighter.active[buf] then
            vim.treesitter.stop(buf)
          end
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
        local pending = 0
        local previous, directories, files
        for _, method in ipairs({ "install", "update" }) do
          local run = installer[method]
          installer[method] = function(languages, options)
            local task = run(languages, options)
            -- Both installers schedule their writes; a finished task had nothing to install.
            if task:status() == "dead" then
              return task
            end
            if pending == 0 then
              previous = LazyVim.treesitter.get_installed(true)
              directories, files = query_additions("*"), nil
            end
            -- Only a force or update can replace individual files in an installed directory.
            if not files and (method == "update" or (options and options.force)) then
              files = query_additions("*/*.scm")
            end
            pending = pending + 1
            task:await(function()
              pending = pending - 1
              if pending == 0 then
                local added = {}
                directories(added)
                if files then
                  files(added)
                end
                refresh(previous, added)
              end
            end)
            return task
          end
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
