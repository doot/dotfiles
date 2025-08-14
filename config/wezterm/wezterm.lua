local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- TODO: tls clients seem to work well with the exception of ssh agent forwarding, which i cannot get working. This works normally for ssh domains, however.
config.tls_clients = {
  {
    name = 'nsf-tls',
    remote_address = 'nix-shitfucker:8765',
    bootstrap_via_ssh = 'doot@nsf.jhauschildt.com',
    local_echo_threshold_ms = 100,
  },
  {
    name = 'nmd-tls',
    remote_address = 'nix-media-docker:8765',
    bootstrap_via_ssh = 'doot@nmd.jhauschildt.com',
    local_echo_threshold_ms = 100,
  },
}

config.tls_servers = {
  {
    -- The host:port combination on which the server will listen
    -- for connections
    bind_address = '0.0.0.0:8765',
  },
}

config.unix_domains = {
  {
    name = 'unix',
    local_echo_threshold_ms = 10,
  },
}


-- This causes `wezterm` to act as though it was started as
-- `wezterm connect unix` by default, connecting to the unix
-- domain on startup.
-- If you prefer to connect manually, leave out this line.
-- TODO: turn back on
-- config.default_gui_startup_args = { 'connec6t', 'unix' }

config.color_scheme = 'Solarized Dark - Patched' -- closest to our iterm2 setup

config.font = wezterm.font('FiraCode Nerd Font', { weight = "Light"})
config.font_size = 13
config.line_height = 1.1
config.cell_width = 0.95

config.hide_tab_bar_if_only_one_tab = false
config.use_fancy_tab_bar = false -- retro
config.tab_bar_at_bottom = false

config.tab_max_width = 50

config.window_padding = {
  left = "0.5cell",
  right = "0.5cell",
  top = "0.25cell",
  bottom = "0.75cell",
}
config.window_frame = {
  font_size = 12
}
config.window_background_opacity = 0.99
config.window_decorations = "TITLE|RESIZE|MACOS_USE_BACKGROUND_COLOR_AS_TITLEBAR_COLOR"
config.window_close_confirmation = "NeverPrompt"
config.enable_scroll_bar = true

config.keys = {
  -- Tab navication via splat h/l and splat left/right
  { key = 'LeftArrow', mods = 'SUPER', action = wezterm.action.ActivateTabRelative(-1), },
  { key = 'h', mods = 'SUPER', action = wezterm.action.ActivateTabRelative(-1), },
  { key = 'RightArrow', mods = 'SUPER', action = wezterm.action.ActivateTabRelative(1), },
  { key = 'l', mods = 'SUPER', action = wezterm.action.ActivateTabRelative(1), },

  -- Use ⌘⇧] to toggle 'floating' WezTerm windows
  {
    key = ']',
    mods = 'CMD|SHIFT',
    action = wezterm.action.ToggleAlwaysOnTop,
  },

  -- Don't ask to close tab
  {
    key = 'w',
    mods = 'CMD',
    action = wezterm.action.CloseCurrentTab { confirm = false },
  },

  -- Cycle through panes, similar behavior as iterm2
  {
    key = '[',
    mods = 'CMD',
    action = wezterm.action.ActivatePaneDirection 'Prev',
  },
  {
    key = ']',
    mods = 'CMD',
    action = wezterm.action.ActivatePaneDirection 'Next',
  },

  -- Adjust pane sizes with hjkl (on top of default key bindings that use arrow keys)
  {
    key = 'h',
    mods = 'CTRL|SHIFT|ALT',
    action = wezterm.action.AdjustPaneSize({'Left', 5}),
  },
  {
    key = 'l',
    mods = 'CTRL|SHIFT|ALT',
    action = wezterm.action.AdjustPaneSize({'Right', 5}),
  },
  {
    key = 'j',
    mods = 'CTRL|SHIFT|ALT',
    action = wezterm.action.AdjustPaneSize({'Up', 10}),
  },
  {
    key = 'k',
    mods = 'CTRL|SHIFT|ALT',
    action = wezterm.action.AdjustPaneSize({'Down', 10}),
  },


}

config.front_end = "WebGpu"
config.max_fps = 120
config.animation_fps = 120
-- config.cursor_blink_rate = 250

config.audible_bell = "Disabled"


-- TODO: figure out cross platform way of getting terminfo installed (https://wezterm.org/config/lua/config/term.html)
-- TODO: add back if this fixes ssh to deskr problem
config.term = "wezterm"

-- Add ":", "=", and "|", to selection word boundary so double clicking behaves more like iterm2
config.selection_word_boundary = " \t\n{}[]()\"'`:=|│"

-- Reduce if this causes memory issues
config.scrollback_lines = 50000

local tabline = wezterm.plugin.require("https://github.com/michaelbrusegard/tabline.wez")
tabline.setup({
  options = {
    icons_enabled = true,
    theme = 'Everforest Dark (Gogh)',
  },
  sections = {
    tabline_a = { 'mode' },
    -- tabline_b = { 'workspace' },
    tabline_b = { },
    tabline_c = { },
    tab_active = {
      { 'index', padding = { left = 0, right = 1 } },
      { 'zoomed', padding = 0 },
      { 'process', padding = { left = 0, right = 0 } },
      ': ',
      { 'cwd', padding = { left = 0, right = 0 }, max_length=35},
    },
    tab_inactive = {
      { 'index', padding = { left = 0, right = 1 } },
      { 'process', padding = { left = 0, right = 0 } },
      ': ',
      { 'cwd', padding = { left = 0, right = 0 }, max_length=35},
    },
    tabline_x = { 'ram', 'cpu' },
    -- tabline_y = { 'datetime' },
    tabline_y = { '' },
    -- tabline_z = { 'workspace', 'domain', 'hostname' },
    tabline_z = { 'workspace', 'domain'},
  },
})
config.status_update_interval = 500
-- tabline.apply_to_config(config)  -- This overrides a bunch of settings, like hiding the title bar, window padding, etc...

-- alt-u: normal mode, alt-c: copy mode, alt-n: scroll mode
-- TODO: want this, but it breaks the theme for some reason
-- local modal = wezterm.plugin.require("https://github.com/MLFlexer/modal.wezterm")
-- modal.apply_to_config(config)
-- wezterm.on("update-right-status", function(window, _)
--   if modal.get_mode(window) then -- is nil if you are not in a mode
--     modal.set_right_status(window, "sdfsdf")
--   else
--     -- your other status
--     window.set_right_status(window, "sdfsdf?")
--   end
-- end)
-- wezterm.on("modal.enter", function(name, window, pane)
--   modal.set_right_status(window, name)
--   modal.set_window_title(pane, name)
-- end)
--
-- wezterm.on("modal.exit", function(name, window, pane)
--   window:set_right_status("NOT IN A MODE")
--   modal.reset_window_title(pane)
-- end)


config.mux_enable_ssh_agent = true
config.ssh_domains = {}

-- Attempt to automatically generate ssh domains from ssh config
for host, c in pairs(wezterm.enumerate_ssh_hosts(os.getenv('HOME') .. "/.ssh/config.custom")) do
  if not host:find('linkedin') then
    table.insert(config.ssh_domains, {
      -- the name can be anything you want; we're just using the hostname
      name = host,
      -- remote_address must be set to `host` for the ssh config to apply to it
      remote_address = host,

      -- if you don't have wezterm's mux server installed on the remote
      -- host, you may wish to set multiplexing = "None" to use a direct
      -- ssh connection that supports multiple panes/tabs which will close
      -- when the connection is dropped.

      -- multiplexing = "None",

      -- if you know that the remote host has a posix/unix environment,
      -- setting assume_shell = "Posix" will result in new panes respecting
      -- the remote current directory when multiplexing = "None".
      assume_shell = 'Posix',
      ssh_option = {
        compression = 'yes',
        forwardagent = 'yes',
      },
      username = c.user,
      local_echo_threshold_ms = 5000,
    })
  end
end

-- config.ssh_domains = {
--   {
--     name = 'nsf',
--     remote_address = 'nsf.jhauschildt.com',
--     username = 'doot',
--     assume_shell = 'Posix',
--     local_echo_threshold_ms = 10,
--     -- connect_automatically = true,
--     ssh_option = {
--       compression = 'yes',
--       forwardagent = 'yes',
--     },
--   },
--   {
--     name = 'nmd',
--     remote_address = 'nmd.jhauschildt.com',
--     username = 'doot',
--     assume_shell = 'Posix',
--     local_echo_threshold_ms = 10,
--     -- connect_automatically = true,
--     ssh_option = {
--       compression = 'yes',
--       forwardagent = 'yes',
--     },
--   },
--   {
--     name = 'desk',
--     remote_address = 'jhauschi-ld2.linkedin.biz',
--     username = 'jhauschi',
--     assume_shell = 'Posix',
--     -- Disable built-in multiplexing and force tmux control mode
--     multiplexing = 'None',
--     local_echo_threshold_ms = 10,
--     default_prog = { 'tmux', '-u', '-CC', 'new', '-A', '-s', 'main' },
--     ssh_option = {
--       compression = 'yes',
--       forwardagent = 'yes',
--     },
--   },
-- }

-- Copied from: https://gist.github.com/xieve/fc67361a2a0cb8fc23ab8369a8fc1170
require("wuake").setup {
  config = config,
}

-- Uncomment to update plugins. Increases startup time.
-- wezterm.plugin.update_all()

return config
