(function() {
  var git, gitAdd;

  git = require('../git');

  gitAdd = function(repo, _arg) {
    var addAll, file, _ref;
    addAll = (_arg != null ? _arg : {}).addAll;
    if (!addAll) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } else {
      file = null;
    }
    return git.add(repo, {
      file: file
    });
  };

  module.exports = gitAdd;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYWRkLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDUCxRQUFBLGtCQUFBO0FBQUEsSUFEZSx5QkFBRCxPQUFTLElBQVIsTUFDZixDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsTUFBSDtBQUNFLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FBUCxDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FIRjtLQUFBO1dBS0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxNQUFBLElBQUEsRUFBTSxJQUFOO0tBQWQsRUFOTztFQUFBLENBRlQsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BVmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-add.coffee
