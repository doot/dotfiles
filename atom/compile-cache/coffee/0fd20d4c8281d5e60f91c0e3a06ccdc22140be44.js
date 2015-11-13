(function() {
  var GitInit, git;

  git = require('../../lib/git');

  GitInit = require('../../lib/models/git-init');

  describe("GitInit", function() {
    return it("sets the project path to the new repo path", function() {
      spyOn(atom.project, 'setPaths');
      spyOn(atom.project, 'getPaths').andCallFake(function() {
        return ['some/path'];
      });
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve(true);
      });
      return waitsForPromise(function() {
        return GitInit().then(function() {
          return expect(atom.project.setPaths).toHaveBeenCalledWith(['some/path']);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWluaXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLDJCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtXQUNsQixFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLE1BQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxPQUFYLEVBQW9CLFVBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxPQUFYLEVBQW9CLFVBQXBCLENBQStCLENBQUMsV0FBaEMsQ0FBNEMsU0FBQSxHQUFBO2VBQUcsQ0FBQyxXQUFELEVBQUg7TUFBQSxDQUE1QyxDQURBLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtlQUM1QixPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixFQUQ0QjtNQUFBLENBQTlCLENBRkEsQ0FBQTthQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsT0FBQSxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQSxHQUFBO2lCQUNiLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQXBCLENBQTZCLENBQUMsb0JBQTlCLENBQW1ELENBQUMsV0FBRCxDQUFuRCxFQURhO1FBQUEsQ0FBZixFQURjO01BQUEsQ0FBaEIsRUFMK0M7SUFBQSxDQUFqRCxFQURrQjtFQUFBLENBQXBCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-init-spec.coffee
