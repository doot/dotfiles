{lib, ...}: {
  name = lib.mkForce "dotfiles";

  languages.python.directory = "./pynvim.venv";

  git-hooks = {
    excludes = [
      "iterm2_shell_integration.bash"
      "bitbar/yabai.1d.sh"
      "imgcat"
      "imgls"
      "wezterm.sh"
      ".*/vim/bundle/.*"
    ];
    hooks.statix.settings.ignore = ["*vim/bundle*"]; # For whatever reason, statix git-hooks integration doesn't respect excludes above
  };
}
