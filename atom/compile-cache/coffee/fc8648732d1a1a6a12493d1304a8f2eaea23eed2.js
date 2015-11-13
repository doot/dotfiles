(function() {
  var Git, getPath;

  Git = require('promised-git');

  getPath = function() {
    var _ref;
    if ((_ref = atom.project) != null ? _ref.getRepositories()[0] : void 0) {
      return atom.project.getRepositories()[0].getWorkingDirectory();
    } else if (atom.project) {
      return atom.project.getPath();
    } else {
      return __dirname;
    }
  };

  module.exports = new Git(getPath());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvZ2l0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxjQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixRQUFBLElBQUE7QUFBQSxJQUFBLHdDQUFlLENBQUUsZUFBZCxDQUFBLENBQWdDLENBQUEsQ0FBQSxVQUFuQzthQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQStCLENBQUEsQ0FBQSxDQUFFLENBQUMsbUJBQWxDLENBQUEsRUFERjtLQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsT0FBUjthQUNILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBYixDQUFBLEVBREc7S0FBQSxNQUFBO2FBR0gsVUFIRztLQUhHO0VBQUEsQ0FGVixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBcUIsSUFBQSxHQUFBLENBQUksT0FBQSxDQUFBLENBQUosQ0FWckIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/git.coffee
