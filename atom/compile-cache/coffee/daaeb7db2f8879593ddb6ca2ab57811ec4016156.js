(function() {
  var BranchList, CommitList, CompositeDisposable, CurrentBranch, ErrorView, FileList, Model, OutputView, Promise, Repo, fs, git, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  Model = require('backbone').Model;

  CompositeDisposable = require('atom').CompositeDisposable;

  ErrorView = require('../views/error-view');

  OutputView = require('../views/output-view');

  Promise = (git = require('../git')).Promise;

  FileList = require('./files').FileList;

  _ref = require('./branches'), CurrentBranch = _ref.CurrentBranch, BranchList = _ref.BranchList;

  CommitList = require('./commits').CommitList;

  Repo = (function(_super) {
    __extends(Repo, _super);

    function Repo() {
      this.push = __bind(this.push, this);
      this.initiateGitCommand = __bind(this.initiateGitCommand, this);
      this.initiateCreateBranch = __bind(this.initiateCreateBranch, this);
      this.completeCommit = __bind(this.completeCommit, this);
      this.cleanupCommitMessageFile = __bind(this.cleanupCommitMessageFile, this);
      this.commitMessage = __bind(this.commitMessage, this);
      this.initiateCommit = __bind(this.initiateCommit, this);
      this.leaf = __bind(this.leaf, this);
      this.selection = __bind(this.selection, this);
      this.reload = __bind(this.reload, this);
      this.destroy = __bind(this.destroy, this);
      return Repo.__super__.constructor.apply(this, arguments);
    }

    Repo.prototype.initialize = function() {
      var atomGit;
      this.fileList = new FileList([]);
      this.branchList = new BranchList([]);
      this.commitList = new CommitList([]);
      this.currentBranch = new CurrentBranch(this.headRefsCount() > 0);
      this.subscriptions = new CompositeDisposable;
      this.listenTo(this.branchList, 'repaint', (function(_this) {
        return function() {
          _this.commitList.reload();
          return _this.currentBranch.reload();
        };
      })(this));
      atomGit = atom.project.getRepositories()[0];
      if (atomGit != null) {
        return this.subscriptions.add(atomGit.onDidChangeStatus(this.reload));
      }
    };

    Repo.prototype.destroy = function() {
      this.stopListening();
      return this.subscriptions.dispose();
    };

    Repo.prototype.reload = function() {
      var promises;
      promises = [this.fileList.reload()];
      if (this.headRefsCount() > 0) {
        promises.push(this.branchList.reload());
        promises.push(this.commitList.reload());
        promises.push(this.currentBranch.reload());
      }
      return Promise.all(promises);
    };

    Repo.prototype.selection = function() {
      return this.activeList.selection();
    };

    Repo.prototype.leaf = function() {
      return this.activeList.leaf();
    };

    Repo.prototype.commitMessagePath = function() {
      var _ref1;
      return path.join((_ref1 = atom.project.getRepositories()[0]) != null ? _ref1.getWorkingDirectory() : void 0, '/.git/COMMIT_EDITMSG_ATOMATIGIT');
    };

    Repo.prototype.headRefsCount = function() {
      var _ref1, _ref2, _ref3, _ref4;
      return (_ref1 = (_ref2 = atom.project.getRepositories()[0]) != null ? (_ref3 = _ref2.getReferences()) != null ? (_ref4 = _ref3.heads) != null ? _ref4.length : void 0 : void 0 : void 0) != null ? _ref1 : 0;
    };

    Repo.prototype.fetch = function() {
      return git.cmd('fetch')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.stash = function() {
      return git.cmd('stash')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.stashPop = function() {
      return git.cmd('stash pop')["catch"](function(error) {
        return new ErrorView(error);
      }).done((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this));
    };

    Repo.prototype.initiateCommit = function() {
      var editorPromise, preCommitHook;
      preCommitHook = atom.config.get('atomatigit.pre_commit_hook');
      if ((preCommitHook != null ? preCommitHook.length : void 0) > 0) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), preCommitHook);
      }
      fs.writeFileSync(this.commitMessagePath(), this.commitMessage());
      editorPromise = atom.workspace.open(this.commitMessagePath(), {
        activatePane: true
      });
      return editorPromise.then((function(_this) {
        return function(editor) {
          editor.setGrammar(atom.grammars.grammarForScopeName('text.git-commit'));
          editor.setCursorBufferPosition([0, 0]);
          return editor.onDidSave(_this.completeCommit);
        };
      })(this));
    };

    Repo.prototype.commitMessage = function() {
      var filesStaged, filesUnstaged, filesUntracked, message;
      message = '\n' + ("# Please enter the commit message for your changes. Lines starting\n# with '#' will be ignored, and an empty message aborts the commit.\n# On branch " + (this.currentBranch.localName()) + "\n");
      filesStaged = this.fileList.staged();
      filesUnstaged = this.fileList.unstaged();
      filesUntracked = this.fileList.untracked();
      if (filesStaged.length >= 1) {
        message += '#\n# Changes to be committed:\n';
      }
      _.each(filesStaged, function(file) {
        return message += file.commitMessage();
      });
      if (filesUnstaged.length >= 1) {
        message += '#\n# Changes not staged for commit:\n';
      }
      _.each(filesUnstaged, function(file) {
        return message += file.commitMessage();
      });
      if (filesUntracked.length >= 1) {
        message += '#\n# Untracked files:\n';
      }
      _.each(filesUntracked, function(file) {
        return message += file.commitMessage();
      });
      return message;
    };

    Repo.prototype.cleanupCommitMessageFile = function() {
      var _ref1;
      if (atom.workspace.getActivePane().getItems().length > 1) {
        atom.workspace.destroyActivePaneItem();
      } else {
        atom.workspace.destroyActivePane();
      }
      try {
        fs.unlinkSync(this.commitMessagePath());
      } catch (_error) {}
      return (_ref1 = atom.project.getRepositories()[0]) != null ? typeof _ref1.refreshStatus === "function" ? _ref1.refreshStatus() : void 0 : void 0;
    };

    Repo.prototype.completeCommit = function() {
      return git.commit(this.commitMessagePath()).then(this.reload).then((function(_this) {
        return function() {
          return _this.trigger('complete');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      })["finally"](this.cleanupCommitMessageFile);
    };

    Repo.prototype.initiateCreateBranch = function() {
      return this.trigger('needInput', {
        message: 'Branch name',
        callback: function(name) {
          return git.cmd("checkout -b " + name)["catch"](function(error) {
            return new ErrorView(error);
          }).done((function(_this) {
            return function() {
              return _this.trigger('complete');
            };
          })(this));
        }
      });
    };

    Repo.prototype.initiateGitCommand = function() {
      return this.trigger('needInput', {
        message: 'Git command',
        callback: (function(_this) {
          return function(command) {
            return git.cmd(command).then(function(output) {
              return new OutputView(output);
            })["catch"](function(error) {
              return new ErrorView(error);
            }).done(function() {
              return _this.trigger('complete');
            });
          };
        })(this)
      });
    };

    Repo.prototype.push = function() {
      return this.currentBranch.push();
    };

    return Repo;

  })(Model);

  module.exports = Repo;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL3JlcG8uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBVSxPQUFBLENBQVEsSUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQVUsT0FBQSxDQUFRLE1BQVIsQ0FGVixDQUFBOztBQUFBLEVBR0MsUUFBUyxPQUFBLENBQVEsVUFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFKRCxDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUE4QixPQUFBLENBQVEscUJBQVIsQ0FOOUIsQ0FBQTs7QUFBQSxFQU9BLFVBQUEsR0FBOEIsT0FBQSxDQUFRLHNCQUFSLENBUDlCLENBQUE7O0FBQUEsRUFRQyxVQUFXLENBQUEsR0FBQSxHQUFrQixPQUFBLENBQVEsUUFBUixDQUFsQixFQUFYLE9BUkQsQ0FBQTs7QUFBQSxFQVNDLFdBQTZCLE9BQUEsQ0FBUSxTQUFSLEVBQTdCLFFBVEQsQ0FBQTs7QUFBQSxFQVVBLE9BQThCLE9BQUEsQ0FBUSxZQUFSLENBQTlCLEVBQUMscUJBQUEsYUFBRCxFQUFnQixrQkFBQSxVQVZoQixDQUFBOztBQUFBLEVBV0MsYUFBNkIsT0FBQSxDQUFRLFdBQVIsRUFBN0IsVUFYRCxDQUFBOztBQUFBLEVBY007QUFFSiwyQkFBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxtQkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxPQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFxQixJ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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/repo.coffee
