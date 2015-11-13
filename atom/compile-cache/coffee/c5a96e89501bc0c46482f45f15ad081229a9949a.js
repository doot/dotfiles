(function() {
  var BufferedProcess, RepoListView, dir, getRepo, getRepoForCurrentFile, getSubmodule, gitAdd, gitCmd, gitDiff, gitRefresh, gitResetHead, gitStagedFiles, gitStatus, gitUnstagedFiles, gitUntrackedFiles, notifier, relativize, _getGitPath, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitCmd = function(_arg) {
    var args, c_stdout, command, cwd, error, exit, options, stderr, stdout, _ref;
    _ref = _arg != null ? _arg : {}, args = _ref.args, cwd = _ref.cwd, options = _ref.options, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit;
    command = _getGitPath();
    if (options == null) {
      options = {};
    }
    if (options.cwd == null) {
      options.cwd = cwd;
    }
    if (stderr == null) {
      stderr = function(data) {
        return notifier.addError(data.toString());
      };
    }
    if ((stdout != null) && (exit == null)) {
      c_stdout = stdout;
      stdout = function(data) {
        if (this.save == null) {
          this.save = '';
        }
        return this.save += data;
      };
      exit = function(exit) {
        c_stdout(this.save != null ? this.save : this.save = '');
        return this.save = null;
      };
    }
    try {
      return new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    } catch (_error) {
      error = _error;
      return notifier.addError('Git Plus is unable to locate git command. Please ensure process.env.PATH can access git.');
    }
  };

  gitStatus = function(repo, stdout) {
    return gitCmd({
      args: ['status', '--porcelain', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(data.length > 2 ? data.split('\0') : []);
      }
    });
  };

  gitStagedFiles = function(repo, stdout) {
    var files;
    files = [];
    return gitCmd({
      args: ['diff-index', '--cached', 'HEAD', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return files = _prettify(data);
      },
      stderr: function(data) {
        if (data.toString().includes("ambiguous argument 'HEAD'")) {
          return files = [1];
        } else {
          notifier.addError(data.toString());
          return files = [];
        }
      },
      exit: function(code) {
        return stdout(files);
      }
    });
  };

  gitUnstagedFiles = function(repo, _arg, stdout) {
    var showUntracked;
    showUntracked = (_arg != null ? _arg : {}).showUntracked;
    return gitCmd({
      args: ['diff-files', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data), stdout);
        } else {
          return stdout(_prettify(data));
        }
      }
    });
  };

  gitUntrackedFiles = function(repo, dataUnstaged, stdout) {
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    return gitCmd({
      args: ['ls-files', '-o', '--exclude-standard', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(dataUnstaged.concat(_prettifyUntracked(data)));
      }
    });
  };

  gitDiff = function(repo, path, stdout) {
    return gitCmd({
      args: ['diff', '-p', '-U1', path],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(_prettifyDiff(data));
      }
    });
  };

  gitRefresh = function() {
    atom.project.getRepositories().forEach(function(r) {
      return r != null ? r.refreshStatus() : void 0;
    });
    return gitCmd({
      args: ['add', '--refresh', '--', '.'],
      stderr: function(data) {}
    });
  };

  gitAdd = function(repo, _arg) {
    var args, exit, file, stderr, stdout, update, _ref;
    _ref = _arg != null ? _arg : {}, file = _ref.file, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit, update = _ref.update;
    args = ['add'];
    if (update) {
      args.push('--update');
    } else {
      args.push('--all');
    }
    if (file) {
      args.push(file);
    } else {
      '.';
    }
    if (exit == null) {
      exit = function(code) {
        if (code === 0) {
          return notifier.addSuccess("Added " + (file != null ? file : 'all files'));
        }
      };
    }
    return gitCmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: stdout != null ? stdout : void 0,
      stderr: stderr != null ? stderr : void 0,
      exit: exit
    });
  };

  gitResetHead = function(repo) {
    return gitCmd({
      args: ['reset', 'HEAD'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return notifier.addSuccess('All changes unstaged');
      }
    });
  };

  _getGitPath = function() {
    var p, _ref;
    p = (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git';
    console.log("Git-plus: Using git at", p);
    return p;
  };

  _prettify = function(data) {
    var files, i, mode;
    data = data.split('\0').slice(0, -1);
    return files = (function() {
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
    var file, files;
    if (data == null) {
      return [];
    }
    data = data.split('\0').slice(0, -1);
    return files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        file = data[_i];
        _results.push({
          mode: '?',
          path: file
        });
      }
      return _results;
    })();
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

  dir = function(andSubmodules) {
    if (andSubmodules == null) {
      andSubmodules = true;
    }
    return new Promise(function(resolve, reject) {
      var submodule;
      if (andSubmodules && (submodule = getSubmodule())) {
        return resolve(submodule.getWorkingDirectory());
      } else {
        return getRepo().then(function(repo) {
          return resolve(repo.getWorkingDirectory());
        });
      }
    });
  };

  relativize = function(path) {
    var _ref, _ref1, _ref2, _ref3;
    return (_ref = (_ref1 = (_ref2 = getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
  };

  getSubmodule = function(path) {
    var repo, _ref, _ref1, _ref2;
    if (path == null) {
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    }
    return repo = (_ref1 = atom.project.getRepositories().filter(function(r) {
      return r != null ? r.repo.submoduleForPath(path) : void 0;
    })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
  };

  getRepo = function() {
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

  module.exports.cmd = gitCmd;

  module.exports.stagedFiles = gitStagedFiles;

  module.exports.unstagedFiles = gitUnstagedFiles;

  module.exports.diff = gitDiff;

  module.exports.refresh = gitRefresh;

  module.exports.status = gitStatus;

  module.exports.reset = gitResetHead;

  module.exports.add = gitAdd;

  module.exports.dir = dir;

  module.exports.relativize = relativize;

  module.exports.getSubmodule = getSubmodule;

  module.exports.getRepo = getRepo;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb1JBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FGWCxDQUFBOztBQUFBLEVBY0EsTUFBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsUUFBQSx3RUFBQTtBQUFBLDBCQURRLE9BQTJDLElBQTFDLFlBQUEsTUFBTSxXQUFBLEtBQUssZUFBQSxTQUFTLGNBQUEsUUFBUSxjQUFBLFFBQVEsWUFBQSxJQUM3QyxDQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsV0FBQSxDQUFBLENBQVYsQ0FBQTs7TUFDQSxVQUFXO0tBRFg7O01BRUEsT0FBTyxDQUFDLE1BQU87S0FGZjs7TUFHQSxTQUFVLFNBQUMsSUFBRCxHQUFBO2VBQVUsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFsQixFQUFWO01BQUE7S0FIVjtBQUtBLElBQUEsSUFBRyxnQkFBQSxJQUFnQixjQUFuQjtBQUNFLE1BQUEsUUFBQSxHQUFXLE1BQVgsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLFNBQUMsSUFBRCxHQUFBOztVQUNQLElBQUMsQ0FBQSxPQUFRO1NBQVQ7ZUFDQSxJQUFDLENBQUEsSUFBRCxJQUFTLEtBRkY7TUFBQSxDQURULENBQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxTQUFDLElBQUQsR0FBQTtBQUNMLFFBQUEsUUFBQSxxQkFBUyxJQUFDLENBQUEsT0FBRCxJQUFDLENBQUEsT0FBUSxFQUFsQixDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBRkg7TUFBQSxDQUpQLENBREY7S0FMQTtBQWNBO2FBQ00sSUFBQSxlQUFBLENBQ0Y7QUFBQSxRQUFBLE9BQUEsRUFBUyxPQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLFFBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxRQUdBLE1BQUEsRUFBUSxNQUhSO0FBQUEsUUFJQSxNQUFBLEVBQVEsTUFKUjtBQUFBLFFBS0EsSUFBQSxFQUFNLElBTE47T0FERSxFQUROO0tBQUEsY0FBQTtBQVNFLE1BREksY0FDSixDQUFBO2FBQUEsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsMEZBQWxCLEVBVEY7S0FmTztFQUFBLENBZFQsQ0FBQTs7QUFBQSxFQXdDQSxTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sTUFBUCxHQUFBO1dBQ1YsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxRQUFELEVBQVcsYUFBWCxFQUEwQixJQUExQixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsTUFBQSxDQUFVLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakIsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQXhCLEdBQThDLEVBQXJELEVBQVY7TUFBQSxDQUZSO0tBREYsRUFEVTtFQUFBLENBeENaLENBQUE7O0FBQUEsRUE4Q0EsY0FBQSxHQUFpQixTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDZixRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7V0FDQSxNQUFBLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLFlBQUQsRUFBZSxVQUFmLEVBQTJCLE1BQTNCLEVBQW1DLGVBQW5DLEVBQW9ELElBQXBELENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7ZUFDTixLQUFBLEdBQVEsU0FBQSxDQUFVLElBQVYsRUFERjtNQUFBLENBRlI7QUFBQSxNQUlBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUVOLFFBQUEsSUFBRyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxRQUFoQixDQUF5QiwyQkFBekIsQ0FBSDtpQkFDRSxLQUFBLEdBQVEsQ0FBQyxDQUFELEVBRFY7U0FBQSxNQUFBO0FBR0UsVUFBQSxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWxCLENBQUEsQ0FBQTtpQkFDQSxLQUFBLEdBQVEsR0FKVjtTQUZNO01BQUEsQ0FKUjtBQUFBLE1BV0EsSUFBQSxFQUFNLFNBQUMsSUFBRCxHQUFBO2VBQVUsTUFBQSxDQUFPLEtBQVAsRUFBVjtNQUFBLENBWE47S0FERixFQUZlO0VBQUEsQ0E5Q2pCLENBQUE7O0FBQUEsRUE4REEsZ0JBQUEsR0FBbUIsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUEyQixNQUEzQixHQUFBO0FBQ2pCLFFBQUEsYUFBQTtBQUFBLElBRHlCLGdDQUFELE9BQWdCLElBQWYsYUFDekIsQ0FBQTtXQUFBLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsWUFBRCxFQUFlLGVBQWYsRUFBZ0MsSUFBaEMsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsSUFBRyxhQUFIO2lCQUNFLGlCQUFBLENBQWtCLElBQWxCLEVBQXdCLFNBQUEsQ0FBVSxJQUFWLENBQXhCLEVBQXlDLE1BQXpDLEVBREY7U0FBQSxNQUFBO2lCQUdFLE1BQUEsQ0FBTyxTQUFBLENBQVUsSUFBVixDQUFQLEVBSEY7U0FETTtNQUFBLENBRlI7S0FERixFQURpQjtFQUFBLENBOURuQixDQUFBOztBQUFBLEVBd0VBLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVAsRUFBd0IsTUFBeEIsR0FBQTs7TUFBTyxlQUFhO0tBQ3RDO1dBQUEsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixvQkFBbkIsRUFBd0MsSUFBeEMsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNOLE1BQUEsQ0FBTyxZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQixDQUFQLEVBRE07TUFBQSxDQUZSO0tBREYsRUFEa0I7RUFBQSxDQXhFcEIsQ0FBQTs7QUFBQSxFQStFQSxPQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLE1BQWIsR0FBQTtXQUNSLE1BQUEsQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxLQUFmLEVBQXNCLElBQXRCLENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7ZUFBVSxNQUFBLENBQU8sYUFBQSxDQUFjLElBQWQsQ0FBUCxFQUFWO01BQUEsQ0FGUjtLQURGLEVBRFE7RUFBQSxDQS9FVixDQUFBOztBQUFBLEVBcUZBLFVBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsU0FBQyxDQUFELEdBQUE7eUJBQU8sQ0FBQyxDQUFFLGFBQUgsQ0FBQSxXQUFQO0lBQUEsQ0FBdkMsQ0FBQSxDQUFBO1dBQ0EsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsV0FBUixFQUFxQixJQUFyQixFQUEyQixHQUEzQixDQUFOO0FBQUEsTUFDQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUEsQ0FEUjtLQURGLEVBRlc7RUFBQSxDQXJGYixDQUFBOztBQUFBLEVBMkZBLE1BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDUCxRQUFBLDhDQUFBO0FBQUEsMEJBRGMsT0FBcUMsSUFBcEMsWUFBQSxNQUFNLGNBQUEsUUFBUSxjQUFBLFFBQVEsWUFBQSxNQUFNLGNBQUEsTUFDM0MsQ0FBQTtBQUFBLElBQUEsSUFBQSxHQUFPLENBQUMsS0FBRCxDQUFQLENBQUE7QUFDQSxJQUFBLElBQUcsTUFBSDtBQUFlLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLENBQUEsQ0FBZjtLQUFBLE1BQUE7QUFBeUMsTUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBQSxDQUF6QztLQURBO0FBRUEsSUFBQSxJQUFHLElBQUg7QUFBYSxNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFBLENBQWI7S0FBQSxNQUFBO0FBQWlDLE1BQUEsR0FBQSxDQUFqQztLQUZBOztNQUdBLE9BQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLElBQUcsSUFBQSxLQUFRLENBQVg7aUJBQ0UsUUFBUSxDQUFDLFVBQVQsQ0FBcUIsUUFBQSxHQUFPLGdCQUFDLE9BQU8sV0FBUixDQUE1QixFQURGO1NBRE07TUFBQTtLQUhSO1dBTUEsTUFBQSxDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE1BQUEsRUFBa0IsY0FBVixHQUFBLE1BQUEsR0FBQSxNQUZSO0FBQUEsTUFHQSxNQUFBLEVBQWtCLGNBQVYsR0FBQSxNQUFBLEdBQUEsTUFIUjtBQUFBLE1BSUEsSUFBQSxFQUFNLElBSk47S0FERixFQVBPO0VBQUEsQ0EzRlQsQ0FBQTs7QUFBQSxFQXlHQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7V0FDYixNQUFBLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7ZUFDTixRQUFRLENBQUMsVUFBVCxDQUFvQixzQkFBcEIsRUFETTtNQUFBLENBRlI7S0FERixFQURhO0VBQUEsQ0F6R2YsQ0FBQTs7QUFBQSxFQWdIQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osUUFBQSxPQUFBO0FBQUEsSUFBQSxDQUFBLGlFQUEwQyxLQUExQyxDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLHdCQUFaLEVBQXNDLENBQXRDLENBREEsQ0FBQTtBQUVBLFdBQU8sQ0FBUCxDQUhZO0VBQUEsQ0FoSGQsQ0FBQTs7QUFBQSxFQXFIQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixRQUFBLGNBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFBeEIsQ0FBQTtXQUNBLEtBQUE7O0FBQWE7V0FBQSxzREFBQTt1QkFBQTtBQUNYLHNCQUFBO0FBQUEsVUFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLFVBQWEsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF4QjtVQUFBLENBRFc7QUFBQTs7U0FGSDtFQUFBLENBckhaLENBQUE7O0FBQUEsRUEwSEEsa0JBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFDbkIsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFpQixZQUFqQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FBQTtXQUVBLEtBQUE7O0FBQWE7V0FBQSwyQ0FBQTt3QkFBQTtBQUNYLHNCQUFBO0FBQUEsVUFBQyxJQUFBLEVBQU0sR0FBUDtBQUFBLFVBQVksSUFBQSxFQUFNLElBQWxCO1VBQUEsQ0FEVztBQUFBOztTQUhNO0VBQUEsQ0ExSHJCLENBQUE7O0FBQUEsRUFnSUEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLFFBQUEsVUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsMEJBQVgsQ0FBUCxDQUFBO0FBQUEsSUFDQTs7QUFBd0I7QUFBQTtXQUFBLDRDQUFBO3lCQUFBO0FBQUEsc0JBQUEsSUFBQSxHQUFPLEtBQVAsQ0FBQTtBQUFBOztRQUF4QixJQUF1QixJQUR2QixDQUFBO1dBRUEsS0FIYztFQUFBLENBaEloQixDQUFBOztBQUFBLEVBMElBLEdBQUEsR0FBTSxTQUFDLGFBQUQsR0FBQTs7TUFBQyxnQkFBYztLQUNuQjtXQUFJLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBRyxhQUFBLElBQWtCLENBQUEsU0FBQSxHQUFZLFlBQUEsQ0FBQSxDQUFaLENBQXJCO2VBQ0UsT0FBQSxDQUFRLFNBQVMsQ0FBQyxtQkFBVixDQUFBLENBQVIsRUFERjtPQUFBLE1BQUE7ZUFHRSxPQUFBLENBQUEsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFDLElBQUQsR0FBQTtpQkFBVSxPQUFBLENBQVEsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBUixFQUFWO1FBQUEsQ0FBZixFQUhGO09BRFU7SUFBQSxDQUFSLEVBREE7RUFBQSxDQTFJTixDQUFBOztBQUFBLEVBbUpBLFVBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFFBQUEseUJBQUE7OE5BQTZGLEtBRGxGO0VBQUEsQ0FuSmIsQ0FBQTs7QUFBQSxFQXVKQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixRQUFBLHdCQUFBOztNQUFBLG1FQUE0QyxDQUFFLE9BQXRDLENBQUE7S0FBUjtXQUNBLElBQUE7O3lEQUVVLENBQUUsZ0JBRkwsQ0FFc0IsSUFGdEIsb0JBRk07RUFBQSxDQXZKZixDQUFBOztBQUFBLEVBK0pBLE9BQUEsR0FBVSxTQUFBLEdBQUE7V0FDSixJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7YUFDVixxQkFBQSxDQUFBLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsU0FBQyxJQUFELEdBQUE7ZUFBVSxPQUFBLENBQVEsSUFBUixFQUFWO01BQUEsQ0FBN0IsQ0FDQSxDQUFDLE9BQUQsQ0FEQSxDQUNPLFNBQUMsQ0FBRCxHQUFBO0FBQ0wsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsQ0FBOEIsQ0FBQyxNQUEvQixDQUFzQyxTQUFDLENBQUQsR0FBQTtpQkFBTyxVQUFQO1FBQUEsQ0FBdEMsQ0FBUixDQUFBO0FBQ0EsUUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO2lCQUNFLE1BQUEsQ0FBTyxnQkFBUCxFQURGO1NBQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7aUJBQ0gsT0FBQSxDQUFRLEdBQUEsQ0FBQSxZQUFJLENBQWEsS0FBYixDQUFtQixDQUFDLE1BQWhDLEVBREc7U0FBQSxNQUFBO2lCQUdILE9BQUEsQ0FBUSxLQUFNLENBQUEsQ0FBQSxDQUFkLEVBSEc7U0FKQTtNQUFBLENBRFAsRUFEVTtJQUFBLENBQVIsRUFESTtFQUFBLENBL0pWLENBQUE7O0FBQUEsRUEyS0EscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQ2xCLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFVBQUEsOEJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBZixDQUFBO0FBQUEsTUFDQSxJQUFBLCtEQUEyQyxDQUFFLE9BQXRDLENBQUEsVUFEUCxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQUF3QixDQUFDLE1BQXpCLENBQWdDLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxJQUFYLEVBQVA7TUFBQSxDQUFoQyxDQUF5RCxDQUFBLENBQUEsQ0FGckUsQ0FBQTtBQUdBLE1BQUEsSUFBRyxpQkFBSDtlQUNFLE9BQU8sQ0FBQyxzQkFBUixDQUErQixTQUEvQixDQUF5QyxDQUFDLElBQTFDLENBQStDLFNBQUMsSUFBRCxHQUFBO0FBQzdDLGNBQUEsU0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQVYsQ0FBMkIsSUFBM0IsQ0FBWixDQUFBO0FBQ0EsVUFBQSxJQUFHLGlCQUFIO21CQUFtQixPQUFBLENBQVEsU0FBUixFQUFuQjtXQUFBLE1BQUE7bUJBQTJDLE9BQUEsQ0FBUSxJQUFSLEVBQTNDO1dBRjZDO1FBQUEsQ0FBL0MsQ0FHQSxDQUFDLE9BQUQsQ0FIQSxDQUdPLFNBQUMsQ0FBRCxHQUFBO2lCQUNMLE1BQUEsQ0FBTyxDQUFQLEVBREs7UUFBQSxDQUhQLEVBREY7T0FBQSxNQUFBO2VBT0UsTUFBQSxDQUFPLGlCQUFQLEVBUEY7T0FKVTtJQUFBLENBQVIsRUFEa0I7RUFBQSxDQTNLeEIsQ0FBQTs7QUFBQSxFQXlMQSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQWYsR0FBcUIsTUF6THJCLENBQUE7O0FBQUEsRUEwTEEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFmLEdBQTZCLGNBMUw3QixDQUFBOztBQUFBLEVBMkxBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixHQUErQixnQkEzTC9CLENBQUE7O0FBQUEsRUE0TEEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFmLEdBQXNCLE9BNUx0QixDQUFBOztBQUFBLEVBNkxBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixVQTdMekIsQ0FBQTs7QUFBQSxFQThMQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsU0E5THhCLENBQUE7O0FBQUEsRUErTEEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFmLEdBQXVCLFlBL0x2QixDQUFBOztBQUFBLEVBZ01BLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBZixHQUFxQixNQWhNckIsQ0FBQTs7QUFBQSxFQWlNQSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQWYsR0FBcUIsR0FqTXJCLENBQUE7O0FBQUEsRUFrTUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFmLEdBQTRCLFVBbE01QixDQUFBOztBQUFBLEVBbU1BLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBZixHQUE4QixZQW5NOUIsQ0FBQTs7QUFBQSxFQW9NQSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsT0FwTXpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/git.coffee
