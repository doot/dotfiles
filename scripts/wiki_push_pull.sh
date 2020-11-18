#!/bin/bash

# This is not a good way to do this, just a tempoary measure

{ 
  cd ~/vimwiki/
  git add . && git commit -m "alias commit: `date`" && git push origin master;
  cd - 
}
{ 
  cd ~/vimwiki/
  git pull
  cd -
}
