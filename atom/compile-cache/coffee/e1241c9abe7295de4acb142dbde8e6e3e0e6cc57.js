(function() {
  var Linter, LinterBootlint, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage('linter').path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterBootlint = (function(_super) {
    __extends(LinterBootlint, _super);

    LinterBootlint.syntax = ['text.html.basic', 'text.html.twig'];

    LinterBootlint.prototype.cmd = 'bootlint';

    LinterBootlint.prototype.linterName = 'bootlint';

    LinterBootlint.prototype.regex = '.+?:(?<line>\\d+)?' + '(:(?<col>\\d+))?' + ' (?<message>((?<error>E)|(?<warning>W)).+?)\\n';

    LinterBootlint.prototype.regexFlags = 's';

    LinterBootlint.prototype.isNodeExecutable = true;

    function LinterBootlint(editor) {
      var flags;
      LinterBootlint.__super__.constructor.call(this, editor);
      flags = atom.config.get('linter-bootlint.flags');
      if (flags) {
        this.cmd += " -d " + flags;
      }
      this.listener = atom.config.observe('linter-bootlint.executablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-bootlint.executablePath');
        };
      })(this));
    }

    LinterBootlint.prototype.destroy = function() {
      LinterBootlint.__super__.destroy.apply(this, arguments);
      return this.listener.dispose();
    };

    return LinterBootlint;

  })(Linter);

  module.exports = LinterBootlint;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWJvb3RsaW50L2xpYi9saW50ZXItYm9vdGxpbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRyxVQUFILEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBR007QUFHSixxQ0FBQSxDQUFBOztBQUFBLElBQUEsY0FBQyxDQUFBLE1BQUQsR0FBUyxDQUFDLGlCQUFELEVBQW9CLGdCQUFwQixDQUFULENBQUE7O0FBQUEsNkJBSUEsR0FBQSxHQUFLLFVBSkwsQ0FBQTs7QUFBQSw2QkFNQSxVQUFBLEdBQVksVUFOWixDQUFBOztBQUFBLDZCQVNBLEtBQUEsR0FDRSxvQkFBQSxHQUNBLGtCQURBLEdBRUEsZ0RBWkYsQ0FBQTs7QUFBQSw2QkFjQSxVQUFBLEdBQVksR0FkWixDQUFBOztBQUFBLDZCQWdCQSxnQkFBQSxHQUFrQixJQWhCbEIsQ0FBQTs7QUFrQmEsSUFBQSx3QkFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQUFBLGdEQUFNLE1BQU4sQ0FBQSxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUZSLENBQUE7QUFHQSxNQUFBLElBQTBCLEtBQTFCO0FBQUEsUUFBQSxJQUFDLENBQUEsR0FBRCxJQUFTLE1BQUEsR0FBTSxLQUFmLENBQUE7T0FIQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hFLEtBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFEOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxDQUxaLENBRFc7SUFBQSxDQWxCYjs7QUFBQSw2QkEyQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQUZPO0lBQUEsQ0EzQlQsQ0FBQTs7MEJBQUE7O0tBSDJCLE9BSDdCLENBQUE7O0FBQUEsRUFxQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FyQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-bootlint/lib/linter-bootlint.coffee
