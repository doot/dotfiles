(function() {
  var Linter, LinterTidy, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterTidy = (function(_super) {
    __extends(LinterTidy, _super);

    LinterTidy.syntax = ['text.html.basic'];

    LinterTidy.prototype.cmd = 'tidy -quiet -utf8';

    LinterTidy.prototype.executablePath = null;

    LinterTidy.prototype.linterName = 'tidy';

    LinterTidy.prototype.errorStream = 'stderr';

    LinterTidy.prototype.regex = 'line (?<line>\\d+) column (?<col>\\d+) - ((?<error>Error)|(?<warning>Warning)): (?<message>.+)';

    function LinterTidy(editor) {
      LinterTidy.__super__.constructor.call(this, editor);
      this.executablePathListener = atom.config.observe('linter-tidy.tidyExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-tidy.tidyExecutablePath');
        };
      })(this));
    }

    LinterTidy.prototype.destroy = function() {
      return this.executablePathListener.dispose();
    };

    return LinterTidy;

  })(Linter);

  module.exports = LinterTidy;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXRpZHkvbGliL2xpbnRlci10aWR5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxJQUF0RCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxFQUFBLEdBQUcsVUFBSCxHQUFjLGFBQXRCLENBRFQsQ0FBQTs7QUFBQSxFQUdNO0FBR0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsQ0FBQyxpQkFBRCxDQUFULENBQUE7O0FBQUEseUJBSUEsR0FBQSxHQUFLLG1CQUpMLENBQUE7O0FBQUEseUJBTUEsY0FBQSxHQUFnQixJQU5oQixDQUFBOztBQUFBLHlCQVFBLFVBQUEsR0FBWSxNQVJaLENBQUE7O0FBQUEseUJBVUEsV0FBQSxHQUFhLFFBVmIsQ0FBQTs7QUFBQSx5QkFhQSxLQUFBLEdBQU8sZ0dBYlAsQ0FBQTs7QUFlYSxJQUFBLG9CQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsNENBQU0sTUFBTixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzlFLEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFENEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxDQUYxQixDQURXO0lBQUEsQ0FmYjs7QUFBQSx5QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxzQkFBc0IsQ0FBQyxPQUF4QixDQUFBLEVBRE87SUFBQSxDQXJCVCxDQUFBOztzQkFBQTs7S0FIdUIsT0FIekIsQ0FBQTs7QUFBQSxFQThCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQTlCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-tidy/lib/linter-tidy.coffee
