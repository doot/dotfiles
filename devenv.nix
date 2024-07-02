{pkgs, ...}: {
  # https://devenv.sh/basics/
  devcontainer.enable = true;
  packages = [pkgs.git];

  languages = {
    nix.enable = true;
    shell.enable = true;
  };

  pre-commit = {
    hooks = {
      commitizen.enable = true;
      alejandra.enable = true;
      deadnix.enable = true;
      actionlint.enable = true;
      shellcheck.enable = true;
      statix.enable = true;
    };
    excludes = [
      "iterm2_shell_integration.bash"
      "bitbar/yabai.1d.sh"
      "imgcat"
      "imgls"
    ];
  };
}
