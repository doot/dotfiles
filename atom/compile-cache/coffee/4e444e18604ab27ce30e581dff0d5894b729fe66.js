(function() {
  var CompositeDisposable, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        "default": path.join(__dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint'),
        type: 'string',
        description: 'HTMLHint Executable Path'
      }
    },
    activate: function() {
      console.log('activate linter-htmlhint');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-htmlhint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.scopes = ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.handlebars', 'text.html.ruby'];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, htmlhintrc, parameters, text;
          filePath = textEditor.getPath();
          htmlhintrc = helpers.findFile(filePath, '.htmlhintrc');
          text = textEditor.getText();
          parameters = [filePath, '--format', 'json'];
          if (htmlhintrc && __indexOf.call(parameters, '-c') < 0) {
            parameters = parameters.concat(['-c', htmlhintrc]);
          }
          return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then(function(output) {
            var linterMessages, linterResults;
            linterResults = JSON.parse(output);
            if (!linterResults.length) {
              return [];
            }
            linterMessages = linterResults[0].messages;
            return linterMessages.map(function(msg) {
              return {
                range: [[msg.line - 1, msg.col - 1], [msg.line - 1, msg.col - 1]],
                type: msg.type,
                text: msg.message,
                filePath: filePath
              };
            });
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWh0bWxoaW50L2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsVUFBM0MsRUFBdUQsS0FBdkQsRUFBOEQsVUFBOUQsQ0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFdBQUEsRUFBYSwwQkFGYjtPQURGO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMEJBQVosQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSGpCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLGNBQUQsR0FBQTtpQkFDRSxLQUFDLENBQUEsY0FBRCxHQUFrQixlQURwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBSkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxNQUFE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

//# sourceURL=/Users/doot/.atom/packages/linter-htmlhint/lib/init.coffee
