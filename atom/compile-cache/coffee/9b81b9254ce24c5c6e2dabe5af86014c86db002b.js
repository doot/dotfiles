(function() {
  var GitLog, LogListView, git, logFileURI, pathToRepoFile, repo, view, _ref;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  GitLog = require('../../lib/models/git-log');

  LogListView = require('../../lib/views/log-list-view');

  view = new LogListView;

  logFileURI = 'atom://git-plus:log';

  describe("GitLog", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(view));
      spyOn(atom.workspace, 'addOpener');
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn({
        getPath: function() {
          return pathToRepoFile;
        }
      });
      spyOn(view, 'branchLog');
      return waitsForPromise(function() {
        return GitLog(repo);
      });
    });
    it("adds a custom opener for the log file URI", function() {
      return expect(atom.workspace.addOpener).toHaveBeenCalled();
    });
    it("opens the log file URI", function() {
      return expect(atom.workspace.open).toHaveBeenCalledWith(logFileURI);
    });
    it("calls branchLog on the view", function() {
      return expect(view.branchLog).toHaveBeenCalledWith(repo);
    });
    return describe("when 'onlyCurrentFile' option is true", function() {
      return it("calls currentFileLog on the view", function() {
        spyOn(view, 'currentFileLog');
        waitsForPromise(function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
        return runs(function() {
          return expect(view.currentFileLog).toHaveBeenCalledWith(repo, repo.relativize(pathToRepoFile));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWxvZy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBRFAsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsMEJBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sR0FBQSxDQUFBLFdBTFAsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxxQkFOYixDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCLENBQTZCLENBQUMsU0FBOUIsQ0FBd0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBeEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsV0FBdEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IscUJBQXRCLENBQTRDLENBQUMsU0FBN0MsQ0FBdUQ7QUFBQSxRQUFFLE9BQUEsRUFBUyxTQUFBLEdBQUE7aUJBQUcsZUFBSDtRQUFBLENBQVg7T0FBdkQsQ0FGQSxDQUFBO0FBQUEsTUFHQSxLQUFBLENBQU0sSUFBTixFQUFZLFdBQVosQ0FIQSxDQUFBO2FBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxNQUFBLENBQU8sSUFBUCxFQUFIO01BQUEsQ0FBaEIsRUFMUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFPQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO2FBQzlDLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQXRCLENBQWdDLENBQUMsZ0JBQWpDLENBQUEsRUFEOEM7SUFBQSxDQUFoRCxDQVBBLENBQUE7QUFBQSxJQVVBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7YUFDM0IsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsVUFBakQsRUFEMkI7SUFBQSxDQUE3QixDQVZBLENBQUE7QUFBQSxJQWFBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFaLENBQXNCLENBQUMsb0JBQXZCLENBQTRDLElBQTVDLEVBRGdDO0lBQUEsQ0FBbEMsQ0FiQSxDQUFBO1dBZ0JBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBLEdBQUE7YUFDaEQsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxRQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksZ0JBQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBUCxFQUFhO0FBQUEsWUFBQSxlQUFBLEVBQWlCLElBQWpCO1dBQWIsRUFBSDtRQUFBLENBQWhCLENBREEsQ0FBQTtlQUVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsTUFBQSxDQUFPLElBQUksQ0FBQyxjQUFaLENBQTJCLENBQUMsb0JBQTVCLENBQWlELElBQWpELEVBQXVELElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQXZELEVBREc7UUFBQSxDQUFMLEVBSHFDO01BQUEsQ0FBdkMsRUFEZ0Q7SUFBQSxDQUFsRCxFQWpCaUI7RUFBQSxDQUFuQixDQVJBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/models/git-log-spec.coffee
