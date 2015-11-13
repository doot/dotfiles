(function() {
  var GitCommit, git, gitAddAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAndCommit = function(repo) {
    var _ref;
    return git.add(repo, {
      file: repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0),
      exit: function() {
        return new GitCommit(repo);
      }
    });
  };

  module.exports = gitAddAndCommit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYWRkLWFuZC1jb21taXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFFBQUEsSUFBQTtXQUFBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUFOO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FBQSxHQUFBO2VBQU8sSUFBQSxTQUFBLENBQVUsSUFBVixFQUFQO01BQUEsQ0FETjtLQURGLEVBRGdCO0VBQUEsQ0FIbEIsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBUmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-add-and-commit.coffee
