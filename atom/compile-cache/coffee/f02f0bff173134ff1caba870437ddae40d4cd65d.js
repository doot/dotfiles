(function() {
  var BufferedProcess, CompositeDisposable, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'Path to scspell command',
        "default": '/usr/local/bin/scspell'
      },
      overrideDictionary: {
        type: 'string',
        title: 'Path to override dictionary',
        "default": ''
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-scspell.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-scspell.overrideDictionary', (function(_this) {
        return function(overrideDictionary) {
          return _this.overrideDictionary = overrideDictionary;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, parameters, parse, regex;
            filePath = textEditor.getPath();
            parameters = [filePath, '--report-only'];
            if (_this.overrideDictionary) {
              parameters.push("--override-dictionary=" + _this.overrideDictionary);
            }
            regex = /.*:(\d+): (.*)\r?/;
            parse = function(line) {
              var end, lineText, message, parsed, start, token, tokenStart;
              parsed = regex.exec(line);
              if (parsed == null) {
                return null;
              }
              line = parseInt(parsed[1], 10) - 1;
              message = parsed[2];
              tokenStart = message.lastIndexOf('from token') + 12;
              token = message.slice(tokenStart, -2);
              lineText = textEditor.lineTextForBufferRow(line);
              start = lineText.indexOf(token);
              end = start + token.length;
              return {
                type: 'SP',
                text: message,
                filePath: filePath,
                range: [[line, start], [line, end]]
              };
            };
            return new Promise(function(resolve, reject) {
              var lines, process;
              lines = [];
              process = new BufferedProcess({
                command: _this.executablePath,
                args: parameters,
                stdout: function(data) {
                  return lines = data.split('\n');
                },
                exit: function(code) {
                  var errors, info, line, _i, _len;
                  if (code !== 0) {
                    return resolve([]);
                  }
                  errors = [];
                  for (_i = 0, _len = lines.length; _i < _len; _i++) {
                    line = lines[_i];
                    if (line) {
                      info = parse(line);
                      if (info != null) {
                        errors.push(info);
                      }
                    }
                  }
                  return resolve(errors);
                }
              });
              return process.onWillThrowError(function(_arg) {
                var error, handle;
                error = _arg.error, handle = _arg.handle;
                atom.notifications.addError("Failed to run " + this.executablePath, {
                  detail: "" + error.message,
                  dismissable: true
                });
                handle();
                return resolve([]);
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXNjc3BlbGwvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8seUJBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyx3QkFGVDtPQURGO0FBQUEsTUFJQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLDZCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtPQUxGO0tBREY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwrQkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsY0FBRCxHQUFBO2lCQUNFLEtBQUMsQ0FBQSxjQUFELEdBQWtCLGVBRHBCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FEQSxDQUFBO2FBSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixtQ0FBcEIsRUFD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

//# sourceURL=/Users/doot/.atom/packages/linter-scspell/lib/main.coffee
