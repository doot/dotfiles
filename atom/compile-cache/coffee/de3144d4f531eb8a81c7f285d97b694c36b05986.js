(function() {
  var RemoveListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RemoveListView = require('../../lib/views/remove-list-view');

  describe("RemoveListView", function() {
    return it("displays a list of files", function() {
      var view;
      view = new RemoveListView(repo, ['file1', 'file2']);
      return expect(view.items.length).toBe(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9yZW1vdmUtYnJhbmNoLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7V0FDekIsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBckIsQ0FBWCxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQixFQUY2QjtJQUFBLENBQS9CLEVBRHlCO0VBQUEsQ0FBM0IsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/remove-branch-list-view-spec.coffee
