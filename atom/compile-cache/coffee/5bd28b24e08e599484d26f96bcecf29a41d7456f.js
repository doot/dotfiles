(function() {
  var CherryPickSelectBranch, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectBranch = require('../../lib/views/cherry-pick-select-branch-view');

  describe("CherryPickSelectBranch view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectBranch(repo, ['head1', 'head2'], 'currentHead');
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd to get commits between currentHead and selected head", function() {
      var expectedArgs;
      spyOn(git, 'cmd').andReturn(Promise.resolve('heads'));
      this.view.confirmSelection();
      expectedArgs = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', "currentHead...head1"];
      return expect(git.cmd).toHaveBeenCalledWith(expectedArgs, {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9jaGVycnktcGljay1zZWxlY3QtYnJhbmNoLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxnREFBUixDQUZ6QixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsc0JBQUEsQ0FBdUIsSUFBdkIsRUFBNkIsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUE3QixFQUFpRCxhQUFqRCxFQURIO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEZ0M7SUFBQSxDQUFsQyxDQUhBLENBQUE7V0FNQSxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQSxHQUFBO0FBQ3ZFLFVBQUEsWUFBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsQ0FDYixLQURhLEVBRWIsZUFGYSxFQUdiLElBSGEsRUFJYiwyQkFKYSxFQUtiLHFCQUxhLENBRmYsQ0FBQTthQVNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLFlBQXJDLEVBQW1EO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFuRCxFQVZ1RTtJQUFBLENBQXpFLEVBUHNDO0VBQUEsQ0FBeEMsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/cherry-pick-select-branch-view-spec.coffee
