set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

" Plugins:
Plugin 'scrooloose/nerdtree'
Plugin 'Xuyuanp/nerdtree-git-plugin'
Plugin 'wakatime/vim-wakatime'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on
"
" Brief help
" :PluginList       - lists configured plugins
" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
"
" see :h vundle for more details or wiki for FAQ
" Put your non-Plugin stuff after this line

set softtabstop=4
set shiftwidth=4
set tabstop=4
set expandtab
syntax on
set ruler
let g:netrw_dirhistmax=0
syntax enable
set background=dark
colorscheme solarized
set autoindent
set copyindent              " copy the previous indentation on autoindenting
set showmatch
set matchtime=1
set hlsearch                " highlight search terms
set smartcase               " ignore case if search pattern is all lowercase,
set incsearch               " show search matches as you type
set scrolloff=2
set history=1000            " remember more commands and search history
set undolevels=1000         " use many muchos levels of undo
set wildignore=*.swp,*.bak,*.pyc,*.class
set title                   " change the terminal's title
set visualbell              " don't beep
set noerrorbells            " don't beep
set nostartofline           " Don’t reset cursor to start of line when moving around.
set title                   " Show filename
set showmode                " Show current mode
set showcmd                 " Show commands/info while typing
set backspace=2             " Allow backspace to work on characters entered in previous sessions

" For mouse click in NERDTree
":set mouse=a
let g:NERDTreeMouseMode=3 
