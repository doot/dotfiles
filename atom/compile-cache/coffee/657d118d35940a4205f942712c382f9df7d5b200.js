(function() {
  var git, gitBranches, gitRemoteBranches, newBranch, pathToRepoFile, repo, _ref, _ref1;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  _ref1 = require('../../lib/models/git-branch'), gitBranches = _ref1.gitBranches, gitRemoteBranches = _ref1.gitRemoteBranches, newBranch = _ref1.newBranch;

  describe("GitBranch", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'addModalPanel').andCallThrough();
    });
    describe(".gitBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitBranches(repo);
        });
      });
      return it("displays a list of the repo's branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    describe(".gitRemoteBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitRemoteBranches(repo);
        });
      });
      return it("displays a list of the repo's remote branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch', '-r'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    return describe(".newBranch", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(function() {
          return Promise.reject('new branch created');
        });
        return newBranch(repo);
      });
      return it("displays a text input", function() {
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWJyYW5jaC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBRFAsQ0FBQTs7QUFBQSxFQUVBLFFBSUksT0FBQSxDQUFRLDZCQUFSLENBSkosRUFDRSxvQkFBQSxXQURGLEVBRUUsMEJBQUEsaUJBRkYsRUFHRSxrQkFBQSxTQUxGLENBQUE7O0FBQUEsRUFRQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1AsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLGVBQXRCLENBQXNDLENBQUMsY0FBdkMsQ0FBQSxFQURPO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUE1QixDQUFBLENBQUE7ZUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxXQUFBLENBQVksSUFBWixFQUFIO1FBQUEsQ0FBaEIsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxRQUFBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxDQUFyQyxFQUFpRDtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBakQsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBdEIsQ0FBb0MsQ0FBQyxnQkFBckMsQ0FBQSxFQUYyQztNQUFBLENBQTdDLEVBTHVCO0lBQUEsQ0FBekIsQ0FIQSxDQUFBO0FBQUEsSUFZQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQTVCLENBQUEsQ0FBQTtlQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLGlCQUFBLENBQWtCLElBQWxCLEVBQUg7UUFBQSxDQUFoQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFFBQUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUFyQyxFQUF1RDtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBdkQsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBdEIsQ0FBb0MsQ0FBQyxnQkFBckMsQ0FBQSxFQUZrRDtNQUFBLENBQXBELEVBTDZCO0lBQUEsQ0FBL0IsQ0FaQSxDQUFBO1dBcUJBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLFNBQUEsR0FBQTtpQkFBRyxPQUFPLENBQUMsTUFBUixDQUFlLG9CQUFmLEVBQUg7UUFBQSxDQUE1QixDQUFBLENBQUE7ZUFDQSxTQUFBLENBQVUsSUFBVixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO2VBQzFCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQXRCLENBQW9DLENBQUMsZ0JBQXJDLENBQUEsRUFEMEI7TUFBQSxDQUE1QixFQUxxQjtJQUFBLENBQXZCLEVBdEJvQjtFQUFBLENBQXRCLENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-branch-spec.coffee
