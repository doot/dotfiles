(function() {
  var CompositeDisposable, GitCommit, GitPush, Path, fs, git, notifier, os;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  os = require('os');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  module.exports = GitCommit = (function() {
    GitCommit.prototype.dir = function() {
      if (this.submodule != null ? this.submodule : this.submodule = git.getSubmodule()) {
        return this.submodule.getWorkingDirectory();
      } else {
        return this.repo.getWorkingDirectory();
      }
    };

    GitCommit.prototype.filePath = function() {
      return Path.join(this.repo.getPath(), 'COMMIT_EDITMSG');
    };

    function GitCommit(repo, _arg) {
      var _ref;
      this.repo = repo;
      _ref = _arg != null ? _arg : {}, this.amend = _ref.amend, this.andPush = _ref.andPush, this.stageChanges = _ref.stageChanges;
      this.currentPane = atom.workspace.getActivePane();
      this.disposables = new CompositeDisposable;
      if (this.amend == null) {
        this.amend = '';
      }
      this.isAmending = this.amend.length > 0;
      this.commentchar = '#';
      git.cmd({
        args: ['config', '--get', 'core.commentchar'],
        stdout: (function(_this) {
          return function(data) {
            if (data.trim() !== '') {
              return _this.commentchar = data.trim();
            }
          };
        })(this)
      });
      if (this.stageChanges) {
        git.add(this.repo, {
          update: true,
          exit: (function(_this) {
            return function(code) {
              return _this.getStagedFiles();
            };
          })(this)
        });
      } else {
        this.getStagedFiles();
      }
    }

    GitCommit.prototype.getStagedFiles = function() {
      return git.stagedFiles(this.repo, (function(_this) {
        return function(files) {
          if (_this.amend !== '' || files.length >= 1) {
            return git.cmd({
              args: ['status'],
              cwd: _this.repo.getWorkingDirectory(),
              stdout: function(data) {
                return _this.prepFile(data);
              }
            });
          } else {
            _this.cleanup();
            return notifier.addInfo('Nothing to commit.');
          }
        };
      })(this));
    };

    GitCommit.prototype.prepFile = function(status) {
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + this.commentchar + " ");
      return this.getTemplate().then((function(_this) {
        return function(template) {
          fs.writeFileSync(_this.filePath(), "" + (_this.amend.length > 0 ? _this.amend : template) + "\n" + _this.commentchar + " Please enter the commit message for your changes. Lines starting\n" + _this.commentchar + " with '" + _this.commentchar + "' will be ignored, and an empty message aborts the commit.\n" + _this.commentchar + "\n" + _this.commentchar + " " + status);
          return _this.showFile();
        };
      })(this));
    };

    GitCommit.prototype.getTemplate = function() {
      return new Promise(function(resolve, reject) {
        return git.cmd({
          args: ['config', '--get', 'commit.template'],
          stdout: (function(_this) {
            return function(data) {
              return resolve((data.trim() !== '' ? fs.readFileSync(Path.get(data.trim())) : ''));
            };
          })(this)
        });
      });
    };

    GitCommit.prototype.showFile = function() {
      return atom.workspace.open(this.filePath(), {
        searchAllPanes: true
      }).done((function(_this) {
        return function(textEditor) {
          if (atom.config.get('git-plus.openInPane')) {
            return _this.splitPane(atom.config.get('git-plus.splitPane'), textEditor);
          } else {
            _this.disposables.add(textEditor.onDidSave(function() {
              return _this.commit();
            }));
            return _this.disposables.add(textEditor.onDidDestroy(function() {
              if (_this.isAmending) {
                return _this.undoAmend();
              } else {
                return _this.cleanup();
              }
            }));
          }
        };
      })(this));
    };

    GitCommit.prototype.splitPane = function(splitDir, oldEditor) {
      var directions, hookEvents, options, pane;
      pane = atom.workspace.paneForURI(this.filePath());
      options = {
        copyActiveItem: true
      };
      hookEvents = (function(_this) {
        return function(textEditor) {
          oldEditor.destroy();
          _this.disposables.add(textEditor.onDidSave(function() {
            return _this.commit();
          }));
          return _this.disposables.add(textEditor.onDidDestroy(function() {
            if (_this.isAmending) {
              return _this.undoAmend();
            } else {
              return _this.cleanup();
            }
          }));
        };
      })(this);
      directions = {
        left: (function(_this) {
          return function() {
            pane = pane.splitLeft(options);
            return hookEvents(pane.getActiveEditor());
          };
        })(this),
        right: function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        },
        up: function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        },
        down: function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        }
      };
      return directions[splitDir]();
    };

    GitCommit.prototype.commit = function() {
      var args;
      args = ['commit', '--cleanup=strip', "--file=" + (this.filePath())];
      return git.cmd({
        args: args,
        options: {
          cwd: this.dir()
        },
        stdout: (function(_this) {
          return function(data) {
            notifier.addSuccess(data);
            if (_this.andPush) {
              new GitPush(_this.repo);
            }
            _this.isAmending = false;
            _this.destroyCommitEditor();
            if (_this.currentPane.alive) {
              _this.currentPane.activate();
            }
            return git.refresh();
          };
        })(this),
        stderr: (function(_this) {
          return function(err) {
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.destroyCommitEditor = function() {
      this.cleanup();
      return atom.workspace.getPanes().some(function(pane) {
        return pane.getItems().some(function(paneItem) {
          var _ref;
          if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref = paneItem.getURI()) != null ? _ref.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
            if (pane.getItems().length === 1) {
              pane.destroy();
            } else {
              paneItem.destroy();
            }
            return true;
          }
        });
      });
    };

    GitCommit.prototype.undoAmend = function(err) {
      if (err == null) {
        err = '';
      }
      return git.cmd({
        args: ['reset', 'ORIG_HEAD'],
        stdout: function() {
          return notifier.addError("" + err + ": Commit amend aborted!");
        },
        stderr: function() {
          return notifier.addError('ERROR! Undoing the amend failed! Please fix your repository manually!');
        },
        exit: (function(_this) {
          return function() {
            _this.isAmending = false;
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.cleanup = function() {
      if (this.currentPane.alive) {
        this.currentPane.activate();
      }
      this.disposables.dispose();
      try {
        return fs.unlinkSync(this.filePath());
      } catch (_error) {}
    };

    return GitCommit;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBTE4sQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FQVixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUlKLHdCQUFBLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFFSCxNQUFBLDZCQUFHLElBQUMsQ0FBQSxZQUFELElBQUMsQ0FBQSxZQUFhLEdBQUcsQ0FBQyxZQUFKLENBQUEsQ0FBakI7ZUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLG1CQUFYLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsRUFIRjtPQUZHO0lBQUEsQ0FBTCxDQUFBOztBQUFBLHdCQVVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBQVYsRUFBMkIsZ0JBQTNCLEVBQUg7SUFBQSxDQVZWLENBQUE7O0FBWWEsSUFB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-commit.coffee
