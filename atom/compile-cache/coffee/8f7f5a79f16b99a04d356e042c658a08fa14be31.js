(function() {
  var BufferedProcess, GitBridge, path;

  GitBridge = require('../lib/git-bridge').GitBridge;

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  describe('GitBridge', function() {
    var gitWorkDir, repo;
    gitWorkDir = "/fake/gitroot/";
    repo = {
      getWorkingDirectory: function() {
        return gitWorkDir;
      },
      relativize: function(fullpath) {
        if (fullpath.startsWith(gitWorkDir)) {
          return fullpath.slice(gitWorkDir.length);
        } else {
          return fullpath;
        }
      }
    };
    beforeEach(function() {
      var done;
      done = false;
      atom.config.set('merge-conflicts.gitPath', '/usr/bin/git');
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      return waitsFor(function() {
        return done;
      });
    });
    it('checks git status for merge conflicts', function() {
      var a, c, conflicts, o, _ref;
      _ref = [], c = _ref[0], a = _ref[1], o = _ref[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, stderr, stdout, _ref1;
        command = _arg.command, args = _arg.args, options = _arg.options, stdout = _arg.stdout, stderr = _arg.stderr, exit = _arg.exit;
        _ref1 = [command, args, options], c = _ref1[0], a = _ref1[1], o = _ref1[2];
        stdout('UU lib/file0.rb');
        stdout('AA lib/file1.rb');
        stdout('M  lib/file2.rb');
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      };
      conflicts = [];
      GitBridge.withConflicts(repo, function(err, cs) {
        if (err) {
          throw err;
        }
        return conflicts = cs;
      });
      expect(conflicts).toEqual([
        {
          path: 'lib/file0.rb',
          message: 'both modified'
        }, {
          path: 'lib/file1.rb',
          message: 'both added'
        }
      ]);
      expect(c).toBe('/usr/bin/git');
      expect(a).toEqual(['status', '--porcelain']);
      return expect(o).toEqual({
        cwd: gitWorkDir
      });
    });
    describe('isStaged', function() {
      var statusMeansStaged;
      statusMeansStaged = function(status, checkPath) {
        var staged;
        if (checkPath == null) {
          checkPath = 'lib/file2.txt';
        }
        GitBridge.process = function(_arg) {
          var exit, stdout;
          stdout = _arg.stdout, exit = _arg.exit;
          stdout("" + status + " lib/file2.txt");
          exit(0);
          return {
            process: {
              on: function(callback) {}
            }
          };
        };
        staged = null;
        GitBridge.isStaged(repo, checkPath, function(err, b) {
          if (err) {
            throw err;
          }
          return staged = b;
        });
        return staged;
      };
      it('is true if already resolved', function() {
        return expect(statusMeansStaged('M ')).toBe(true);
      });
      it('is true if resolved as ours', function() {
        return expect(statusMeansStaged(' M', 'lib/file1.txt')).toBe(true);
      });
      it('is false if still in conflict', function() {
        return expect(statusMeansStaged('UU')).toBe(false);
      });
      return it('is false if resolved, but then modified', function() {
        return expect(statusMeansStaged('MM')).toBe(false);
      });
    });
    it('checks out "our" version of a file from the index', function() {
      var a, c, called, o, _ref;
      _ref = [], c = _ref[0], a = _ref[1], o = _ref[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, _ref1;
        command = _arg.command, args = _arg.args, options = _arg.options, exit = _arg.exit;
        _ref1 = [command, args, options], c = _ref1[0], a = _ref1[1], o = _ref1[2];
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      };
      called = false;
      GitBridge.checkoutSide(repo, 'ours', 'lib/file1.txt', function(err) {
        if (err) {
          throw err;
        }
        return called = true;
      });
      expect(called).toBe(true);
      expect(c).toBe('/usr/bin/git');
      expect(a).toEqual(['checkout', '--ours', 'lib/file1.txt']);
      return expect(o).toEqual({
        cwd: gitWorkDir
      });
    });
    it('stages changes to a file', function() {
      var a, c, called, o, _ref;
      _ref = [], c = _ref[0], a = _ref[1], o = _ref[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, _ref1;
        command = _arg.command, args = _arg.args, options = _arg.options, exit = _arg.exit;
        _ref1 = [command, args, options], c = _ref1[0], a = _ref1[1], o = _ref1[2];
        return exit(0);
      };
      called = false;
      GitBridge.add(repo, 'lib/file1.txt', function(err) {
        if (err) {
          throw err;
        }
        return called = true;
      });
      expect(called).toBe(true);
      expect(c).toBe('/usr/bin/git');
      expect(a).toEqual(['add', 'lib/file1.txt']);
      return expect(o).toEqual({
        cwd: gitWorkDir
      });
    });
    return describe('rebase detection', function() {
      var withRoot;
      withRoot = function(gitDir, callback) {
        var fullDir, saved;
        fullDir = path.join(atom.project.getDirectories()[0].getPath(), gitDir);
        saved = GitBridge._repoGitDir;
        GitBridge._repoGitDir = function() {
          return fullDir;
        };
        callback();
        return GitBridge._repoGitDir = saved;
      };
      it('recognizes a non-interactive rebase', function() {
        return withRoot('rebasing.git', function() {
          return expect(GitBridge.isRebasing()).toBe(true);
        });
      });
      it('recognizes an interactive rebase', function() {
        return withRoot('irebasing.git', function() {
          return expect(GitBridge.isRebasing()).toBe(true);
        });
      });
      return it('returns false if not rebasing', function() {
        return withRoot('merging.git', function() {
          return expect(GitBridge.isRebasing()).toBe(false);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvZ2l0LWJyaWRnZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTs7QUFBQSxFQUFDLFlBQWEsT0FBQSxDQUFRLG1CQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBQ0Msa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFFcEIsUUFBQSxnQkFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLGdCQUFiLENBQUE7QUFBQSxJQUVBLElBQUEsR0FDRTtBQUFBLE1BQUEsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2VBQUcsV0FBSDtNQUFBLENBQXJCO0FBQUEsTUFDQSxVQUFBLEVBQVksU0FBQyxRQUFELEdBQUE7QUFDVixRQUFBLElBQUcsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsVUFBcEIsQ0FBSDtpQkFDRSxRQUFTLDBCQURYO1NBQUEsTUFBQTtpQkFHRSxTQUhGO1NBRFU7TUFBQSxDQURaO0tBSEYsQ0FBQTtBQUFBLElBVUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEtBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixFQUEyQyxjQUEzQyxDQURBLENBQUE7QUFBQSxNQUdBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLFNBQUMsR0FBRCxHQUFBO0FBQ3JCLFFBQUEsSUFBYSxXQUFiO0FBQUEsZ0JBQU0sR0FBTixDQUFBO1NBQUE7ZUFDQSxJQUFBLEdB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

//# sourceURL=/Users/doot/.atom/packages/merge-conflicts/spec/git-bridge-spec.coffee
