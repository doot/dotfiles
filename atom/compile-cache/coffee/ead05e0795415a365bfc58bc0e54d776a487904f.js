(function() {
  var atomRefresh, callGit, cwd, fs, getBranches, git, logcb, noop, parseDefault, parseDiff, parseStatus, path, project, q, repo;

  fs = require('fs');

  path = require('path');

  git = require('git-promise');

  q = require('q');

  logcb = function(log, error) {
    return console[error ? 'error' : 'log'](log);
  };

  repo = void 0;

  cwd = void 0;

  project = atom.project;

  if (project) {
    repo = project.getRepositories()[0];
    cwd = repo ? repo.getWorkingDirectory() : void 0;
  }

  noop = function() {
    return q.fcall(function() {
      return true;
    });
  };

  atomRefresh = function() {
    repo.refreshStatus();
  };

  getBranches = function() {
    return q.fcall(function() {
      var branches, h, refs, _i, _j, _len, _len1, _ref, _ref1;
      branches = {
        local: [],
        remote: [],
        tags: []
      };
      refs = repo.getReferences();
      _ref = refs.heads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        branches.local.push(h.replace('refs/heads/', ''));
      }
      _ref1 = refs.remotes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        h = _ref1[_j];
        branches.remote.push(h.replace('refs/remotes/', ''));
      }
      return branches;
    });
  };

  parseDiff = function(data) {
    return q.fcall(function() {
      var diff, diffs, line, _i, _len, _ref;
      diffs = [];
      diff = {};
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.length) {
          switch (false) {
            case !/^diff --git /.test(line):
              diff = {
                lines: [],
                added: 0,
                removed: 0
              };
              diff['diff'] = line.replace(/^diff --git /, '');
              diffs.push(diff);
              break;
            case !/^index /.test(line):
              diff['index'] = line.replace(/^index /, '');
              break;
            case !/^--- /.test(line):
              diff['---'] = line.replace(/^--- [a|b]\//, '');
              break;
            case !/^\+\+\+ /.test(line):
              diff['+++'] = line.replace(/^\+\+\+ [a|b]\//, '');
              break;
            default:
              diff['lines'].push(line);
              if (/^\+/.test(line)) {
                diff['added']++;
              }
              if (/^-/.test(line)) {
                diff['removed']++;
              }
          }
        }
      }
      return diffs;
    });
  };

  parseStatus = function(data) {
    return q.fcall(function() {
      var files, line, name, type, _i, _len, _ref, _ref1;
      files = [];
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (!line.length) {
          continue;
        }
        _ref1 = line.replace(/\ \ /g, ' ').trim().split(' '), type = _ref1[0], name = _ref1[1];
        files.push({
          name: name,
          selected: (function() {
            switch (type[type.length - 1]) {
              case 'C':
              case 'M':
              case 'R':
              case 'D':
              case 'A':
                return true;
              default:
                return false;
            }
          })(),
          type: (function() {
            switch (type[type.length - 1]) {
              case 'A':
                return 'added';
              case 'C':
                return 'modified';
              case 'D':
                return 'deleted';
              case 'M':
                return 'modified';
              case 'R':
                return 'modified';
              case 'U':
                return 'conflict';
              case '?':
                return 'new';
              default:
                return 'unknown';
            }
          })()
        });
      }
      return files;
    });
  };

  parseDefault = function(data) {
    return q.fcall(function() {
      return true;
    });
  };

  callGit = function(cmd, parser, nodatalog) {
    logcb("> git " + cmd);
    return git(cmd, {
      cwd: cwd
    }).then(function(data) {
      if (!nodatalog) {
        logcb(data);
      }
      return parser(data);
    }).fail(function(e) {
      logcb(e.stdout, true);
      logcb(e.message, true);
    });
  };

  module.exports = {
    isInitialised: function() {
      return cwd;
    },
    alert: function(text) {
      logcb(text);
    },
    setLogger: function(cb) {
      logcb = cb;
    },
    count: function(branch) {
      return repo.getAheadBehindCount(branch);
    },
    getLocalBranch: function() {
      return repo.getShortHead();
    },
    getRemoteBranch: function() {
      return repo.getUpstreamBranch();
    },
    isMerging: function() {
      return fs.existsSync(path.join(repo.path, 'MERGE_HEAD'));
    },
    getBranches: getBranches,
    hasRemotes: function() {
      var refs;
      refs = repo.getReferences();
      return refs && refs.remotes && refs.remotes.length;
    },
    hasOrigin: function() {
      return repo.getOriginURL() !== null;
    },
    add: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("add -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    commit: function(message) {
      message = message || Date.now();
      message = message.replace(/"/g, '\\"');
      return callGit("commit -m \"" + message + "\"", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    checkout: function(branch, remote) {
      return callGit("checkout " + (remote ? '--track ' : '') + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    createBranch: function(branch) {
      return callGit("branch " + branch, function(data) {
        return callGit("checkout " + branch, function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      });
    },
    deleteBranch: function(branch) {
      return callGit("branch -d " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    forceDeleteBranch: function(branch) {
      return callGit("branch -D " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    diff: function(file) {
      return callGit("--no-pager diff " + (file || ''), parseDiff, true);
    },
    fetch: function() {
      return callGit("fetch --prune", parseDefault);
    },
    merge: function(branch, noff) {
      var noffOutput;
      noffOutput = noff ? "--no-ff" : "";
      return callGit("merge " + noffOutput + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    pull: function() {
      return callGit("pull", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    flow: function(type, action, branch) {
      return callGit("flow " + type + " " + action + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    push: function(remote, branch) {
      var cmd;
      cmd = "-c push.default=simple push " + remote + " " + branch + " --porcelain";
      return callGit(cmd, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    log: function(branch) {
      return callGit("log origin/" + (repo.getUpstreamBranch() || 'master') + ".." + branch, parseDefault);
    },
    reset: function(files) {
      return callGit("checkout -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    remove: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("rm -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(true);
      });
    },
    status: function() {
      return callGit('status --porcelain --untracked-files=all', parseStatus);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL2dpdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEhBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsYUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FKSixDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLFNBQUMsR0FBRCxFQUFNLEtBQU4sR0FBQTtXQUNOLE9BQVEsQ0FBRyxLQUFILEdBQWMsT0FBZCxHQUEyQixLQUEzQixDQUFSLENBQTBDLEdBQTFDLEVBRE07RUFBQSxDQU5SLENBQUE7O0FBQUEsRUFTQSxJQUFBLEdBQU8sTUFUUCxDQUFBOztBQUFBLEVBVUEsR0FBQSxHQUFNLE1BVk4sQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FYZixDQUFBOztBQWFBLEVBQUEsSUFBRyxPQUFIO0FBQ0UsSUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLGVBQVIsQ0FBQSxDQUEwQixDQUFBLENBQUEsQ0FBakMsQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFTLElBQUgsR0FBYSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFiLEdBQUEsTUFETixDQURGO0dBYkE7O0FBQUEsRUFtQkEsSUFBQSxHQUFPLFNBQUEsR0FBQTtXQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBQVIsRUFBSDtFQUFBLENBbkJQLENBQUE7O0FBQUEsRUFxQkEsV0FBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLElBQUEsSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFBLENBRFk7RUFBQSxDQXJCZCxDQUFBOztBQUFBLEVBeUJBLFdBQUEsR0FBYyxTQUFBLEdBQUE7V0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLFNBQUEsR0FBQTtBQUN2QixVQUFBLG1EQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVc7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsUUFBVyxNQUFBLEVBQVEsRUFBbkI7QUFBQSxRQUF1QixJQUFBLEVBQU0sRUFBN0I7T0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQURQLENBQUE7QUFHQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRSxRQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBZixDQUFvQixDQUFDLENBQUMsT0FBRixDQUFVLGFBQVYsRUFBeUIsRUFBekIsQ0FBcEIsQ0FBQSxDQURGO0FBQUEsT0FIQTtBQU1BO0FBQUEsV0FBQSw4Q0FBQTtzQkFBQTtBQUNFLFFBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFoQixDQUFxQixDQUFDLENBQUMsT0FBRixDQUFVLGVBQVYsRUFBMkIsRUFBM0IsQ0FBckIsQ0FBQSxDQURGO0FBQUEsT0FOQTtBQVNBLGFBQU8sUUFBUCxDQVZ1QjtJQUFBLENBQVIsRUFBSDtFQUFBLENBekJkLENBQUE7O0FBQUEsRUFxQ0EsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO1dBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFBLEdBQUE7QUFDNUIsVUFBQSxpQ0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUVBO0FBQUEsV0FBQSwyQ0FBQTt3QkFBQTtZQUFrQyxJQUFJLENBQUM7QUFDckMsa0JBQUEsS0FBQTtBQUFBLGtCQUNPLGNBQWMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBRFA7QUFFSSxjQUFBLElBQUEsR0FDRTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsZ0JBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxnQkFFQSxPQUFBLEVBQVMsQ0FGVDtlQURGLENBQUE7QUFBQSxjQUlBLElBQUssQ0FBQSxNQUFBLENBQUwsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsRUFBNkIsRUFBN0IsQ0FKZixDQUFBO0FBQUEsY0FLQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FMQSxDQUZKOztBQUFBLGtCQVFPLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQVJQO0FBU0ksY0FBQSxJQUFLLENBQUEsT0FBQSxDQUFMLEdBQWdCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixFQUF4QixDQUFoQixDQVRKOztBQUFBLGtCQVVPLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYixDQVZQO0FBV0ksY0FBQSxJQUFLLENBQUEsS0FBQSxDQUFMLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxjQUFiLEVBQTZCLEVBQTdCLENBQWQsQ0FYSjs7QUFBQSxrQkFZTyxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFoQixDQVpQO0FBYUksY0FBQSxJQUFLLENBQUEsS0FBQSxDQUFMLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBYixFQUFnQyxFQUFoQyxDQUFkLENBYko7O0FBQUE7QUFlSSxjQUFBLElBQUssQ0FBQSxPQUFBLENBQVEsQ0FBQyxJQUFkLENBQW1CLElBQW5CLENBQUEsQ0FBQTtBQUNBLGNBQUEsSUFBbUIsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLENBQW5CO0FBQUEsZ0JBQUEsSUFBSyxDQUFBLE9BQUEsQ0FBTCxFQUFBLENBQUE7ZUFEQTtBQUVBLGNBQUEsSUFBcUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQXJCO0FBQUEsZ0JBQUEsSUFBSyxDQUFBLFNBQUEsQ0FBTCxFQUFBLENBQUE7ZUFqQko7QUFBQTtTQURGO0FBQUEsT0FGQTtBQXNCQSxhQUFPLEtBQVAsQ0F2QjRCO0lBQUEsQ0FBUixFQUFWO0VBQUEsQ0FyQ1osQ0FBQTs7QUFBQSxFQThEQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7V0FBVSxDQUFDLENBQUMsS0FBRixDQUFRLFNBQUEsR0FBQTtBQUM5QixVQUFBLDhDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO2FBQWtDLElBQUksQ0FBQzs7U0FDckM7QUFBQSxRQUFBLFFBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEdBQXRCLENBQTBCLENBQUMsSUFBM0IsQ0FBQSxDQUFpQyxDQUFDLEtBQWxDLENBQXdDLEdBQXhDLENBQWYsRUFBQyxlQUFELEVBQU8sZUFBUCxDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsSUFBTixDQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFVBQ0EsUUFBQTtBQUFVLG9CQUFPLElBQUssQ0FBQSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsQ0FBWjtBQUFBLG1CQUNILEdBREc7QUFBQSxtQkFDQyxHQUREO0FBQUEsbUJBQ0ssR0FETDtBQUFBLG1CQUNTLEdBRFQ7QUFBQSxtQkFDYSxHQURiO3VCQUNzQixLQUR0QjtBQUFBO3VCQUVILE1BRkc7QUFBQTtjQURWO0FBQUEsVUFJQSxJQUFBO0FBQU0sb0JBQU8sSUFBSyxDQUFBLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBZCxDQUFaO0FBQUEsbUJBQ0MsR0FERDt1QkFDVSxRQURWO0FBQUEsbUJBRUMsR0FGRDt1QkFFVSxXQUZWO0FBQUEsbUJBR0MsR0FIRDt1QkFHVSxVQUhWO0FBQUEsbUJBSUMsR0FKRDt1QkFJVSxXQUpWO0FBQUEsbUJBS0MsR0FMRDt1QkFLVSxXQUxWO0FBQUEsbUJBTUMsR0FORDt1QkFNVSxXQU5WO0FBQUEsbUJBT0MsR0FQRDt1QkFPVSxNQVBWO0FBQUE7dUJBUUMsVUFSRDtBQUFBO2NBSk47U0FERixDQURBLENBREY7QUFBQSxPQURBO0FBa0JBLGFBQU8sS0FBUCxDQW5COEI7SUFBQSxDQUFSLEVBQVY7RUFBQSxDQTlEZCxDQUFBOztBQUFBLEVBbUZBLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtXQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsU0FBQSxHQUFBO0FBQy9CLGFBQU8sSUFBUCxDQUQrQjtJQUFBLENBQVIsRUFBVjtFQUFBLENBbkZmLENBQUE7O0FBQUEsRUFzRkEsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxTQUFkLEdBQUE7QUFDUixJQUFBLEtBQUEsQ0FBTyxRQUFBLEdBQVEsR0FBZixDQUFBLENBQUE7QUFFQSxXQUFPLEdBQUEsQ0FBSSxHQUFKLEVBQVM7QUFBQSxNQUFDLEdBQUEsRUFBSyxHQUFOO0tBQVQsQ0FDTCxDQUFDLElBREksQ0FDQyxTQUFDLElBQUQsR0FBQTtBQUNKLE1BQUEsSUFBQSxDQUFBLFNBQUE7QUFBQSxRQUFBLEtBQUEsQ0FBTSxJQUFOLENBQUEsQ0FBQTtPQUFBO0FBQ0EsYUFBTyxNQUFBLENBQU8sSUFBUCxDQUFQLENBRkk7SUFBQSxDQURELENBSUwsQ0FBQyxJQUpJLENBSUMsU0FBQyxDQUFELEdBQUE7QUFDSixNQUFBLEtBQUEsQ0FBTSxDQUFDLENBQUMsTUFBUixFQUFnQixJQUFoQixDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxDQUFDLENBQUMsT0FBUixFQUFpQixJQUFqQixDQURBLENBREk7SUFBQSxDQUpELENBQVAsQ0FIUTtFQUFBLENBdEZWLENBQUE7O0FBQUEsRUFrR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLGFBQU8sR0FBUCxDQURhO0lBQUEsQ0FBZjtBQUFBLElBR0EsS0FBQSxFQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsTUFBQSxLQUFBLENBQU0sSUFBTixDQUFBLENBREs7SUFBQSxDQUhQO0FBQUEsSUFPQSxTQUFBLEVBQVcsU0FBQyxFQUFELEdBQUE7QUFDVCxNQUFBLEtBQUEsR0FBUSxFQUFSLENBRFM7SUFBQSxDQVBYO0FBQUEsSUFXQSxLQUFBLEVBQU8sU0FBQyxNQUFELEdBQUE7QUFDTCxhQUFPLElBQUksQ0FBQyxtQkFBTCxDQUF5QixNQUF6QixDQUFQLENBREs7SUFBQSxDQVhQO0FBQUEsSUFjQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTtBQUNkLGFBQU8sSUFBSSxDQUFDLFlBQUwsQ0FBQSxDQUFQLENBRGM7SUFBQSxDQWRoQjtBQUFBLElBaUJBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsYUFBTyxJQUFJLENBQUMsaUJBQUwsQ0FBQSxDQUFQLENBRGU7SUFBQSxDQWpCakI7QUFBQSxJQW9CQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLElBQWYsRUFBcUIsWUFBckIsQ0FBZCxDQUFQLENBRFM7SUFBQSxDQXBCWDtBQUFBLElBdUJBLFdBQUEsRUFBYSxXQXZCYjtBQUFBLElBeUJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBQTtBQUNBLGFBQU8sSUFBQSxJQUFTLElBQUksQ0FBQyxPQUFkLElBQTBCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBOUMsQ0FGVTtJQUFBLENBekJaO0FBQUEsSUE2QkEsU0FBQSxFQUFXLFNBQUEsR0FBQTtBQUNULGFBQU8sSUFBSSxDQUFDLFlBQUwsQ0FBQSxDQUFBLEtBQXlCLElBQWhDLENBRFM7SUFBQSxDQTdCWDtBQUFBLElBZ0NBLEdBQUEsRUFBSyxTQUFDLEtBQUQsR0FBQTtBQUNILE1BQUEsSUFBQSxDQUFBLEtBQTBCLENBQUMsTUFBM0I7QUFBQSxlQUFPLElBQUEsQ0FBQSxDQUFQLENBQUE7T0FBQTtBQUNBLGFBQU8sT0FBQSxDQUFTLFNBQUEsR0FBUSxDQUFDLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxDQUFELENBQWpCLEVBQXFDLFNBQUMsSUFBRCxHQUFBO0FBQzFDLFFBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLGVBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUYwQztNQUFBLENBQXJDLENBQVAsQ0FGRztJQUFBLENBaENMO0FBQUEsSUFzQ0EsTUFBQSxFQUFRLFNBQUMsT0FBRCxHQUFBO0FBQ04sTUFBQSxPQUFBLEdBQVUsT0FBQSxJQUFXLElBQUksQ0FBQyxHQUFMLENBQUEsQ0FBckIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLEVBQXNCLEtBQXRCLENBRFYsQ0FBQTtBQUdBLGFBQU8sT0FBQSxDQUFTLGNBQUEsR0FBYyxPQUFkLEdBQXNCLElBQS9CLEVBQW9DLFNBQUMsSUFBRCxHQUFBO0FBQ3pDLFFBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLGVBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUZ5QztNQUFBLENBQXBDLENBQVAsQ0FKTTtJQUFBLENBdENSO0FBQUEsSUE4Q0EsUUFBQSxFQUFVLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNSLGFBQU8sT0FBQSxDQUFTLFdBQUEsR0FBVSxDQUFJLE1BQUgsR0FBZSxVQUFmLEdBQStCLEVBQWhDLENBQVYsR0FBK0MsTUFBeEQsRUFBa0UsU0FBQyxJQUFELEdBQUE7QUFDdkUsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBRnVFO01BQUEsQ0FBbEUsQ0FBUCxDQURRO0lBQUEsQ0E5Q1Y7QUFBQSxJQW1EQSxZQUFBLEVBQWMsU0FBQyxNQUFELEdBQUE7QUFDWixhQUFPLE9BQUEsQ0FBUyxTQUFBLEdBQVMsTUFBbEIsRUFBNEIsU0FBQyxJQUFELEdBQUE7QUFDakMsZUFBTyxPQUFBLENBQVMsV0FBQSxHQUFXLE1BQXBCLEVBQThCLFNBQUMsSUFBRCxHQUFBO0FBQ25DLFVBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLGlCQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FGbUM7UUFBQSxDQUE5QixDQUFQLENBRGlDO01BQUEsQ0FBNUIsQ0FBUCxDQURZO0lBQUEsQ0FuRGQ7QUFBQSxJQXlEQSxZQUFBLEVBQWMsU0FBQyxNQUFELEdBQUE7QUFDWixhQUFPLE9BQUEsQ0FBUyxZQUFBLEdBQVksTUFBckIsRUFBK0IsU0FBQyxJQUFELEdBQUE7QUFDcEMsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFQLENBRm9DO01BQUEsQ0FBL0IsQ0FBUCxDQURZO0lBQUEsQ0F6RGQ7QUFBQSxJQThEQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQsR0FBQTtBQUNqQixhQUFPLE9BQUEsQ0FBUyxZQUFBLEdBQVksTUFBckIsRUFBK0IsU0FBQyxJQUFELEdBQUE7QUFDcEMsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFQLENBRm9DO01BQUEsQ0FBL0IsQ0FBUCxDQURpQjtJQUFBLENBOURuQjtBQUFBLElBbUVBLElBQUEsRUFBTSxTQUFDLElBQUQsR0FBQTtBQUNKLGFBQU8sT0FBQSxDQUFTLGtCQUFBLEdBQWlCLENBQUMsSUFBQSxJQUFRLEVBQVQsQ0FBMUIsRUFBeUMsU0FBekMsRUFBb0QsSUFBcEQsQ0FBUCxDQURJO0lBQUEsQ0FuRU47QUFBQSxJQXNFQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsYUFBTyxPQUFBLENBQVEsZUFBUixFQUF5QixZQUF6QixDQUFQLENBREs7SUFBQSxDQXRFUDtBQUFBLElBeUVBLEtBQUEsRUFBTyxTQUFDLE1BQUQsRUFBUSxJQUFSLEdBQUE7QUFDTCxVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBZ0IsSUFBSCxHQUFhLFNBQWIsR0FBNEIsRUFBekMsQ0FBQTtBQUNBLGFBQU8sT0FBQSxDQUFTLFFBQUEsR0FBUSxVQUFSLEdBQW1CLEdBQW5CLEdBQXNCLE1BQS9CLEVBQXlDLFNBQUMsSUFBRCxHQUFBO0FBQzlDLFFBQUEsV0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLGVBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUY4QztNQUFBLENBQXpDLENBQVAsQ0FGSztJQUFBLENBekVQO0FBQUEsSUErRUEsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUNKLGFBQU8sT0FBQSxDQUFRLE1BQVIsRUFBZ0IsU0FBQyxJQUFELEdBQUE7QUFDckIsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBRnFCO01BQUEsQ0FBaEIsQ0FBUCxDQURJO0lBQUEsQ0EvRU47QUFBQSxJQW9GQSxJQUFBLEVBQU0sU0FBQyxJQUFELEVBQU0sTUFBTixFQUFhLE1BQWIsR0FBQTtBQUNKLGFBQU8sT0FBQSxDQUFTLE9BQUEsR0FBTyxJQUFQLEdBQVksR0FBWixHQUFlLE1BQWYsR0FBc0IsR0FBdEIsR0FBeUIsTUFBbEMsRUFBNEMsU0FBQyxJQUFELEdBQUE7QUFDakQsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBRmlEO01BQUEsQ0FBNUMsQ0FBUCxDQURJO0lBQUEsQ0FwRk47QUFBQSxJQXlGQSxJQUFBLEVBQU0sU0FBQyxNQUFELEVBQVEsTUFBUixHQUFBO0FBQ0osVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU8sOEJBQUEsR0FBOEIsTUFBOUIsR0FBcUMsR0FBckMsR0FBd0MsTUFBeEMsR0FBK0MsY0FBdEQsQ0FBQTtBQUVBLGFBQU8sT0FBQSxDQUFRLEdBQVIsRUFBYSxTQUFDLElBQUQsR0FBQTtBQUNsQixRQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxlQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FGa0I7TUFBQSxDQUFiLENBQVAsQ0FISTtJQUFBLENBekZOO0FBQUEsSUFnR0EsR0FBQSxFQUFLLFNBQUMsTUFBRCxHQUFBO0FBQ0gsYUFBTyxPQUFBLENBQVMsYUFBQSxHQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFMLENBQUEsQ0FBQSxJQUE0QixRQUE3QixDQUFaLEdBQWtELElBQWxELEdBQXNELE1BQS9ELEVBQXlFLFlBQXpFLENBQVAsQ0FERztJQUFBLENBaEdMO0FBQUEsSUFtR0EsS0FBQSxFQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsYUFBTyxPQUFBLENBQVMsY0FBQSxHQUFhLENBQUMsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFYLENBQUQsQ0FBdEIsRUFBMEMsU0FBQyxJQUFELEdBQUE7QUFDL0MsUUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBRitDO01BQUEsQ0FBMUMsQ0FBUCxDQURLO0lBQUEsQ0FuR1A7QUFBQSxJQXdHQSxNQUFBLEVBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixNQUFBLElBQUEsQ0FBQSxLQUEwQixDQUFDLE1BQTNCO0FBQUEsZUFBTyxJQUFBLENBQUEsQ0FBUCxDQUFBO09BQUE7QUFDQSxhQUFPLE9BQUEsQ0FBUyxRQUFBLEdBQU8sQ0FBQyxLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBRCxDQUFoQixFQUFvQyxTQUFDLElBQUQsR0FBQTtBQUN6QyxRQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSxlQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FGeUM7TUFBQSxDQUFwQyxDQUFQLENBRk07SUFBQSxDQXhHUjtBQUFBLElBOEdBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixhQUFPLE9BQUEsQ0FBUSwwQ0FBUixFQUFvRCxXQUFwRCxDQUFQLENBRE07SUFBQSxDQTlHUjtHQW5HRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/git.coffee
