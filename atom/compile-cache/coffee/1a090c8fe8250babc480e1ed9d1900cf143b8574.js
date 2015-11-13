(function() {
  var CherryPickSelectCommits, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectCommits = require('../../lib/views/cherry-pick-select-commits-view');

  describe("CherryPickSelectCommits view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectCommits(repo, ['commit1', 'commit2']);
    });
    it("displays a list of commits", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd with 'cherry-pick' and the selected commits", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      this.view.confirmSelection();
      this.view.find('.btn-pick-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['cherry-pick', 'commit1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9jaGVycnktcGljay1zZWxlY3QtY29tbWl0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLHVCQUFBLEdBQTBCLE9BQUEsQ0FBUSxpREFBUixDQUYxQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsdUJBQUEsQ0FBd0IsSUFBeEIsRUFBOEIsQ0FBQyxTQUFELEVBQVksU0FBWixDQUE5QixFQURIO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7YUFDL0IsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEK0I7SUFBQSxDQUFqQyxDQUhBLENBQUE7V0FNQSxFQUFBLENBQUcsMkRBQUgsRUFBZ0UsU0FBQSxHQUFBO0FBQzlELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxrQkFBWCxDQUE4QixDQUFDLEtBQS9CLENBQUEsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxhQUFELEVBQWdCLFNBQWhCLENBQXJDLEVBQWlFO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFqRSxFQUo4RDtJQUFBLENBQWhFLEVBUHVDO0VBQUEsQ0FBekMsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/cherry-pick-select-commit-view-spec.coffee
