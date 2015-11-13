(function() {
  var git, gitStashApply, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashApply = function(repo) {
    return git.cmd({
      args: ['stash', 'apply'],
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
        return notifier.addError(data.toString());
      }
    });
  };

  module.exports = gitStashApply;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtYXBwbHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO1dBQ2QsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE9BQUEsRUFBUztBQUFBLFFBQ1AsR0FBQSxFQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFEVjtPQUZUO0FBQUEsTUFLQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLElBQTZCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEdBQXlCLENBQXREO2lCQUFBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBQUE7U0FETTtNQUFBLENBTFI7QUFBQSxNQU9BLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNOLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBbEIsRUFETTtNQUFBLENBUFI7S0FERixFQURjO0VBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBZmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stash-apply.coffee
