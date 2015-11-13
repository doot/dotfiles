(function() {
  var Path, git, pathToRepoFile, pathToSubmoduleFile;

  git = require('../lib/git');

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/.atom/packages/git-plus/lib/git.coffee");

  pathToSubmoduleFile = Path.get("~/.atom/packages/git-plus/spec/foo/foo.txt");

  describe("Git-Plus git module", function() {
    describe("git.getRepo", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.getRepo().then(function(repo) {
            return expect(repo.getWorkingDirectory()).toContain('git-plus');
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.dir().then(function(dir) {
            return expect(dir).toContain('git-plus');
          });
        });
      });
    });
    return describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        return expect(git.getSubmodule(pathToSubmoduleFile)).toBeTruthy();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9naXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEdBQUwsQ0FBUywwQ0FBVCxDQUhqQixDQUFBOztBQUFBLEVBSUEsbUJBQUEsR0FBc0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyw0Q0FBVCxDQUp0QixDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixJQUFBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTthQUN0QixFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO2VBQ3RCLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFELEdBQUE7bUJBQ2pCLE1BQUEsQ0FBTyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQLENBQWtDLENBQUMsU0FBbkMsQ0FBNkMsVUFBN0MsRUFEaUI7VUFBQSxDQUFuQixFQURjO1FBQUEsQ0FBaEIsRUFEc0I7TUFBQSxDQUF4QixFQURzQjtJQUFBLENBQXhCLENBQUEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO2FBQ2xCLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7ZUFDdEIsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsR0FBRyxDQUFDLEdBQUosQ0FBQSxDQUFTLENBQUMsSUFBVixDQUFlLFNBQUMsR0FBRCxHQUFBO21CQUNiLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxTQUFaLENBQXNCLFVBQXRCLEVBRGE7VUFBQSxDQUFmLEVBRGM7UUFBQSxDQUFoQixFQURzQjtNQUFBLENBQXhCLEVBRGtCO0lBQUEsQ0FBcEIsQ0FOQSxDQUFBO1dBWUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7ZUFDakQsTUFBQSxDQUFPLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGNBQWpCLENBQVAsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxNQUE5QyxFQURpRDtNQUFBLENBQW5ELENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyx5RUFBSCxFQUE4RSxTQUFBLEdBQUE7ZUFDNUUsTUFBQSxDQUFPLEdBQUcsQ0FBQyxZQUFKLENBQWlCLG1CQUFqQixDQUFQLENBQTZDLENBQUMsVUFBOUMsQ0FBQSxFQUQ0RTtNQUFBLENBQTlFLEVBSjJCO0lBQUEsQ0FBN0IsRUFiOEI7RUFBQSxDQUFoQyxDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/git-spec.coffee
