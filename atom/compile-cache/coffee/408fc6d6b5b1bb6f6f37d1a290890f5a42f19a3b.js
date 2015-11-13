(function() {
  var GitMerge, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitMerge = require('../../lib/models/git-merge');

  describe("GitMerge", function() {
    return it("calls git.cmd with 'branch'", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      GitMerge(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['branch'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LW1lcmdlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDRCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtXQUNuQixFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFBLENBQVMsSUFBVCxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsQ0FBckMsRUFBaUQ7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQWpELEVBSGdDO0lBQUEsQ0FBbEMsRUFEbUI7RUFBQSxDQUFyQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-merge-spec.coffee
