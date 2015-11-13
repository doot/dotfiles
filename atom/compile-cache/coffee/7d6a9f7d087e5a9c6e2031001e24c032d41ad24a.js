(function() {
  var Path, commitPane, currentPane, fs, git, mockRepo, mockRepoWithSubmodule, mockSubmodule, pathToRepoFile, pathToSubmoduleFile, repo, textEditor, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../lib/git');

  _ref = require('./fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, commitPane = _ref.commitPane, currentPane = _ref.currentPane;

  pathToSubmoduleFile = Path.get("~/some/submodule/file");

  mockRepo = {
    getWorkingDirectory: function() {
      return Path.get("~/some/repository");
    },
    refreshStatus: function() {
      return void 0;
    },
    relativize: function(path) {
      if (path === pathToRepoFile) {
        return "directory/file";
      }
    },
    repo: {
      submoduleForPath: function(path) {
        return void 0;
      }
    }
  };

  mockSubmodule = {
    getWorkingDirectory: function() {
      return Path.get("~/some/submodule");
    },
    relativize: function(path) {
      if (path === pathToSubmoduleFile) {
        return "file";
      }
    }
  };

  mockRepoWithSubmodule = Object.create(mockRepo);

  mockRepoWithSubmodule.repo = {
    submoduleForPath: function(path) {
      if (path === pathToSubmoduleFile) {
        return mockSubmodule;
      }
    }
  };

  describe("Git-Plus git module", function() {
    describe("git.getConfig", function() {
      var args;
      args = ['config', '--get', 'user.name'];
      beforeEach(function() {
        return spyOn(git, 'cmd').andReturn(Promise.resolve('akonwi'));
      });
      describe("when a repo file path isn't specified", function() {
        return it("spawns a command querying git for the given global setting", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name');
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: Path.get('~')
            });
          });
        });
      });
      return describe("when a repo file path is specified", function() {
        return it("checks for settings in that repo", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name', repo.getWorkingDirectory());
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.getRepo", function() {
      return it("returns a promise resolving to repository", function() {
        return waitsForPromise(function() {
          return git.getRepo().then(function(repo) {
            return expect(repo.getWorkingDirectory()).toContain('git-plus');
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise resolving to absolute path of repo", function() {
        return waitsForPromise(function() {
          return git.dir().then(function(dir) {
            return expect(dir).toContain('git-plus');
          });
        });
      });
    });
    describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepoWithSubmodule];
        });
        return expect(git.getSubmodule(pathToSubmoduleFile).getWorkingDirectory()).toEqual(Path.get("~/some/submodule"));
      });
    });
    describe("git.relativize", function() {
      return it("returns relativized filepath for files in repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo, mockRepoWithSubmodule];
        });
        expect(git.relativize(pathToRepoFile)).toBe('directory/file');
        return expect(git.relativize(pathToSubmoduleFile)).toBe("file");
      });
    });
    describe("git.cmd", function() {
      return it("returns a promise", function() {
        var promise;
        promise = git.cmd();
        expect(promise["catch"]).toBeDefined();
        return expect(promise.then).toBeDefined();
      });
    });
    describe("git.add", function() {
      it("calls git.cmd with ['add', '--all', {fileName}]", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            file: pathToSubmoduleFile
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', pathToSubmoduleFile], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      it("calls git.cmd with ['add', '--all', '.'] when no file is specified", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      return it("calls git.cmd with ['add', '--update'...] when update option is true", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            update: true
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--update', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.reset", function() {
      return it("resets and unstages all files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.reset(mockRepo).then(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.stagedFiles", function() {
      return it("returns an empty array when there are no staged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.stagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.unstagedFiles", function() {
      return it("returns an empty array when there are no unstaged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.unstagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.status", function() {
      return it("calls git.cmd with 'status' as the first argument", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args;
          if (args[0][0] === 'status') {
            return Promise.resolve(true);
          }
        });
        return git.status(mockRepo).then(function() {
          return expect(true).toBeTruthy();
        });
      });
    });
    describe("git.refresh", function() {
      it("calls git.cmd with 'add' and '--refresh' arguments for each repo in project", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args[0];
          expect(args[0]).toBe('add');
          return expect(args[1]).toBe('--refresh');
        });
        spyOn(mockRepo, 'getWorkingDirectory').andCallFake(function() {
          return expect(mockRepo.getWorkingDirectory.callCount).toBe(1);
        });
        return git.refresh();
      });
      return it("calls repo.refreshStatus for each repo in project", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo];
        });
        spyOn(mockRepo, 'refreshStatus');
        spyOn(git, 'cmd').andCallFake(function() {
          return void 0;
        });
        git.refresh();
        return expect(mockRepo.refreshStatus.callCount).toBe(1);
      });
    });
    return describe("git.diff", function() {
      return it("calls git.cmd with ['diff', '-p', '-U1'] and the file path", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve("string");
        });
        git.diff(mockRepo, pathToRepoFile);
        return expect(git.cmd).toHaveBeenCalledWith(['diff', '-p', '-U1', pathToRepoFile], {
          cwd: mockRepo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9naXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQU1JLE9BQUEsQ0FBUSxZQUFSLENBTkosRUFDRSxZQUFBLElBREYsRUFFRSxzQkFBQSxjQUZGLEVBR0Usa0JBQUEsVUFIRixFQUlFLGtCQUFBLFVBSkYsRUFLRSxtQkFBQSxXQVJGLENBQUE7O0FBQUEsRUFVQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLHVCQUFULENBVnRCLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsbUJBQVQsRUFBSDtJQUFBLENBQXJCO0FBQUEsSUFDQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBRGY7QUFBQSxJQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUFVLE1BQUEsSUFBb0IsSUFBQSxLQUFRLGNBQTVCO2VBQUEsaUJBQUE7T0FBVjtJQUFBLENBRlo7QUFBQSxJQUdBLElBQUEsRUFDRTtBQUFBLE1BQUEsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEdBQUE7ZUFBVSxPQUFWO01BQUEsQ0FBbEI7S0FKRjtHQWJGLENBQUE7O0FBQUEsRUFtQkEsYUFBQSxHQUNFO0FBQUEsSUFBQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7YUFBRyxJ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

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/git-spec.coffee
