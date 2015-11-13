(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, cwd, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return notifier.addSuccess("Removed " + (prettify(data)));
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, _i, _len, _results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        file = data[i];
        _results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return _results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcmVtb3ZlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDVixRQUFBLG9DQUFBO0FBQUEsSUFEa0IsK0JBQUQsT0FBZSxJQUFkLFlBQ2xCLENBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFOLENBQUE7QUFBQSxJQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCLENBRGQsQ0FBQTtBQUVBLElBQUEsSUFBRyxxQkFBQSxJQUFpQixDQUFBLFlBQXBCO0FBQ0UsTUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBa0MsQ0FBQyxPQUFuQyxDQUFBLENBQUEsQ0FBQTtlQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLGtCQUFiLEVBQWlDLFdBQWpDLENBQVIsRUFBdUQ7QUFBQSxVQUFDLEtBQUEsR0FBRDtTQUF2RCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2lCQUFVLFFBQVEsQ0FBQyxVQUFULENBQXFCLFVBQUEsR0FBUyxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBOUIsRUFBVjtRQUFBLENBRE4sRUFGRjtPQURGO0tBQUEsTUFBQTthQU1FLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsa0JBQW5CLEVBQXVDLElBQXZDLEVBQTZDLEdBQTdDLENBQVIsRUFBMkQ7QUFBQSxRQUFDLEtBQUEsR0FBRDtPQUEzRCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2VBQWMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixRQUFBLENBQVMsSUFBVCxDQUFyQixFQUFkO01BQUEsQ0FETixFQU5GO0tBSFU7RUFBQSxDQUpaLENBQUE7O0FBQUEsRUFnQkEsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsUUFBQSwyQkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWCxDQUFQLENBQUE7QUFDQSxJQUFBLElBQUcsSUFBSDtBQUNFO1dBQUEsbURBQUE7dUJBQUE7QUFDRSxzQkFBQSxJQUFLLENBQUEsQ0FBQSxDQUFMLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQSxFQUFsQyxDQURGO0FBQUE7c0JBREY7S0FBQSxNQUFBO2FBSUUsS0FKRjtLQUZTO0VBQUEsQ0FoQlgsQ0FBQTs7QUFBQSxFQXdCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQXhCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-remove.coffee
