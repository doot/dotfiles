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

local function go_args(linter, overrides)
  if overrides.args then
    return
  end
  local previous
  return function(exe)
    if vim.fn.executable("go") == 0 then
      return false
    end
    local context = { exe, vim.uv.cwd(), vim.env.PATH }
    if not vim.deep_equal(previous, context) then
      -- The stock adapter probes golangci-lint and the current Go module as it loads.
      local path = vim.env.PATH
      if vim.fs.basename(exe) == "golangci-lint" then
        path = path .. ":" .. vim.fs.dirname(exe)
      end
      local args = vim._with({ env = { PATH = path } }, function()
        return dofile(vim.api.nvim_get_runtime_file("lua/lint/linters/golangcilint.lua", false)[1]).args
      end)
      if not args then
        return false
      end
      linter.args = vim.list_extend(args, overrides.prepend_args or {})
      previous = context
    end
    return true
  end
end

local function guard(linter, prepare)
  local condition = linter.condition
  linter.condition = function(ctx)
    if condition and not condition(ctx) then
      return false
    end
    return in_cwd(linter.cwd, function()
      local cmd = linter.cmd
      local resolved = type(cmd) == "function" and cmd() or cmd
      local path = vim.tbl_get(linter, "env", "PATH") or vim.env.PATH
      return vim._with({ env = { PATH = path == "" and "." or path } }, function()
        local exe = vim.fn.exepath(resolved)
        if exe == "" or (prepare and not prepare(exe)) then
          return false
        end
        if type(cmd) == "function" then
          -- Use the command already resolved for this event, not a second call to the project.
          linter.cmd = function()
            linter.cmd = cmd
            return resolved
          end
        end
        return true
      end)
    end)
  end
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
      local linters = require("lint").linters
      local opts = LazyVim.opts("nvim-lint").linters
      for _, name in ipairs(optional) do
        local linter = linters[name]
        if type(linter) == "table" then
          guard(linter, name == "golangcilint" and go_args(linter, opts[name] or {}))
        end
      end
    end)
  end,
}
