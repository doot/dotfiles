(function() {
  var git, gitCheckoutCurrentFile, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitCheckoutCurrentFile = function(repo) {
    var currentFile, _ref;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return git.cmd({
      args: ['checkout', '--', currentFile],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        notifier.addSuccess('File changes checked out successfully');
        return git.refresh();
      }
    });
  };

  module.exports = gitCheckoutCurrentFile;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY2hlY2tvdXQtY3VycmVudC1maWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0Esc0JBQUEsR0FBeUIsU0FBQyxJQUFELEdBQUE7QUFDdkIsUUFBQSxpQkFBQTtBQUFBLElBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FBZCxDQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsV0FBbkIsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsdUNBQXBCLENBQUEsQ0FBQTtlQUNBLEdBQUcsQ0FBQyxPQUFKLENBQUEsRUFGTTtNQUFBLENBRlI7S0FERixFQUZ1QjtFQUFBLENBSHpCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUFpQixzQkFaakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-checkout-current-file.coffee
