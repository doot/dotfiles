(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'Perlcritic Executable Path',
        "default": 'perlcritic'
      }
    },
    activate: function() {
      return require("atom-package-deps").install("linter-perlcritic");
    },
    provideLinter: function() {
      var helpers, provider, regex;
      helpers = require('atom-linter');
      regex = '[^:]*:(?<line>\\d+):(?<col>\\d+):(?<message>.*)';
      return provider = {
        name: 'perlcritic',
        grammarScopes: ['source.perl.mojolicious', 'source.perl'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var command, filePath, parameters, text;
            filePath = textEditor.getPath();
            command = atom.config.get("linter-perlcritic.executablePath");
            parameters = [];
            parameters.push(filePath);
            text = textEditor.getText();
            return helpers.exec(command, parameters).then(function(output) {
              var errors, message;
              errors = (function() {
                var _i, _len, _ref, _results;
                _ref = helpers.parse(output, regex, {
                  filePath: filePath
                });
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  message = _ref[_i];
                  message.type = 'info';
                  _results.push(message);
                }
                return _results;
              })();
              return errors;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBlcmxjcml0aWMvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyw0QkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLFlBRlQ7T0FERjtLQURGO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBR1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsbUJBQXJDLEVBSFE7SUFBQSxDQUxWO0FBQUEsSUFVQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSx3QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSLENBQVYsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLGlEQURSLENBQUE7YUFFQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxZQUFOO0FBQUEsUUFDQSxhQUFBLEVBQWUsQ0FBQyx5QkFBRCxFQUE0QixhQUE1QixDQURmO0FBQUEsUUFFQSxLQUFBLEVBQU8sTUFGUDtBQUFBLFFBR0EsU0FBQSxFQUFXLElBSFg7QUFBQSxRQUlBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ0osZ0JBQUEsbUNBQUE7QUFBQSxZQUFBLFFBQUEsR0FBYSxVQUFVLENBQUMsT0FBWCxDQUFBLENBQWIsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FEYixDQUFBO0FBQUEsWUFFQSxVQUFBLEdBQWEsRUFGYixDQUFBO0FBQUEsWUFHQSxVQUFVLENBQUMsSUFBWCxDQUFnQixRQUFoQixDQUhBLENBQUE7QUFBQSxZQUlBLElBQUEsR0FBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBSlAsQ0FBQTtBQUtBLG1CQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFzQixVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLFNBQUMsTUFBRCxHQUFBO0FBQzVDLGtCQUFBLGVBQUE7QUFBQSxjQUFBLE1BQUE7O0FBQVM7OztBQUFBO3FCQUFBLDJDQUFBO3FDQUFBO0FBQ1Asa0JBQUEsT0FBTyxDQUFDLElBQVIsR0FBZSxNQUFmLENBQUE7QUFBQSxnQ0FDQSxRQURBLENBRE87QUFBQTs7a0JBQVQsQ0FBQTtBQUlBLHFCQUFPLE1BQVAsQ0FMNEM7WUFBQSxDQUF2QyxDQUFQLENBTkk7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpOO1FBSlc7SUFBQSxDQVZmO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-perlcritic/lib/init.coffee
