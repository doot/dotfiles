;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets. It is optional.
(setq user-full-name "Jeremy Hauschildt"
      user-mail-address "jhauschildt@linkedin.com")

;; Doom exposes five (optional) variables for controlling fonts in Doom:
;;
;; - `doom-font' -- the primary font to use
;; - `doom-variable-pitch-font' -- a non-monospace font (where applicable)
;; - `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;; - `doom-unicode-font' -- for unicode glyphs
;; - `doom-serif-font' -- for the `fixed-pitch-serif' face
;;
;; See 'C-h v doom-font' for documentation and more examples of what they
;; accept. For example:
;;
;;(setq doom-font (font-spec :family "Fira Code" :size 12 :weight 'semi-light)
;;      doom-variable-pitch-font (font-spec :family "Fira Sans" :size 13))
;;
;; If you or Emacs can't find your font, use 'M-x describe-font' to look them
;; up, `M-x eval-region' to execute elisp code, and 'M-x doom/reload-font' to
;; refresh your font settings. If Emacs still can't find your font, it likely
;; wasn't installed correctly. Font issues are rarely Doom issues!
(setq doom-font (font-spec :family "Fira Code" :size 12)
      doom-big-font (font-spec :family "Fira Code" :size 18))

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function. This is the default:
(setq doom-theme 'doom-one)

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type nil)

;; If you use `org' and don't want your org files in the default location below,
;; change `org-directory'. It must be set before org loads!
(setq org-directory "~/org/")

;; load org modules
(after! org
  (add-to-list 'org-modules 'org-habit)
  ;; (add-hook 'before-save-hook #'org-update-all-dblocks) ;; regenerate clock tables before saving
 )


;; Whenever you reconfigure a package, make sure to wrap your config in an
;; `after!' block, otherwise Doom's defaults may override your settings. E.g.
;;
;;   (after! PACKAGE
;;     (setq x y))
;;
;; The exceptions to this rule:
;;
;;   - Setting file/directory variables (like `org-directory')
;;   - Setting variables which explicitly tell you to set them before their
;;     package is loaded (see 'C-h v VARIABLE' to look up their documentation).
;;   - Setting doom variables (which start with 'doom-' or '+').
;;
;; Here are some additional functions/macros that will help you configure Doom.
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;; Alternatively, use `C-h o' to look up a symbol (functions, variables, faces,
;; etc).
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.

;;  (use-package! org-alert
;;    (setq alert-default-style 'notifier))
;;(use-package! org-alert)

;; (require 'org-alert)
;;
;; (setq alert-default-style 'osx-notifier)
;; (use-package! org-wild-notifier
;;   :after org-agenda
;;   :init
;;   :config
;;   (setq alert-default-style 'osx-notifier
;;         org-wild-notifier-notification-title "Schedule")
;;   (org-wild-notifier-mode))

;; (use-package! org-wild-notifier
;;     ;; The add-hook enables the mode after init
;;     :defer t
;;     :init
;;     (add-hook 'doom-post-init-hook #'org-wild-notifier-mode t)
;;     :config
;;     (setq alert-default-style 'osx-notifier))

;; (use-package! org-wild-notifier
;;    ;; The add-hook enables the mode after init
;;    :defer t
;;    :init
;;    (add-hook 'doom-post-init-hook #'org-wild-notifier-mode t)
;;    :config
;;    (setq alert-default-style 'osx-notifier))

(unless (equal "Battery status not available"
               (battery))
  (display-battery-mode 1))                           ; if batter status is available, show on status

; from https://github.com/sunnyhasija/DOOMEmacs
(after! company
  (setq company-idle-delay 0.75
        company-minimum-prefix-length 3)
  (setq company-show-numbers t)
(add-hook 'evil-normal-state-entry-hook #'company-abort)) ;; make aborting less annoying.

(setq-default history-length 1000) ; remembering history from precedent
(setq-default prescient-history-length 1000)

(use-package! org-journal
  :custom
  (org-journal-file-type 'weekly)
  (org-journal-file-format "%Y-%m-%d.org")
  (org-journal-enable-agenda-integration t)
  (org-journal-date-format "%B - %F, %A")
  (org-journal-time-format "%R: ")
  )

(setq tab-width 2)

(map! :leader
      (:prefix ("j" . "journal") ;; org-journal bindings
        :desc "Create new journal entry" "j" #'org-journal-new-entry
        :desc "Open previous entry" "p" #'org-journal-previous-entry
        :desc "Open next entry" "n" #'org-journal-next-entry
        :desc "Search journal" "s" #'org-journal-search-forever))

;; The built-in calendar mode mappings for org-journal
;; conflict with evil bindings
(map!
 (:map calendar-mode-map
   :n "o" #'org-journal-display-entry
   :n "p" #'org-journal-previous-entry
   :n "n" #'org-journal-next-entry
   :n "O" #'org-journal-new-date-entry))


(setq org-deadline-warning-days 7)
(setq org-agenda-skip-scheduled-if-deadline-is-shown t)

(setq org-duration-format 'h:mm) ;; show hours at max, not days

(setq split-width-threshold 5000) ;; try to prevent splitting vertically when we want to split horizontally

(setq jiralib-url "https://jira01.corp.linkedin.com:8443")
(after! auth-source
  (setq auth-sources (nreverse auth-sources))) ;; fucking macos keychain does not support creation

(after! org (setq org-hide-emphasis-markers t)) ;; disable emphasis markers in org-mode
(add-hook! org-mode :append #'org-appear-mode) ;; reveal org emphasis markers only when under cursor

;; Auto-save all org files periodically
(add-hook 'auto-save-hook 'org-save-all-org-buffers)

;; Auto-reload files when they are changed on disk
(global-auto-revert-mode t)

;; Try to start up in a larger window on second, vertical, monitor
(add-to-list 'default-frame-alist '(top . (+ -398)))
(add-to-list 'default-frame-alist '(left . 3840))
(add-to-list 'default-frame-alist '(height . 160))
(add-to-list 'default-frame-alist '(width . 203))

(defun org-agenda-and-all-todos-notes-split ()
  (interactive)
  (find-file "~/org/notes.org")
  (split-window-below)
  (org-agenda nil "n"))

(map! :leader
      :desc "Agenda and All Todos split with notes.org"
      "o n" #'org-agenda-and-all-todos-notes-split)
