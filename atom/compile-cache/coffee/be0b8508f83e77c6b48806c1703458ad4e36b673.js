(function() {
  var SelectStageFiles, git, gitStageFiles;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  gitStageFiles = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }, function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

  module.exports = gitStageFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3RhZ2UtZmlsZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQ0FBUixDQURuQixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtXQUNkLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSxJQUFmO0tBREYsRUFFRSxTQUFDLElBQUQsR0FBQTthQUFjLElBQUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBZDtJQUFBLENBRkYsRUFEYztFQUFBLENBSGhCLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQVRqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stage-files.coffee
