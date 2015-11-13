(function() {
  var BrowserPlus;

  BrowserPlus = require('../lib/browser-plus');

  describe("BrowserPlus", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('browser-plus');
    });
    return describe("when the browser-plus:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.browser-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var browserPlusElement, browserPlusPanel;
          expect(workspaceElement.querySelector('.browser-plus')).toExist();
          browserPlusElement = workspaceElement.querySelector('.browser-plus');
          expect(browserPlusElement).toExist();
          browserPlusPanel = atom.workspace.panelForItem(browserPlusElement);
          expect(browserPlusPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
          return expect(browserPlusPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.browser-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var browserPlusElement;
          browserPlusElement = workspaceElement.querySelector('.browser-plus');
          expect(browserPlusElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
          return expect(browserPlusElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL3NwZWMvYnJvd3Nlci1wbHVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsUUFBQSxDQUFTLGlEQUFULEVBQTRELFNBQUEsR0FBQTtBQUMxRCxNQUFBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFHcEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsZUFBL0IsQ0FBUCxDQUF1RCxDQUFDLEdBQUcsQ0FBQyxPQUE1RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxxQkFBekMsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLG9DQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsZUFBL0IsQ0FBUCxDQUF1RCxDQUFDLE9BQXhELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxrQkFBQSxHQUFxQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixlQUEvQixDQUZyQixDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sa0JBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFBLENBSEEsQ0FBQTtBQUFBLFVBS0EsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLGtCQUE1QixDQUxuQixDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsU0FBakIsQ0FBQSxDQUFQLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsSUFBMUMsQ0FOQSxDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHFCQUF6QyxDQVBBLENBQUE7aUJBUUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLFNBQWpCLENBQUEsQ0FBUCxDQUFvQyxDQUFDLElBQXJDLENBQTBDLEtBQTFDLEVBVEc7UUFBQSxDQUFMLEVBWm9DO01BQUEsQ0FBdEMsQ0FBQSxDQUFBO2FBdUJBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFPN0IsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsZUFBL0IsQ0FBUCxDQUF1RCxDQUFDLEdBQUcsQ0FBQyxPQUE1RCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxxQkFBekMsQ0FOQSxDQUFBO0FBQUEsUUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBUkEsQ0FBQTtlQVdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxjQUFBLGtCQUFBO0FBQUEsVUFBQSxrQkFBQSxHQUFxQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixlQUEvQixDQUFyQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sa0JBQVAsQ0FBMEIsQ0FBQyxXQUEzQixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxxQkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxrQkFBUCxDQUEwQixDQUFDLEdBQUcsQ0FBQyxXQUEvQixDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEIwRDtJQUFBLENBQTVELEVBUHNCO0VBQUEsQ0FBeEIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/browser-plus/spec/browser-plus-spec.coffee
