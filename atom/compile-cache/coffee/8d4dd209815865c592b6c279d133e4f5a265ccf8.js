(function() {
  var TagListView, git;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  module.exports = function(repo) {
    return git.cmd(['tag', '-ln'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new TagListView(repo, data);
    })["catch"](function() {
      return new TagListView(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtdGFncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFSLEVBQXdCO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUF4QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixJQUFsQixFQUFkO0lBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQSxHQUFBO2FBQU8sSUFBQSxXQUFBLENBQVksSUFBWixFQUFQO0lBQUEsQ0FGUCxFQURlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-tags.coffee
