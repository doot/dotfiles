(function() {
  var Path, head, mocks, pathToRepoFile;

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/some/repository/directory/file");

  head = jasmine.createSpyObj('head', ['replace']);

  module.exports = mocks = {
    pathToRepoFile: pathToRepoFile,
    repo: {
      getPath: function() {
        return Path.join(this.getWorkingDirectory, ".git");
      },
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
      getReferences: function() {
        return {
          heads: [head]
        };
      },
      getShortHead: function() {
        return 'short head';
      },
      repo: {
        submoduleForPath: function(path) {
          return void 0;
        }
      }
    },
    currentPane: {
      alive: true,
      activate: function() {
        return void 0;
      },
      destroy: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return pathToRepoFile;
            }
          }
        ];
      }
    },
    commitPane: {
      alive: true,
      destroy: function() {
        return mocks.textEditor.destroy();
      },
      splitRight: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return Path.join(mocks.repo.getPath(), 'COMMIT_EDITMSG');
            }
          }
        ];
      }
    },
    textEditor: {
      getPath: function() {
        return pathToRepoFile;
      },
      getURI: function() {
        return pathToRepoFile;
      },
      onDidDestroy: function(destroy) {
        this.destroy = destroy;
        return {
          dispose: function() {}
        };
      },
      onDidSave: function(save) {
        this.save = save;
        return {
          dispose: function() {
            return void 0;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9maXh0dXJlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLGtDQUFULENBRmpCLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBTyxDQUFDLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxTQUFELENBQTdCLENBSlAsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsR0FDZjtBQUFBLElBQUEsY0FBQSxFQUFnQixjQUFoQjtBQUFBLElBRUEsSUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsbUJBQWYsRUFBb0MsTUFBcEMsRUFBSDtNQUFBLENBQVQ7QUFBQSxNQUNBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsbUJBQVQsRUFBSDtNQUFBLENBRHJCO0FBQUEsTUFFQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRmY7QUFBQSxNQUdBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUFVLFFBQUEsSUFBb0IsSUFBQSxLQUFRLGNBQTVCO2lCQUFBLGlCQUFBO1NBQVY7TUFBQSxDQUhaO0FBQUEsTUFJQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2VBQ2I7QUFBQSxVQUFBLEtBQUEsRUFBTyxDQUFDLElBQUQsQ0FBUDtVQURhO01BQUEsQ0FKZjtBQUFBLE1BTUEsWUFBQSxFQUFjLFNBQUEsR0FBQTtlQUFHLGFBQUg7TUFBQSxDQU5kO0FBQUEsTUFPQSxJQUFBLEVBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLFNBQUMsSUFBRCxHQUFBO2lCQUFVLE9BQVY7UUFBQSxDQUFsQjtPQVJGO0tBSEY7QUFBQSxJQWFBLFdBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxNQUNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FEVjtBQUFBLE1BRUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQUZUO0FBQUEsTUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2VBQUc7VUFDWDtBQUFBLFlBQUEsTUFBQSxFQUFRLFNBQUEsR0FBQTtxQkFBRyxlQUFIO1lBQUEsQ0FBUjtXQURXO1VBQUg7TUFBQSxDQUhWO0tBZEY7QUFBQSxJQXFCQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxJQUFQO0FBQUEsTUFDQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFqQixDQUFBLEVBQUg7TUFBQSxDQURUO0FBQUEsTUFFQSxVQUFBLEVBQVksU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRlo7QUFBQSxNQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRztVQUNYO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3FCQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFYLENBQUEsQ0FBVixFQUFnQyxnQkFBaEMsRUFBSDtZQUFBLENBQVI7V0FEVztVQUFIO01BQUEsQ0FIVjtLQXRCRjtBQUFBLElBNkJBLFVBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtlQUFHLGVBQUg7TUFBQSxDQUFUO0FBQUEsTUFDQSxNQUFBLEVBQVEsU0FBQSxHQUFBO2VBQUcsZUFBSDtNQUFBLENBRFI7QUFBQSxNQUVBLFlBQUEsRUFBYyxTQUFFLE9BQUYsR0FBQTtBQUNaLFFBRGEsSUFBQyxDQUFBLFVBQUEsT0FDZCxDQUFBO2VBQUE7QUFBQSxVQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUEsQ0FBVDtVQURZO01BQUEsQ0FGZDtBQUFBLE1BSUEsU0FBQSxFQUFXLFNBQUUsSUFBRixHQUFBO0FBQ1QsUUFEVSxJQUFDLENBQUEsT0FBQSxJQUNYLENBQUE7ZUFBQTtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTttQkFBRyxPQUFIO1VBQUEsQ0FBVDtVQURTO01BQUEsQ0FKWDtLQTlCRjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/fixtures.coffee
