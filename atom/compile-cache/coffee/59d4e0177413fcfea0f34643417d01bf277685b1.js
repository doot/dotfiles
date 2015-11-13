(function() {
  var GitCherryPick, repo;

  repo = require('../fixtures').repo;

  GitCherryPick = require('../../lib/models/git-cherry-pick');

  describe("GitCherryPick", function() {
    it("gets heads from the repo's references", function() {
      spyOn(repo, 'getReferences').andCallThrough();
      GitCherryPick(repo);
      return expect(repo.getReferences).toHaveBeenCalled();
    });
    return it("calls replace on each head with to remove 'refs/heads/'", function() {
      var head;
      head = repo.getReferences().heads[0];
      GitCherryPick(repo);
      return expect(head.replace).toHaveBeenCalledWith('refs/heads/', '');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtDQUFSLENBRGhCLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsSUFBQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLE1BQUEsS0FBQSxDQUFNLElBQU4sRUFBWSxlQUFaLENBQTRCLENBQUMsY0FBN0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGFBQUEsQ0FBYyxJQUFkLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBWixDQUEwQixDQUFDLGdCQUEzQixDQUFBLEVBSDBDO0lBQUEsQ0FBNUMsQ0FBQSxDQUFBO1dBS0EsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQW9CLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBbEMsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxDQUFjLElBQWQsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsb0JBQXJCLENBQTBDLGFBQTFDLEVBQXlELEVBQXpELEVBSDREO0lBQUEsQ0FBOUQsRUFOd0I7RUFBQSxDQUExQixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-cherry-pick-spec.coffee
