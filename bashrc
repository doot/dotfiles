# Source global definitions
if [ -f /etc/bashrc ]; then
  . /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# If not running interactively, don't do anything
case $- in
  *i*) ;;
    *) return;;
esac

# Determine host and os info
os=$(uname -s)
host=$(uname -n | cut -d. -f1)

# OS Specific settings
case $os in
  "Darwin")
    PATH="/opt/homebrew/bin:$PATH"

    # Put GNU versions of utilities further up in the path than older OSX versions
    PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:$PATH"

    alias ls='ls -FG';

    # Kindof does the same thing as lsub when it doesn't exist on OS X
    alias lsusb='system_profiler SPUSBDataType'

    # Show hidden files on OS X
    alias showhidden='defaults write com.apple.finder AppleShowAllFiles YES && killall Finder'
    alias hidehidden='defaults write com.apple.finder AppleShowAllFiles NO && killall Finder'

    # Support for auto-completing brew.  Also loads other auto-completions installed via brew.
    [[ -r "/opt/homebrew/etc/profile.d/bash_completion.sh" ]] && . "/opt/homebrew/etc/profile.d/bash_completion.sh"

    # Setup bws access token from macos keychain
    # export "BWS_ACCESS_TOKEN=$(security find-generic-password -w -s 'BWS_ACCESS_TOKEN' -a "${USER}")"
    ;;

    "Linux")
      alias ls='ls -F --color=auto'
      if ! shopt -oq posix; then
        if [ -f /usr/share/bash-completion/bash_completion ]; then
          . /usr/share/bash-completion/bash_completion
        elif [ -f /etc/bash_completion ]; then
          . /etc/bash_completion
        fi
      fi
      
      # needed for podman/distrobox on steam deck
      PATH=$HOME/.local/bin:$PATH
      PATH=$HOME/.local/podman/bin:$PATH
    ;;
esac

# Wezterm shell completion (if installed)
if type wezterm > /dev/null 2>&1; then
  eval "$(wezterm shell-completion --shell=bash)"
fi

# Include work specific aliases if it exists
if [[ -f ${HOME}/.dotfiles_work/bashrc_aliases ]]; then
  # shellcheck source=/dev/null
  . "${HOME}/.dotfiles_work/bashrc_aliases"
fi

# Include other work specific bashrc if it exists
if [[ -f ${HOME}/.dotfiles_work/bashrc ]]; then
  # shellcheck source=/dev/null
  . "${HOME}/.dotfiles_work/bashrc"
fi

# Bash settings
export PS1='\u@\h:\w [$?]\n\$ '

# append to the history file, don't overwrite it
shopt -s histappend

# set history size to unlimited
export HISTSIZE=
export HISTFILESIZE=
export HISTTIMEFORMAT="[%F %T] "

# force flush to history file after every command
export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"

# set history file to a new location to prevent sessions that don't respect settings above from truncating
export HISTFILE=~/.bash_eternal_history

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

shopt -s lithist
shopt -s cdspell        # correct minor spelling mistakes in directory names for cd

# prevent me from doing stupid shit
export PIP_REQUIRE_VIRTUALENV=true

# complete sudo and man-pages
complete -cf sudo man

# get a nicer percentage in manpages
export MANPAGER='less -s -M +Gg'

# Disable telemetry in eternal-terminal
export ET_NO_TELEMETRY=1

# Vi Mode
set -o vi

# Support for gpg-agent.  Used for ssh via gpg key (stored on yubikey)
if [ -f "${HOME}/.gpg-agent-info" ]; then
    # shellcheck source=/dev/null
    source "$HOME/.gpg-agent-info"
fi

# Custom scripts
PATH="${HOME}/bin:${PATH}"

# Rust/cargo
PATH="${HOME}/.cargo/bin:${PATH}"

# Go
PATH="${HOME}/go/bin:${PATH}"

# doom emacs
PATH="${PATH}:${HOME}/.config/emacs/bin"

PATH="$PATH:${HOME}/.local/bin"

# Display git status in prompt
GIT_PROMPT_START="${USER}@\h:\[\033[0;33m\]\w\[\033[0;0m\] _LAST_COMMAND_INDICATOR_ " # \u is somehow broken when calling new version of bash on linux
# export GIT_PROMPT_START

#GIT_PROMPT_ONLY_IN_REPO=1
if [ -f "${HOME}/.bash-git-prompt/gitprompt.sh" ]; then
  # shellcheck source=/dev/null
  source "${HOME}/.bash-git-prompt/gitprompt.sh"
fi

export LS_COLORS="di=34"

# shellcheck source=/dev/null
[ -f "$HOME/.fzf.bash" ] && source "$HOME/.fzf.bash"
export FZF_DEFAULT_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_ALT_C_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_CTRL_T_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_DEFAULT_OPTS="
  --layout=reverse
  --multi
  --ghost='>:@ '
  --pointer='->'
  --prompt='$ '
  --height 40%
  --info=inline
  --bind '?:toggle-preview'
  --bind 'ctrl-a:select-all'
  --bind 'ctrl-y:execute-silent(echo {+} | pbcopy)'
  --bind 'ctrl-e:execute(echo {+} | xargs -o vim)'
  --style full
  --bind 'result:bg-transform-list-label:
        if [[ -z $FZF_QUERY ]]; then
          echo \" $FZF_MATCH_COUNT items \"
        else
          echo \" $FZF_MATCH_COUNT matches for [$FZF_QUERY] \"
        fi
        '
  --bind 'focus:bg-transform-preview-label:[[ -n {} ]] && printf \" Previewing [%s] \" {}'
  --bind 'focus:+bg-transform-header:[[ -n {} ]] && file --brief {}'
  --color 'border:#aaaaaa,label:#cccccc'
  --color 'preview-border:#9999cc,preview-label:#ccccff'
  --color 'list-border:#669966,list-label:#99cc99'
  --color 'input-border:#996666,input-label:#ffcccc'
  --color 'header-border:#6699cc,header-label:#99ccff'
"

_fzf_comprun() {
  local command=$1
  shift

  case "$command" in
    cd)           fzf "$@" --preview 'tree -C {} | head -200' ;;
    export|unset) fzf "$@" --preview "eval 'echo \$'{}" ;;
    ssh)          fzf "$@" --preview 'dig {}' ;;
    vim)          fzf "$@" --preview 'bat --style=numbers --color=always {} || cat {}' ;;
    lvim)          fzf "$@" --preview 'bat --style=numbers --color=always {} || cat {}' ;;
    nvim)          fzf "$@" --preview 'bat --style=numbers --color=always {} || cat {}' ;;
    *)            fzf "$@" ;;
  esac
}

vws() { vim -c ":VWS /\c$1/" ~/vimwiki/index.wiki; }

# Aliases
alias db-update=~/.dotfiles/install
alias gl='git log --graph --oneline --all'

if type 'nvim' &> /dev/null; then
  alias vim='nvim'
  alias vimdiff='nvim -d'
  export EDITOR=nvim
  export VISUAL=nvim
  alias lvim="NVIM_APPNAME=lazyvim nvim"
else
  export EDITOR=vim
  export VISUAL=vim
fi

if type 'eza' &> /dev/null; then
  export EXA_COLORS="xx=37"
  alias l='eza -l -snew --color-scale all --color-scale-mode fixed -g --icons --git'
  alias ll='eza -la --color-scale all --color-scale-mode fixed -g --icons --git'
  alias lt='eza -l -snew --color-scale all --color-scale-mode fixed -g --icons --git --tree --level=2'
else
  alias l='ls -lrht'
  alias ll='ls -lrhta'
fi

if type 'colordiff' &> /dev/null; then
  alias diff='colordiff'
fi

if type 'ggrep' &> /dev/null; then
  alias grep='ggrep'
fi

alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias .....='cd ../../../../'
alias dammit='sudo $(history -p \!\!)'
alias h=history
alias docker='sudo docker'
alias docker-compose='sudo docker-compose'
# alias sudo="sudo -E"
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias drm='docker rm'
alias dps='docker ps'
alias wiki='vim ~/vimwiki/index.wiki'
alias todo='vim ~/vimwiki/Todo.wiki'
alias diary='vim ~/vimwiki/diary/diary.wiki +VimwikiDiaryGenerateLinks +Calendar'
alias vimwiki2html='vim -R ~/vimwiki/index.wiki +VimwikiAll2HTML +q; open ~/vimwiki_html/index.html'
alias wikipull='cd ~/vimwiki/; git pull && git submodule update --remote --recursive --merge --init; cd -;'
alias wikipush='cd ~/vimwiki/personal/; git add . && git commit -m "alias commit: `date`" ; git push origin master; cd -; cd ~/vimwiki/; git add . && git commit -m "alias commit: `date`" && git push origin master; cd -;'
alias setlogintime='sudo lastlog -u $USER -S; sudo lastlog -u $USER'
alias ltmux='ssh -t deskr "tmux -CC attach -d"'

# NixOS aliases
alias nixos-changelog='nix profile diff-closures --profile /nix/var/nix/profiles/system'
alias de='devenv'

# Functions

dirvimdiff ()
{
  # Diff files between two directories in vimdiff, one at a time
  # dirvimdiff dir1/ dir2/
  for files in $(diff -rq "$1" "$2" | awk '/^Files .* differ.*$/ {print $2":"$4}');
  do
    nvim -d "${files%:*}" "${files#*:}";
  done
}

# Enable direnv, if it's installed AND it hasn't already been loaded (/etc/bashrc sometimes loads it)
if type "direnv" &> /dev/null && [[ $(type -t _direnv_hook) != "function" ]] ; then
  eval "$(direnv hook bash)"
fi

# remove duplicates in PATH:
PATH=$(echo "${PATH}" | awk -v RS=: -v ORS=: '!($0 in a) {a[$0]; print}')
PATH="${PATH%:}"    # remove trailing colon
export PATH
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
