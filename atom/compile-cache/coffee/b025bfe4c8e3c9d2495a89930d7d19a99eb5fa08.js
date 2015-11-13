(function() {
  var BufferedProcess, CompositeDisposable, XRegExp, path, writeGoodRe, _ref,
    __slice = [].slice;

  path = require('path');

  XRegExp = require('xregexp').XRegExp;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  writeGoodRe = '[^^]*(?<offset>\\^+)[^^]*\n(?<message>.+?) on line (?<line>\\d+) at column (?<col>\\d+)\n?';

  module.exports = {
    config: {
      writeGoodPath: {
        type: 'string',
        title: 'Path to the write-good executable. Defaults to a built-in write-good.',
        "default": path.join(__dirname, '..', 'node_modules', 'write-good', 'bin', 'write-good.js')
      },
      additionalArgs: {
        type: 'string',
        title: 'Additional arguments to pass to write-good.',
        "default": ''
      },
      nodePath: {
        type: 'string',
        title: 'Path to the node interpreter to use. Defaults to Atom\'s.',
        "default": path.join(atom.packages.getApmPath(), '..', 'node')
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-write-good.writeGoodPath', (function(_this) {
        return function(writeGoodPath) {
          return _this.writeGoodPath = writeGoodPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-write-good.nodePath', (function(_this) {
        return function(nodePath) {
          return _this.nodePath = nodePath;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-write-good.additionalArgs', (function(_this) {
        return function(additionalArgs) {
          return _this.additionalArgs = additionalArgs ? additionalArgs.split(' ') : [];
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        grammarScopes: ["source.gfm", "gfm.restructuredtext", "text.git-commit", "text.plain", "text.plain.null-grammar", "text.restructuredtext", "text.bibtex", "text.tex.latex", "text.tex.latex.beamer", "text.log.latex", "text.tex.latex.memoir", "text.tex"],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            return new Promise(function(resolve, reject) {
              var filePath, output, process;
              filePath = textEditor.getPath();
              output = "";
              process = new BufferedProcess({
                command: _this.nodePath,
                args: [_this.writeGoodPath, filePath].concat(__slice.call(_this.additionalArgs)),
                stdout: function(data) {
                  return output += data;
                },
                exit: function(code) {
                  var messages, regex;
                  messages = [];
                  regex = XRegExp(writeGoodRe, this.regexFlags);
                  XRegExp.forEach(output, regex, function(match, i) {
                    match.colStart = parseInt(match.col);
                    match.lineStart = parseInt(match.line) - 1;
                    match.colEnd = match.colStart + match.offset.length;
                    return messages.push({
                      type: 'Error',
                      text: match.message,
                      filePath: filePath,
                      range: [[match.lineStart, match.colStart], [match.lineStart, match.colEnd]]
                    });
                  });
                  return resolve(messages);
                }
              });
              return process.onWillThrowError(function(_arg) {
                var error, handle;
                error = _arg.error, handle = _arg.handle;
                atom.notifications.addError("Failed to run " + this.nodePath + " " + this.writeGoodPath, {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXdyaXRlLWdvb2QvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsU0FBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUVBLE9BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsdUJBQUEsZUFBRCxFQUFrQiwyQkFBQSxtQkFGbEIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyw0RkFKZCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sdUVBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsWUFBM0MsRUFBeUQsS0FBekQsRUFBZ0UsZUFBaEUsQ0FGVDtPQURGO0FBQUEsTUFJQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sNkNBRFA7QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO09BTEY7QUFBQSxNQVFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTywyREFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFkLENBQUEsQ0FBVixFQUFzQyxJQUF0QyxF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

//# sourceURL=/Users/doot/.atom/packages/linter-write-good/lib/init.coffee
