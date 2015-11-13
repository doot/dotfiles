(function() {
  var $, $$, BranchDialog, BranchView, CommitDialog, ConfirmDialog, DeleteDialog, DiffView, FileView, FlowDialog, GitControlView, LogView, MenuView, MergeDialog, PushDialog, View, git, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$, $$ = _ref.$$;

  git = require('./git');

  BranchView = require('./views/branch-view');

  DiffView = require('./views/diff-view');

  FileView = require('./views/file-view');

  LogView = require('./views/log-view');

  MenuView = require('./views/menu-view');

  BranchDialog = require('./dialogs/branch-dialog');

  CommitDialog = require('./dialogs/commit-dialog');

  ConfirmDialog = require('./dialogs/confirm-dialog');

  DeleteDialog = require('./dialogs/delete-dialog');

  MergeDialog = require('./dialogs/merge-dialog');

  FlowDialog = require('./dialogs/flow-dialog');

  PushDialog = require('./dialogs/push-dialog');

  module.exports = GitControlView = (function(_super) {
    __extends(GitControlView, _super);

    function GitControlView() {
      this.flow = __bind(this.flow, this);
      this.merge = __bind(this.merge, this);
      return GitControlView.__super__.constructor.apply(this, arguments);
    }

    GitControlView.content = function() {
      if (git.isInitialised()) {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            _this.subview('menuView', new MenuView());
            _this.div({
              "class": 'content',
              outlet: 'contentView'
            }, function() {
              _this.div({
                "class": 'sidebar'
              }, function() {
                _this.subview('filesView', new FileView());
                _this.subview('localBranchView', new BranchView({
                  name: 'Local',
                  local: true
                }));
                return _this.subview('remoteBranchView', new BranchView({
                  name: 'Remote'
                }));
              });
              _this.div({
                "class": 'domain'
              }, function() {
                return _this.subview('diffView', new DiffView());
              });
              _this.subview('branchDialog', new BranchDialog());
              _this.subview('commitDialog', new CommitDialog());
              _this.subview('mergeDialog', new MergeDialog());
              _this.subview('flowDialog', new FlowDialog());
              return _this.subview('pushDialog', new PushDialog());
            });
            return _this.subview('logView', new LogView());
          };
        })(this));
      } else {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            return _this.subview('logView', new LogView());
          };
        })(this));
      }
    };

    GitControlView.prototype.serialize = function() {};

    GitControlView.prototype.initialize = function() {
      console.log('GitControlView: initialize');
      git.setLogger((function(_this) {
        return function(log, iserror) {
          return _this.logView.log(log, iserror);
        };
      })(this));
      this.active = true;
      this.branchSelected = null;
      if (!git.isInitialised()) {
        git.alert("> This project is not a git repository. Either open another project or create a repository.");
      }
    };

    GitControlView.prototype.destroy = function() {
      console.log('GitControlView: destroy');
      this.active = false;
    };

    GitControlView.prototype.getTitle = function() {
      return 'git:control';
    };

    GitControlView.prototype.update = function(nofetch) {
      if (git.isInitialised()) {
        this.loadBranches();
        this.showStatus();
        if (!nofetch) {
          this.fetchMenuClick();
          this.diffView.clearAll();
        }
      }
    };

    GitControlView.prototype.loadLog = function() {
      git.log(this.selectedBranch).then(function(logs) {
        console.log('git.log', logs);
      });
    };

    GitControlView.prototype.checkoutBranch = function(branch, remote) {
      git.checkout(branch, remote).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.branchCount = function(count) {
      var remotes;
      if (git.isInitialised()) {
        remotes = git.hasOrigin();
        this.menuView.activate('upstream', remotes && count.behind);
        this.menuView.activate('downstream', remotes && (count.ahead || !git.getRemoteBranch()));
        this.menuView.activate('remote', remotes);
      }
    };

    GitControlView.prototype.loadBranches = function() {
      if (git.isInitialised()) {
        this.selectedBranch = git.getLocalBranch();
        git.getBranches().then((function(_this) {
          return function(branches) {
            _this.branches = branches;
            _this.remoteBranchView.addAll(branches.remote);
            _this.localBranchView.addAll(branches.local, true);
          };
        })(this));
      }
    };

    GitControlView.prototype.showSelectedFiles = function() {
      this.menuView.activate('file', this.filesView.hasSelected());
      this.menuView.activate('file.merging', this.filesView.hasSelected() || git.isMerging());
    };

    GitControlView.prototype.showStatus = function() {
      git.status().then((function(_this) {
        return function(files) {
          _this.filesView.addAll(files);
        };
      })(this));
    };

    GitControlView.prototype.branchMenuClick = function() {
      this.branchDialog.activate();
    };

    GitControlView.prototype.compareMenuClick = function() {
      git.diff(this.filesView.getSelected().all.join(' ')).then((function(_this) {
        return function(diffs) {
          return _this.diffView.addAll(diffs);
        };
      })(this));
    };

    GitControlView.prototype.commitMenuClick = function() {
      if (!(this.filesView.hasSelected() || git.isMerging())) {
        return;
      }
      this.commitDialog.activate();
    };

    GitControlView.prototype.commit = function() {
      var files, msg;
      if (!this.filesView.hasSelected()) {
        return;
      }
      msg = this.commitDialog.getMessage();
      files = this.filesView.getSelected();
      this.filesView.unselectAll();
      git.add(files.add).then(function() {
        return git.remove(files.rem);
      }).then(function() {
        return git.commit(msg);
      }).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.createBranch = function(branch) {
      git.createBranch(branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.deleteBranch = function(branch) {
      var confirmCb, forceDeleteCallback;
      confirmCb = (function(_this) {
        return function(params) {
          git.deleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      forceDeleteCallback = (function(_this) {
        return function(params) {
          return git.forceDeleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      this.contentView.append(new DeleteDialog({
        hdr: 'Delete Branch',
        msg: "Are you sure you want to delete the local branch '" + branch + "'?",
        cb: confirmCb,
        fdCb: forceDeleteCallback,
        branch: branch
      }));
    };

    GitControlView.prototype.fetchMenuClick = function() {
      if (git.isInitialised()) {
        if (!git.hasOrigin()) {
          return;
        }
      }
      git.fetch().then((function(_this) {
        return function() {
          return _this.loadBranches();
        };
      })(this));
    };

    GitControlView.prototype.mergeMenuClick = function() {
      this.mergeDialog.activate(this.branches.local);
    };

    GitControlView.prototype.merge = function(branch, noff) {
      git.merge(branch, noff).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.flowMenuClick = function() {
      this.flowDialog.activate(this.branches.local);
    };

    GitControlView.prototype.flow = function(type, action, branch) {
      git.flow(type, action, branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.pullMenuClick = function() {
      git.pull().then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.pushMenuClick = function() {
      git.getBranches().then((function(_this) {
        return function(branches) {
          return _this.pushDialog.activate(branches.remote);
        };
      })(this));
    };

    GitControlView.prototype.push = function(remote, branches) {
      return git.push(remote, branches).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.resetMenuClick = function() {
      var files;
      if (!this.filesView.hasSelected()) {
        return;
      }
      files = this.filesView.getSelected();
      return atom.confirm({
        message: "Reset will erase changes since the last commit in the selected files. Are you sure?",
        buttons: {
          Cancel: (function(_this) {
            return function() {};
          })(this),
          Reset: (function(_this) {
            return function() {
              git.reset(files.all).then(function() {
                return _this.update();
              });
            };
          })(this)
        }
      });
    };

    return GitControlView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL2dpdC1jb250cm9sLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVMQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsWUFBQSxJQUFELEVBQU8sU0FBQSxDQUFQLEVBQVUsVUFBQSxFQUFWLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FGTixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVIsQ0FOWCxDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUixDQVBWLENBQUE7O0FBQUEsRUFRQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSLENBUlgsQ0FBQTs7QUFBQSxFQVVBLFlBQUEsR0FBZSxPQUFBLENBQVEseUJBQVIsQ0FWZixDQUFBOztBQUFBLEVBV0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUixDQVhmLENBQUE7O0FBQUEsRUFZQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUixDQVpoQixDQUFBOztBQUFBLEVBYUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUixDQWJmLENBQUE7O0FBQUEsRUFjQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBZGQsQ0FBQTs7QUFBQSxFQWVBLFVBQUEsR0FBYSxPQUFBLENBQVEsdUJBQVIsQ0FmYixDQUFBOztBQUFBLEVBZ0JBLFVBQUEsR0FBYSxPQUFBLENBQVEsdUJBQVIs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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/git-control-view.coffee
