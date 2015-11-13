(function() {
  var BranchListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  BranchListView = require('../../lib/views/branch-list-view');

  describe("BranchListView", function() {
    beforeEach(function() {
      this.view = new BranchListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    return it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9icmFuY2gtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixrQkFBckIsQ0FBWixDQUFBO2FBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO2VBQzVCLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUQ0QjtNQUFBLENBQTlCLEVBRlM7SUFBQSxDQUFYLENBQUEsQ0FBQTtXQUtBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEZ0M7SUFBQSxDQUFsQyxFQU55QjtFQUFBLENBQTNCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/branch-list-view-spec.coffee
