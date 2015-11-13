(function() {
  var LogListView, ViewUriLog, amountOfCommitsToShow, git, gitLog;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  ViewUriLog = 'atom://git-plus:log';

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  gitLog = function(repo, _arg) {
    var currentFile, onlyCurrentFile, _ref;
    onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    atom.workspace.addOpener(function(filePath) {
      if (filePath === ViewUriLog) {
        return new LogListView;
      }
    });
    return atom.workspace.open(ViewUriLog).done(function(view) {
      if (view instanceof LogListView) {
        view.setRepo(repo);
        if (onlyCurrentFile) {
          return view.currentFileLog(onlyCurrentFile, currentFile);
        } else {
          return view.branchLog();
        }
      }
    });
  };

  module.exports = gitLog;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyREFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxxQkFGYixDQUFBOztBQUFBLEVBSUEscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFEc0I7RUFBQSxDQUp4QixDQUFBOztBQUFBLEVBT0EsTUFBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNQLFFBQUEsa0NBQUE7QUFBQSxJQURlLGtDQUFELE9BQWtCLElBQWpCLGVBQ2YsQ0FBQTtBQUFBLElBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FBZCxDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxRQUFELEdBQUE7QUFDdkIsTUFBQSxJQUEwQixRQUFBLEtBQVksVUFBdEM7QUFBQSxlQUFPLEdBQUEsQ0FBQSxXQUFQLENBQUE7T0FEdUI7SUFBQSxDQUF6QixDQUZBLENBQUE7V0FLQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxTQUFDLElBQUQsR0FBQTtBQUNuQyxNQUFBLElBQUcsSUFBQSxZQUFnQixXQUFuQjtBQUNFLFFBQUEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQUEsQ0FBQTtBQUNBLFFBQUEsSUFBRyxlQUFIO2lCQUNFLElBQUksQ0FBQyxjQUFMLENBQW9CLGVBQXBCLEVBQXFDLFdBQXJDLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUksQ0FBQyxTQUFMLENBQUEsRUFIRjtTQUZGO09BRG1DO0lBQUEsQ0FBckMsRUFOTztFQUFBLENBUFQsQ0FBQTs7QUFBQSxFQXFCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQXJCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-log.coffee
