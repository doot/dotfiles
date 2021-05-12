# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
  . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

# Include work specific bash_profile if it exists
if [[ -f ~/.dotfiles/work/bash_profile ]]; then
  . "${HOME}/dotfiles/work/bash_profile"
fi

# User specific environment and startup programs
export ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX=1

source "${HOME}/.dotfiles/iterm2_shell_integration.bash"

export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
