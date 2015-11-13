(function() {
  var RebaseListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RebaseListView = require('../../lib/views/rebase-list-view');

  describe("RebaseListView", function() {
    beforeEach(function() {
      this.view = new RebaseListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("rebases onto the selected branch", function() {
      this.view.confirmSelection();
      this.view.rebase('branch1');
      return expect(git.cmd).toHaveBeenCalledWith(['rebase', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9yZWJhc2UtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixrQkFBckIsQ0FBWixDQUFBO2FBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO2VBQzVCLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUQ0QjtNQUFBLENBQTlCLEVBRlM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBS0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTthQUNoQyxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxDQUFoQyxFQURnQztJQUFBLENBQWxDLENBTEEsQ0FBQTtXQVFBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsTUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxTQUFiLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxFQUFXLFNBQVgsQ0FBckMsRUFBNEQ7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQTVELEVBSHFDO0lBQUEsQ0FBdkMsRUFUeUI7RUFBQSxDQUEzQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/rebase-list-view-spec.coffee
