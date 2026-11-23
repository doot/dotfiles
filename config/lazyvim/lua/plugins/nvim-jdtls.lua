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
  ft = function(plugin, ft)
    if LazyVim.has("mason.nvim") or type(plugin.config) ~= "function" then
      return ft
    end
    local source = debug.getinfo(plugin.config, "S").source
    local attach
    vim.api.nvim_create_autocmd("FileType", {
      group = vim.api.nvim_create_augroup("dotfiles_jdtls", { clear = true }),
      pattern = ft,
      callback = function(event)
        local cmd = vim.fn.exepath("jdtls")
        if cmd == "" then
          return
        end
        LazyVim.opts(plugin.name).cmd[1] = cmd
        if attach then
          attach(event)
          return
        end
        -- The Java extra attaches on load and registers a FileType callback for later buffers.
        require("lazy").load({ plugins = { plugin.name } })
        local handlers = vim.tbl_filter(function(ac)
          return type(ac.callback) == "function" and debug.getinfo(ac.callback, "S").source == source
        end, vim.api.nvim_get_autocmds({ event = "FileType", pattern = ft }))
        if #handlers ~= 1 then
          return true -- never replace an unidentified callback
        end
        attach = handlers[1].callback
        vim.api.nvim_del_autocmd(handlers[1].id)
      end,
    })
    return {}
  end,
  opts = function(_, opts)
    if LazyVim.has("mason.nvim") or not (opts.dap and LazyVim.has("nvim-dap")) then
      return
    end
    local function supports(client, command)
      local commands = vim.tbl_get(client.server_capabilities, "executeCommandProvider", "commands") or {}
      return vim.tbl_contains(commands, command)
    end
    local function configure_dap(setup, options, automatic)
      -- Both nvim-jdtls helpers write the same provider slot. Preserve a user replacement.
      local providers = require("dap").providers.configs
      local provider = providers.jdtls
      local source = type(provider) == "function" and debug.getinfo(provider, "S").source
      if not automatic and source == debug.getinfo(setup, "S").source then
        provider = nil
      end
      setup(options)
      if provider or not automatic then
        providers.jdtls = provider
      end
    end
    local function test_keys(client, buf)
      if not opts.test or not supports(client, "vscode.java.startDebugSession") then
        return
      end
      if not supports(client, "vscode.java.test.junit.argument") then
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
    end

    local jdtls = opts.jdtls
    opts.jdtls = function(config)
      if type(jdtls) == "function" then
        config = jdtls(config) or config
      elseif jdtls then
        config = vim.tbl_deep_extend("force", config, jdtls)
      end
      local main = opts.dap_main
      local configured = type(main) == "table" and next(main) ~= nil
      local automatic = main ~= false and not configured
      -- nvim-jdtls registers the adapter on LspAttach; only the first setup keeps its options.
      local init = config.on_init
      local callbacks = type(init) == "table" and vim.list_slice(init) or { init }
      table.insert(callbacks, function(client)
        if supports(client, "vscode.java.startDebugSession") then
          configure_dap(require("jdtls").setup_dap, type(opts.dap) == "table" and opts.dap or {}, automatic)
        end
      end)
      config = vim.tbl_extend("force", config, { on_init = callbacks })
      if configured then
        local function discover(client, buf)
          if supports(client, "vscode.java.resolveMainClass") then
            vim.api.nvim_buf_call(buf, function()
              configure_dap(require("jdtls.dap").setup_dap_main_class_configs, main, false)
            end)
          end
        end
        local attach = config.on_attach
        config = vim.tbl_extend("force", config, {
          on_attach = vim.list_extend({ discover }, type(attach) == "table" and attach or { attach }),
        })
      end
      local jars = bundles("debug")
      if #jars == 0 then
        return config
      end
      if opts.test then
        vim.list_extend(jars, bundles("test"))
      end
      local existing = vim.tbl_get(config, "init_options", "bundles") or {}
      local attach = config.on_attach
      return vim.tbl_deep_extend("force", config, {
        init_options = { bundles = LazyVim.dedup(vim.list_extend(vim.list_slice(existing), jars)) },
        on_attach = vim.list_extend({ test_keys }, type(attach) == "table" and attach or { attach }),
      })
    end
  end,
}
