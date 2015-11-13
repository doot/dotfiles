(function() {
  var TagListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagListView = require('../../lib/views/tag-list-view');

  describe("TagListView", function() {
    describe("when there are two tags", function() {
      return it("displays a list of tags", function() {
        var view;
        view = new TagListView(repo, "tag1\ntag2");
        return expect(view.items.length).toBe(2);
      });
    });
    return describe("when there are no tags", function() {
      return it("displays a message to 'Add Tag'", function() {
        var view;
        view = new TagListView(repo);
        expect(view.items.length).toBe(1);
        return expect(view.items[0].tag).toBe('+ Add Tag');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy90YWctbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLCtCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixJQUFBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7YUFDbEMsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBVyxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLFlBQWxCLENBQVgsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0IsRUFGNEI7TUFBQSxDQUE5QixFQURrQztJQUFBLENBQXBDLENBQUEsQ0FBQTtXQUtBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7YUFDakMsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBVyxJQUFBLFdBQUEsQ0FBWSxJQUFaLENBQVgsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFyQixDQUF5QixDQUFDLElBQTFCLENBQStCLFdBQS9CLEVBSG9DO01BQUEsQ0FBdEMsRUFEaUM7SUFBQSxDQUFuQyxFQU5zQjtFQUFBLENBQXhCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/tag-list-view-spec.coffee
