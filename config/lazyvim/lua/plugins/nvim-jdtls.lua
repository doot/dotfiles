-- luacheck: read globals vim LazyVim
local function bundles(extension)
  local roots = vim.split(vim.env.XDG_DATA_DIRS or "/usr/local/share:/usr/share", ":", { trimempty = true })
  table.insert(roots, 1, vim.env.XDG_DATA_HOME or vim.fn.expand("~/.local/share"))
  for _, root in ipairs(roots) do
    local dir = vim.fs.joinpath(root, "vscode/extensions/vscjava.vscode-java-" .. extension)
    local manifest = dir .. "/package.json"
    if vim.startswith(root, "/") and vim.fn.filereadable(manifest) == 1 then
      local ok, metadata = pcall(vim.json.decode, table.concat(vim.fn.readfile(manifest), "\n"))
      local jars = ok and type(metadata) == "table" and vim.tbl_get(metadata, "contributes", "javaExtensions")
      if type(jars) == "table" then
        local paths = {}
        for _, jar in ipairs(jars) do
          local path = type(jar) == "string" and vim.fs.joinpath(dir, jar)
          if path and vim.fn.filereadable(path) == 1 then
            table.insert(paths, path)
          end
        end
        if #paths > 0 and #paths == #jars then
          return paths
        end
      end
    end
  end
  return {}
end

return {
  "mfussenegger/nvim-jdtls",
  optional = true,
  opts = function(_, opts)
    if LazyVim.has("mason.nvim") or not (opts.dap and LazyVim.has("nvim-dap")) then
      return
    end
    local jars = bundles("debug")
    if #jars == 0 then
      return
    end
    if opts.test then
      vim.list_extend(jars, bundles("test"))
    end
    opts.jdtls = {
      init_options = { bundles = jars },
      on_attach = function(client, buf)
        local commands = vim.tbl_get(client.server_capabilities, "executeCommandProvider", "commands") or {}
        if not opts.test or not vim.tbl_contains(commands, "vscode.java.startDebugSession") then
          return
        end
        if not vim.tbl_contains(commands, "vscode.java.test.junit.argument") then
          return
        end
        local dap = require("jdtls.dap")
        local test = type(opts.test) == "table" and opts.test or {}
        local function map(key, action, desc)
          vim.keymap.set("n", "<leader>" .. key, function()
            action(test)
          end, { buffer = buf, desc = desc })
        end
        map("tt", dap.test_class, "Run Test Class")
        map("tr", dap.test_nearest_method, "Run Nearest Test")
        map("tT", dap.pick_test, "Pick Test")
      end,
    }
  end,
}
