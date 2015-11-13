(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd({
          args: ['rm', '-f', '--ignore-unmatch', currentFile],
          cwd: repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess("Removed " + (prettify(data)));
          }
        });
      }
    } else {
      return git.cmd({
        args: ['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'],
        cwd: repo.getWorkingDirectory(),
        stdout: function(data) {
          return new RemoveListView(repo, prettify(data));
        }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcmVtb3ZlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDVixRQUFBLCtCQUFBO0FBQUEsSUFEa0IsK0JBQUQsT0FBZSxJQUFkLFlBQ2xCLENBQUE7QUFBQSxJQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCLENBQWQsQ0FBQTtBQUVBLElBQUEsSUFBRyxxQkFBQSxJQUFpQixDQUFBLFlBQXBCO0FBQ0UsTUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBa0MsQ0FBQyxPQUFuQyxDQUFBLENBQUEsQ0FBQTtlQUNBLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBTjtBQUFBLFVBQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxVQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTttQkFDTixRQUFRLENBQUMsVUFBVCxDQUFxQixVQUFBLEdBQVMsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQTlCLEVBRE07VUFBQSxDQUZSO1NBREYsRUFGRjtPQURGO0tBQUEsTUFBQTthQVNFLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixrQkFBbkIsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBTjtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxRQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBYyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLFFBQUEsQ0FBUyxJQUFULENBQXJCLEVBQWQ7UUFBQSxDQUZSO09BREYsRUFURjtLQUhVO0VBQUEsQ0FKWixDQUFBOztBQUFBLEVBc0JBLFFBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFFBQUEsMkJBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVgsQ0FBUCxDQUFBO0FBQ0EsSUFBQSxJQUFHLElBQUg7QUFDRTtXQUFBLG1EQUFBO3VCQUFBO0FBQ0Usc0JBQUEsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxDQUF3QixDQUFBLENBQUEsRUFBbEMsQ0FERjtBQUFBO3NCQURGO0tBQUEsTUFBQTthQUlFLEtBSkY7S0FGUztFQUFBLENBdEJYLENBQUE7O0FBQUEsRUE4QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0E5QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-remove.coffee
