# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

# Include work specific bash_profile if it exists
if [[ -f ~/.dotfiles/work/bash_profile ]]; then
  . "${HOME}/dotfiles/work/bashrc_aliases"
fi

# User specific environment and startup programs
export ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX=1

source .dotfiles/iterm2_shell_integration.bash

