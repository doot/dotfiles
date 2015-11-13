(function() {
  var SelectUnstageFiles, git, gitUnstageFiles;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  gitUnstageFiles = function(repo) {
    return git.stagedFiles(repo, function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

  module.exports = gitUnstageFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtdW5zdGFnZS1maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLG9DQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO1dBQ2hCLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLEVBQXNCLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxrQkFBQSxDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUFkO0lBQUEsQ0FBdEIsRUFEZ0I7RUFBQSxDQUhsQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsZUFOakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-unstage-files.coffee
