(function() {
  var ListView, git, gitDeleteLocalBranch;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  gitDeleteLocalBranch = function(repo) {
    return git.cmd({
      args: ['branch'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString());
      }
    });
  };

  module.exports = gitDeleteLocalBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGVsZXRlLWxvY2FsLWJyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxvQkFBQSxHQUF1QixTQUFDLElBQUQsR0FBQTtXQUNyQixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxRQUFELENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7ZUFBYyxJQUFBLFFBQUEsQ0FBUyxJQUFULEVBQWUsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFmLEVBQWQ7TUFBQSxDQUZSO0tBREYsRUFEcUI7RUFBQSxDQUh2QixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsb0JBVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-delete-local-branch.coffee
