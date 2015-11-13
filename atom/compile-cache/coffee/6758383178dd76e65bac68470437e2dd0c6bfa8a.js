(function() {
  var RemoteListView, git, gitPull;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  gitPull = function(repo, _arg) {
    var extraArgs, rebase;
    rebase = (_arg != null ? _arg : {}).rebase;
    if (rebase) {
      extraArgs = ['--rebase'];
    }
    return git.cmd({
      args: ['remote'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new RemoteListView(repo, data, {
          mode: 'pull',
          extraArgs: extraArgs
        });
      }
    });
  };

  module.exports = gitPull;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcHVsbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDUixRQUFBLGlCQUFBO0FBQUEsSUFEZ0IseUJBQUQsT0FBUyxJQUFSLE1BQ2hCLENBQUE7QUFBQSxJQUFBLElBQTRCLE1BQTVCO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBQyxVQUFELENBQVosQ0FBQTtLQUFBO1dBRUEsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsUUFBRCxDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQWMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtBQUFBLFVBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxVQUFjLFNBQUEsRUFBVyxTQUF6QjtTQUEzQixFQUFkO01BQUEsQ0FGUjtLQURGLEVBSFE7RUFBQSxDQUhWLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQVhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-pull.coffee
