(function() {
  var buildIMECompositionEvent, buildTextInputEvent, triggerAutocompletion, _ref;

  _ref = require('./spec-helper'), triggerAutocompletion = _ref.triggerAutocompletion, buildIMECompositionEvent = _ref.buildIMECompositionEvent, buildTextInputEvent = _ref.buildTextInputEvent;

  describe('FuzzyProvider', function() {
    var autocompleteManager, completionDelay, editor, editorView, mainModule, _ref1;
    _ref1 = [], completionDelay = _ref1[0], editorView = _ref1[1], editor = _ref1[2], mainModule = _ref1[3], autocompleteManager = _ref1[4];
    beforeEach(function() {
      var workspaceElement;
      atom.config.set('autocomplete-plus.enableAutoActivation', true);
      atom.config.set('autocomplete-plus.defaultProvider', 'Fuzzy');
      completionDelay = 100;
      atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
      completionDelay += 100;
      workspaceElement = atom.views.getView(atom.workspace);
      return jasmine.attachToDOM(workspaceElement);
    });
    return describe('when auto-activation is enabled', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return Promise.all([
            atom.packages.activatePackage("language-javascript"), atom.workspace.open('sample.js').then(function(e) {
              return editor = e;
            }), atom.packages.activatePackage('autocomplete-plus').then(function(a) {
              return mainModule = a.mainModule;
            })
          ]);
        });
        return runs(function() {
          autocompleteManager = mainModule.autocompleteManager;
          advanceClock(mainModule.autocompleteManager.providerManager.defaultProvider.deferBuildWordListInterval);
          return editorView = atom.views.getView(editor);
        });
      });
      it('adds words to the wordlist after they have been written', function() {
        var provider;
        editor.moveToBottom();
        editor.moveToBeginningOfLine();
        provider = autocompleteManager.providerManager.defaultProvider;
        expect(provider.tokenList.getToken('somethingNew')).toBeUndefined();
        editor.insertText('somethingNew');
        return expect(provider.tokenList.getToken('somethingNew')).toBe('somethingNew');
      });
      it('removes words that are no longer in the buffer', function() {
        var provider;
        editor.moveToBottom();
        editor.moveToBeginningOfLine();
        provider = autocompleteManager.providerManager.defaultProvider;
        expect(provider.tokenList.getToken('somethingNew')).toBeUndefined();
        editor.insertText('somethingNew');
        expect(provider.tokenList.getToken('somethingNew')).toBe('somethingNew');
        editor.backspace();
        expect(provider.tokenList.getToken('somethingNew')).toBe(void 0);
        return expect(provider.tokenList.getToken('somethingNe')).toBe('somethingNe');
      });
      it("adds completions from editor.completions", function() {
        var bufferPosition, prefix, provider, results, scopeDescriptor;
        provider = autocompleteManager.providerManager.defaultProvider;
        atom.config.set('editor.completions', ['abcd', 'abcde', 'abcdef'], {
          scopeSelector: '.source.js'
        });
        editor.moveToBottom();
        editor.insertText('ab');
        bufferPosition = editor.getLastCursor().getBufferPosition();
        scopeDescriptor = editor.getRootScopeDescriptor();
        prefix = 'ab';
        results = provider.getSuggestions({
          editor: editor,
          bufferPosition: bufferPosition,
          scopeDescriptor: scopeDescriptor,
          prefix: prefix
        });
        return expect(results[0].text).toBe('abcd');
      });
      it("adds completions from settings", function() {
        var bufferPosition, prefix, provider, results, scopeDescriptor;
        provider = autocompleteManager.providerManager.defaultProvider;
        atom.config.set('editor.completions', {
          builtin: {
            suggestions: ['nope']
          }
        }, {
          scopeSelector: '.source.js'
        });
        editor.moveToBottom();
        editor.insertText('ab');
        bufferPosition = editor.getLastCursor().getBufferPosition();
        scopeDescriptor = editor.getRootScopeDescriptor();
        prefix = 'ab';
        results = provider.getSuggestions({
          editor: editor,
          bufferPosition: bufferPosition,
          scopeDescriptor: scopeDescriptor,
          prefix: prefix
        });
        return expect(results).toBeUndefined();
      });
      xit('adds words to the wordlist with unicode characters', function() {
        var provider;
        provider = autocompleteManager.providerManager.defaultProvider;
        expect(provider.tokenList.indexOf('somēthingNew')).toEqual(-1);
        editor.insertText('somēthingNew');
        editor.insertText(' ');
        return expect(provider.tokenList.indexOf('somēthingNew')).not.toEqual(-1);
      });
      return xit('removes words from the wordlist when they no longer exist in any open buffers', function() {
        var provider, _i;
        provider = autocompleteManager.providerManager.defaultProvider;
        expect(provider.tokenList.indexOf('bogos')).toEqual(-1);
        editor.insertText('bogos = 1');
        editor.insertText(' ');
        expect(provider.tokenList.indexOf('bogos')).not.toEqual(-1);
        expect(provider.tokenList.indexOf('bogus')).toEqual(-1);
        for (_i = 1; _i <= 7; _i++) {
          editor.backspace();
        }
        editor.insertText('us = 1');
        editor.insertText(' ');
        expect(provider.tokenList.indexOf('bogus')).not.toEqual(-1);
        return expect(provider.tokenList.indexOf('bogos')).toEqual(-1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9mdXp6eS1wcm92aWRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRUFBQTs7QUFBQSxFQUFBLE9BQXlFLE9BQUEsQ0FBUSxlQUFSLENBQXpFLEVBQUMsNkJBQUEscUJBQUQsRUFBd0IsZ0NBQUEsd0JBQXhCLEVBQWtELDJCQUFBLG1CQUFsRCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsMkVBQUE7QUFBQSxJQUFBLFFBQXlFLEVBQXpFLEVBQUMsMEJBQUQsRUFBa0IscUJBQWxCLEVBQThCLGlCQUE5QixFQUFzQyxxQkFBdEMsRUFBa0QsOEJBQWxELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFFVCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFELENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1DQUFoQixFQUFxRCxPQUFyRCxDQURBLENBQUE7QUFBQSxNQUlBLGVBQUEsR0FBa0IsR0FKbEIsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixFQUF5RCxlQUF6RCxDQUxBLENBQUE7QUFBQSxNQU1BLGVBQUEsSUFBbUIsR0FObkIsQ0FBQTtBQUFBLE1BUUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQVJuQixDQUFBO2FBU0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLEVBWFM7SUFBQSxDQUFY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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/fuzzy-provider-spec.coffee
