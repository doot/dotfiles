(function() {
  var GitCommit, git, gitAddAllCommitAndPush;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllCommitAndPush = function(repo) {
    return git.add(repo, {
      file: null,
      exit: function() {
        return new GitCommit(repo, {
          andPush: true
        });
      }
    });
  };

  module.exports = gitAddAllCommitAndPush;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYWRkLWFsbC1jb21taXQtYW5kLXB1c2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxzQkFBQSxHQUF5QixTQUFDLElBQUQsR0FBQTtXQUN2QixHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLElBQU47QUFBQSxNQUNBLElBQUEsRUFBTSxTQUFBLEdBQUE7ZUFDQSxJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO0FBQUEsVUFBQSxPQUFBLEVBQVMsSUFBVDtTQUFoQixFQURBO01BQUEsQ0FETjtLQURGLEVBRHVCO0VBQUEsQ0FIekIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLHNCQVRqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-add-all-commit-and-push.coffee
