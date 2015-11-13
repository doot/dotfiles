(function() {
  var GitCommit, git, gitCommitAmend;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitCommitAmend = function(repo) {
    return git.cmd({
      args: ['log', '-1', '--format=%B'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(amend) {
        return git.cmd({
          args: ['reset', '--soft', 'HEAD^'],
          cwd: repo.getWorkingDirectory(),
          exit: function() {
            return new GitCommit(repo, {
              amend: "" + (amend != null ? amend.trim() : void 0) + "\n"
            });
          }
        });
      }
    });
  };

  module.exports = gitCommitAmend;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LWFtZW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FEWixDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsYUFBZCxDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsS0FBRCxHQUFBO2VBQ04sR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsT0FBcEIsQ0FBTjtBQUFBLFVBQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxVQUVBLElBQUEsRUFBTSxTQUFBLEdBQUE7bUJBQU8sSUFBQSxTQUFBLENBQVUsSUFBVixFQUFnQjtBQUFBLGNBQUEsS0FBQSxFQUFPLEVBQUEsR0FBRSxpQkFBQyxLQUFLLENBQUUsSUFBUCxDQUFBLFVBQUQsQ0FBRixHQUFpQixJQUF4QjthQUFoQixFQUFQO1VBQUEsQ0FGTjtTQURGLEVBRE07TUFBQSxDQUZSO0tBREYsRUFEZTtFQUFBLENBSGpCLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQWJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
