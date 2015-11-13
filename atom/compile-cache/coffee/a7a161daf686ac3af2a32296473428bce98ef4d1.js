(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile, splitPane,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "removed:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    message = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return message.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    return [message.join('\n'), prevChangedFiles];
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ").replace("committed:\n" + commentchar, "committed:\n" + (prevChangedFiles.map(function(f) {
        return "" + commentchar + "   " + f;
      }).join("\n")));
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
  };

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.alive) {
      currentPane.activate();
    }
    disposables.dispose();
    try {
      return fs.unlinkSync(filePath);
    } catch (_error) {}
  };

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getStagedFiles(repo).then(function(files) {
        return [message, prettifyFileStatuses(diffFiles(prevChangedFiles, files))];
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LWFtZW5kLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwUUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBTFosQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBUGQsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFFBQUEsT0FBQTtBQUFBLElBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEVBQVAsQ0FBQTtLQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLGFBRHhCLENBQUE7OztBQUVLO1dBQUEsc0RBQUE7dUJBQUE7QUFDSCxzQkFBQTtBQUFBLFVBQUMsTUFBQSxJQUFEO0FBQUEsVUFBTyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWxCO1VBQUEsQ0FERztBQUFBOztTQUhlO0VBQUEsQ0FUdEIsQ0FBQTs7QUFBQSxFQWVBLHFCQUFBLEdBQXdCLFNBQUMsSUFBRCxHQUFBO1dBQ3RCO0FBQUEsTUFB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
