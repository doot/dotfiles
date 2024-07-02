#!/bin/bash

# This is not a good way to do this, just a tempoary measure

{ 
  cd ~/vimwiki/ || return
  git add . && git commit -m "alias commit: $(date)" && git push origin master;
  cd - || return
}
{ 
  cd ~/vimwiki/ || return
  git pull
  cd - || return
}
