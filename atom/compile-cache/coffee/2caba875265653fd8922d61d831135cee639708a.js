(function() {
  describe('Tool Bar package', function() {
    var toolBarAPI, toolBarService, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], toolBarService = _ref[1], toolBarAPI = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('tool-bar').then(function(pack) {
          return toolBarService = pack.mainModule.provideToolBar();
        });
      });
    });
    describe('@activate', function() {
      return it('appends only one tool bar', function() {
        expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        return expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
      });
    });
    describe('@deactivate', function() {
      return it('removes the tool bar view', function() {
        atom.packages.deactivatePackage('tool-bar');
        return expect(workspaceElement.querySelector('.tool-bar')).toBeNull();
      });
    });
    describe('provides a service API', function() {
      it('for others to use', function() {
        expect(toolBarService).toBeDefined();
        return expect(typeof toolBarService).toBe('function');
      });
      describe('which can add a button', function() {
        var toolBar;
        toolBar = [][0];
        beforeEach(function() {
          toolBarAPI = toolBarService('specs-tool-bar');
          return toolBar = workspaceElement.querySelector('.tool-bar');
        });
        it('by third-party packages', function() {
          expect(toolBarAPI).toBeDefined();
          return expect(toolBarAPI.group).toBe('specs-tool-bar');
        });
        it('with minimum settings', function() {
          toolBarAPI.addButton({
            icon: 'octoface',
            callback: 'application:about',
            tooltip: 'About Atom'
          });
          expect(toolBar.children.length).toBe(1);
          expect(toolBar.firstChild.classList.contains('icon-octoface')).toBe(true);
          return expect(toolBar.firstChild.dataset.originalTitle).toBe('About Atom');
        });
        it('using custom icon set (Ionicons)', function() {
          toolBarAPI.addButton({
            icon: 'gear-a',
            callback: 'application:show-settings',
            tooltip: 'Show Settings',
            iconset: 'ion'
          });
          expect(toolBar.children.length).toBe(1);
          expect(toolBar.firstChild.classList.contains('ion')).toBe(true);
          expect(toolBar.firstChild.classList.contains('ion-gear-a')).toBe(true);
          return expect(toolBar.firstChild.dataset.originalTitle).toBe('Show Settings');
        });
        return it('and disabling it', function() {
          var button;
          button = toolBarAPI.addButton({
            icon: 'octoface',
            callback: 'application:about',
            tooltip: 'About Atom'
          });
          button.setEnabled(false);
          expect(toolBar.children.length).toBe(1);
          return expect(toolBar.firstChild.classList.contains('disabled')).toBe(true);
        });
      });
      return describe('which can add a spacer', function() {
        var toolBar;
        toolBar = [][0];
        beforeEach(function() {
          toolBarAPI = toolBarService('specs-tool-bar');
          return toolBar = workspaceElement.querySelector('.tool-bar');
        });
        return it('with no settings', function() {
          toolBarAPI.addSpacer();
          expect(toolBar.children.length).toBe(1);
          return expect(toolBar.firstChild.nodeName).toBe('HR');
        });
      });
    });
    describe('when tool-bar:toggle is triggered', function() {
      return it('hides or shows the tool bar', function() {
        atom.commands.dispatch(workspaceElement, 'tool-bar:toggle');
        expect(workspaceElement.querySelector('.tool-bar')).toBeNull();
        atom.commands.dispatch(workspaceElement, 'tool-bar:toggle');
        return expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1);
      });
    });
    return describe('when tool-bar position is changed', function() {
      var bottomPanelElement, leftPanelElement, rightPanelElement, topPanelElement, _ref1;
      _ref1 = [], topPanelElement = _ref1[0], rightPanelElement = _ref1[1], bottomPanelElement = _ref1[2], leftPanelElement = _ref1[3];
      beforeEach(function() {
        topPanelElement = atom.views.getView(atom.workspace.panelContainers.top);
        rightPanelElement = atom.views.getView(atom.workspace.panelContainers.right);
        bottomPanelElement = atom.views.getView(atom.workspace.panelContainers.bottom);
        return leftPanelElement = atom.views.getView(atom.workspace.panelContainers.left);
      });
      describe('by triggering tool-bar:position-top', function() {
        return it('the tool bar view is added to top pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-top');
          expect(topPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      describe('by triggering tool-bar:position-right', function() {
        return it('the tool bar view is added to right pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-right');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      describe('by triggering tool-bar:position-bottom', function() {
        return it('the tool bar view is added to bottom pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-bottom');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
          return expect(leftPanelElement.querySelector('.tool-bar')).toBeNull();
        });
      });
      return describe('by triggering tool-bar:position-left', function() {
        return it('the tool bar view is added to left pane', function() {
          atom.commands.dispatch(workspaceElement, 'tool-bar:position-left');
          expect(topPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(rightPanelElement.querySelector('.tool-bar')).toBeNull();
          expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull();
          return expect(leftPanelElement.querySelectorAll('.tool-bar').length).toBe(1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvc3BlYy90b29sLWJhci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsa0RBQUE7QUFBQSxJQUFBLE9BQWlELEVBQWpELEVBQUMsMEJBQUQsRUFBbUIsd0JBQW5CLEVBQW1DLG9CQUFuQyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixDQUF5QyxDQUFDLElBQTFDLENBQStDLFNBQUMsSUFBRCxHQUFBO2lCQUM3QyxjQUFBLEdBQWlCLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBaEIsQ0FBQSxFQUQ0QjtRQUFBLENBQS9DLEVBRGM7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVNBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTthQUNwQixFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxXQUFsQyxDQUE4QyxDQUFDLE1BQXRELENBQTZELENBQUMsSUFBOUQsQ0FBbUUsQ0FBbkUsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFVBQS9CLENBQTBDO0FBQUEsVUFBQSxjQUFBLEVBQWdCLElBQWhCO1NB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

//# sourceURL=/Users/doot/.atom/packages/tool-bar/spec/tool-bar-spec.coffee
