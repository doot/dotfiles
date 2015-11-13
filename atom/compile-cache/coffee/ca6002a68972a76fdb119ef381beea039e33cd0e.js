(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      shellcheckExecutablePath: {
        type: 'string',
        title: 'Shellcheck Executable Path',
        "default": 'shellcheck'
      },
      enableNotice: {
        type: 'boolean',
        title: 'Enable Notice Messages',
        "default": false
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-shellcheck.shellcheckExecutablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-shellcheck.enableNotice', (function(_this) {
        return function(enableNotice) {
          return _this.enableNotice = enableNotice;
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
        grammarScopes: ['source.shell'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, parameters, showAll, text;
            filePath = textEditor.getPath();
            text = textEditor.getText();
            showAll = _this.enableNotice;
            parameters = ['-f', 'gcc', '-'];
            return helpers.exec(_this.executablePath, parameters, {
              stdin: text
            }).then(function(output) {
              var colEnd, colStart, lineEnd, lineStart, match, messages, regex;
              regex = /.+?:(\d+):(\d+):\s(\w+?):\s(.+)/g;
              messages = [];
              while ((match = regex.exec(output)) !== null) {
                if (showAll || match[3] === "warning" || match[3] === "error") {
                  lineStart = match[1] - 1;
                  colStart = match[2] - 1;
                  lineEnd = match[1] - 1;
                  colEnd = textEditor.getBuffer().lineLengthForRow(lineStart);
                  messages.push({
                    type: match[3],
                    filePath: filePath,
                    range: [[lineStart, colStart], [lineEnd, colEnd]],
                    text: match[4]
                  });
                }
              }
              return messages;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXNoZWxsY2hlY2svbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLHdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sNEJBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxZQUZUO09BREY7QUFBQSxNQUlBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyx3QkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FMRjtLQURGO0FBQUEsSUFVQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FDbEIsNENBRGtCLEVBRWpCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLGNBQUQsR0FBQTtpQkFDRSxLQUFDLENBQUEsY0FBRCxHQUFrQixlQURwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmlCLENBQW5CLENBREEsQ0FBQTthQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFB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

//# sourceURL=/Users/doot/.atom/packages/linter-shellcheck/lib/main.coffee
