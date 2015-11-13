(function() {
  var git;

  git = require('../git');

  module.exports = function(repo, _arg) {
    var addAll, file, _ref;
    addAll = (_arg != null ? _arg : {}).addAll;
    if (addAll) {
      return git.add(repo);
    } else {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
      return git.add(repo, {
        file: file
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtYWRkLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsa0JBQUE7QUFBQSxJQUR1Qix5QkFBRCxPQUFTLElBQVIsTUFDdkIsQ0FBQTtBQUFBLElBQUEsSUFBRyxNQUFIO2FBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUFQLENBQUE7YUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBZCxFQUpGO0tBRGU7RUFBQSxDQUZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-add.coffee
