# Setup fzf
# ---------
if [[ ! "$PATH" == *${HOME}/.dotfiles/fzf/bin* ]]; then
  PATH="${PATH:+${PATH}:}${HOME}/.dotfiles/fzf/bin"
fi

eval "$(fzf --bash)"
