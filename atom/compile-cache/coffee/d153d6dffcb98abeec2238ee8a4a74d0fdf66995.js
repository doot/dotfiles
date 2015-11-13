(function() {
  var waitForAutocomplete;

  waitForAutocomplete = require('./spec-helper').waitForAutocomplete;

  describe('Async providers', function() {
    var autocompleteManager, completionDelay, editor, editorView, mainModule, registration, _ref;
    _ref = [], completionDelay = _ref[0], editorView = _ref[1], editor = _ref[2], mainModule = _ref[3], autocompleteManager = _ref[4], registration = _ref[5];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('editor.fontSize', '16');
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
      return waitsFor(function() {
        return autocompleteManager = mainModule.autocompleteManager;
      });
    });
    afterEach(function() {
      return registration != null ? registration.dispose() : void 0;
    });
    describe('when an async provider is registered', function() {
      beforeEach(function() {
        var testAsyncProvider;
        testAsyncProvider = {
          getSuggestions: function(options) {
            return new Promise(function(resolve) {
              return setTimeout(function() {
                return resolve([
                  {
                    text: 'asyncProvided',
                    replacementPrefix: 'asyncProvided',
                    rightLabel: 'asyncProvided'
                  }
                ]);
              }, 10);
            });
          },
          selector: '.source.js'
        };
        return registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testAsyncProvider);
      });
      return it('should provide completions when a provider returns a promise that results in an array of suggestions', function() {
        editor.moveToBottom();
        editor.insertText('o');
        waitForAutocomplete();
        return runs(function() {
          var suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          return expect(suggestionListView.querySelector('li .right-label')).toHaveText('asyncProvided');
        });
      });
    });
    return describe('when a provider takes a long time to provide suggestions', function() {
      beforeEach(function() {
        var testAsyncProvider;
        testAsyncProvider = {
          selector: '.source.js',
          getSuggestions: function(options) {
            return new Promise(function(resolve) {
              return setTimeout(function() {
                return resolve([
                  {
                    text: 'asyncProvided',
                    replacementPrefix: 'asyncProvided',
                    rightLabel: 'asyncProvided'
                  }
                ]);
              }, 1000);
            });
          }
        };
        return registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testAsyncProvider);
      });
      return it('does not show the suggestion list when it is triggered then no longer needed', function() {
        runs(function() {
          editorView = atom.views.getView(editor);
          editor.moveToBottom();
          editor.insertText('o');
          return advanceClock(autocompleteManager.suggestionDelay * 2);
        });
        waits(0);
        runs(function() {
          editor.insertText('\r');
          waitForAutocomplete();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          return advanceClock(1000);
        });
        waits(0);
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9hdXRvY29tcGxldGUtbWFuYWdlci1hc3luYy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsZUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLHdGQUFBO0FBQUEsSUFBQSxPQUF1RixFQUF2RixFQUFDLHlCQUFELEVBQWtCLG9CQUFsQixFQUE4QixnQkFBOUIsRUFBc0Msb0JBQXRDLEVBQWtELDZCQUFsRCxFQUF1RSxzQkFBdkUsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILFlBQUEsZ0JBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLEVBQW1DLElBQW5DLENBREEsQ0FBQTtBQUFBLFFBSUEsZUFBQSxHQUFrQixHQUpsQixDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLEVBQXlELGVBQXpELENBTEEsQ0FBQTtBQUFBLFFBTUEsZUFBQSxJQUFtQixHQU5uQixDQUFBO0FBQUEsUUFRQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBUm5CLENBQUE7ZUFTQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsRUFYRztN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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/autocomplete-manager-async-spec.coffee
