# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# Determine host and os info
os=`uname -s`
host=`hostname | cut -d. -f1`

# OS Specific settings
case $os in
	"Darwin")
        alias ls='ls -FG';
        tabs 4;
        
        # Kindof does the same thing as lsub when it doesn't exist on OS X
        alias lsusb='system_profiler SPUSBDataType'

        # Show hidden files on OS X
        alias showhidden='defaults write com.apple.finder AppleShowAllFiles YES && killall Finder'
        alias hidehidden='defaults write com.apple.finder AppleShowAllFiles NO && killall Finder'

        # Support for auto-completing brew.  Also loads other auto-completions installed via brew.
        if [ -f $(brew --prefix)/etc/bash_completion ]
        then
          . $(brew --prefix)/etc/bash_completion
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

# Aliases
alias db-update=~/.dotfiles/install

alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias .....='cd ../../../../'
alias dammit='sudo $(history -p \!\!)'
alias h=history
alias docker='sudo docker'
alias ll='ls -lrht'
alias sudo="sudo -E"
alias grep="grep --color=auto"
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Bash settings
export HISTSIZE=9999
export HISTFILESIZE=999999
export PROMPT_COMMAND="$PROMPT_COMMAND;history -a"
# append to the history file, don't overwrite it
shopt -s histappend
# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# complete sudo and man-pages
complete -cf sudo man

#if [ -f "${HOME}/.gpg-agent-info" ]; then
#  . "${HOME}/.gpg-agent-info"
#  export GPG_AGENT_INFO
#  export SSH_AUTH_SOCK
#fi
#export GPG_TTY=$(tty)

# Support for gpg-agent.  Used for ssh via gpg key (stored on yubikey)
if [ -f "${HOME}/.gpg-agent-info" ]; then
    source ~/.gpg-agent-info
fi

# Support for auto-completing git commands
if [ -f "${HOME}/.git-completion.bash" ]; then
    source ~/.git-completion.bash
fi

# Custom scripts
PATH="~/.bin:${PATH}"

# Display git status in prompt
GIT_PROMPT_START="\u@\h:\[\033[0;33m\]\w\[\033[0;0m\] _LAST_COMMAND_INDICATOR_ "
if [ -f "${HOME}/.bash-git-prompt/gitprompt.sh" ]; then
    source ~/.bash-git-prompt/gitprompt.sh
fi

PATH="/Users/doot/perl5/bin${PATH+:}${PATH}"; export PATH;
PERL5LIB="/Users/doot/perl5/lib/perl5${PERL5LIB+:}${PERL5LIB}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/Users/doot/perl5${PERL_LOCAL_LIB_ROOT+:}${PERL_LOCAL_LIB_ROOT}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/Users/doot/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/Users/doot/perl5"; export PERL_MM_OPT;
