(function() {
  var git, gitStashDrop, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashDrop = function(repo) {
    return git.cmd({
      args: ['stash', 'drop'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        if (data.toString().length > 0) {
          return notifier.addSuccess(data);
        }
      },
      stderr: function(data) {
        return notifier.addError(data);
      }
    });
  };

  module.exports = gitStashDrop;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtZHJvcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtXQUNiLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxPQUFBLEVBQVM7QUFBQSxRQUNQLEdBQUEsRUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBRFY7T0FGVDtBQUFBLE1BS0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sUUFBQSxJQUE2QixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUFoQixHQUF5QixDQUF0RDtpQkFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixFQUFBO1NBRE07TUFBQSxDQUxSO0FBQUEsTUFPQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7ZUFDTixRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFsQixFQURNO01BQUEsQ0FQUjtLQURGLEVBRGE7RUFBQSxDQUhmLENBQUE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQWZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stash-drop.coffee
