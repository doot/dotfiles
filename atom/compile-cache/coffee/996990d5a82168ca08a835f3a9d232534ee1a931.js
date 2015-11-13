(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'PHP Executable Path',
        "default": 'php'
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-php');
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.config.observe('linter-php.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'PHP',
        grammarScopes: ['text.html.php', 'source.php'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var command, filePath, parameters, text;
            filePath = textEditor.getPath();
            command = _this.executablePath;
            parameters = [];
            parameters.push('--syntax-check');
            parameters.push('--no-php-ini');
            parameters.push('--define', 'display_errors=On');
            parameters.push('--define', 'log_errors=Off');
            text = textEditor.getText();
            return helpers.exec(command, parameters, {
              stdin: text
            }).then(function(output) {
              var match, messages, regex;
              regex = /error:\s+(.*?) on line (\d+)/g;
              messages = [];
              while ((match = regex.exec(output)) !== null) {
                messages.push({
                  type: "Error",
                  filePath: filePath,
                  range: helpers.rangeFromLineNumber(textEditor, match[2] - 1),
                  text: match[1]
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBocC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLHFCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQURGO0tBREY7QUFBQSxJQU1BLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLFlBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwyQkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsY0FBRCxHQUFBO2lCQUNFLEtBQUMsQ0FBQSxjQUFELEdBQWtCLGVBRHBCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsRUFIUTtJQUFBLENBTlY7QUFBQSxJQWFBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURVO0lBQUEsQ0FiWjtBQUFBLElBZ0JBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sS0FBTjtBQUFBLFFBQ0EsYUFBQSxFQUFlLENBQUMsZUFBRCxFQUFrQixZQUFsQixDQURmO0FBQUEsUUFFQSxLQUFBLEVBQU8sTUFGUDtBQUFBLFFBR0EsU0FBQSxFQUFXLElBSFg7QUFBQSxRQUlBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ0osZ0JBQUEsbUNBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxHQUFVLEtBQUMsQ0FBQSxjQURYLENBQUE7QUFBQSxZQUVBLFVBQUEsR0FBYSxFQUZiLENBQUE7QUFBQSxZQUdBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGdCQUFoQixDQUhBLENBQUE7QUFBQSxZQUlBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGNBQWhCLENBSkEsQ0FBQTtBQUFBLFlBS0EsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsVUFBaEIsRUFBNEIsbUJBQTVCLENBTEEsQ0FBQTtBQUFBLFlBTUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsVUFBaEIsRUFBNEIsZ0JBQTVCLENBTkEsQ0FBQTtBQUFBLFlBT0EsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FQUCxDQUFBO0FBUUEsbUJBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLEVBQXNCLFVBQXRCLEVBQWtDO0FBQUEsY0FBQyxLQUFBLEVBQU8sSUFBUjthQUFsQyxDQUFnRCxDQUFDLElBQWpELENBQXNELFNBQUMsTUFBRCxHQUFBO0FBQzNELGtCQUFBLHNCQUFBO0FBQUEsY0FBQSxLQUFBLEdBQVEsK0JBQVIsQ0FBQTtBQUFBLGNBQ0EsUUFBQSxHQUFXLEVBRFgsQ0FBQTtBQUVBLHFCQUFNLENBQUMsS0FBQSxHQUFRLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQUFULENBQUEsS0FBa0MsSUFBeEMsR0FBQTtBQUNFLGdCQUFBLFFBQVEsQ0FBQyxJQUFULENBQ0U7QUFBQSxrQkFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLGtCQUNBLFFBQUEsRUFBVSxRQURWO0FBQUEsa0JBRUEsS0FBQSxFQUFPLE9BQU8sQ0FBQyxtQkFBUixDQUE0QixVQUE1QixFQUF3QyxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsQ0FBbkQsQ0FGUDtBQUFBLGtCQUdBLElBQUEsRUFBTSxLQUFNLENBQUEsQ0FBQSxDQUhaO2lCQURGLENBQUEsQ0FERjtjQUFBLENBRkE7QUFRQSxxQkFBTyxRQUFQLENBVDJEO1lBQUEsQ0FBdEQsQ0FBUCxDQVRJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKTjtRQUhXO0lBQUEsQ0FoQmY7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/linter-php/lib/main.coffee
