(function() {
  var GitStageHunk, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageHunk = require('../../lib/models/git-stage-hunk');

  describe("GitStageHunk", function() {
    it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageHunk(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
    return it("opens the view for selecting files to choose from", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      return GitStageHunk(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LXN0YWdlLWh1bmstc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUNBQVIsQ0FGZixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLElBQUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsZUFBWCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUF0QyxDQUFBLENBQUE7QUFBQSxNQUNBLFlBQUEsQ0FBYSxJQUFiLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBWCxDQUF5QixDQUFDLGdCQUExQixDQUFBLEVBSGtEO0lBQUEsQ0FBcEQsQ0FBQSxDQUFBO1dBS0EsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsZUFBWCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUF0QyxDQUFBLENBQUE7YUFDQSxZQUFBLENBQWEsSUFBYixDQUFrQixDQUFDLElBQW5CLENBQXdCLFNBQUMsSUFBRCxHQUFBO2VBQ3RCLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxXQUFiLENBQUEsRUFEc0I7TUFBQSxDQUF4QixFQUZzRDtJQUFBLENBQXhELEVBTnVCO0VBQUEsQ0FBekIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-stage-hunk-spec.coffee
