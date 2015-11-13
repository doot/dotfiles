(function() {
  var $, BranchListView, CommitListView, CompositeDisposable, CurrentBranchView, ErrorView, FileListView, InputView, RepoView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  FileListView = require('./files').FileListView;

  _ref1 = require('./branches'), CurrentBranchView = _ref1.CurrentBranchView, BranchListView = _ref1.BranchListView;

  CommitListView = require('./commits').CommitListView;

  ErrorView = require('./error-view');

  InputView = require('./input-view');

  RepoView = (function(_super) {
    __extends(RepoView, _super);

    function RepoView() {
      this.destroy = __bind(this.destroy, this);
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.toggle = __bind(this.toggle, this);
      this.toggleFocus = __bind(this.toggleFocus, this);
      this.unfocus = __bind(this.unfocus, this);
      this.focus = __bind(this.focus, this);
      this.unfocusIfNotActive = __bind(this.unfocusIfNotActive, this);
      this.hasFocus = __bind(this.hasFocus, this);
      this.resize = __bind(this.resize, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.activateView = __bind(this.activateView, this);
      this.showCommits = __bind(this.showCommits, this);
      this.showFiles = __bind(this.showFiles, this);
      this.showBranches = __bind(this.showBranches, this);
      this.refresh = __bind(this.refresh, this);
      this.insertCommands = __bind(this.insertCommands, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return RepoView.__super__.constructor.apply(this, arguments);
    }

    RepoView.content = function(model) {
      return this.div({
        "class": 'atomatigit'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'resize-handle',
            outlet: 'resizeHandle'
          });
          _this.subview('currentBranchView', new CurrentBranchView(model));
          _this.ul({
            "class": 'list-inline tab-bar inset-panel'
          }, function() {
            _this.li({
              outlet: 'fileTab',
              "class": 'tab active',
              click: 'showFiles'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Files');
            });
            _this.li({
              outlet: 'branchTab',
              "class": 'tab',
              click: 'showBranches'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Branches');
            });
            return _this.li({
              outlet: 'commitTab',
              "class": 'tab',
              click: 'showCommits'
            }, function() {
              return _this.div({
                "class": 'title'
              }, 'Log');
            });
          });
          return _this.div({
            "class": 'lists'
          }, function() {
            _this.subview('fileListView', new FileListView(model.fileList));
            _this.subview('branchListView', new BranchListView(model.branchList));
            return _this.subview('commitListView', new CommitListView(model.commitList));
          });
        };
      })(this));
    };

    RepoView.prototype.initialize = function(model) {
      this.model = model;
      return this.InitPromise = this.model.reload().then(this.showFiles);
    };

    RepoView.prototype.attached = function() {
      this.model.on('needInput', this.getInput);
      this.model.on('complete', this.focus);
      this.model.on('update', this.refresh);
      this.on('click', this.focus);
      this.resizeHandle.on('mousedown', this.resizeStarted);
      this.fileListView.on('blur', this.unfocusIfNotActive);
      this.branchListView.on('blur', this.unfocusIfNotActive);
      this.commitListView.on('blur', this.unfocusIfNotActive);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(this.insertCommands());
    };

    RepoView.prototype.detached = function() {
      this.model.off('needInput', this.getInput);
      this.model.off('complete', this.focus);
      this.model.off('update', this.refresh);
      this.off('click', this.focus);
      this.resizeHandle.off('mousedown', this.resizeStarted);
      this.fileListView.off('blur', this.unfocusIfNotActive);
      this.branchListView.off('blur', this.unfocusIfNotActive);
      this.commitListView.off('blur', this.unfocusIfNotActive);
      return this.subscriptions.dispose();
    };

    RepoView.prototype.insertCommands = function() {
      return atom.commands.add(this.element, {
        'core:move-down': (function(_this) {
          return function() {
            return _this.model.activeList.next();
          };
        })(this),
        'core:move-up': (function(_this) {
          return function() {
            return _this.model.activeList.previous();
          };
        })(this),
        'core:cancel': this.hide,
        'atomatigit:files': this.showFiles,
        'atomatigit:branches': this.showBranches,
        'atomatigit:commit-log': this.showCommits,
        'atomatigit:commit': (function(_this) {
          return function() {
            _this.model.initiateCommit();
            return _this.unfocus();
          };
        })(this),
        'atomatigit:git-command': (function(_this) {
          return function() {
            _this.model.initiateGitCommand();
            return _this.unfocus();
          };
        })(this),
        'atomatigit:stage': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.stage() : void 0;
          };
        })(this),
        'atomatigit:stash': this.model.stash,
        'atomatigit:stash-pop': this.model.stashPop,
        'atomatigit:toggle-diff': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.selection()) != null ? _ref2.toggleDiff() : void 0;
          };
        })(this),
        'atomatigit:unstage': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.unstage() : void 0;
          };
        })(this),
        'atomatigit:fetch': this.model.fetch,
        'atomatigit:kill': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.leaf()) != null ? _ref2.kill() : void 0;
          };
        })(this),
        'atomatigit:open': (function(_this) {
          return function() {
            var _ref2;
            return (_ref2 = _this.model.selection()) != null ? _ref2.open() : void 0;
          };
        })(this),
        'atomatigit:push': this.model.push,
        'atomatigit:refresh': this.refresh,
        'atomatigit:toggle-focus': this.toggleFocus
      });
    };

    RepoView.prototype.refresh = function() {
      return this.model.reload().then((function(_this) {
        return function() {
          return _this.activeView.repaint();
        };
      })(this));
    };

    RepoView.prototype.showBranches = function() {
      this.model.activeList = this.model.branchList;
      this.activeView = this.branchListView;
      return this.activateView();
    };

    RepoView.prototype.showFiles = function() {
      this.model.activeList = this.model.fileList;
      this.activeView = this.fileListView;
      return this.activateView();
    };

    RepoView.prototype.showCommits = function() {
      this.model.activeList = this.model.commitList;
      this.activeView = this.commitListView;
      return this.activateView();
    };

    RepoView.prototype.activateView = function() {
      this.fileListView.toggleClass('hidden', this.activeView !== this.fileListView);
      this.fileTab.toggleClass('active', this.activeView === this.fileListView);
      this.branchListView.toggleClass('hidden', this.activeView !== this.branchListView);
      this.branchTab.toggleClass('active', this.activeView === this.branchListView);
      this.commitListView.toggleClass('hidden', this.activeView !== this.commitListView);
      this.commitTab.toggleClass('active', this.activeView === this.commitListView);
      return this.focus();
    };

    RepoView.prototype.resizeStarted = function() {
      $(document.body).on('mousemove', this.resize);
      return $(document.body).on('mouseup', this.resizeStopped);
    };

    RepoView.prototype.resizeStopped = function() {
      $(document.body).off('mousemove', this.resize);
      return $(document.body).off('mouseup', this.resizeStopped);
    };

    RepoView.prototype.resize = function(_arg) {
      var pageX, width;
      pageX = _arg.pageX;
      width = $(document.body).width() - pageX;
      return this.width(width);
    };

    RepoView.prototype.getInput = function(options) {
      return new InputView(options);
    };

    RepoView.prototype.hasFocus = function() {
      var _ref2;
      return ((_ref2 = this.activeView) != null ? _ref2.is(':focus') : void 0) || document.activeElement === this.activeView;
    };

    RepoView.prototype.unfocusIfNotActive = function() {
      return this.unfocusTimeoutId = setTimeout((function(_this) {
        return function() {
          if (!_this.hasFocus()) {
            return _this.unfocus();
          }
        };
      })(this), 300);
    };

    RepoView.prototype.focus = function() {
      var _ref2;
      if (this.unfocusTimeoutId != null) {
        clearTimeout(this.unfocusTimeoutId);
        this.unfocusTimeoutId = null;
      }
      return ((_ref2 = this.activeView) != null ? typeof _ref2.focus === "function" ? _ref2.focus() : void 0 : void 0) && (this.hasClass('focused') || this.refresh()) && this.addClass('focused');
    };

    RepoView.prototype.unfocus = function() {
      return this.removeClass('focused');
    };

    RepoView.prototype.toggleFocus = function() {
      if (!this.hasFocus()) {
        return this.focus();
      }
      this.unfocus();
      return atom.workspace.getActivePane().activate();
    };

    RepoView.prototype.toggle = function() {
      if (this.hasParent() && this.hasFocus()) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    RepoView.prototype.show = function() {
      if (!this.hasParent()) {
        atom.workspace.addRightPanel({
          item: this
        });
      }
      return this.focus();
    };

    RepoView.prototype.hide = function() {
      if (this.hasParent()) {
        this.detach();
      }
      return atom.workspace.getActivePane().activate();
    };

    RepoView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.detach();
    };

    return RepoView;

  })(View);

  module.exports = RepoView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvcmVwby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwSUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0MsZUFBc0MsT0FBQSxDQUFRLFNBQVIsRUFBdEMsWUFIRCxDQUFBOztBQUFBLEVBSUEsUUFBdUMsT0FBQSxDQUFRLFlBQVIsQ0FBdkMsRUFBQywwQkFBQSxpQkFBRCxFQUFvQix1QkFBQSxjQUpwQixDQUFBOztBQUFBLEVBS0MsaUJBQXNDLE9BQUEsQ0FBUSxXQUFSLEVBQXRDLGNBTEQsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBdUMsT0FBQSxDQUFRLGNBQVIsQ0FOdkMsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBdUMsT0FBQSxDQUFRLGNBQVIsQ0FQdkMsQ0FBQTs7QUFBQSxFQVVNO0FBQ0osK0JBQUEsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFlBQVA7T0FBTCxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7QUFBQSxZQUF3QixNQUFBLEVBQVEsY0FBaEM7V0FBTCxDQUFBLENBQUE7QUFBQSxV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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/repo-view.coffee
