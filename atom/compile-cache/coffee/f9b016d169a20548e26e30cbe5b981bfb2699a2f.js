(function() {
  var git, gitCheckoutAllFiles, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitCheckoutAllFiles = function(repo) {
    return git.cmd({
      args: ['checkout', '-f'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        notifier.addSuccess("File changes checked out successfully!");
        return git.refresh();
      }
    });
  };

  module.exports = gitCheckoutAllFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY2hlY2tvdXQtYWxsLWZpbGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsU0FBQyxJQUFELEdBQUE7V0FDcEIsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLElBQWIsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0Isd0NBQXBCLENBQUEsQ0FBQTtlQUNBLEdBQUcsQ0FBQyxPQUFKLENBQUEsRUFGTTtNQUFBLENBRlI7S0FERixFQURvQjtFQUFBLENBSHRCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixtQkFYakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-checkout-all-files.coffee
