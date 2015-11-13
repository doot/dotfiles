(function() {
  var Repo, RepoView, UnstagedFile, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  Repo = require('../lib/models/repo');

  UnstagedFile = require('../lib/models/files').UnstagedFile;

  RepoView = require('../lib/views/repo-view');

  describe("Atomatigit", function() {
    var activationPromise, repo, repoView, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], repo = _ref[2], repoView = _ref[3];
    beforeEach(function() {
      var projectPath;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      projectPath = temp.mkdirSync('atomatigit-spec-');
      fs.copySync(path.join(__dirname, 'fixtures', 'working-dir'), projectPath);
      fs.moveSync(path.join(projectPath, 'git.git'), path.join(projectPath, '.git'));
      atom.project.setPaths([projectPath]);
      spyOn(UnstagedFile.prototype, 'loadDiff').andCallFake(function() {});
      activationPromise = atom.packages.activatePackage('atomatigit').then(function(_arg) {
        var mainModule;
        mainModule = _arg.mainModule;
        repo = new Repo;
        spyOn(repo, 'reload').andCallFake(function() {
          return new Promise(function(resolve, reject) {
            return resolve();
          });
        });
        repoView = new RepoView(repo);
        mainModule.repo = repo;
        return mainModule.repoView = repoView;
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe('atomatigit:toggle', function() {
      return it('hides and shows the view', function() {
        return runs(function() {
          var atomatigitElement;
          expect(workspaceElement.querySelector('.atomatigit')).not.toExist();
          atom.commands.dispatch(workspaceElement, 'atomatigit:toggle');
          expect(workspaceElement.querySelector('.atomatigit')).toExist();
          atomatigitElement = workspaceElement.querySelector('.atomatigit');
          expect(atomatigitElement).toExist();
          expect(atomatigitElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'atomatigit:toggle');
          expect(workspaceElement.querySelector('.atomatigit')).not.toExist();
          return expect(atomatigitElement).not.toBeVisible();
        });
      });
    });
    describe('atomatigit:branches', function() {
      return it('switch active view', function() {
        return runs(function() {
          var atomatigitElement, branchListElement;
          atom.commands.dispatch(workspaceElement, 'atomatigit:toggle');
          expect(workspaceElement.querySelector('.atomatigit')).toExist();
          atomatigitElement = workspaceElement.querySelector('.atomatigit');
          branchListElement = workspaceElement.querySelector('.branch-list-view');
          expect(branchListElement).toExist();
          expect(branchListElement).not.toBeVisible();
          atom.commands.dispatch(atomatigitElement, 'atomatigit:branches');
          return expect(branchListElement).toBeVisible();
        });
      });
    });
    return describe('atomatigit:commit-log', function() {
      return it('switch active view', function() {
        return runs(function() {
          var atomatigitElement, commitListElement;
          atom.commands.dispatch(workspaceElement, 'atomatigit:toggle');
          expect(workspaceElement.querySelector('.atomatigit')).toExist();
          atomatigitElement = workspaceElement.querySelector('.atomatigit');
          commitListElement = workspaceElement.querySelector('.commit-list-view');
          expect(commitListElement).toExist();
          expect(commitListElement).not.toBeVisible();
          atom.commands.dispatch(atomatigitElement, 'atomatigit:commit-log');
          return expect(commitListElement).toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9zcGVjL2F0b21hdGlnaXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLG9CQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlDLGVBQWdCLE9BQUEsQ0FBUSxxQkFBUixFQUFoQixZQUpELENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHdCQUFSLENBTFgsQ0FBQTs7QUFBQSxFQVlBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLHlEQUFBO0FBQUEsSUFBQSxPQUF3RCxFQUF4RCxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixFQUFzQyxjQUF0QyxFQUE0QyxrQkFBNUMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsV0FBQTtBQUFBLE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FEQSxDQUFBO0FBQUEsTUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxrQkFBZixDQUhkLENBQUE7QUFBQSxNQUlBLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDLGFBQWpDLENBQVosRUFBNkQsV0FBN0QsQ0FKQSxDQUFBO0FBQUEsTUFLQSxFQUFFLENBQUMsUUFBSCxDQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixTQUF2QixDQUFaLEVBQStDLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixNQUF2QixDQUEvQyxDQUxBLENBQUE7QUFBQSxNQU1BLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLFdBQUQsQ0FBdEIsQ0FOQSxDQUFBO0FBQUEsTUFRQSxLQUFBLENBQU0sWUFBWSxDQUFBLFNBQWxCLEVBQXNCLFVBQXRCLENBQWlDLENBQUMsV0FBbEMsQ0FBK0MsU0FBQSxHQUFBLENBQS9DLENBUkEsQ0FBQTtBQUFBLE1BVUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsU0FBQyxJQUFELEdBQUE7QUFDbkUsWUFBQSxVQUFBO0FBQUEsUUFEcUUsYUFBRCxLQUFDLFVBQ3JFLENBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxHQUFBLENBQUEsSUFBUCxDQUFBO0FBQUEsUUFFQSxLQUFBLENBQU0sSUFBTixFQUFZLFFBQVosQ0FBcUIsQ0FBQyxXQUF0QixDQUFtQyxTQUFBLEdBQUE7aUJBQzdCLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTttQkFBcUIsT0FBQSxDQUFBLEVBQXJCO1VBQUEsQ0FBUixFQUQ2QjtRQUFBLENBQW5DLENBRkEsQ0FBQTtBQUFBLFFBTUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFTLElBQVQsQ0FOZixDQUFBO0FBQUEsUUFPQSxVQUFVLENBQUMsSUFBWCxHQUFrQixJQVBsQixDQUFBO2VBUUEsVUFBVSxDQUFDLFFBQVgsR0FBc0IsU0FUNkM7TUFBQSxDQUFqRCxDQVZwQixDQUFBO2FBcUJBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2Qsa0JBRGM7TUFBQSxDQUFoQixFQXRCUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUEyQkEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTthQUM1QixFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO2VBQzdCLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLGlCQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBUCxDQUFxRCxDQUFDLEdBQUcsQ0FBQyxPQUExRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxtQkFBekMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQUEsQ0FGQSxDQUFBO0FBQUEsVUFJQSxpQkFBQSxHQUFvQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixhQUEvQixDQUpwQixDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxPQUExQixDQUFBLENBTEEsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsV0FBMUIsQ0FBQSxDQU5BLENBQUE7QUFBQSxVQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUJBQXpDLENBUkEsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGFBQS9CLENBQVAsQ0FBcUQsQ0FBQyxHQUFHLENBQUMsT0FBMUQsQ0FBQSxDQVRBLENBQUE7aUJBVUEsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsR0FBRyxDQUFDLFdBQTlCLENBQUEsRUFYRztRQUFBLENBQUwsRUFENkI7TUFBQSxDQUEvQixFQUQ0QjtJQUFBLENBQTlCLENBM0JBLENBQUE7QUFBQSxJQTBDQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO2FBQzlCLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7ZUFDdkIsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsb0NBQUE7QUFBQSxVQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsbUJBQXpDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGFBQS9CLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsaUJBQUEsR0FBb0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FGcEIsQ0FBQTtBQUFBLFVBSUEsaUJBQUEsR0FBb0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsbUJBQS9CLENBSnBCLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLE9BQTFCLENBQUEsQ0FMQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxHQUFHLENBQUMsV0FBOUIsQ0FBQSxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixpQkFBdkIsRUFBMEMscUJBQTFDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxXQUExQixDQUFBLEVBVEc7UUFBQSxDQUFMLEVBRHVCO01BQUEsQ0FBekIsRUFEOEI7SUFBQSxDQUFoQyxDQTFDQSxDQUFBO1dBdURBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtlQUN2QixJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxvQ0FBQTtBQUFBLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxtQkFBekMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsYUFBL0IsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxpQkFBQSxHQUFvQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixhQUEvQixDQUZwQixDQUFBO0FBQUEsVUFJQSxpQkFBQSxHQUFvQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixtQkFBL0IsQ0FKcEIsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsT0FBMUIsQ0FBQSxDQUxBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLEdBQUcsQ0FBQyxXQUE5QixDQUFBLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGlCQUF2QixFQUEwQyx1QkFBMUMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLFdBQTFCLENBQUEsRUFURztRQUFBLENBQUwsRUFEdUI7TUFBQSxDQUF6QixFQURnQztJQUFBLENBQWxDLEVBeERxQjtFQUFBLENBQXZCLENBWkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/spec/atomatigit-spec.coffee
