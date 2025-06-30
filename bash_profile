# .bash_profile

# Get aliases and functions
if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

# Include work specific bash_profile if it exists
if [[ -f ~/.dotfiles_work/bash_profile ]]; then
  . "${HOME}/.dotfiles_work/bash_profile"
fi

# User specific environment and startup programs
export ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX=YES

# Enable iterm2 shell integration if inside of iterm2
if [ -z "$ITERM_PROFILE" ]; then
  source "${HOME}/.dotfiles/iterm2_shell_integration.bash"
elif [ -z "$WEZTERM_CONFIG_DIR" ]; then
  source "${HOME}/.dotfiles/wezterm.sh"
fi

# remove duplicates in PATH:
PATH=$(echo ${PATH} | awk -v RS=: -v ORS=: '!($0 in a) {a[$0]; print}')
PATH="${PATH%:}"    # remove trailing colon
export PATH
