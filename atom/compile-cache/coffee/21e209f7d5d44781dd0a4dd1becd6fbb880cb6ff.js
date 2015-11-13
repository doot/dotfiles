(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function(repo) {
    return git.unstagedFiles(repo, null, function(data) {
      return new SelectStageHunkFile(repo, data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3RhZ2UtaHVuay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHNDQUFSLENBRHRCLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7V0FDYixHQUFHLENBQUMsYUFBSixDQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUNFLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxtQkFBQSxDQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFkO0lBQUEsQ0FERixFQURhO0VBQUEsQ0FIZixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFSakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-stage-hunk.coffee
