(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git.cmd(['stash', 'apply'], {
      cwd: cwd
    }).then(function(msg) {
      if (msg !== '') {
        return OutputViewManager["new"]().addLine(msg).finish();
      }
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtYXBwbHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTixDQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxPQUFWLENBQVIsRUFBNEI7QUFBQSxNQUFDLEtBQUEsR0FBRDtLQUE1QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRCxHQUFBO0FBQ0osTUFBQSxJQUFpRCxHQUFBLEtBQVMsRUFBMUQ7ZUFBQSxpQkFBaUIsQ0FBQyxLQUFELENBQWpCLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxHQUFoQyxDQUFvQyxDQUFDLE1BQXJDLENBQUEsRUFBQTtPQURJO0lBQUEsQ0FETixDQUdBLENBQUMsT0FBRCxDQUhBLENBR08sU0FBQyxHQUFELEdBQUE7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURLO0lBQUEsQ0FIUCxFQUZlO0VBQUEsQ0FKakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stash-apply.coffee
