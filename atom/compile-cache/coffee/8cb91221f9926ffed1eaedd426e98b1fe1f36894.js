(function() {
  var BufferedProcess, Path, RepoListView, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  Path = require('flavored-path');

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard', '-z'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data) {
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

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/);
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, _ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, _ref;
      project = atom.project;
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options) {
      if (options == null) {
        options = {};
      }
      return new Promise(function(resolve, reject) {
        var output, _ref;
        output = '';
        try {
          return new BufferedProcess({
            command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
            args: args,
            options: options,
            stdout: function(data) {
              return output += data.toString();
            },
            stderr: function(data) {
              return reject(data.toString());
            },
            exit: function(code) {
              return resolve(output);
            }
          });
        } catch (_error) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        }
      });
    },
    getConfig: function(setting, workingDirectory) {
      if (workingDirectory == null) {
        workingDirectory = null;
      }
      if (workingDirectory != null) {
        return git.cmd(['config', '--get', setting], {
          cwd: workingDirectory
        });
      } else {
        return git.cmd(['config', '--get', setting], {
          cwd: Path.get('~')
        });
      }
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0');
        } else {
          return [];
        }
      });
    },
    refresh: function() {
      return atom.project.getRepositories().forEach(function(repo) {
        if (repo != null) {
          repo.refreshStatus();
          return git.cmd(['add', '--refresh', '--', '.'], {
            cwd: repo.getWorkingDirectory()
          });
        }
      });
    },
    relativize: function(path) {
      var _ref, _ref1, _ref2, _ref3;
      return (_ref = (_ref1 = (_ref2 = git.getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo, stdout) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data);
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, _arg) {
      var args, showUntracked;
      showUntracked = (_arg != null ? _arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data));
        } else {
          return _prettify(data);
        }
      });
    },
    add: function(repo, _arg) {
      var args, file, update, _ref;
      _ref = _arg != null ? _arg : {}, file = _ref.file, update = _ref.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          notifier.addSuccess("Added " + (file != null ? file : 'all files'));
          return true;
        }
      });
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getSubmodule: function(path) {
      var _ref, _ref1, _ref2;
      if (path == null) {
        path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      }
      return (_ref1 = atom.project.getRepositories().filter(function(r) {
        var _ref2;
        return r != null ? (_ref2 = r.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMElBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQU1BLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVAsR0FBQTtBQUNsQixRQUFBLElBQUE7O01BRHlCLGVBQWE7S0FDdEM7QUFBQSxJQUFBLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLG9CQUFuQixFQUF3QyxJQUF4QyxDQUFQLENBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQVUsWUFBWSxDQUFDLE1BQWIsQ0FBb0Isa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBcEIsRUFBVjtJQUFBLENBRE4sRUFGa0I7RUFBQSxDQU5wQixDQUFBOztBQUFBLEVBV0EsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsUUFBQSxPQUFBO0FBQUEsSUFBQSxJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/git.coffee
