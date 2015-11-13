# Aliases
alias lsusb='system_profiler SPUSBDataType'
alias h=history
alias db-update=~/.dotfiles/install

# Bash settings
export HISTSIZE=9999
export HISTFILESIZE=999999

#if [ -f "${HOME}/.gpg-agent-info" ]; then
#  . "${HOME}/.gpg-agent-info"
#  export GPG_AGENT_INFO
#  export SSH_AUTH_SOCK
#fi
#export GPG_TTY=$(tty)

# Support for gpg-agent.  Used for ssh via gpg key (stored on yubikey)
source ~/.gpg-agent-info

# Display git status in prompt
GIT_PROMPT_START="\u@\h:\[\033[0;33m\]\w\[\033[0;0m\] _LAST_COMMAND_INDICATOR_ "
source ~/.bash-git-prompt/gitprompt.sh

PATH="/Users/doot/perl5/bin${PATH+:}${PATH}"; export PATH;
PERL5LIB="/Users/doot/perl5/lib/perl5${PERL5LIB+:}${PERL5LIB}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/Users/doot/perl5${PERL_LOCAL_LIB_ROOT+:}${PERL_LOCAL_LIB_ROOT}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/Users/doot/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/Users/doot/perl5"; export PERL_MM_OPT;
