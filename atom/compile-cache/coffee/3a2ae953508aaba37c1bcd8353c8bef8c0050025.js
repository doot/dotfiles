(function() {
  var GitStatus, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitStatus = require('../../lib/models/git-status');

  describe("GitStatus", function() {
    beforeEach(function() {
      return spyOn(git, 'status').andReturn(Promise.resolve('foobar'));
    });
    it("calls git.status", function() {
      GitStatus(repo);
      return expect(git.status).toHaveBeenCalledWith(repo);
    });
    return it("creates a new StatusListView", function() {
      return GitStatus(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LXN0YXR1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSw2QkFBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsS0FBQSxDQUFNLEdBQU4sRUFBVyxRQUFYLENBQW9CLENBQUMsU0FBckIsQ0FBK0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBaEIsQ0FBL0IsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsU0FBQSxDQUFVLElBQVYsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxNQUFYLENBQWtCLENBQUMsb0JBQW5CLENBQXdDLElBQXhDLEVBRnFCO0lBQUEsQ0FBdkIsQ0FIQSxDQUFBO1dBT0EsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTthQUNqQyxTQUFBLENBQVUsSUFBVixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBQyxJQUFELEdBQUE7ZUFDbkIsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLFdBQWIsQ0FBQSxFQURtQjtNQUFBLENBQXJCLEVBRGlDO0lBQUEsQ0FBbkMsRUFSb0I7RUFBQSxDQUF0QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-status-spec.coffee
