(function() {
  var BranchListView, BufferedProcess, OutputViewManager, PullBranchListView, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(repo, data, remote, extraArgs, resolve) {
      this.repo = repo;
      this.data = data;
      this.remote = remote;
      this.extraArgs = extraArgs;
      this.resolve = resolve;
      return PullBranchListView.__super__.initialize.apply(this, arguments);
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.pull(name.substring(name.indexOf('/') + 1));
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var startMessage, view, _ref;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = OutputViewManager["new"]();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      return new BufferedProcess({
        command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
        args: ['pull'].concat(this.extraArgs, this.remote, remoteBranch),
        options: {
          cwd: this.repo.getWorkingDirectory()
        },
        stdout: function(data) {
          return view.addLine(data.toString());
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        },
        exit: (function(_this) {
          return function(code) {
            _this.resolve();
            view.finish();
            return startMessage.dismiss();
          };
        })(this)
      });
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3B1bGwtYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUhqQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FHUTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFnQixNQUFoQixFQUF5QixTQUF6QixFQUFxQyxPQUFyQyxHQUFBO0FBQWlELE1BQWhELElBQUMsQ0FBQSxPQUFBLElBQStDLENBQUE7QUFBQSxNQUF6QyxJQUFDLENBQUEsT0FBQSxJQUF3QyxDQUFBO0FBQUEsTUFBbEMsSUFBQyxDQUFBLFNBQUEsTUFBaUMsQ0FBQTtBQUFBLE1BQXpCLElBQUMsQ0FBQSxZQUFBLFNBQXdCLENBQUE7QUFBQSxNQUFiLElBQUMsQ0FBQSxVQUFBLE9BQVksQ0FBQTthQUFBLG9EQUFBLFNBQUEsRUFBakQ7SUFBQSxDQUFaLENBQUE7O0FBQUEsaUNBRUEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFEVyxPQUFELEtBQUMsSUFDWCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsR0FBb0IsQ0FBbkMsQ0FBTixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRlM7SUFBQSxDQUZYLENBQUE7O0FBQUEsaUNBTUEsSUFBQSxHQUFNLFNBQUMsWUFBRCxHQUFBO0FBQ0osVUFBQSx3QkFBQTs7UUFESyxlQUFhO09BQ2xCO0FBQUEsTUFBQSxJQUFBLEdBQU8saUJBQWlCLENBQUMsS0FBRCxDQUFqQixDQUFBLENBQVAsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLFlBQWpCLEVBQStCO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtPQUEvQixDQURmLENBQUE7YUFFSSxJQUFBLGVBQUEsQ0FDRjtBQUFBLFFBQUEsT0FBQSxnRUFBK0MsS0FBL0M7QUFBQSxRQUNBLElBQUEsRUFBTSxDQUFDLE1BQUQsQ0FBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLFNBQWpCLEVBQTRCLElBQUMsQ0FBQSxNQUE3QixFQUFxQyxZQUFyQyxDQUROO0FBQUEsUUFFQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtTQUhGO0FBQUEsUUFJQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7aUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWIsRUFBVjtRQUFBLENBSlI7QUFBQSxRQUtBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBYixFQUFWO1FBQUEsQ0FMUjtBQUFBLFFBTUEsSUFBQSxFQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxJQUFELEdBQUE7QUFDSixZQUFBLEtBQUMsQ0FBQSxPQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBREEsQ0FBQTttQkFFQSxZQUFZLENBQUMsT0FBYixDQUFBLEVBSEk7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5OO09BREUsRUFIQTtJQUFBLENBTk4sQ0FBQTs7OEJBQUE7O0tBRCtCLGVBUm5DLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
