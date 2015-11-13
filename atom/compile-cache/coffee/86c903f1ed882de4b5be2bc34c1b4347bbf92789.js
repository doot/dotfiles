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
      return this.scopes = ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.php', 'text.html.ruby'];
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
          parameters = [filePath];
          if (htmlhintrc && __indexOf.call(parameters, '-c') < 0) {
            parameters = parameters.concat(['-c', htmlhintrc]);
          }
          return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then(function(output) {
            var parsed;
            parsed = helpers.parse(output, 'line (?<line>[0-9]+), col (?<col>[0-9]+): (?<message>.+)');
            parsed.map(function(match) {
              if (match.text.slice(1, 5) === "[33m") {
                match.type = 'warning';
              } else if (match.text.slice(1, 5) === "[31m") {
                match.type = 'error';
              } else {
                match.type = 'info';
              }
              match.text = match.text.slice(5, -5);
              match.filePath = filePath;
              return match;
            });
            return parsed;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWh0bWxoaW50L2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsVUFBM0MsRUFBdUQsS0FBdkQsRUFBOEQsVUFBOUQsQ0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFdBQUEsRUFBYSwwQkFGYjtPQURGO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMEJBQVosQ0FBQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSGpCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsZ0NBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLGNBQUQsR0FBQTtpQkFDRSxLQUFDLENBQUEsY0FBRCxHQUFrQixlQURwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBSkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxNQUFELEdBQVcsQ0FBQyxtQkFBRCxFQUFzQixpQkFBdEIsRUFBeUMsZUFBekMsRUFBMEQsa0JBQTFELEVBQThFLGVBQTlFLEVBQStGLG9CQUEvRixFQUFxSCxlQUFySCxFQUFzSSxnQkFBdEksRUFSTDtJQUFBLENBTFY7QUFBQSxJQWVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURVO0lBQUEsQ0FmWjtBQUFBLElBa0JBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsSUFBQyxDQUFBLE1BQWhCO0FBQUEsUUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLFFBRUEsU0FBQSxFQUFXLElBRlg7QUFBQSxRQUdBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGNBQUEsc0NBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUFBLFVBQ0EsVUFBQSxHQUFhLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFFBQWpCLEVBQTJCLGFBQTNCLENBRGIsQ0FBQTtBQUFBLFVBRUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FGUCxDQUFBO0FBQUEsVUFHQSxVQUFBLEdBQWEsQ0FBRSxRQUFGLENBSGIsQ0FBQTtBQUtBLFVBQUEsSUFBRyxVQUFBLElBQWUsZUFBWSxVQUFaLEVBQUEsSUFBQSxLQUFsQjtBQUNFLFlBQUEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxNQUFYLENBQWtCLENBQUMsSUFBRCxFQUFPLFVBQVAsQ0FBbEIsQ0FBYixDQURGO1dBTEE7QUFRQSxpQkFBTyxPQUFPLENBQUMsUUFBUixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQWpCLEVBQW9FLFVBQXBFLEVBQWdGLEVBQWhGLENBQW1GLENBQUMsSUFBcEYsQ0FBeUYsU0FBQyxNQUFELEdBQUE7QUFFOUYsZ0JBQUEsTUFBQTtBQUFBLFlBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxLQUFSLENBQWMsTUFBZCxFQUFzQiwwREFBdEIsQ0FBVCxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsR0FBUCxDQUFXLFNBQUMsS0FBRCxHQUFBO0FBR1QsY0FBQSxJQUFHLEtBQUssQ0FBQyxJQUFLLFlBQVgsS0FBb0IsTUFBdkI7QUFDRSxnQkFBQSxLQUFLLENBQUMsSUFBTixHQUFhLFNBQWIsQ0FERjtlQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsSUFBSyxZQUFYLEtBQW9CLE1BQXZCO0FBQ0gsZ0JBQUEsS0FBSyxDQUFDLElBQU4sR0FBYSxPQUFiLENBREc7ZUFBQSxNQUFBO0FBR0gsZ0JBQUEsS0FBSyxDQUFDLElBQU4sR0FBYSxNQUFiLENBSEc7ZUFGTDtBQUFBLGNBUUEsS0FBSyxDQUFDLElBQU4sR0FBYSxLQUFLLENBQUMsSUFBSyxhQVJ4QixDQUFBO0FBQUEsY0FXQSxLQUFLLENBQUMsUUFBTixHQUFpQixRQVhqQixDQUFBO0FBY0EscUJBQU8sS0FBUCxDQWpCUztZQUFBLENBQVgsQ0FGQSxDQUFBO0FBcUJBLG1CQUFPLE1BQVAsQ0F2QjhGO1VBQUEsQ0FBekYsQ0FBUCxDQVRJO1FBQUEsQ0FITjtRQUhXO0lBQUEsQ0FsQmY7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/linter-htmlhint/lib/init.coffee
