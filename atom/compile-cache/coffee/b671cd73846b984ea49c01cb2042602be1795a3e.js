(function() {
  var StatusListView, git, gitStatus;

  git = require('../git');

  StatusListView = require('../views/status-list-view');

  gitStatus = function(repo) {
    return git.status(repo, function(data) {
      return new StatusListView(repo, data);
    });
  };

  module.exports = gitStatus;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3RhdHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO1dBQ1YsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFYLEVBQWlCLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUFkO0lBQUEsQ0FBakIsRUFEVTtFQUFBLENBSFosQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBTmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-status.coffee
