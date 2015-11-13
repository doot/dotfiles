(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, _arg) {
    var extraArgs, rebase;
    rebase = (_arg != null ? _arg : {}).rebase;
    if (rebase) {
      extraArgs = ['--rebase'];
    }
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteListView(repo, data, {
        mode: 'pull',
        extraArgs: extraArgs
      }).result;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcHVsbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsaUJBQUE7QUFBQSxJQUR1Qix5QkFBRCxPQUFTLElBQVIsTUFDdkIsQ0FBQTtBQUFBLElBQUEsSUFBNEIsTUFBNUI7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFDLFVBQUQsQ0FBWixDQUFBO0tBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFwQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQVUsR0FBQSxDQUFBLGNBQUksQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCO0FBQUEsUUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLFFBQWMsU0FBQSxFQUFXLFNBQXpCO09BQTNCLENBQThELENBQUMsT0FBN0U7SUFBQSxDQUROLEVBRmU7RUFBQSxDQUhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-pull.coffee
