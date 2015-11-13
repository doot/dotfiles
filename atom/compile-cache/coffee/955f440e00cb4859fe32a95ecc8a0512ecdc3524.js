(function() {
  var GitAdd, git, pathToRepoFile, repo, _ref;

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitAdd = require('../../lib/models/git-add');

  describe("GitAdd", function() {
    it("calls git.add with the current file if `addAll` is false", function() {
      spyOn(git, 'add');
      spyOn(atom.workspace, 'getActiveTextEditor').andCallFake(function() {
        return {
          getPath: function() {
            return pathToRepoFile;
          }
        };
      });
      GitAdd(repo);
      return expect(git.add).toHaveBeenCalledWith(repo, {
        file: repo.relativize(pathToRepoFile)
      });
    });
    return it("calls git.add without a file option if `addAll` is true", function() {
      spyOn(git, 'add');
      GitAdd(repo, {
        addAll: true
      });
      return expect(git.add).toHaveBeenCalledWith(repo);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWFkZC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FBUCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsMEJBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLElBQUEsRUFBQSxDQUFHLDBEQUFILEVBQStELFNBQUEsR0FBQTtBQUM3RCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixxQkFBdEIsQ0FBNEMsQ0FBQyxXQUE3QyxDQUF5RCxTQUFBLEdBQUE7ZUFDdkQ7QUFBQSxVQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7bUJBQUcsZUFBSDtVQUFBLENBQVQ7VUFEdUQ7TUFBQSxDQUF6RCxDQURBLENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxJQUFQLENBSEEsQ0FBQTthQUlBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLElBQXJDLEVBQTJDO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBTjtPQUEzQyxFQUw2RDtJQUFBLENBQS9ELENBQUEsQ0FBQTtXQU9BLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sSUFBUCxFQUFhO0FBQUEsUUFBQSxNQUFBLEVBQVEsSUFBUjtPQUFiLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLElBQXJDLEVBSDREO0lBQUEsQ0FBOUQsRUFSaUI7RUFBQSxDQUFuQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-add-spec.coffee
