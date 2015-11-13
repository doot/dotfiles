(function() {
  var CompositeDisposable, helpers, os, path, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  helpers = require('atom-linter');

  path = require('path');

  _ = require('lodash');

  os = require('os');

  module.exports = {
    config: {
      executable: {
        type: 'string',
        "default": 'pylint',
        description: 'Command or path to executable.'
      },
      pythonPath: {
        type: 'string',
        "default": '',
        description: 'Paths to be added to $PYTHONPATH.  Use %p for current project directory (no trailing /).'
      },
      rcFile: {
        type: 'string',
        "default": '',
        description: 'Path to .pylintrc file.'
      },
      messageFormat: {
        type: 'string',
        "default": '%i %m',
        description: 'Format for Pylint messages where %m is the message, %i is the numeric mesasge ID (e.g. W0613) and %s is the human-readable message ID (e.g. unused-argument).'
      }
    },
    activate: function() {
      require('atom-package-deps').install(require('../package.json').name);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-pylint.executable', (function(_this) {
        return function(newExecutableValue) {
          return _this.executable = newExecutableValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.rcFile', (function(_this) {
        return function(newRcFileValue) {
          return _this.rcFile = newRcFileValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.messageFormat', (function(_this) {
        return function(newMessageFormatValue) {
          return _this.messageFormat = newMessageFormatValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.pythonPath', (function(_this) {
        return function(newPythonPathValue) {
          return _this.pythonPath = _.trim(newPythonPathValue, path.delimiter);
        };
      })(this)));
      this.regex = '^(?<line>\\d+),(?<col>\\d+),(?<type>\\w+),(\\w\\d+):(?<message>.*)$';
      return this.errorWhitelist = [/^No config file found, using default configuration$/];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        name: 'Pylint',
        grammarScopes: ['source.python'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(activeEditor) {
            var file;
            file = activeEditor.getPath();
            return helpers.tempFile(path.basename(file), activeEditor.getText(), function(tmpFilename) {
              var args, cwd, env, format, pattern, projDir, pythonPath, value, _ref;
              projDir = _this.getProjDir(file);
              cwd = projDir;
              pythonPath = _this.pythonPath.replace(/%p/g, projDir);
              env = Object.create(process.env, {
                PYTHONPATH: {
                  value: _.compact([process.env.PYTHONPATH, projDir, pythonPath]).join(path.delimiter)
                }
              });
              format = _this.messageFormat;
              _ref = {
                '%m': 'msg',
                '%i': 'msg_id',
                '%s': 'symbol'
              };
              for (pattern in _ref) {
                value = _ref[pattern];
                format = format.replace(new RegExp(pattern, 'g'), "{" + value + "}");
              }
              args = ["--msg-template='{line},{column},{category},{msg_id}:" + format + "'", '--reports=n', '--output-format=text'];
              if (_this.rcFile) {
                args.push("--rcfile=" + _this.rcFile);
              }
              args.push(tmpFilename);
              return helpers.exec(_this.executable, args, {
                env: env,
                cwd: cwd,
                stream: 'both'
              }).then(function(data) {
                var filteredErrors;
                filteredErrors = _this.filterWhitelistedErrors(data.stderr);
                if (filteredErrors) {
                  throw new Error(filteredErrors);
                }
                return helpers.parse(data.stdout, _this.regex, {
                  filePath: file
                }).filter(function(lintIssue) {
                  return lintIssue.type !== 'info';
                }).map(function(lintIssue) {
                  var colEnd, colStart, lineEnd, lineStart, _ref1, _ref2, _ref3;
                  _ref1 = lintIssue.range, (_ref2 = _ref1[0], lineStart = _ref2[0], colStart = _ref2[1]), (_ref3 = _ref1[1], lineEnd = _ref3[0], colEnd = _ref3[1]);
                  if (lineStart === lineEnd && (colStart <= colEnd && colEnd <= 0)) {
                    return _.merge({}, lintIssue, {
                      range: helpers.rangeFromLineNumber(activeEditor, lineStart, colStart)
                    });
                  }
                  return lintIssue;
                });
              });
            });
          };
        })(this)
      };
    },
    getProjDir: function(filePath) {
      return atom.project.relativizePath(filePath)[0];
    },
    filterWhitelistedErrors: function(output) {
      var filteredOutputLines, outputLines;
      outputLines = _.compact(output.split(os.EOL));
      filteredOutputLines = _.reject(outputLines, (function(_this) {
        return function(outputLine) {
          return _.some(_this.errorWhitelist, function(errorRegex) {
            return errorRegex.test(outputLine);
          });
        };
      })(this));
      return filteredOutputLines.join(os.EOL);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsZ0NBRmI7T0FERjtBQUFBLE1BSUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwRkFGYjtPQUxGO0FBQUEsTUFRQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlCQUZiO09BVEY7QUFBQSxNQVlBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxXQUFBLEVBQ0UsK0pBSEY7T0FiRjtLQURGO0FBQUEsSUFxQkEsUUFBQSxFQUFV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

//# sourceURL=/Users/doot/.atom/packages/linter-pylint/lib/main.coffee
