(function() {
  var $, GitProjects, fs, path, utils, workspaceElement;

  $ = require('atom-space-pen-views').$;

  GitProjects = require('../lib/git-projects');

  utils = require('../lib/utils');

  workspaceElement = null;

  fs = require('fs');

  path = require('path');

  describe("GitProjects", function() {
    beforeEach(function() {
      var waitsForPromise;
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise = atom.packages.activatePackage('git-projects');
    });
    describe("when the git-projects:toggle event is triggered", function() {
      return it("Toggles the view containing the list of projects", function() {
        atom.commands.dispatch(workspaceElement, 'git-projects:toggle');
        expect($(workspaceElement).find('.git-projects')).toExist();
        return setTimeout(function() {
          atom.commands.dispatch(workspaceElement, 'git-projects:toggle');
          return expect($(workspaceElement).find('.git-projects')).not.toExist();
        }, 0);
      });
    });
    return describe("findGitRepos", function() {
      it("should return an array", function() {
        var asserts;
        asserts = 0;
        runs(function() {
          GitProjects.findGitRepos(null, function(repos) {
            expect(repos).toBeArray;
            return asserts++;
          });
          return GitProjects.findGitRepos("~/workspace/;~/workspace; ~/workspace/fake", function(repos) {
            expect(repos).toBeArray;
            return asserts++;
          });
        });
        return waitsFor(function() {
          return asserts === 2;
        });
      });
      it("should not contain any of the ignored patterns", function() {
        var done;
        done = false;
        runs(function() {
          return GitProjects.findGitRepos("~/workspace/;~/workspace; ~/workspace/fake", function(projects) {
            projects.forEach(function(project) {
              return expect(project.path).not.toMatch(/node_modules|\.git/g);
            });
            return done = true;
          });
        });
        return waitsFor(function() {
          return done;
        });
      });
      return it("should not contain any of the ignored paths", function() {
        var done;
        done = false;
        runs(function() {
          return GitProjects.findGitRepos("~/workspace/;~/workspace; ~/workspace/fake", function(projects) {
            projects.forEach(function(project) {
              return expect(project.path).not.toMatch(/\/workspace\/www/g);
            });
            return done = true;
          });
        });
        return waitsFor(function() {
          return done;
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXByb2plY3RzL3NwZWMvZ2l0LXByb2plY3RzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQUZSLENBQUE7O0FBQUEsRUFHQSxnQkFBQSxHQUFtQixJQUhuQixDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSkwsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUxQLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFFdEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxlQUFBO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QixFQUZUO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUlBLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBLEdBQUE7YUFDMUQsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUEsR0FBQTtBQUNyRCxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMscUJBQXpDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxnQkFBRixD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

//# sourceURL=/Users/doot/.atom/packages/git-projects/spec/git-projects-spec.coffee
