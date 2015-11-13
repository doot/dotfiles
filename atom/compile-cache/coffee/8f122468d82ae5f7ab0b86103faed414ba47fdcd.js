(function() {
  var BufferedProcess, CompositeDisposable, cpConfigFileName, fs, helpers, path, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  helpers = require('atom-linter');

  fs = require('fs');

  cpConfigFileName = '.classpath';

  module.exports = {
    config: {
      javaExecutablePath: {
        type: 'string',
        title: 'Path to the javac executable',
        "default": 'javac'
      },
      classpath: {
        type: 'string',
        title: "Extra classpath for javac",
        "default": ''
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-javac');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-javac.javaExecutablePath', (function(_this) {
        return function(newValue) {
          return _this.javaExecutablePath = newValue;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-javac.classpath', (function(_this) {
        return function(newValue) {
          return _this.classpath = newValue.trim();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      return {
        grammarScopes: ['source.java'],
        scope: 'project',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var args, cp, cpConfig, filePath, wd;
            filePath = textEditor.getPath();
            wd = path.dirname(filePath);
            cp = null;
            cpConfig = _this.findClasspathConfig(wd);
            if (cpConfig != null) {
              wd = cpConfig.cfgDir;
              cp = cpConfig.cfgCp;
            }
            if (_this.classpath) {
              cp += path.delimiter + _this.classpath;
            }
            if (process.env.CLASSPATH) {
              cp += path.delimiter + process.env.CLASSPATH;
            }
            args = ['-Xlint:all'];
            if (cp != null) {
              args = args.concat(['-cp', cp]);
            }
            args.push(filePath);
            return helpers.exec(_this.javaExecutablePath, args, {
              stream: 'stderr',
              cwd: wd
            }).then(function(val) {
              return _this.parse(val, textEditor);
            });
          };
        })(this)
      };
    },
    parse: function(javacOutput, textEditor) {
      var caretRegex, column, errRegex, file, line, lineNum, lines, mess, messages, type, _i, _len, _ref1;
      errRegex = /^(.*\.java):(\d+): ([\w \-]+): (.+)/;
      caretRegex = /^( *)\^/;
      lines = javacOutput.split(/\r?\n/);
      messages = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.match(errRegex)) {
          _ref1 = line.match(errRegex).slice(1, 5), file = _ref1[0], lineNum = _ref1[1], type = _ref1[2], mess = _ref1[3];
          messages.push({
            type: type,
            text: mess,
            filePath: file,
            range: [[lineNum - 1, 0], [lineNum - 1, 0]]
          });
        } else if (line.match(caretRegex)) {
          column = line.match(caretRegex)[1].length;
          if (messages.length > 0) {
            messages[messages.length - 1].range[0][1] = column;
            messages[messages.length - 1].range[1][1] = column + 1;
          }
        }
      }
      return messages;
    },
    findClasspathConfig: function(d) {
      var e, result;
      while (atom.project.contains(d) || (__indexOf.call(atom.project.getPaths(), d) >= 0)) {
        try {
          result = {
            cfgCp: fs.readFileSync(path.join(d, cpConfigFileName), {
              encoding: 'utf-8'
            }),
            cfgDir: d
          };
          result.cfgCp = result.cfgCp.trim();
          return result;
        } catch (_error) {
          e = _error;
          d = path.dirname(d);
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWphdmFjL2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsWUFKbkIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyw4QkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLE9BRlQ7T0FERjtBQUFBLE1BSUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLDJCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtPQUxGO0tBREY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLGNBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxD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

//# sourceURL=/Users/doot/.atom/packages/linter-javac/lib/init.coffee
