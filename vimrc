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
Plugin 'leafgarland/typescript-vim'
Plugin 'vimwiki/vimwiki'
Plugin 'majutsushi/tagbar'
Plugin 'blindFS/vim-taskwarrior'
Plugin 'powerman/vim-plugin-AnsiEsc'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'airblade/vim-gitgutter'
Plugin 'mhinz/vim-signify'
Plugin 'tpope/vim-fugitive'
Plugin 'ervandew/supertab'
Plugin 'edkolev/tmuxline.vim'
Plugin 'mattn/calendar-vim'
Plugin 'altercation/vim-colors-solarized'
Plugin 'alok/notational-fzf-vim'

" unsure about these plugins:
"Plugin 'Shougo/denite.nvim'
Plugin 'w0rp/ale'
" Plugin 'python-mode/python-mode'
Plugin 'vim-scripts/indentpython.vim'
Plugin 'mhartington/oceanic-next'
" Plugin 'tbabej/taskwiki'

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

set softtabstop=2
set shiftwidth=2
set tabstop=2
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
set wildmode=longest:full,full
set wildmenu
set title                   " change the terminal's title
set titleold=""             " remove 'Thanks for flying Vim!' when leaving vim
set visualbell              " don't beep
set noerrorbells            " don't beep
set nostartofline           " Don’t reset cursor to start of line when moving around.
set showmode                " Show current mode
set showcmd                 " Show commands/info while typing
set backspace=2             " Allow backspace to work on characters entered in previous sessions

" Way better vimdiff in newer versions of vim/neovim
if has('nvim-0.3.2') || has("patch-8.1.0360")
  set diffopt=filler,internal,algorithm:histogram,indent-heuristic
endif

" trying out new theme:
" for vim 7
 set t_Co=256
" for vim 8
 if (has("termguicolors"))
  set termguicolors
 endif
colorscheme OceanicNext
let g:airline_theme='oceanicnext'
" end new theme

if has("autocmd")
  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif

" Fix ^G before folder names on Mac
let g:NERDTreeNodeDelimiter = "\u00a0"

" For mouse click in NERDTree
set mouse=a
let g:NERDTreeMouseMode=3
" Map ctrl+c to yank to system clipboard.  Useful when mouse=a is set and we
" want to copy a lot of text to the system clipboard.  Also remember shift (or
" alt/option on mac) will temporarily stop that stupid mouse=a shit.
vmap <C-C> "+y

" If only window left open is NERDTree, exit all the way
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif

" Open NERDTree automatically if no file is specified
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

" Open NERDTree with ctrl + n
map <C-n> :NERDTreeToggle<CR>

" NERDTress File highlighting
function! NERDTreeHighlightFile(extension, fg, bg, guifg, guibg)
 exec 'autocmd FileType nerdtree highlight ' . a:extension .' ctermbg='. a:bg .' ctermfg='. a:fg .' guibg='. a:guibg .' guifg='. a:guifg
 exec 'autocmd FileType nerdtree syn match ' . a:extension .' #^\s\+.*'. a:extension .'$#'
endfunction
call NERDTreeHighlightFile('jade', 'green', 'none', 'green', '#151515')
call NERDTreeHighlightFile('ini', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('md', 'blue', 'none', '#3366FF', '#151515')
call NERDTreeHighlightFile('yml', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('config', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('conf', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('json', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('html', 'yellow', 'none', 'yellow', '#151515')
call NERDTreeHighlightFile('styl', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('css', 'cyan', 'none', 'cyan', '#151515')
call NERDTreeHighlightFile('py', 'Red', 'none', 'red', '#151515')
call NERDTreeHighlightFile('js', 'Red', 'none', '#ffa500', '#151515')
call NERDTreeHighlightFile('php', 'Magenta', 'none', '#ff00ff', '#151515')


"let &t_8f="\<Esc>[38;2;%lu;%lu;%lum"
"let &t_8b="\<Esc>[48;2;%lu;%lu;%lum"
" set termguicolors " Setting this will fix the background in vim when
" not using tmux/iterm2.  in gnome-terminal it will be dark gray and crazy
" colors instead of solorized and in other terminals it might be a crazy orange

let g:airline_solarized_bg='dark'
let g:airline_powerline_fonts = 1

function! ToggleCalendar()
  execute ":Calendar"
  if exists("g:calendar_open")
    if g:calendar_open == 1
      execute "q"
      unlet g:calendar_open
    else
      g:calendar_open = 1
    end
  else
    let g:calendar_open = 1
  end
endfunction
" update this to new key, c is dumb
":autocmd FileType vimwiki map c :call ToggleCalendar()


"let g:vimwiki_url_maxsave=0
"let g:vimwiki-option-auto_tags=1
let g:vimwiki_auto_toc=1
let g:vimwiki_nested_syntaxes = {'python': 'python', 'c++': 'cpp', 'java': 'java'}
let g:vimwiki_listsyms = ' ○◐●✓'
"let g:vimwiki_template_path = '$HOME/vimwiki/templates'
let g:vimwiki_template_path = '$HOME/vimwiki/templates/Dark-Vimwiki-Template/wiki/templates/'
let g:vimwiki_template_default = 'def_template'
let g:vimwiki_template_ext = '.html'
let g:vimwiki_auto_header = 1

" Python ident
au FileType python set ts=4 sts=4 et sw=4 smartindent cinwords=if,elif,else,for,while,try,except,finally,def,class


"set t_ut=
"set ttyfast

let g:airline#extensions#ale#enabled = 1

" Let's try this out for a little while to kick my arrow key habbit:
" don't use arrowkeys
noremap <Up>    <NOP>
noremap <Down>  <NOP>
noremap <Left>  <NOP>
noremap <Right> <NOP>

" really, just don't
inoremap <Up>    <NOP>
inoremap <Down>  <NOP>
inoremap <Left>  <NOP>
inoremap <Right> <NOP>

" use nice symbols for errors and warnings
let g:ale_sign_error = '✗'
let g:ale_sign_warning = '⚠'

aug python
  " ftype/python.vim overwrites this
  au FileType python setlocal ts=4 sts=4 sw=4 expandtab
aug end

set rtp+=~/.dotfiles/fzf

set updatetime=700

let g:tmuxline_theme = 'airline'
let g:tmuxline_preset = {
  \'a'    : '#(whoami)@#H',
  \'b'    : ['%Y-%m-%d', '%H:%M', '#S'],
  \'c'    : "#(echo $(tmux-mem-cpu-load -g 4 --interval 2 -m 2 -m 0))",
  \'win'  : ['#I', '#W'],
  \'cwin' : ['#I', '#W'],
  \'options': { 'status-justify': 'left' },
  \'win_options': { 'window-status-activity-style': 'none' }
  \}

let g:nv_search_paths = ['~/vimwiki']
let g:nv_default_extension = '.wiki'
