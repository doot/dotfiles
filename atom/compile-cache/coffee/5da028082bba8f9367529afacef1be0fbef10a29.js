(function() {
  var SelectStageHunkFiles, SelectStageHunks, fs, git, pathToRepoFile, repo, _ref;

  fs = require('fs-plus');

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  SelectStageHunkFiles = require('../../lib/views/select-stage-hunk-file-view');

  SelectStageHunks = require('../../lib/views/select-stage-hunks-view');

  describe("SelectStageHunkFiles", function() {
    return it("gets the diff of the selected file", function() {
      var fileItem, view;
      spyOn(git, 'diff').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectStageHunkFiles(repo, [fileItem]);
      view.confirmSelection();
      return expect(git.diff).toHaveBeenCalledWith(repo, pathToRepoFile);
    });
  });

  describe("SelectStageHunks", function() {
    return it("stages the selected hunk", function() {
      var hunk, patch_path, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      spyOn(fs, 'unlink');
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      hunk = {
        match: function() {
          return [1, 'this is a diff', 'hunk'];
        }
      };
      view = new SelectStageHunks(repo, ["patch_path hunk1", hunk]);
      patch_path = repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      view.confirmSelection();
      view.find('.btn-stage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['apply', '--cached', '--', patch_path], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy9zZWxlY3Qtc3RhZ2UtaHVuay1maWxlcy12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxPQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBRlAsQ0FBQTs7QUFBQSxFQUdBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw2Q0FBUixDQUh2QixDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHlDQUFSLENBSm5CLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO1dBQy9CLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLE1BQVgsQ0FBa0IsQ0FBQyxTQUFuQixDQUE2QixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQUE3QixDQUFBLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLGNBQU47T0FGRixDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQVcsSUFBQSxvQkFBQSxDQUFxQixJQUFyQixFQUEyQixDQUFDLFFBQUQsQ0FBM0IsQ0FIWCxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUpBLENBQUE7YUFLQSxNQUFBLENBQU8sR0FBRyxDQUFDLElBQVgsQ0FBZ0IsQ0FBQyxvQkFBakIsQ0FBc0MsSUFBdEMsRUFBNEMsY0FBNUMsRUFOdUM7SUFBQSxDQUF6QyxFQUQrQjtFQUFBLENBQWpDLENBTkEsQ0FBQTs7QUFBQSxFQWVBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7V0FDM0IsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLHNCQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsUUFBVixDQURBLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsV0FBVixDQUFzQixDQUFDLFdBQXZCLENBQW1DLFNBQUEsR0FBQTtlQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFqQyxDQUFBLEVBRGlDO01BQUEsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7aUJBQUcsQ0FBQyxDQUFELEVBQUksZ0JBQUosRUFBc0IsTUFBdEIsRUFBSDtRQUFBLENBQVA7T0FMRixDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQVcsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixDQUFDLGtCQUFELEVBQXFCLElBQXJCLENBQXZCLENBTlgsQ0FBQTtBQUFBLE1BT0EsVUFBQSxHQUFhLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUEsR0FBNkIsZ0JBUDFDLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBUkEsQ0FBQTtBQUFBLE1BU0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxtQkFBVixDQUE4QixDQUFDLEtBQS9CLENBQUEsQ0FUQSxDQUFBO2FBVUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxPQUFELEVBQVUsVUFBVixFQUFzQixJQUF0QixFQUE0QixVQUE1QixDQUFyQyxFQUE4RTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBOUUsRUFYNkI7SUFBQSxDQUEvQixFQUQyQjtFQUFBLENBQTdCLENBZkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/views/select-stage-hunk-files-view-spec.coffee
