(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, TextEditor, XRegExp, fs, path, tmp, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess, TextEditor = _ref.TextEditor;

  path = require('path');

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = true;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(new Error(data.stderr.join('')));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else if (options.stream === 'both') {
            return resolve({
              stdout: data.stdout.join(''),
              stderr: data.stderr.join('')
            });
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            if (error && error.code === 'ENOENT') {
              return reject(error);
            }
            handle();
            if (error.code === 'EACCES') {
              error = new Error("Failed to spawn command `" + command + "`. Make sure it's a file, not a directory and it's executable.");
              error.name = 'BufferedProcessError';
            }
            return reject(error);
          };
        })(this));
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    rangeFromLineNumber: function(textEditor, lineNumber, colStart) {
      if (!(textEditor instanceof TextEditor)) {
        throw new Error('Provided text editor is invalid');
      }
      if (typeof lineNumber === 'undefined') {
        throw new Error('Invalid lineNumber provided');
      }
      if (typeof colStart !== 'number') {
        colStart = textEditor.indentationForBufferRow(lineNumber) * textEditor.getTabLength();
      }
      return [[lineNumber, colStart], [lineNumber, textEditor.getBuffer().lineLengthForRow(lineNumber)]];
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {
          baseReduction: 1
        };
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length && startDir.join(path.sep)) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    },
    tempFile: function(fileName, fileContents, callback) {
      if (typeof fileName !== 'string') {
        throw new Error('Invalid fileName provided');
      }
      if (typeof fileContents !== 'string') {
        throw new Error('Invalid fileContent provided');
      }
      if (typeof callback !== 'function') {
        throw new Error('Invalid Callback provided');
      }
      return new Promise(function(resolve, reject) {
        return tmp.dir({
          prefix: 'atom-linter_'
        }, function(err, dirPath, cleanupCallback) {
          var filePath;
          if (err) {
            return reject(err);
          }
          filePath = path.join(dirPath, fileName);
          return fs.writeFile(filePath, fileContents, function(err) {
            if (err) {
              cleanupCallback();
              return reject(err);
            }
            return (new Promise(function(resolve) {
              return resolve(callback(filePath));
            })).then(function(result) {
              fs.unlink(filePath, function() {
                return fs.rmdir(dirPath);
              });
              return result;
            }).then(resolve, reject);
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWphdmFjL25vZGVfbW9kdWxlcy9hdG9tLWxpbnRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0ZBQUE7O0FBQUEsRUFBQSxPQUFxRCxPQUFBLENBQVEsTUFBUixDQUFyRCxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBQWxCLEVBQXVDLGtCQUFBLFVBQXZDLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxHQU5ULENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsSUFQVixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUlmO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxPQUFELEVBQVUsSUFBVixFQUFxQixPQUFyQixHQUFBOztRQUFVLE9BQU87T0FDckI7O1FBRHlCLFVBQVU7T0FDbkM7QUFBQSxNQUFBLElBQUEsQ0FBQSxTQUFzRCxDQUFDLE1BQXZEO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSxxQkFBTixDQUFWLENBQUE7T0FBQTtBQUNBLGFBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQLEVBQWdCLElBQWhCLEVBQXNCLE9BQXRCLEVBQStCLEtBQS9CLENBQVAsQ0FGSTtJQUFBLENBQU47QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLFFB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

//# sourceURL=/Users/doot/.atom/packages/linter-javac/node_modules/atom-linter/lib/helpers.coffee
