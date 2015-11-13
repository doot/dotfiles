(function() {
  var BranchListView, DeleteBranchListView, git, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = DeleteBranchListView = (function(_super) {
    __extends(DeleteBranchListView, _super);

    function DeleteBranchListView() {
      return DeleteBranchListView.__super__.constructor.apply(this, arguments);
    }

    DeleteBranchListView.prototype.initialize = function(repo, data, _arg) {
      this.repo = repo;
      this.data = data;
      this.isRemote = (_arg != null ? _arg : {}).isRemote;
      return DeleteBranchListView.__super__.initialize.apply(this, arguments);
    };

    DeleteBranchListView.prototype.confirmed = function(_arg) {
      var branch, name, remote;
      name = _arg.name;
      if (name.startsWith("*")) {
        name = name.slice(1);
      }
      if (!this.isRemote) {
        this["delete"](name);
      } else {
        branch = name.substring(name.indexOf('/') + 1);
        remote = name.substring(0, name.indexOf('/'));
        this["delete"](branch, remote);
      }
      return this.cancel();
    };

    DeleteBranchListView.prototype["delete"] = function(branch, remote) {
      if (remote == null) {
        remote = '';
      }
      if (remote.length === 0) {
        return git.cmd({
          args: ['branch', '-D', branch],
          cwd: this.repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      } else {
        return git.cmd({
          args: ['push', remote, '--delete', branch],
          cwd: this.repo.getWorkingDirectory(),
          stderr: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      }
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2RlbGV0ZS1icmFuY2gtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRVE7QUFDSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsRUFBZSxJQUFmLEdBQUE7QUFBa0MsTUFBakMsSUFBQyxDQUFBLE9BQUEsSUFBZ0MsQ0FBQTtBQUFBLE1BQTFCLElBQUMsQ0FBQSxPQUFBLElBQXlCLENBQUE7QUFBQSxNQUFsQixJQUFDLENBQUEsMkJBQUYsT0FBWSxJQUFWLFFBQWlCLENBQUE7YUFBQSxzREFBQSxTQUFBLEVBQWxDO0lBQUEsQ0FBWixDQUFBOztBQUFBLG1DQUVBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsb0JBQUE7QUFBQSxNQURXLE9BQUQsS0FBQyxJQUNYLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBSDtBQUNFLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxDQUFQLENBREY7T0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxRQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBQSxDQUFELENBQVEsSUFBUixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxHQUFvQixDQUFuQyxDQUFULENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQWxCLENBRFQsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFFBQUEsQ0FBRCxDQUFRLE1BQVIsRUFBZ0IsTUFBaEIsQ0FGQSxDQUhGO09BSEE7YUFVQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBWFM7SUFBQSxDQUZYLENBQUE7O0FBQUEsbUNBZUEsU0FBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTs7UUFBUyxTQUFTO09BQ3hCO0FBQUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFQLEtBQWlCLENBQXBCO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLENBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsTUFBakIsQ0FBTjtBQUFBLFVBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQURMO0FBQUEsVUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7bUJBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFwQixFQUFWO1VBQUEsQ0FGUjtTQURGLEVBREY7T0FBQSxNQUFBO2VBTUUsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsVUFBakIsRUFBNkIsTUFBN0IsQ0FBTjtBQUFBLFVBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQURMO0FBQUEsVUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7bUJBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFwQixFQUFWO1VBQUEsQ0FGUjtTQURGLEVBTkY7T0FETTtJQUFBLENBZlIsQ0FBQTs7Z0NBQUE7O0tBRGlDLGVBTnJDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/delete-branch-view.coffee
