(function() {
  var ListView, git, gitDeleteRemoteBranch;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  gitDeleteRemoteBranch = function(repo) {
    return git.cmd({
      args: ['branch', '-r'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString(), {
          isRemote: true
        });
      }
    });
  };

  module.exports = gitDeleteRemoteBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGVsZXRlLXJlbW90ZS1icmFuY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsU0FBQyxJQUFELEdBQUE7V0FDdEIsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsUUFBRCxFQUFXLElBQVgsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNGLElBQUEsUUFBQSxDQUFTLElBQVQsRUFBZSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWYsRUFBZ0M7QUFBQSxVQUFBLFFBQUEsRUFBVSxJQUFWO1NBQWhDLEVBREU7TUFBQSxDQUZSO0tBREYsRUFEc0I7RUFBQSxDQUh4QixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIscUJBVmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-delete-remote-branch.coffee
