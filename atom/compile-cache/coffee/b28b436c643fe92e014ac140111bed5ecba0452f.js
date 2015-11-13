(function() {
  var DeleteBranchView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  DeleteBranchView = require('../../lib/views/delete-branch-view');

  describe("DeleteBranchView", function() {
    it("deletes the selected local branch", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "branch/1\nbranch2");
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['branch', '-D', 'branch/1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
    return it("deletes the selected remote branch when `isRemote: true`", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "origin/branch", {
        isRemote: true
      });
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['push', 'origin', '--delete', 'branch'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9kZWxldGUtYnJhbmNoLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxvQ0FBUixDQUZuQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixJQUFBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsVUFBQSxJQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBVyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLG1CQUF2QixDQURYLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsVUFBakIsQ0FBckMsRUFBbUU7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQW5FLEVBSnNDO0lBQUEsQ0FBeEMsQ0FBQSxDQUFBO1dBTUEsRUFBQSxDQUFHLDBEQUFILEVBQStELFNBQUEsR0FBQTtBQUM3RCxVQUFBLElBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFNBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFXLElBQUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsZUFBdkIsRUFBd0M7QUFBQSxRQUFBLFFBQUEsRUFBVSxJQUFWO09BQXhDLENBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixFQUErQixRQUEvQixDQUFyQyxFQUErRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBL0UsRUFKNkQ7SUFBQSxDQUEvRCxFQVAyQjtFQUFBLENBQTdCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/delete-branch-view-spec.coffee
