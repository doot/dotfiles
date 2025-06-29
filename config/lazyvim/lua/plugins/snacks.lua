-- Same as "vertical" preset, except re-orders preview to top and increases min_width
local reordered_larger_vert = {
  layout = {
    layout = {
      backdrop = false,
      width = 0.5,
      min_width = 170,
      height = 0.8,
      min_height = 30,
      box = "vertical",
      border = "rounded",
      title = "{title} {live} {flags}",
      title_pos = "center",
      { win = "preview", title = "{preview}", height = 0.4, border = "top" },
      { win = "input", height = 1, border = "bottom" },
      { win = "list", border = "none" },
    },
  }
}

return {
  "folke/snacks.nvim",
  opts = {
    picker = {
      layout = {
      },
      -- Changing global picker settings changes the picker in unexpected places, like the explorer sidebar. Instead, change only a few sources.
      sources = {
        files = reordered_larger_vert,
        grep = reordered_larger_vert,
        grep_buffers = reordered_larger_vert,
        grep_word = reordered_larger_vert,
        keymaps = reordered_larger_vert,
        help = reordered_larger_vert,
        recent = reordered_larger_vert,
        lsp_declarations = reordered_larger_vert,
        lsp_definitions = reordered_larger_vert,
        lsp_implementations = reordered_larger_vert,
        lsp_references = reordered_larger_vert,
        lsp_symbols = reordered_larger_vert,
        lsp_type_definitions = reordered_larger_vert,
        lsp_workspace_symbols = reordered_larger_vert,
        notifications = reordered_larger_vert,
      },
    },
  }
}
