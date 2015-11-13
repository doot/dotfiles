(function() {
  var GitDiffTool, Path, fs, git, pathToRepoFile, repo, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitDiffTool = require('../../lib/models/git-difftool');

  describe("GitDiffTool", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      spyOn(git, 'getConfig').andReturn(Promise.resolve('some-tool'));
      return waitsForPromise(function() {
        return GitDiffTool(repo, {
          file: pathToRepoFile
        });
      });
    });
    return describe("when git-plus.includeStagedDiff config is true", function() {
      it("calls git.cmd with 'diff-index HEAD -z'", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      return it("calls `git.getConfig` to check if a a difftool is set", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('diff.tool', Path.dirname(pathToRepoFile));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWRpZmZ0b29sLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsT0FBQSxDQUFRLCtCQUFSLENBSmQsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEMsSUFBOUMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixPQUFoQixDQUE1QixDQURBLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsV0FBWCxDQUF1QixDQUFDLFNBQXhCLENBQWtDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQWhCLENBQWxDLENBRkEsQ0FBQTthQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsV0FBQSxDQUFZLElBQVosRUFBa0I7QUFBQSxVQUFBLElBQUEsRUFBTSxjQUFOO1NBQWxCLEVBRGM7TUFBQSxDQUFoQixFQUpTO0lBQUEsQ0FBWCxDQUFBLENBQUE7V0FPQSxRQUFBLENBQVMsZ0RBQVQsRUFBMkQsU0FBQSxHQUFBO0FBQ3pELE1BQUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtlQUM1QyxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFlBQUQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLENBQXJDLEVBQW1FO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFuRSxFQUQ0QztNQUFBLENBQTlDLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7ZUFDMUQsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQUMsb0JBQXRCLENBQTJDLFdBQTNDLEVBQXdELElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixDQUF4RCxFQUQwRDtNQUFBLENBQTVELEVBSnlEO0lBQUEsQ0FBM0QsRUFSc0I7RUFBQSxDQUF4QixDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-difftool-spec.coffee
