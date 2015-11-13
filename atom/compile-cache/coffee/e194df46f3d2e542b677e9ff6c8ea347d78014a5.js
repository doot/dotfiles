(function() {
  var git, gitStashSave, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashSave = function(repo) {
    var notification;
    notification = notifier.addInfo('Saving...', {
      dismissable: true
    });
    return git.cmd({
      args: ['stash', 'save'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        notification.dismiss();
        return notifier.addSuccess(data);
      }
    });
  };

  module.exports = gitStashSave;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtc2F2ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFFBQUEsWUFBQTtBQUFBLElBQUEsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLFdBQWpCLEVBQThCO0FBQUEsTUFBQSxXQUFBLEVBQWEsSUFBYjtLQUE5QixDQUFmLENBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsT0FBQSxFQUFTO0FBQUEsUUFDUCxHQUFBLEVBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQURWO09BRlQ7QUFBQSxNQUtBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7ZUFDQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixFQUZNO01BQUEsQ0FMUjtLQURGLEVBRmE7RUFBQSxDQUhmLENBQUE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQWZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stash-save.coffee
