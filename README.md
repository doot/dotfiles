# dotfiles 
Personal configuration files.  A bit messy and sparse, mostly for my own use.

Uses Dotbot to install and maintain: https://git.io/dotbot.  Also see authors [blog post](http://www.anishathalye.com/2014/08/03/managing-your-dotfiles/).


### Install
```
# If there is a work dotfiles repository, make sure it is cloned to ~/.dotfiles_work/ and the hostnames in install.conf.yaml apply to the work environment

git clone --recurse-submodules git@github.com:doot/dotfiles.git ~/.dotfiles
~/.dotfiles/install
```
    
### Update/Sync Existing Box
```
db-update
```

###### TODO
- Incorporate and combine configurations from other systems
- Make OS agnostic (some OS X specifics exist and I would like the same repository to work on linux boxes)
- Make system agnostic (some system specific things exist)
