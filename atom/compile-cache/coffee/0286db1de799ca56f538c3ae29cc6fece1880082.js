(function() {
  var MergeListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  MergeListView = require('../../lib/views/merge-list-view');

  describe("MergeListView", function() {
    beforeEach(function() {
      this.view = new MergeListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd with 'merge branch1' when branch1 is selected", function() {
      this.view.confirmSelection();
      waitsFor(function() {
        return git.cmd.callCount > 0;
      });
      return expect(git.cmd).toHaveBeenCalledWith(['merge', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9tZXJnZS1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlDQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsYUFBQSxDQUFjLElBQWQsRUFBb0Isa0JBQXBCLENBQVosQ0FBQTthQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtlQUFHLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLEVBQUg7TUFBQSxDQUE5QixFQUZTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUlBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEZ0M7SUFBQSxDQUFsQyxDQUpBLENBQUE7V0FPQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtlQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUixHQUFvQixFQUF2QjtNQUFBLENBQVQsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxPQUFELEVBQVUsU0FBVixDQUFyQyxFQUEyRDtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBM0QsRUFIZ0U7SUFBQSxDQUFsRSxFQVJ3QjtFQUFBLENBQTFCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/merge-list-view-spec.coffee
