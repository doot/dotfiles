(function() {
  var GitRemove, currentPane, git, pathToRepoFile, repo, textEditor, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, currentPane = _ref.currentPane;

  GitRemove = require('../../lib/models/git-remove');

  describe("GitRemove", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'getActivePaneItem').andReturn(currentPane);
      spyOn(window, 'confirm').andReturn(true);
      return spyOn(git, 'cmd').andReturn(Promise.resolve(repo.relativize(pathToRepoFile)));
    });
    describe("when there is a current file open", function() {
      return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
        var args, _ref1;
        GitRemove(repo);
        args = git.cmd.mostRecentCall.args[0];
        expect(__indexOf.call(args, 'rm') >= 0).toBe(true);
        return expect((_ref1 = repo.relativize(pathToRepoFile), __indexOf.call(args, _ref1) >= 0)).toBe(true);
      });
    });
    return describe("when 'showSelector' is set to true", function() {
      return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
        var args;
        GitRemove(repo, {
          showSelector: true
        });
        args = git.cmd.mostRecentCall.args[0];
        return expect(__indexOf.call(args, '*') >= 0).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LXJlbW92ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtRUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQWtELE9BQUEsQ0FBUSxhQUFSLENBQWxELEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FBUCxFQUF1QixrQkFBQSxVQUF2QixFQUFtQyxtQkFBQSxXQURuQyxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSw2QkFBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1AsTUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IscUJBQXRCLENBQTRDLENBQUMsU0FBN0MsQ0FBdUQsVUFBdkQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsbUJBQXRCLENBQTBDLENBQUMsU0FBM0MsQ0FBcUQsV0FBckQsQ0FEQSxDQUFBO0FBQUEsTUFFQSxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxTQUF6QixDQUFtQyxJQUFuQyxDQUZBLENBQUE7YUFHQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixJQUFJLENBQUMsVUFBTCxDQUFnQixjQUFoQixDQUFoQixDQUE1QixFQUpPO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQU1BLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBLEdBQUE7YUFDNUMsRUFBQSxDQUFJLDhCQUFBLEdBQThCLGNBQWxDLEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxZQUFBLFdBQUE7QUFBQSxRQUFBLFNBQUEsQ0FBVSxJQUFWLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBRG5DLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxlQUFRLElBQVIsRUFBQSxJQUFBLE1BQVAsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixJQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sU0FBQSxJQUFJLENBQUMsVUFBTCxDQUFnQixjQUFoQixDQUFBLEVBQUEsZUFBbUMsSUFBbkMsRUFBQSxLQUFBLE1BQUEsQ0FBUCxDQUErQyxDQUFDLElBQWhELENBQXFELElBQXJELEVBSmtEO01BQUEsQ0FBcEQsRUFENEM7SUFBQSxDQUE5QyxDQU5BLENBQUE7V0FhQSxRQUFBLENBQVMsb0NBQVQsRUFBK0MsU0FBQSxHQUFBO2FBQzdDLEVBQUEsQ0FBSSxvQ0FBQSxHQUFvQyxjQUF4QyxFQUEwRCxTQUFBLEdBQUE7QUFDeEQsWUFBQSxJQUFBO0FBQUEsUUFBQSxTQUFBLENBQVUsSUFBVixFQUFnQjtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FBaEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FEbkMsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxlQUFPLElBQVAsRUFBQSxHQUFBLE1BQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixFQUh3RDtNQUFBLENBQTFELEVBRDZDO0lBQUEsQ0FBL0MsRUFkb0I7RUFBQSxDQUF0QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-remove-spec.coffee
