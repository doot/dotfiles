(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(blink-cursor-mode nil)
 '(column-number-mode t)
 '(display-battery-mode t)
 '(menu-bar-mode nil)
 '(org-agenda-custom-commands
   '(("n" "Agenda and all TODOs"
      ((tags "PRIORITY=\"A\""
             ((org-agenda-skip-function
               '(org-agenda-skip-entry-if 'todo 'done))
              (org-agenda-overriding-header "High-priority unfinished tasks:")))
       (agenda "")
       (alltodo "")))))
 '(org-agenda-files
   '("/Users/jhauschi/org/from_vimwiki.org" "/Users/jhauschi/org/notes.org" "/Users/jhauschi/org/projects.org" "/Users/jhauschi/org/template.org" "/Users/jhauschi/org/todo.org" "/Users/jhauschi/Library/Mobile Documents/iCloud~com~appsonthemove~beorg/Documents/org/journal/2020-11-02.org"))
 '(show-paren-mode t)
 '(size-indication-mode t)
 '(tool-bar-mode nil))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
