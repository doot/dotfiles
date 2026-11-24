-- luacheck: read globals vim LazyVim
local optional = { "credo", "golangcilint", "hadolint", "markdownlint-cli2", "sqlfluff", "statix" }

local function in_cwd(cwd, fn)
  local previous = vim.uv.cwd()
  if not cwd or cwd == previous then
    return fn()
  end
  assert(vim.uv.chdir(cwd))
  local ok, result = pcall(fn)
  assert(vim.uv.chdir(previous))
  if not ok then
    error(result, 0)
  end
  return result
end

local function go_args(exe)
  -- The adapter hard-codes its version probe. Redirect only that call, not the PATH used by go env.
  local fn = setmetatable({
    system = function(argv)
      if argv[1] == "golangci-lint" then
        argv[1] = exe
      end
      return vim.fn.system(argv)
    end,
  }, { __index = vim.fn })
  local scoped = setmetatable({ fn = fn }, { __index = vim })
  local adapter = assert(loadfile(LazyVim.get_plugin("nvim-lint").dir .. "/lua/lint/linters/golangcilint.lua"))
  return setfenv(adapter, setmetatable({ vim = scoped }, { __index = getfenv(adapter) }))().args
end

local function go_guard(overrides)
  local previous
  return function(linter, exe)
    if vim.fn.executable("go") == 0 then
      return false
    end
    if type(overrides) ~= "function" and not overrides.args then
      local context = { exe, vim.uv.cwd(), vim.env.PATH }
      if not vim.deep_equal(previous, context) then
        local args = go_args(exe)
        if not args then
          return false
        end
        linter.args = vim.list_extend(args, overrides.prepend_args or {})
        previous = context
      end
    end
    return true
  end
end

local function lint_options(prepare)
  local command
  return {
    filter = function(linter)
      local ok, eligible = pcall(in_cwd, linter.cwd, function()
        command = type(linter.cmd) == "function" and linter.cmd() or linter.cmd
        local path = vim.tbl_get(linter, "env", "PATH") or vim.env.PATH
        return vim._with({ env = { PATH = path == "" and "." or path } }, function()
          local exe = vim.fn.exepath(command)
          return exe ~= "" and (not prepare or prepare(linter, exe))
        end)
      end)
      if not ok then
        vim.notify_once(tostring(eligible), vim.log.levels.WARN)
      end
      return ok and eligible
    end,
    wrap_linter = function(linter)
      linter.cmd = command
      return linter
    end,
  }
end

return {
  "mfussenegger/nvim-lint",
  opts = function(_, opts)
    -- The Elixir extra replaces linters_by_ft after the Docker extra registers Hadolint.
    if LazyVim.has_extra("lang.docker") then
      opts.linters_by_ft.dockerfile = opts.linters_by_ft.dockerfile or { "hadolint" }
    end
    local markdown = opts.linters["markdownlint-cli2"] or {}
    markdown.prepend_args = { "--config", vim.fn.expand("$HOME/.dotfiles/.markdownlint-cli2.yaml"), "--" }
    opts.linters["markdownlint-cli2"] = markdown
  end,
  init = function()
    LazyVim.on_load("nvim-lint", function()
      local lint = require("lint")
      local run = lint.try_lint
      local go = go_guard(LazyVim.opts("nvim-lint").linters.golangcilint or {})
      lint.try_lint = function(names, options)
        -- LazyVim passes a list without options. Preserve callers' own filters and wrappers.
        if type(names) ~= "table" or options then
          return run(names, options)
        end
        for _, name in ipairs(names) do
          run(name, vim.list_contains(optional, name) and lint_options(name == "golangcilint" and go) or nil)
        end
      end
    end)
  end,
}
