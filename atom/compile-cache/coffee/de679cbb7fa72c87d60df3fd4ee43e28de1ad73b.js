(function() {
  var RemoteListView, git, gitPush;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  gitPush = function(repo) {
    return git.cmd({
      args: ['remote'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new RemoteListView(repo, data, {
          mode: 'push'
        });
      }
    });
  };

  module.exports = gitPush;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcHVzaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtXQUNSLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLFFBQUQsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkI7QUFBQSxVQUFBLElBQUEsRUFBTSxNQUFOO1NBQTNCLEVBQWQ7TUFBQSxDQUZSO0tBREYsRUFEUTtFQUFBLENBSFYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-push.coffee
