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
      ".*vim\/bundle.*"
      ".*vim\/plugin.*"
    ];
    hooks.statix.settings.ignore = ["*vim/bundle*"]; # For whatever reason, statix git-hooks integration doesn't respect excludes above
    hooks.lychee.settings.flags = "--verbose --cache=true --cache-exclude-status '429, 500..600' --exclude-all-private=true --exclude='go\/' --exclude='github\.com\/\\$1'";
  };
}
