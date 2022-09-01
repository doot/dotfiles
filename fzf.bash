# Setup fzf
# ---------
if [[ ! "$PATH" == *${HOME}/.dotfiles/fzf/bin* ]]; then
  PATH="${PATH:+${PATH}:}${HOME}/.dotfiles/fzf/bin"
fi

# Auto-completion
# ---------------
[[ $- == *i* ]] && source "${HOME}/.dotfiles/fzf/shell/completion.bash" 2> /dev/null

# Key bindings
# ------------
source "${HOME}/.dotfiles/fzf/shell/key-bindings.bash"
