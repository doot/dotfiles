(function() {
  var BufferedProcess, CompositeDisposable, LinterPerl, deprecate, fs, path, pkg, util, _, _ref,
    __slice = [].slice;

  _ref = require("atom"), CompositeDisposable = _ref.CompositeDisposable, BufferedProcess = _ref.BufferedProcess;

  pkg = require("../package.json");

  fs = require("fs");

  path = require("path");

  deprecate = require("grim").deprecate;

  _ = {
    isEqual: require("lodash/lang/isEqual")
  };

  util = require("./util");

  module.exports = LinterPerl = (function() {
    var DEPRECATED_OPTIONS, RE;

    LinterPerl.prototype.grammarScopes = ["source.perl"];

    LinterPerl.prototype.scope = "file";

    LinterPerl.prototype.lintOnFly = true;

    LinterPerl.prototype.config = {};

    DEPRECATED_OPTIONS = {
      perlExecutablePath: "executablePath",
      incPathsFromProjectPath: "incPathsFromProjectRoot"
    };

    function LinterPerl(configSchema) {
      var keyPath, name, value;
      this.subscriptions = new CompositeDisposable;
      for (name in configSchema) {
        keyPath = "" + pkg.name + "." + name;
        value = atom.config.get(keyPath);
        if (DEPRECATED_OPTIONS[name]) {
          if (!_.isEqual(value, configSchema[name]["default"])) {
            deprecate("" + pkg.name + "." + name + " is deprecated.\nPlease use " + pkg.name + "." + DEPRECATED_OPTIONS[name] + " in your config.");
          }
          name = DEPRECATED_OPTIONS[name];
        }
        this.config[name] = value;
        this.subscriptions.add(atom.config.observe(keyPath, (function(_this) {
          return function(value) {
            return _this.config[name] = value;
          };
        })(this)));
      }
    }

    LinterPerl.prototype.destructor = function() {
      return this.subscriptions.dispose();
    };

    RE = /(.*) at (.*) line (\d+)/;

    LinterPerl.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var args, buf, command, exit, filePath, process, rootDirectory, stderr, stdout, _ref1;
          buf = [];
          stdout = function(output) {
            return buf.push(output);
          };
          stderr = function(output) {
            return buf.push(output);
          };
          exit = function(code) {
            var filePath, line, lineNum, m, message, results, unused, _i, _len, _ref1;
            results = [];
            _ref1 = buf.join("\n").split("\n");
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              line = _ref1[_i];
              m = line.match(RE);
              if (!(m && m.length === 4)) {
                continue;
              }
              unused = m[0], message = m[1], filePath = m[2], lineNum = m[3];
              results.push({
                type: 'Error',
                text: message,
                filePath: filePath,
                range: [[lineNum - 1, 0], [lineNum - 1, textEditor.getBuffer().lineLengthForRow(lineNum - 1)]]
              });
            }
            return resolve(results);
          };
          filePath = textEditor.getPath();
          rootDirectory = util.determineRootDirectory(textEditor);
          _ref1 = _this.buildCommand(filePath, rootDirectory), command = _ref1.command, args = _ref1.args;
          process = new BufferedProcess({
            command: command,
            args: args,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          return process.onWillThrowError(function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            atom.notifications.addError("Failed to run " + command + ".", {
              detail: error.message,
              dismissable: true
            });
            handle();
            return resolve([]);
          });
        };
      })(this));
    };

    LinterPerl.prototype.buildCommand = function(filePath, rootDirectory) {
      var args, cmd, command, isCartonUsed;
      cmd = ["perl", "-MO=Lint"];
      if (this.config.lintOptions) {
        cmd[1] += "," + this.config.lintOptions;
      }
      if (this.config.incPathsFromProjectRoot.length > 0) {
        cmd = cmd.concat(this.config.incPathsFromProjectRoot.map(function(p) {
          return "-I" + path.join(rootDirectory, p);
        }));
      }
      if (this.config.additionalPerlOptions) {
        cmd = cmd.concat(this.config.additionalPerlOptions);
      }
      cmd.push(filePath);
      if (this.config.autoDetectCarton) {
        isCartonUsed = fs.existsSync(path.join(rootDirectory, "cpanfile.snapshot")) && fs.existsSync(path.join(rootDirectory, "local"));
        if (isCartonUsed) {
          cmd = ["carton", "exec", "--"].concat(cmd);
        }
      }
      if (this.config.executeCommandViaShell) {
        cmd = [process.env.SHELL, "-lc", cmd.join(" ")];
      }
      command = cmd[0], args = 2 <= cmd.length ? __slice.call(cmd, 1) : [];
      return {
        command: command,
        args: args
      };
    };

    return LinterPerl;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBlcmwvbGliL2xpbnRlci1wZXJsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5RkFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQix1QkFBQSxlQUF0QixDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlDLFlBQWEsT0FBQSxDQUFRLE1BQVIsRUFBYixTQUpELENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUk7QUFBQSxJQUNGLE9BQUEsRUFBUyxPQUFBLENBQVEscUJBQVIsQ0FEUDtHQUxKLENBQUE7O0FBQUEsRUFRQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FSUCxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsUUFBQSxzQkFBQTs7QUFBQSx5QkFBQSxhQUFBLEdBQWUsQ0FBQyxhQUFELENBQWYsQ0FBQTs7QUFBQSx5QkFDQSxLQUFBLEdBQU8sTUFEUCxDQUFBOztBQUFBLHlCQUVBLFNBQUEsR0FBVyxJQUZYLENBQUE7O0FBQUEseUJBTUEsTUFBQSxHQUFRLEVBTlIsQ0FBQTs7QUFBQSxJQVFBLGtCQUFBLEdBQ0U7QUFBQSxNQUFBLGtCQUFBLEVBQW9CLGdCQUFwQjtBQUFBLE1BQ0EsdUJBQUEsRUFBeUIseUJBRHpCO0tBVEYsQ0FBQTs7QUFZYSxJQUFBLG9CQUFDLFlBQUQsR0FBQTtBQUNYLFVBQUEsb0JB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

//# sourceURL=/Users/doot/.atom/packages/linter-perl/lib/linter-perl.coffee
