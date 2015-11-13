(function() {
  var GitCommit, git, gitAddAllAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllAndCommit = function(repo) {
    return git.add(repo, {
      exit: function() {
        return new GitCommit(repo);
      }
    });
  };

  module.exports = gitAddAllAndCommit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYWRkLWFsbC1hbmQtY29tbWl0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FEWixDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7V0FDbkIsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFBLEdBQUE7ZUFBTyxJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQVA7TUFBQSxDQUFOO0tBREYsRUFEbUI7RUFBQSxDQUhyQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsa0JBUGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-add-all-and-commit.coffee
