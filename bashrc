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
host=$(hostname | cut -d. -f1)

# OS Specific settings
case $os in
  "Darwin")
    alias ls='ls -FG';

    # Kindof does the same thing as lsub when it doesn't exist on OS X
    alias lsusb='system_profiler SPUSBDataType'

    # Show hidden files on OS X
    alias showhidden='defaults write com.apple.finder AppleShowAllFiles YES && killall Finder'
    alias hidehidden='defaults write com.apple.finder AppleShowAllFiles NO && killall Finder'

    # Support for auto-completing brew.  Also loads other auto-completions installed via brew.
    if [ -f "$(brew --prefix)/etc/bash_completion" ]
    then
      # shellcheck source=/dev/null
      . "$(brew --prefix)/etc/bash_completion"
    fi
    if type brew 2&>/dev/null; then
      for completion_file in "$(brew --prefix)"/etc/bash_completion.d/*; do
        # shellcheck source=/dev/null
        source "$completion_file"
      done
    fi
    if [ -f /usr/local/share/bash-completion/bash_completion ]; then
      . /usr/local/share/bash-completion/bash_completion
    fi
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
    ;;
esac

# Brew autocompletion
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"

# Aliases
alias db-update=~/.dotfiles/install
alias gl='git log --graph --oneline --all'

if type "nvim" &> /dev/null; then
  alias vim='nvim'
  alias vimdiff='nvim -d'
  export EDITOR=nvim
  export VISUAL=nvim
else
  export EDITOR=vim
  export VISUAL=vim
fi

if type "exa" &> /dev/null; then
  alias l='exa -l -snew --color-scale -g'
  alias ll='exa -la --color-scale -g'
else
  alias l='ls -lrht'
  alias ll='ls -lrhta'
fi

alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias .....='cd ../../../../'
alias dammit='sudo $(history -p \!\!)'
alias h=history
alias docker='sudo docker'
alias docker-compose='sudo docker-compose'
alias diff='colordiff'
alias sudo="sudo -E"
alias grep="grep --color=auto"
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias drm="docker rm"
alias dps="docker ps"
alias wiki='vim ~/vimwiki/index.wiki'
alias todo='vim ~/vimwiki/Todo.wiki'
alias diary='vim ~/vimwiki/diary/diary.wiki +VimwikiDiaryGenerateLinks +Calendar'
alias vimwiki2html='vim -R ~/vimwiki/index.wiki +VimwikiAll2HTML +q; open ~/vimwiki_html/index.html'
alias wikipull='cd ~/vimwiki/; git pull && git submodule update --remote --recursive --merge --init; cd -;'
alias wikipush='cd ~/vimwiki/personal/; git add . && git commit -m "alias commit: `date`" ; git push origin master; cd -; cd ~/vimwiki/; git add . && git commit -m "alias commit: `date`" && git push origin master; cd -;'

alias ltmux="ssh -t deskr '/home/linuxbrew/.linuxbrew/bin/tmux -CC attach -d'"

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
shopt -s histappend
export HISTSIZE=
export HISTFILESIZE=
export HISTTIMEFORMAT="[%F %T] "
export HISTFILE=~/.bash_eternal_history
export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
# append to the history file, don't overwrite it
# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

shopt -s lithist
shopt -s cdspell        # correct minor spelling mistakes in directory names for cd

# prevent me from doing stupid shit
export PIP_REQUIRE_VIRTUALENV=true


# complete sudo and man-pages
complete -cf sudo man

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

# doom emacs
PATH=$PATH:~/.emacs.d/bin

# Display git status in prompt
GIT_PROMPT_START="${USER}@\h:\[\033[0;33m\]\w\[\033[0;0m\] _LAST_COMMAND_INDICATOR_ " # \u is somehow broken when calling new version of bash on linux
# export GIT_PROMPT_START
if [ -f "/usr/local/opt/bash-git-prompt/share/gitprompt.sh" ]; then
  __GIT_PROMPT_DIR="/usr/local/opt/bash-git-prompt/share"
  export __GIT_PROMPT_DIR
  # shellcheck source=/dev/null
  source "/usr/local/opt/bash-git-prompt/share/gitprompt.sh"
fi

#GIT_PROMPT_ONLY_IN_REPO=1
if [ -f "${HOME}/.bash-git-prompt/gitprompt.sh" ]; then
  # shellcheck source=/dev/null
  source "${HOME}/.bash-git-prompt/gitprompt.sh"
fi

# PATH="/Users/doot/perl5/bin${PATH+:}${PATH}"; export PATH;
# PERL5LIB="/Users/doot/perl5/lib/perl5${PERL5LIB+:}${PERL5LIB}"; export PERL5LIB;
# PERL_LOCAL_LIB_ROOT="/Users/doot/perl5${PERL_LOCAL_LIB_ROOT+:}${PERL_LOCAL_LIB_ROOT}"; export PERL_LOCAL_LIB_ROOT;
# PERL_MB_OPT="--install_base \"/Users/doot/perl5\""; export PERL_MB_OPT;
# PERL_MM_OPT="INSTALL_BASE=/Users/doot/perl5"; export PERL_MM_OPT;

EDITOR=vim

export LS_COLORS="di=34"


# Put GNU versions of utilities further up in the path than older OSX versions
PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"

export PATH

# shellcheck source=/dev/null
[ -f "$HOME/.fzf.bash" ] && source "$HOME/.fzf.bash"
export FZF_DEFAULT_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_ALT_C_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_CTRL_T_COMMAND='rg --files --no-ignore-messages --no-messages --hidden --no-ignore-vcs --ignore-file ~/.dotfiles/rgignore_fzf'
export FZF_DEFAULT_OPTS="
  --layout=reverse
  --border
  --multi
  --header='>:@ '
  --pointer='->'
  --prompt='$ '
  --height 40%
  --info=inline
  --preview-window=:hidden
  --preview '([[ -f {} ]] && (bat --style=numbers --color=always {} || cat {})) || ([[ -d {} ]] && (tree -C {} | less)) || echo {} 2> /dev/null | head -200'
  --bind '?:toggle-preview'
  --bind 'ctrl-a:select-all'
  --bind 'ctrl-y:execute-silent(echo {+} | pbcopy)'
  --bind 'ctrl-e:execute(echo {+} | xargs -o vim)'
"

# TODO: conditionally import this on non-work machines.  This fucks up builds.
# if [ -f /home/linuxbrew/.linuxbrew/bin/brew ]; then
#   eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
# fi

vws() { vim -c ":VWS /\c$1/" ~/vimwiki/index.wiki; }
