(function() {
  var CompositeDisposable, NamedRegexp, Path;

  CompositeDisposable = require('atom').CompositeDisposable;

  Path = require('path');

  NamedRegexp = require('named-regexp');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'Perlcritic Executable Path',
        "default": 'perlcritic'
      },
      regex: {
        type: 'string',
        title: 'Perlcritic Verbose Regex',
        "default": '(:<text>.*) at line (:<line>\\d+), column (:<col>\\d+).\\s+(:<trace>.*\\.)\\s+\\(Severity: (:<severity>\\d+)\\)'
      },
      level: {
        type: 'string',
        title: 'Perlcritic Level of warning',
        "default": 'Info'
      }
    },
    activate: function() {
      return require("atom-package-deps").install("linter-perlcritic");
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'perlcritic',
        grammarScopes: ['source.perl.mojolicious', 'source.perl'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var command, fileDir, filePath, parameters, text;
            filePath = textEditor.getPath();
            fileDir = Path.dirname(filePath);
            command = atom.config.get('linter-perlcritic.executablePath');
            parameters = [];
            parameters.push('-');
            text = textEditor.getText();
            return helpers.exec(command, parameters, {
              stdin: text,
              cwd: fileDir
            }).then(function(output) {
              var captures, col, line, match, messages, regex;
              regex = new RegExp(atom.config.get('linter-perlcritic.regex'), 'ig');
              regex = NamedRegexp.named(regex);
              messages = [];
              while ((match = regex.exec(output)) !== null) {
                line = parseInt(match.capture('line'), 10) - 1;
                col = parseInt(match.capture('col'), 10) - 1;
                text = match.capture('text');
                captures = match.captures;
                if (captures['severity']) {
                  text += ' (Severity ' + match.capture('severity') + ')';
                }
                if (captures['trace']) {
                  text += ' [' + match.capture('trace') + ']';
                }
                messages.push({
                  type: atom.config.get('linter-perlcritic.level'),
                  text: text,
                  filePath: filePath,
                  range: helpers.rangeFromLineNumber(textEditor, line, col)
                });
              }
              return messages;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBlcmxjcml0aWMvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLDRCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsWUFGVDtPQURGO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sMEJBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxpSEFGVDtPQUxGO0FBQUEsTUFRQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sNkJBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxNQUZUO09BVEY7S0FERjtBQUFBLElBZUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLG1CQUFyQyxFQURRO0lBQUEsQ0FmVjtBQUFBLElBa0JBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEs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

//# sourceURL=/Users/doot/.atom/packages/linter-perlcritic/lib/init.coffee
