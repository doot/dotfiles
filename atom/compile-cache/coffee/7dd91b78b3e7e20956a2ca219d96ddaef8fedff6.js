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
      if (!remote) {
        return git.cmd(['branch', '-D', branch], {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        });
      } else {
        return git.cmd(['push', remote, '--delete', branch], {
          cwd: this.repo.getWorkingDirectory()
        })["catch"](function(data) {
          return notifier.addSuccess(data);
        });
      }
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2RlbGV0ZS1icmFuY2gtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRVE7QUFDSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsRUFBZSxJQUFmLEdBQUE7QUFBa0MsTUFBakMsSUFBQyxDQUFBLE9BQUEsSUFBZ0MsQ0FBQTtBQUFBLE1BQTFCLElBQUMsQ0FBQSxPQUFBLElBQXlCLENBQUE7QUFBQSxNQUFsQixJQUFDLENBQUEsMkJBQUYsT0FBWSxJQUFWLFFBQWlCLENBQUE7YUFBQSxzREFBQSxTQUFBLEVBQWxDO0lBQUEsQ0FBWixDQUFBOztBQUFBLG1DQUVBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsb0JBQUE7QUFBQSxNQURXLE9BQUQsS0FBQyxJQUNYLENBQUE7QUFBQSxNQUFBLElBQXdCLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLENBQXhCO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLENBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLFFBQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFBLENBQUQsQ0FBUSxJQUFSLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQW5DLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBbEIsQ0FEVCxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsUUFBQSxDQUFELENBQVEsTUFBUixFQUFnQixNQUFoQixDQUZBLENBSEY7T0FEQTthQU9BLElBQUMsQ0FBQSxNQUFELENBQUEsRUFSUztJQUFBLENBRlgsQ0FBQTs7QUFBQSxtQ0FZQSxTQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ04sTUFBQSxJQUFBLENBQUEsTUFBQTtlQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELEVBQVcsSUFBWCxFQUFpQixNQUFqQixDQUFSLEVBQWtDO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7U0FBbEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtpQkFBVSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixFQUFWO1FBQUEsQ0FETixFQURGO09BQUEsTUFBQTtlQUlFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixVQUFqQixFQUE2QixNQUE3QixDQUFSLEVBQThDO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7U0FBOUMsQ0FDQSxDQUFDLE9BQUQsQ0FEQSxDQUNPLFNBQUMsSUFBRCxHQUFBO2lCQUFVLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBQVY7UUFBQSxDQURQLEVBSkY7T0FETTtJQUFBLENBWlIsQ0FBQTs7Z0NBQUE7O0tBRGlDLGVBTnJDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/delete-branch-view.coffee
