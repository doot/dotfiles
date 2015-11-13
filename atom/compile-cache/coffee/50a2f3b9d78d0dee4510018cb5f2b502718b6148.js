(function() {
  var BufferedProcess, CompositeDisposable, LinterLiferay, XRegExp, _ref,
    __slice = [].slice;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  XRegExp = require('xregexp').XRegExp;

  LinterLiferay = (function() {
    LinterLiferay.prototype.grammarScopes = ['source.css.scss', 'source.css', 'source.js', 'source.velocity', 'text.html.jsp', 'text.html.mustache', 'text.html'];

    LinterLiferay.prototype.regex = 'Lines?\\s+(?<lineStart>\\d+)(?<lineEnd>\\-\\d+)?(?:,\\s+Column\\s+)?(?<col>\\d+)?:\\s+(?<message>.*)';

    LinterLiferay.prototype.regexFlags = 'i';

    function LinterLiferay() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-liferay.lintJS', (function(_this) {
        return function() {
          return _this.args = _this.formatArgs();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-liferay.checkSFPath', (function(_this) {
        return function() {
          return _this.cmd = atom.config.get('linter-liferay.checkSFPath');
        };
      })(this)));
    }

    LinterLiferay.prototype.formatArgs = function() {
      var args;
      args = ['--no-color', '--show-columns'];
      if (!atom.config.get('linter-liferay.lintJS')) {
        args.push('--no-lint');
      }
      return args;
    };

    LinterLiferay.prototype.getProvider = function() {
      var provider;
      return provider = {
        grammarScopes: this.grammarScopes,
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(editor) {
            _this.editor = editor;
            return _this.lint();
          };
        })(this)
      };
    };

    LinterLiferay.prototype.lint = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var output, process;
          output = [];
          process = new BufferedProcess({
            command: _this.cmd,
            args: __slice.call(_this.args).concat([_this.editor.getPath()]),
            stdout: function(data) {
              return output.push(data);
            },
            exit: function(code) {
              if (code !== 0) {
                return resolve([]);
              }
              return resolve(_this.getMessages(output.join('\n')));
            }
          });
          return process.onWillThrowError(function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            atom.notifications.addError("Cannot execute " + _this.cmd, {
              detail: error.message,
              dismissable: true
            });
            handle();
            return reject(error);
          });
        };
      })(this));
    };

    LinterLiferay.prototype.getMessages = function(output) {
      var messages, regex;
      messages = [];
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(output, regex, (function(_this) {
        return function(match, i) {
          return messages.push({
            filePath: _this.editor.getPath(),
            range: _this.computeRange(match),
            type: 'warning',
            text: match.message
          });
        };
      })(this));
      return messages;
    };

    LinterLiferay.prototype.computeRange = function(match) {
      var colEnd, colStart, rowEnd, rowEndLength, rowStart, _ref1, _ref2, _ref3;
      rowStart = match.lineStart;
      rowEnd = (_ref1 = match.lineEnd) != null ? _ref1 : rowStart;
      colStart = (_ref2 = match.col) != null ? _ref2 : 1;
      rowEndLength = (_ref3 = this.editor.lineTextForBufferRow(rowEnd - 1)) != null ? _ref3.length : void 0;
      colEnd = rowEndLength != null ? rowEndLength : 1;
      return [[--rowStart, --colStart], [--rowEnd, --colEnd]];
    };

    LinterLiferay.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    return LinterLiferay;

  })();

  module.exports = LinterLiferay;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWxpZmVyYXkvbGliL2xpbnRlci1saWZlcmF5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsU0FBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0wsNEJBQUEsYUFBQSxHQUFlLENBQ2QsaUJBRGMsRUFFZCxZQUZjLEVBR2QsV0FIYyxFQUlkLGlCQUpjLEVBS2QsZUFMYyxFQU1kLG9CQU5jLEVBT2QsV0FQYyxDQUFmLENBQUE7O0FBQUEsNEJBVUEsS0FBQSxHQUFPLHNHQVZQLENBQUE7O0FBQUEsNEJBWUEsVUFBQSxHQUFZLEdBWlosQ0FBQTs7QUFjYSxJQUFBLHVCQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix1QkFBcEIsRUFBNkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUMsQ0FBQSxVQUFELENBQUEsRUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw0QkFBcEIsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEUsS0FBQyxDQUFBLEdBQUQsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBRDZEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsQ0FBbkIsQ0FIQSxDQURZO0lBQUEsQ0FkYjs7QUFBQSw0QkFxQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsWUFBRCxFQUFlLGdCQUFmLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQWlDLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQTdCO0FBQUEsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsQ0FBQSxDQUFBO09BREE7YUFFQSxLQUhXO0lBQUEsQ0FyQlosQ0FBQTs7QUFBQSw0QkEwQkEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNaLFVBQUEsUUFBQTthQUFBLFFBQUEsR0FDQztBQUFBLFFBQUEsYUFBQSxFQUFlLElBQUMsQ0FBQSxhQUFoQjtBQUFBLFFBQ0EsS0FBQSxFQUFPLE1BRFA7QUFBQSxRQUVBLFNBQUEsRUFBVyxJQUZYO0FBQUEsUUFHQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLE1BQUQsR0FBQTtBQUNMLFlBQUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUZLO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FITjtRQUZXO0lBQUEsQ0ExQmIsQ0FBQTs7QUFBQSw0QkFvQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNELElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDWCxjQUFBLGVBQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxVQUVBLE9BQUEsR0FBYyxJQUFBLGVBQUEsQ0FDYjtBQUFBLFlBQUEsT0FBQSxFQUFTLEtBQUMsQ0FBQSxHQUFWO0FBQUEsWUFDQSxJQUFBLEVBQU8sYUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLFFBQVUsQ0FBQSxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBQVYsQ0FEUDtBQUFBLFlBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO3FCQUNQLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixFQURPO1lBQUEsQ0FGUjtBQUFBLFlBSUEsSUFBQSxFQUFNLFNBQUMsSUFBRCxHQUFBO0FBQ0wsY0FBQSxJQUF5QixJQUFBLEtBQVEsQ0FBakM7QUFBQSx1QkFBTyxPQUFBLENBQVEsRUFBUixDQUFQLENBQUE7ZUFBQTtxQkFDQSxPQUFBLENBQVEsS0FBQyxDQUFBLFdBQUQsQ0FBYSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBYixDQUFSLEVBRks7WUFBQSxDQUpOO1dBRGEsQ0FGZCxDQUFBO2lCQVdBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixTQUFDLElBQUQsR0FBQTtBQUN4QixnQkFBQSxhQUFBO0FBQUEsWUFEMEIsYUFBQSxPQUFPLGNBQUEsTUFDakMsQ0FBQTtBQUFBLFlBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE2QixpQkFBQSxHQUFpQixLQUFDLENBQUEsR0FBL0MsRUFDQztBQUFBLGNBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxPQUFkO0FBQUEsY0FDQSxXQUFBLEVBQWEsSUFEYjthQURELENBQUEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFBLENBSkEsQ0FBQTttQkFLQSxNQUFBLENBQU8sS0FBUCxFQU53QjtVQUFBLENBQXpCLEVBWlc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLEVBREM7SUFBQSxDQXBDTixDQUFBOztBQUFBLDRCQXlEQSxXQUFBLEdBQWEsU0FBQyxNQUFELEdBQUE7QUFDWixVQUFBLGVBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsSUFBQyxDQUFBLEtBQVQsRUFBZ0IsSUFBQyxDQUFBLFVBQWpCLENBRFIsQ0FBQTtBQUFBLE1BR0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLENBQVIsR0FBQTtpQkFDOUIsUUFBUSxDQUFDLElBQVQsQ0FDQztBQUFBLFlBQUEsUUFBQSxFQUFVLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQVY7QUFBQSxZQUNBLEtBQUEsRUFBTyxLQUFDLENBQUEsWUFBRCxDQUFjLEtBQWQsQ0FEUDtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLElBQUEsRUFBTSxLQUFLLENBQUMsT0FIWjtXQURELEVBRDhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsQ0FIQSxDQUFBO2FBVUEsU0FYWTtJQUFBLENBekRiLENBQUE7O0FBQUEsNEJBc0VBLFlBQUEsR0FBYyxTQUFDLEtBQUQsR0FBQTtBQUNiLFVBQUEscUVBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxLQUFLLENBQUMsU0FBakIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSw2Q0FBeUIsUUFEekIsQ0FBQTtBQUFBLE1BR0EsUUFBQSx5Q0FBdUIsQ0FIdkIsQ0FBQTtBQUFBLE1BTUEsWUFBQSx5RUFBdUQsQ0FBRSxlQU56RCxDQUFBO0FBQUEsTUFPQSxNQUFBLDBCQUFTLGVBQWUsQ0FQeEIsQ0FBQTthQVVBLENBQ0MsQ0FBQyxFQUFBLFFBQUQsRUFBYSxFQUFBLFFBQWIsQ0FERCxFQUVDLENBQUMsRUFBQSxNQUFELEVBQVcsRUFBQSxNQUFYLENBRkQsRUFYYTtJQUFBLENBdEVkLENBQUE7O0FBQUEsNEJBc0ZBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURRO0lBQUEsQ0F0RlQsQ0FBQTs7eUJBQUE7O01BSkQsQ0FBQTs7QUFBQSxFQTZGQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQTdGakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-liferay/lib/linter-liferay.coffee
