(function() {
  var $, BranchListView, CompositeDisposable, InputView, RemoteBranchListView, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  RemoteBranchListView = require('../views/remote-branch-list-view');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      var destroy, panel;
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      panel = atom.workspace.addModalPanel({
        item: this
      });
      panel.show();
      destroy = (function(_this) {
        return function() {
          panel.destroy();
          _this.disposables.dispose();
          return _this.currentPane.activate();
        };
      })(this);
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': function(event) {
          return destroy();
        }
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            var editor, name;
            editor = _this.branchEditor.getModel();
            name = editor.getText();
            if (name.length > 0) {
              _this.createBranch(name);
              return destroy();
            }
          };
        })(this)
      }));
    };

    InputView.prototype.createBranch = function(name) {
      return git.cmd({
        args: ['checkout', '-b', name],
        cwd: this.repo.getWorkingDirectory(),
        stderr: (function(_this) {
          return function(data) {
            notifier.addSuccess(data.toString());
            git.refresh();
            return _this.currentPane.activate();
          };
        })(this)
      });
    };

    return InputView;

  })(View);

  module.exports.newBranch = function(repo) {
    return new InputView(repo);
  };

  module.exports.gitBranches = function(repo) {
    return git.cmd({
      args: ['branch'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new BranchListView(repo, data);
      }
    });
  };

  module.exports.gitRemoteBranches = function(repo) {
    return git.cmd({
      args: ['branch', '-r'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new RemoteBranchListView(repo, data);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYnJhbmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFEcEIsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSxrQ0FBUixDQU52QixDQUFBOztBQUFBLEVBUU07QUFDSixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQsRUFBNkIsSUFBQSxjQUFBLENBQWU7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFBWSxlQUFBLEVBQWlCLGlCQUE3QjtXQUFmLENBQTdCLEVBREc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBSUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-branch.coffee
