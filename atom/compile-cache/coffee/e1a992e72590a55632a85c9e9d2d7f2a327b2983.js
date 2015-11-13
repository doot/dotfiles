(function() {
  var GitStageFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageFiles = require('../../lib/models/git-stage-files');

  describe("GitStageFiles", function() {
    return it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageFiles(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQ0FBUixDQUZoQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO1dBQ3hCLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLGVBQVgsQ0FBMkIsQ0FBQyxTQUE1QixDQUFzQyxPQUFPLENBQUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxhQUFBLENBQWMsSUFBZCxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQVgsQ0FBeUIsQ0FBQyxnQkFBMUIsQ0FBQSxFQUhrRDtJQUFBLENBQXBELEVBRHdCO0VBQUEsQ0FBMUIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-stage-files-spec.coffee
