(function() {
  var BufferedProcess, CompositeDisposable, cpConfigFileName, fs, helpers, path, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  helpers = require('atom-linter');

  fs = require('fs');

  cpConfigFileName = '.classpath';

  module.exports = {
    config: {
      javaExecutablePath: {
        type: 'string',
        title: 'Path to the javac executable',
        "default": 'javac'
      },
      classpath: {
        type: 'string',
        title: "Extra classpath for javac",
        "default": ''
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-javac');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-javac.javaExecutablePath', (function(_this) {
        return function(newValue) {
          return _this.javaExecutablePath = newValue;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-javac.classpath', (function(_this) {
        return function(newValue) {
          return _this.classpath = newValue.trim();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      return {
        grammarScopes: ['source.java'],
        scope: 'project',
        lintOnFly: false,
        lint: (function(_this) {
          return function(textEditor) {
            var args, cp, cpConfig, filePath, files, wd;
            filePath = textEditor.getPath();
            wd = path.dirname(filePath);
            files = _this.getFilesEndingWith(_this.getProjectRootDir(), ".java");
            cp = null;
            cpConfig = _this.findClasspathConfig(wd);
            if (cpConfig != null) {
              wd = cpConfig.cfgDir;
              cp = cpConfig.cfgCp;
            }
            if (_this.classpath) {
              cp += path.delimiter + _this.classpath;
            }
            if (process.env.CLASSPATH) {
              cp += path.delimiter + process.env.CLASSPATH;
            }
            args = ['-Xlint:all'];
            if (cp != null) {
              args = args.concat(['-cp', cp]);
            }
            args.push.apply(args, files);
            return helpers.exec(_this.javaExecutablePath, args, {
              stream: 'stderr',
              cwd: wd
            }).then(function(val) {
              return _this.parse(val, textEditor);
            });
          };
        })(this)
      };
    },
    parse: function(javacOutput, textEditor) {
      var caretRegex, column, errRegex, file, line, lineNum, lines, mess, messages, type, _i, _len, _ref1;
      errRegex = /^(.*\.java):(\d+): ([\w \-]+): (.+)/;
      caretRegex = /^( *)\^/;
      lines = javacOutput.split(/\r?\n/);
      messages = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.match(errRegex)) {
          _ref1 = line.match(errRegex).slice(1, 5), file = _ref1[0], lineNum = _ref1[1], type = _ref1[2], mess = _ref1[3];
          messages.push({
            type: type,
            text: mess,
            filePath: file,
            range: [[lineNum - 1, 0], [lineNum - 1, 0]]
          });
        } else if (line.match(caretRegex)) {
          column = line.match(caretRegex)[1].length;
          if (messages.length > 0) {
            messages[messages.length - 1].range[0][1] = column;
            messages[messages.length - 1].range[1][1] = column + 1;
          }
        }
      }
      return messages;
    },
    getProjectRootDir: function() {
      return atom.project.rootDirectories[0].path;
    },
    getFilesEndingWith: function(startPath, endsWith) {
      var filename, files, foundFiles, i, stat;
      foundFiles = [];
      if (!fs.existsSync(startPath)) {
        return foundFiles;
      }
      files = fs.readdirSync(startPath);
      i = 0;
      while (i < files.length) {
        filename = path.join(startPath, files[i]);
        stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
          foundFiles.push.apply(foundFiles, this.getFilesEndingWith(filename, endsWith));
        } else if (filename.indexOf(endsWith, filename.length - endsWith.length) >= 0) {
          foundFiles.push.apply(foundFiles, [filename]);
        }
        i++;
      }
      return foundFiles;
    },
    findClasspathConfig: function(d) {
      var e, result;
      while (atom.project.contains(d) || (__indexOf.call(atom.project.getPaths(), d) >= 0)) {
        try {
          result = {
            cfgCp: fs.readFileSync(path.join(d, cpConfigFileName), {
              encoding: 'utf-8'
            }),
            cfgDir: d
          };
          result.cfgCp = result.cfgCp.trim();
          return result;
        } catch (_error) {
          e = _error;
          d = path.dirname(d);
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWphdmFjL2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsT0FBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLDJCQUFBLG1CQUFsQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsWUFKbkIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyw4QkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLE9BRlQ7T0FERjtBQUFBLE1BSUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLDJCQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtPQUxGO0tBREY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLGNBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlDQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7aUJBQ0UsS0FBQyxDQUFBLGtCQUFELEdBQXNCLFNBRHhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FGQSxDQUFBO2FBS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix3QkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO2lCQUNFLEtBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLElBQVQsQ0FBQSxFQURmO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsRUFOUTtJQUFBLENBVlY7QUFBQSxJQW9CQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBcEJaO0FBQUEsSUF1QkEsYUFBQSxFQUFlLFNBQUEsR0FBQTthQUNiO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQyxhQUFELENBQWY7QUFBQSxRQUNBLEtBQUEsRUFBTyxTQURQO0FBQUEsUUFFQSxTQUFBLEVBQVcsS0FGWDtBQUFBLFFBR0EsSUFBQSxFQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxVQUFELEdBQUE7QUFDSixnQkFBQSx1Q0FBQTtBQUFBLFlBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBWCxDQUFBO0FBQUEsWUFDQSxFQUFBLEdBQUssSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBREwsQ0FBQTtBQUFBLFlBRUEsS0FBQSxHQUFRLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixLQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFwQixFQUEwQyxPQUExQyxDQUZSLENBQUE7QUFBQSxZQUlBLEVBQUEsR0FBSyxJQUpMLENBQUE7QUFBQSxZQU9BLFFBQUEsR0FBVyxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsRUFBckIsQ0FQWCxDQUFBO0FBUUEsWUFBQSxJQUFHLGdCQUFIO0FBRUUsY0FBQSxFQUFBLEdBQUssUUFBUSxDQUFDLE1BQWQsQ0FBQTtBQUFBLGNBRUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxLQUZkLENBRkY7YUFSQTtBQWVBLFlBQUEsSUFBcUMsS0FBQyxDQUFBLFNBQXRDO0FBQUEsY0FBQSxFQUFBLElBQU0sSUFBSSxDQUFDLFNBQUwsR0FBaUIsS0FBQyxDQUFBLFNBQXhCLENBQUE7YUFmQTtBQWtCQSxZQUFBLElBQWdELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBNUQ7QUFBQSxjQUFBLEVBQUEsSUFBTSxJQUFJLENBQUMsU0FBTCxHQUFpQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQW5DLENBQUE7YUFsQkE7QUFBQSxZQXFCQSxJQUFBLEdBQU8sQ0FBQyxZQUFELENBckJQLENBQUE7QUFzQkEsWUFBQSxJQUFtQyxVQUFuQztBQUFBLGNBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBQyxLQUFELEVBQVEsRUFBUixDQUFaLENBQVAsQ0FBQTthQXRCQTtBQUFBLFlBdUJBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBVixDQUFnQixJQUFoQixFQUFzQixLQUF0QixDQXZCQSxDQUFBO21CQTBCQSxPQUFPLENBQUMsSUFBUixDQUFhLEtBQUMsQ0FBQSxrQkFBZCxFQUFrQyxJQUFsQyxFQUF3QztBQUFBLGNBQUMsTUFBQSxFQUFRLFFBQVQ7QUFBQSxjQUFtQixHQUFBLEVBQUssRUFBeEI7YUFBeEMsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLEdBQUQsR0FBQTtBQUFTLHFCQUFPLEtBQUMsQ0FBQSxLQUFELENBQU8sR0FBUCxFQUFZLFVBQVosQ0FBUCxDQUFUO1lBQUEsQ0FEUixFQTNCSTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSE47UUFEYTtJQUFBLENBdkJmO0FBQUEsSUF5REEsS0FBQSxFQUFPLFNBQUMsV0FBRCxFQUFjLFVBQWQsR0FBQTtBQUVMLFVBQUEsK0ZBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxxQ0FBWCxDQUFBO0FBQUEsTUFHQSxVQUFBLEdBQWEsU0FIYixDQUFBO0FBQUEsTUFLQSxLQUFBLEdBQVEsV0FBVyxDQUFDLEtBQVosQ0FBa0IsT0FBbEIsQ0FMUixDQUFBO0FBQUEsTUFNQSxRQUFBLEdBQVcsRUFOWCxDQUFBO0FBT0EsV0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsSUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVgsQ0FBSDtBQUNFLFVBQUEsUUFBOEIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFYLENBQXFCLFlBQW5ELEVBQUMsZUFBRCxFQUFPLGtCQUFQLEVBQWdCLGVBQWhCLEVBQXNCLGVBQXRCLENBQUE7QUFBQSxVQUNBLFFBQVEsQ0FBQyxJQUFULENBQ0U7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLFlBRUEsUUFBQSxFQUFVLElBRlY7QUFBQSxZQUdBLEtBQUEsRUFBTyxDQUFDLENBQUMsT0FBQSxHQUFVLENBQVgsRUFBYyxDQUFkLENBQUQsRUFBbUIsQ0FBQyxPQUFBLEdBQVUsQ0FBWCxFQUFjLENBQWQsQ0FBbkIsQ0FIUDtXQURGLENBREEsQ0FERjtTQUFBLE1BT0ssSUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQVgsQ0FBSDtBQUNILFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUF1QixDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQW5DLENBQUE7QUFDQSxVQUFBLElBQUcsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBckI7QUFDRSxZQUFBLFFBQVMsQ0FBQSxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFsQixDQUFvQixDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQXZDLEdBQTRDLE1BQTVDLENBQUE7QUFBQSxZQUNBLFFBQVMsQ0FBQSxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFsQixDQUFvQixDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQXZDLEdBQTRDLE1BQUEsR0FBUyxDQURyRCxDQURGO1dBRkc7U0FSUDtBQUFBLE9BUEE7QUFvQkEsYUFBTyxRQUFQLENBdEJLO0lBQUEsQ0F6RFA7QUFBQSxJQWlGQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWdCLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBdkMsQ0FEaUI7SUFBQSxDQWpGbkI7QUFBQSxJQW9GQSxrQkFBQSxFQUFvQixTQUFDLFNBQUQsRUFBWSxRQUFaLEdBQUE7QUFDbEIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLEVBQUcsQ0FBQyxVQUFILENBQWMsU0FBZCxDQUFKO0FBQ0UsZUFBTyxVQUFQLENBREY7T0FEQTtBQUFBLE1BR0EsS0FBQSxHQUFRLEVBQUUsQ0FBQyxXQUFILENBQWUsU0FBZixDQUhSLENBQUE7QUFBQSxNQUlBLENBQUEsR0FBSSxDQUpKLENBQUE7QUFLQSxhQUFNLENBQUEsR0FBSSxLQUFLLENBQUMsTUFBaEIsR0FBQTtBQUNFLFFBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixLQUFNLENBQUEsQ0FBQSxDQUEzQixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsQ0FEUCxDQUFBO0FBRUEsUUFBQSxJQUFHLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBSDtBQUNFLFVBQUEsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFoQixDQUFzQixVQUF0QixFQUFrQyxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUIsQ0FBbEMsQ0FBQSxDQURGO1NBQUEsTUFFSyxJQUFHLFFBQVEsQ0FBQyxPQUFULENBQWlCLFFBQWpCLEVBQTJCLFFBQVEsQ0FBQyxNQUFULEdBQW1CLFFBQVEsQ0FBQyxNQUF2RCxDQUFBLElBQW1FLENBQXRFO0FBQ0gsVUFBQSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQWhCLENBQXNCLFVBQXRCLEVBQWtDLENBQUMsUUFBRCxDQUFsQyxDQUFBLENBREc7U0FKTDtBQUFBLFFBT0EsQ0FBQSxFQVBBLENBREY7TUFBQSxDQUxBO0FBY0EsYUFBTyxVQUFQLENBZmtCO0lBQUEsQ0FwRnBCO0FBQUEsSUFzR0EsbUJBQUEsRUFBcUIsU0FBQyxDQUFELEdBQUE7QUFJbkIsVUFBQSxTQUFBO0FBQUEsYUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBQSxJQUE0QixDQUFDLGVBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBTCxFQUFBLENBQUEsTUFBRCxDQUFsQyxHQUFBO0FBQ0U7QUFDRSxVQUFBLE1BQUEsR0FDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxZQUFILENBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLGdCQUFiLENBQWpCLEVBQWlEO0FBQUEsY0FBRSxRQUFBLEVBQVUsT0FBWjthQUFqRCxDQUFQO0FBQUEsWUFDQSxNQUFBLEVBQVEsQ0FEUjtXQURGLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQUEsQ0FIZixDQUFBO0FBSUEsaUJBQU8sTUFBUCxDQUxGO1NBQUEsY0FBQTtBQU9FLFVBREksVUFDSixDQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLENBQUosQ0FQRjtTQURGO01BQUEsQ0FBQTtBQVVBLGFBQU8sSUFBUCxDQWRtQjtJQUFBLENBdEdyQjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-javac/lib/init.coffee
