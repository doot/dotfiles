(function() {
  var GitTags, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitTags = require('../../lib/models/git-tags');

  describe("GitTags", function() {
    return it("calls git.cmd with 'tag' as an arg", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('data'));
      GitTags(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '-ln'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LXRhZ3Mtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO1dBQ2xCLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixNQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLE9BQUEsQ0FBUSxJQUFSLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBckMsRUFBcUQ7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQXJELEVBSHVDO0lBQUEsQ0FBekMsRUFEa0I7RUFBQSxDQUFwQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-tags-spec.coffee
