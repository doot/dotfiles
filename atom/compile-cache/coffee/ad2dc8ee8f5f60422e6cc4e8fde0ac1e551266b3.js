(function() {
  var ProjectsListView, git, gitInit, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  gitInit = function() {
    var currentFile, promise, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return promise = new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

  init = function(path) {
    return git.cmd({
      args: ['init'],
      cwd: path,
      stdout: function(data) {
        notifier.addSuccess(data);
        return atom.project.setPaths([path]);
      }
    });
  };

  module.exports = gitInit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtaW5pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDZCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsMEJBQUE7QUFBQSxJQUFBLFdBQUEsK0RBQWtELENBQUUsT0FBdEMsQ0FBQSxVQUFkLENBQUE7QUFDQSxJQUFBLElBQUcsQ0FBQSxXQUFBLElBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsTUFBeEIsR0FBaUMsQ0FBeEQ7YUFDRSxPQUFBLEdBQWMsSUFBQSxnQkFBQSxDQUFBLENBQWtCLENBQUMsTUFBTSxDQUFDLElBQTFCLENBQStCLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBQSxDQUFLLElBQUwsRUFBVjtNQUFBLENBQS9CLEVBRGhCO0tBQUEsTUFBQTthQUdFLElBQUEsQ0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBN0IsRUFIRjtLQUZRO0VBQUEsQ0FKVixDQUFBOztBQUFBLEVBV0EsSUFBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO1dBQ0wsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsTUFBRCxDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sUUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFELENBQXRCLEVBRk07TUFBQSxDQUZSO0tBREYsRUFESztFQUFBLENBWFAsQ0FBQTs7QUFBQSxFQW1CQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQW5CakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-init.coffee
