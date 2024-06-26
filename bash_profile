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

source "${HOME}/.dotfiles/iterm2_shell_integration.bash"

export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
