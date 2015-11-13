(function() {
  var CompositeDisposable, helpers;

  CompositeDisposable = require('atom').CompositeDisposable;

  helpers = require('atom-linter');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'PHP Executable Path',
        "default": 'php'
      }
    },
    _testBin: function() {
      var message, title;
      title = 'linter-php: Unable to determine PHP version';
      message = 'Unable to determine the version of "' + this.executablePath + '", please verify that this is the right path to PHP.';
      try {
        return helpers.exec(this.executablePath, ['-v']).then((function(_this) {
          return function(output) {
            var regex;
            regex = /PHP (\d+)\.(\d+)\.(\d+)/g;
            if (!regex.exec(output)) {
              atom.notifications.addError(title, {
                detail: message
              });
              return _this.executablePath = '';
            }
          };
        })(this))["catch"](function(e) {
          console.log(e);
          return atom.notifications.addError(title, {
            detail: message
          });
        });
      } catch (_error) {}
    },
    activate: function() {
      require('atom-package-deps').install('linter-php');
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.config.observe('linter-php.executablePath', (function(_this) {
        return function(executablePath) {
          _this.executablePath = executablePath;
          return _this._testBin();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
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
            if (command == null) {
              return Promise.resolve([]);
            }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBocC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxxQkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FERjtLQURGO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsNkNBQVIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLHNDQUFBLEdBQXlDLElBQUMsQ0FBQSxjQUExQyxHQUNSLHNEQUZGLENBQUE7QUFHQTtlQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLGNBQWQsRUFBOEIsQ0FBQyxJQUFELENBQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLE1BQUQsR0FBQTtBQUN6QyxnQkFBQSxLQUFBO0FBQUEsWUFBQSxLQUFBLEdBQVEsMEJBQVIsQ0FBQTtBQUNBLFlBQUEsSUFBRyxDQUFBLEtBQVMsQ0FBQyxJQUFOLENBQVcsTUFBWCxDQUFQO0FBQ0UsY0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLEtBQTVCLEVBQW1DO0FBQUEsZ0JBQUMsTUFBQSxFQUFRLE9BQVQ7ZUFBbkMsQ0FBQSxDQUFB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

//# sourceURL=/Users/doot/.atom/packages/linter-php/lib/main.coffee
