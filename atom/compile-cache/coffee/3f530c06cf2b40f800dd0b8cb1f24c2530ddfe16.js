(function() {
  var waitForAutocomplete;

  waitForAutocomplete = require('./spec-helper').waitForAutocomplete;

  describe('Autocomplete', function() {
    var autocompleteManager, completionDelay, editor, editorView, mainModule, _ref;
    _ref = [], completionDelay = _ref[0], editorView = _ref[1], editor = _ref[2], autocompleteManager = _ref[3], mainModule = _ref[4];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('autocomplete-plus.fileBlacklist', ['.*', '*.md']);
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmine.attachToDOM(workspaceElement);
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
      runs(function() {
        return autocompleteManager = mainModule.autocompleteManager;
      });
      return runs(function() {
        editorView = atom.views.getView(editor);
        return advanceClock(mainModule.autocompleteManager.providerManager.defaultProvider.deferBuildWordListInterval);
      });
    });
    describe('@activate()', function() {
      return it('activates autocomplete and initializes AutocompleteManager', function() {
        return runs(function() {
          expect(autocompleteManager).toBeDefined();
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
    return describe('@deactivate()', function() {
      return it('removes all autocomplete views', function() {
        return runs(function() {
          var buffer;
          buffer = editor.getBuffer();
          editor.moveToBottom();
          editor.insertText('A');
          waitForAutocomplete();
          return runs(function() {
            editorView = editorView;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            atom.packages.deactivatePackage('autocomplete-plus');
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9tYWluLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxlQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSwwRUFBQTtBQUFBLElBQUEsT0FBeUUsRUFBekUsRUFBQyx5QkFBRCxFQUFrQixvQkFBbEIsRUFBOEIsZ0JBQTlCLEVBQXNDLDZCQUF0QyxFQUEyRCxvQkFBM0QsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILFlBQUEsZ0JBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLEVBQW1ELENBQUMsSUFBRCxFQUFPLE1BQVAsQ0FBbkQsQ0FEQSxDQUFBO0FBQUEsUUFJQSxlQUFBLEdBQWtCLEdBSmxCLENBQUE7QUFBQSxRQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsZUFBekQsQ0FMQSxDQUFBO0FBQUEsUUFNQSxlQUFBLElBQW1CLEdBTm5CLENBQUE7QUFBQSxRQVFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FSbkIsQ0FBQTtlQVNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQVhHO01BQUEsQ0FBTCxDQUFBLENB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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/main-spec.coffee
