(function() {
  var LinterProvider, child_process, path;

  child_process = require('child_process');

  path = require('path');

  module.exports = LinterProvider = (function() {
    var getCommand, regex;

    function LinterProvider() {}

    regex = /\[(\w+)\]\s(.*)/;

    getCommand = function() {
      var cmd;
      cmd = atom.config.get('linter-flint.executablePath');
      if (atom.config.get('linter-flint.skipReadme')) {
        cmd = "" + cmd + " --skip-readme";
      }
      if (atom.config.get('linter-flint.skipContributing')) {
        cmd = "" + cmd + " --skip-contributing";
      }
      if (atom.config.get('linter-flint.skipLicense')) {
        cmd = "" + cmd + " --skip-license";
      }
      if (atom.config.get('linter-flint.skipBootstrap')) {
        cmd = "" + cmd + " --skip-bootstrap";
      }
      if (atom.config.get('linter-flint.skipTestScript')) {
        cmd = "" + cmd + " --skip-test-script";
      }
      if (atom.config.get('linter-flint.skipScripts')) {
        cmd = "" + cmd + " --skip-scripts";
      }
      if (!atom.config.get('linter-flint.colorOutput')) {
        cmd = "" + cmd + " --no-color";
      }
      return cmd;
    };

    LinterProvider.prototype.lint = function() {
      return new Promise(function(resolve) {
        var data, process, projectPath;
        projectPath = atom.project.getPaths()[0];
        data = '';
        process = child_process.exec(getCommand(), {
          cwd: projectPath
        });
        process.stderr.on('data', function(d) {
          return data = d.toString();
        });
        return process.on('close', function() {
          var line, message, toReturn, type, _i, _len, _ref, _ref1;
          toReturn = [];
          _ref = data.split('\n');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            if (line.match(regex)) {
              _ref1 = line.match(regex).slice(1, 3), type = _ref1[0], message = _ref1[1];
              toReturn.push({
                type: type,
                text: message
              });
            }
          }
          return resolve(toReturn);
        });
      });
    };

    return LinterProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWZsaW50L2xpYi9wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxlQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsUUFBQSxpQkFBQTs7Z0NBQUE7O0FBQUEsSUFBQSxLQUFBLEdBQVEsaUJBQVIsQ0FBQTs7QUFBQSxJQUtBLFVBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQU4sQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLGdCQUFiLENBREY7T0FEQTtBQUdBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLHNCQUFiLENBREY7T0FIQTtBQUtBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLGlCQUFiLENBREY7T0FMQTtBQU9BLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLG1CQUFiLENBREY7T0FQQTtBQVNBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLHFCQUFiLENBREY7T0FUQTtBQVdBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUcsR0FBSCxHQUFPLGlCQUFiLENBREY7T0FYQTtBQWFBLE1BQUEsSUFBQSxDQUFBLElBQVcsQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBUDtBQUNFLFFBQUEsR0FBQSxHQUFNLEVBQUEsR0FBRyxHQUFILEdBQU8sYUFBYixDQURGO09BYkE7QUFlQSxhQUFPLEdBQVAsQ0FoQlc7SUFBQSxDQUxiLENBQUE7O0FBQUEsNkJBdUJBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxHQUFBO0FBQ2pCLFlBQUEsMEJBQUE7QUFBQSxRQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBdEMsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLGFBQWEsQ0FBQyxJQUFkLENBQW1CLFVBQUEsQ0FBQSxDQUFuQixFQUFpQztBQUFBLFVBQUMsR0FBQSxFQUFLLFdBQU47U0FBakMsQ0FGVixDQUFBO0FBQUEsUUFHQSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQWYsQ0FBa0IsTUFBbEIsRUFBMEIsU0FBQyxDQUFELEdBQUE7aUJBQU8sSUFBQSxHQUFPLENBQUMsQ0FBQyxRQUFGLENBQUEsRUFBZDtRQUFBLENBQTFCLENBSEEsQ0FBQTtlQUlBLE9BQU8sQ0FBQyxFQUFSLENBQVcsT0FBWCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsY0FBQSxvREFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLEVBQVgsQ0FBQTtBQUNBO0FBQUEsZUFBQSwyQ0FBQTs0QkFBQTtBQUVFLFlBQUEsSUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBSDtBQUNFLGNBQUEsUUFBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYLENBQWtCLFlBQXBDLEVBQUMsZUFBRCxFQUFPLGtCQUFQLENBQUE7QUFBQSxjQUNBLFFBQVEsQ0FBQyxJQUFULENBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLGdCQUNBLElBQUEsRUFBTSxPQUROO2VBREYsQ0FEQSxDQURGO2FBRkY7QUFBQSxXQURBO2lCQVNBLE9BQUEsQ0FBUSxRQUFSLEVBVmtCO1FBQUEsQ0FBcEIsRUFMaUI7TUFBQSxDQUFSLENBQVgsQ0FESTtJQUFBLENBdkJOLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-flint/lib/provider.coffee
