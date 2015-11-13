(function() {
  var StatusListView, fs, git, repo,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  StatusListView = require('../../lib/views/status-list-view');

  describe("StatusListView", function() {
    describe("when there are modified files", function() {
      it("displays a list of modified files", function() {
        var view;
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        return expect(view.items.length).toBe(2);
      });
      return it("calls git.cmd with 'diff' when user doesn't want to open the file", function() {
        var view;
        spyOn(window, 'confirm').andReturn(false);
        spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(__indexOf.call(git.cmd.mostRecentCall.args[0], 'diff') >= 0).toBe(true);
      });
    });
    return describe("when there are unstaged files", function() {
      beforeEach(function() {
        return spyOn(window, 'confirm').andReturn(true);
      });
      it("opens the file when it is a file", function() {
        var view;
        spyOn(atom.workspace, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      return it("opens the directory in a project when it is a directory", function() {
        var view;
        spyOn(atom, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return true;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.open).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9zdGF0dXMtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUZELENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUixDQUhqQixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsTUFBQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsQ0FBQyxjQUFELEVBQWlCLGlCQUFqQixFQUFvQyxFQUFwQyxDQUFyQixDQUFYLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFsQixDQUF5QixDQUFDLElBQTFCLENBQStCLENBQS9CLEVBRnNDO01BQUEsQ0FBeEMsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLG1FQUFILEVBQXdFLFNBQUEsR0FBQTtBQUN0RSxZQUFBLElBQUE7QUFBQSxRQUFBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsU0FBZCxDQUF3QixDQUFDLFNBQXpCLENBQW1DLEtBQW5DLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxL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

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/status-list-view-spec.coffee
