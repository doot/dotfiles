(function() {
  var waitForAutocomplete;

  waitForAutocomplete = require('./spec-helper').waitForAutocomplete;

  describe('Autocomplete Manager', function() {
    var autocompleteManager, completionDelay, editor, editorView, mainModule, _ref;
    _ref = [], completionDelay = _ref[0], editorView = _ref[1], editor = _ref[2], mainModule = _ref[3], autocompleteManager = _ref[4];
    beforeEach(function() {
      return runs(function() {
        var workspaceElement;
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('editor.fontSize', '16');
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmine.attachToDOM(workspaceElement);
      });
    });
    return describe('Undo a completion', function() {
      beforeEach(function() {
        runs(function() {
          return atom.config.set('autocomplete-plus.enableAutoActivation', true);
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js').then(function(e) {
            return editor = e;
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('autocomplete-plus').then(function(a) {
            return mainModule = a.mainModule;
          });
        });
        waitsFor(function() {
          var _ref1;
          return (_ref1 = mainModule.autocompleteManager) != null ? _ref1.ready : void 0;
        });
        return runs(function() {
          autocompleteManager = mainModule.autocompleteManager;
          return advanceClock(autocompleteManager.providerManager.defaultProvider.deferBuildWordListInterval);
        });
      });
      return it('restores the previous state', function() {
        editor.moveToBottom();
        editor.moveToBeginningOfLine();
        editor.insertText('f');
        waitForAutocomplete();
        return runs(function() {
          editorView = atom.views.getView(editor);
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          expect(editor.getBuffer().getLastLine()).toEqual('function');
          editor.undo();
          return expect(editor.getBuffer().getLastLine()).toEqual('f');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9hdXRvY29tcGxldGUtbWFuYWdlci11bmRvLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxlQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsMEVBQUE7QUFBQSxJQUFBLE9BQXlFLEVBQXpFLEVBQUMseUJBQUQsRUFBa0Isb0JBQWxCLEVBQThCLGdCQUE5QixFQUFzQyxvQkFBdEMsRUFBa0QsNkJBQWxELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFBLENBQUssU0FBQSxHQUFBO0FBRUgsWUFBQSxnQkFBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUMsSUFBbkMsQ0FEQSxDQUFBO0FBQUEsUUFJQSxlQUFBLEdBQWtCLEdBSmxCLENBQUE7QUFBQSxRQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsZUFBekQsQ0FMQSxDQUFBO0FBQUEsUUFNQSxlQUFBLElBQW1CLEdBTm5CLENBQUE7QUFBQSxRQVFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FSbkIsQ0FBQTtlQVNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQVhHO01BQUEsQ0FBTCxFQURTO0lBQUEs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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/autocomplete-manager-undo-spec.coffee
