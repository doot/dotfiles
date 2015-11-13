(function() {
  var BranchListView, OutputView, PullBranchListView, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  OutputView = require('./output-view');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(repo, data, remote, extraArgs) {
      this.repo = repo;
      this.data = data;
      this.remote = remote;
      this.extraArgs = extraArgs;
      return PullBranchListView.__super__.initialize.apply(this, arguments);
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.pull(name.substring(name.indexOf('/') + 1));
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var view;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = new OutputView();
      return git.cmd({
        args: ['pull'].concat(this.extraArgs, this.remote, remoteBranch),
        cwd: this.repo.getWorkingDirectory(),
        stdout: function(data) {
          return view.addLine(data.toString());
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        },
        exit: (function(_this) {
          return function(code) {
            return view.finish();
          };
        })(this)
      });
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3B1bGwtYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBR1E7QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsRUFBZ0IsTUFBaEIsRUFBeUIsU0FBekIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxTQUFBLE1BQzFCLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsWUFBQSxTQUNuQyxDQUFBO2FBQUEsb0RBQUEsU0FBQSxFQURVO0lBQUEsQ0FBWixDQUFBOztBQUFBLGlDQUdBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BRFcsT0FBRCxLQUFDLElBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQW5DLENBQU4sQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZTO0lBQUEsQ0FIWCxDQUFBOztBQUFBLGlDQU9BLElBQUEsR0FBTSxTQUFDLFlBQUQsR0FBQTtBQUNKLFVBQUEsSUFBQTs7UUFESyxlQUFhO09BQ2xCO0FBQUEsTUFBQSxJQUFBLEdBQVcsSUFBQSxVQUFBLENBQUEsQ0FBWCxDQUFBO2FBQ0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLENBQUMsTUFBRCxDQUFRLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsU0FBakIsRUFBNEIsSUFBQyxDQUFBLE1BQTdCLEVBQXFDLFlBQXJDLENBQU47QUFBQSxRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FETDtBQUFBLFFBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2lCQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFiLEVBQVY7UUFBQSxDQUZSO0FBQUEsUUFHQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7aUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWIsRUFBVjtRQUFBLENBSFI7QUFBQSxRQUlBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxHQUFBO21CQUFVLElBQUksQ0FBQyxNQUFMLENBQUEsRUFBVjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSk47T0FERixFQUZJO0lBQUEsQ0FQTixDQUFBOzs4QkFBQTs7S0FEK0IsZUFQbkMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
