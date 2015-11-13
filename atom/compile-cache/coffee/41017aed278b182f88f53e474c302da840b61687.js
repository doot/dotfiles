(function() {
  var Point, buildIMECompositionEvent, buildTextInputEvent, suggestionForWord, suggestionsForPrefix, triggerAutocompletion, _ref;

  Point = require('atom').Point;

  _ref = require('./spec-helper'), triggerAutocompletion = _ref.triggerAutocompletion, buildIMECompositionEvent = _ref.buildIMECompositionEvent, buildTextInputEvent = _ref.buildTextInputEvent;

  suggestionForWord = function(suggestionList, word) {
    return suggestionList.getSymbol(word);
  };

  suggestionsForPrefix = function(provider, editor, prefix, options) {
    var bufferPosition, scopeDescriptor, sug, suggestions, _i, _len, _results;
    bufferPosition = editor.getCursorBufferPosition();
    scopeDescriptor = editor.getLastCursor().getScopeDescriptor();
    suggestions = provider.getSuggestions({
      editor: editor,
      bufferPosition: bufferPosition,
      prefix: prefix,
      scopeDescriptor: scopeDescriptor
    });
    if (options != null ? options.raw : void 0) {
      return suggestions;
    } else {
      if (suggestions) {
        _results = [];
        for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
          sug = suggestions[_i];
          _results.push(sug.text);
        }
        return _results;
      } else {
        return [];
      }
    }
  };

  describe('SymbolProvider', function() {
    var autocompleteManager, completionDelay, editor, editorView, mainModule, provider, _ref1;
    _ref1 = [], completionDelay = _ref1[0], editorView = _ref1[1], editor = _ref1[2], mainModule = _ref1[3], autocompleteManager = _ref1[4], provider = _ref1[5];
    beforeEach(function() {
      var workspaceElement;
      atom.config.set('autocomplete-plus.enableAutoActivation', true);
      atom.config.set('autocomplete-plus.defaultProvider', 'Symbol');
      completionDelay = 100;
      atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
      completionDelay += 100;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return Promise.all([
          atom.workspace.open("sample.js").then(function(e) {
            return editor = e;
          }), atom.packages.activatePackage("language-javascript"), atom.packages.activatePackage("autocomplete-plus").then(function(a) {
            return mainModule = a.mainModule;
          })
        ]);
      });
      return runs(function() {
        autocompleteManager = mainModule.autocompleteManager;
        advanceClock(1);
        editorView = atom.views.getView(editor);
        return provider = autocompleteManager.providerManager.defaultProvider;
      });
    });
    it("runs a completion ", function() {
      return expect(suggestionForWord(provider.symbolStore, 'quicksort')).toBeTruthy();
    });
    it("adds words to the symbol list after they have been written", function() {
      expect(suggestionsForPrefix(provider, editor, 'anew')).not.toContain('aNewFunction');
      editor.insertText('function aNewFunction(){};');
      editor.insertText(' ');
      advanceClock(provider.changeUpdateDelay);
      return expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunction');
    });
    it("adds words after they have been added to a scope that is not a direct match for the selector", function() {
      expect(suggestionsForPrefix(provider, editor, 'some')).not.toContain('somestring');
      editor.insertText('abc = "somestring"');
      editor.insertText(' ');
      advanceClock(provider.changeUpdateDelay);
      return expect(suggestionsForPrefix(provider, editor, 'some')).toContain('somestring');
    });
    it("removes words from the symbol list when they do not exist in the buffer", function() {
      editor.moveToBottom();
      editor.moveToBeginningOfLine();
      expect(suggestionsForPrefix(provider, editor, 'anew')).not.toContain('aNewFunction');
      editor.insertText('function aNewFunction(){};');
      editor.moveToEndOfLine();
      advanceClock(provider.changeUpdateDelay);
      expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunction');
      editor.setCursorBufferPosition([13, 21]);
      editor.backspace();
      editor.moveToTop();
      advanceClock(provider.changeUpdateDelay);
      expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunctio');
      return expect(suggestionsForPrefix(provider, editor, 'anew')).not.toContain('aNewFunction');
    });
    it("does not return the word under the cursor when there is only a prefix", function() {
      editor.moveToBottom();
      editor.insertText('qu');
      expect(suggestionsForPrefix(provider, editor, 'qu')).not.toContain('qu');
      editor.insertText(' qu');
      return expect(suggestionsForPrefix(provider, editor, 'qu')).toContain('qu');
    });
    it("does not return the word under the cursor when there is a suffix and only one instance of the word", function() {
      editor.moveToBottom();
      editor.insertText('catscats');
      editor.moveToBeginningOfLine();
      editor.insertText('omg');
      expect(suggestionsForPrefix(provider, editor, 'omg')).not.toContain('omg');
      return expect(suggestionsForPrefix(provider, editor, 'omg')).not.toContain('omgcatscats');
    });
    it("does not return the word under the cursors when are multiple cursors", function() {
      editor.moveToBottom();
      editor.setText('\n\n\n');
      editor.setCursorBufferPosition([0, 0]);
      editor.addCursorAtBufferPosition([1, 0]);
      editor.addCursorAtBufferPosition([2, 0]);
      editor.insertText('omg');
      return expect(suggestionsForPrefix(provider, editor, 'omg')).not.toContain('omg');
    });
    it("returns the word under the cursor when there is a suffix and there are multiple instances of the word", function() {
      editor.moveToBottom();
      editor.insertText('icksort');
      editor.moveToBeginningOfLine();
      editor.insertText('qu');
      expect(suggestionsForPrefix(provider, editor, 'qu')).not.toContain('qu');
      return expect(suggestionsForPrefix(provider, editor, 'qu')).toContain('quicksort');
    });
    it("correctly tracks the buffer row associated with symbols as they change", function() {
      var suggestion;
      editor.setText('');
      advanceClock(provider.changeUpdateDelay);
      editor.setText('function abc(){}\nfunction abc(){}');
      advanceClock(provider.changeUpdateDelay);
      suggestion = suggestionForWord(provider.symbolStore, 'abc');
      expect(suggestion.bufferRowsForBuffer(editor.getBuffer())).toEqual([0, 1]);
      editor.setCursorBufferPosition([2, 100]);
      editor.insertText('\n\nfunction omg(){}; function omg(){}');
      advanceClock(provider.changeUpdateDelay);
      suggestion = suggestionForWord(provider.symbolStore, 'omg');
      expect(suggestion.bufferRowsForBuffer(editor.getBuffer())).toEqual([3, 3]);
      editor.selectLeft(16);
      editor.backspace();
      advanceClock(provider.changeUpdateDelay);
      suggestion = suggestionForWord(provider.symbolStore, 'omg');
      expect(suggestion.bufferRowsForBuffer(editor.getBuffer())).toEqual([3]);
      editor.insertText('\nfunction omg(){}');
      advanceClock(provider.changeUpdateDelay);
      suggestion = suggestionForWord(provider.symbolStore, 'omg');
      expect(suggestion.bufferRowsForBuffer(editor.getBuffer())).toEqual([3, 4]);
      editor.setText('');
      advanceClock(provider.changeUpdateDelay);
      expect(suggestionForWord(provider.symbolStore, 'abc')).toBeUndefined();
      expect(suggestionForWord(provider.symbolStore, 'omg')).toBeUndefined();
      editor.setText('function abc(){}\nfunction abc(){}');
      editor.setCursorBufferPosition([0, 0]);
      editor.insertText('\n');
      editor.setCursorBufferPosition([2, 100]);
      editor.insertText('\nfunction abc(){}');
      advanceClock(provider.changeUpdateDelay);
      suggestion = suggestionForWord(provider.symbolStore, 'abc');
      return expect(suggestion.bufferRowsForBuffer(editor.getBuffer())).toContain(3);
    });
    it("does not output suggestions from the other buffer", function() {
      var coffeeEditor, results, _ref2;
      _ref2 = [], results = _ref2[0], coffeeEditor = _ref2[1];
      waitsForPromise(function() {
        return Promise.all([
          atom.packages.activatePackage("language-coffee-script"), atom.workspace.open("sample.coffee").then(function(e) {
            return coffeeEditor = e;
          })
        ]);
      });
      return runs(function() {
        advanceClock(1);
        return expect(suggestionsForPrefix(provider, coffeeEditor, 'item')).toHaveLength(0);
      });
    });
    describe("when autocomplete-plus.minimumWordLength is > 1", function() {
      beforeEach(function() {
        return atom.config.set('autocomplete-plus.minimumWordLength', 3);
      });
      return it("only returns results when the prefix is at least the min word length", function() {
        editor.insertText('function aNewFunction(){};');
        advanceClock(provider.changeUpdateDelay);
        expect(suggestionsForPrefix(provider, editor, '')).not.toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'a')).not.toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'an')).not.toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'ane')).toContain('aNewFunction');
        return expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunction');
      });
    });
    describe("when autocomplete-plus.minimumWordLength is 0", function() {
      beforeEach(function() {
        return atom.config.set('autocomplete-plus.minimumWordLength', 0);
      });
      return it("only returns results when the prefix is at least the min word length", function() {
        editor.insertText('function aNewFunction(){};');
        advanceClock(provider.changeUpdateDelay);
        expect(suggestionsForPrefix(provider, editor, '')).not.toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'a')).toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'an')).toContain('aNewFunction');
        expect(suggestionsForPrefix(provider, editor, 'ane')).toContain('aNewFunction');
        return expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunction');
      });
    });
    describe("when the editor's path changes", function() {
      return it("continues to track changes on the new path", function() {
        var buffer;
        buffer = editor.getBuffer();
        expect(provider.isWatchingEditor(editor)).toBe(true);
        expect(provider.isWatchingBuffer(buffer)).toBe(true);
        expect(suggestionsForPrefix(provider, editor, 'qu')).toContain('quicksort');
        buffer.setPath('cats.js');
        expect(provider.isWatchingEditor(editor)).toBe(true);
        expect(provider.isWatchingBuffer(buffer)).toBe(true);
        editor.moveToBottom();
        editor.moveToBeginningOfLine();
        expect(suggestionsForPrefix(provider, editor, 'qu')).toContain('quicksort');
        expect(suggestionsForPrefix(provider, editor, 'anew')).not.toContain('aNewFunction');
        editor.insertText('function aNewFunction(){};');
        return expect(suggestionsForPrefix(provider, editor, 'anew')).toContain('aNewFunction');
      });
    });
    describe("when multiple editors track the same buffer", function() {
      var leftPane, rightEditor, rightPane, _ref2;
      _ref2 = [], leftPane = _ref2[0], rightPane = _ref2[1], rightEditor = _ref2[2];
      beforeEach(function() {
        var pane;
        pane = atom.workspace.paneForItem(editor);
        rightPane = pane.splitRight({
          copyActiveItem: true
        });
        rightEditor = rightPane.getItems()[0];
        expect(provider.isWatchingEditor(editor)).toBe(true);
        return expect(provider.isWatchingEditor(rightEditor)).toBe(true);
      });
      it("watches the both the old and new editor for changes", function() {
        rightEditor.moveToBottom();
        rightEditor.moveToBeginningOfLine();
        expect(suggestionsForPrefix(provider, rightEditor, 'anew')).not.toContain('aNewFunction');
        rightEditor.insertText('function aNewFunction(){};');
        expect(suggestionsForPrefix(provider, rightEditor, 'anew')).toContain('aNewFunction');
        editor.moveToBottom();
        editor.moveToBeginningOfLine();
        expect(suggestionsForPrefix(provider, editor, 'somenew')).not.toContain('someNewFunction');
        editor.insertText('function someNewFunction(){};');
        return expect(suggestionsForPrefix(provider, editor, 'somenew')).toContain('someNewFunction');
      });
      return it("stops watching editors and removes content from symbol store as they are destroyed", function() {
        var buffer;
        expect(suggestionForWord(provider.symbolStore, 'quicksort')).toBeTruthy();
        buffer = editor.getBuffer();
        editor.destroy();
        expect(provider.isWatchingBuffer(buffer)).toBe(true);
        expect(provider.isWatchingEditor(editor)).toBe(false);
        expect(provider.isWatchingEditor(rightEditor)).toBe(true);
        expect(suggestionForWord(provider.symbolStore, 'quicksort')).toBeTruthy();
        expect(suggestionForWord(provider.symbolStore, 'aNewFunction')).toBeFalsy();
        rightEditor.insertText('function aNewFunction(){};');
        expect(suggestionForWord(provider.symbolStore, 'aNewFunction')).toBeTruthy();
        rightPane.destroy();
        expect(provider.isWatchingBuffer(buffer)).toBe(false);
        expect(provider.isWatchingEditor(editor)).toBe(false);
        expect(provider.isWatchingEditor(rightEditor)).toBe(false);
        expect(suggestionForWord(provider.symbolStore, 'quicksort')).toBeFalsy();
        return expect(suggestionForWord(provider.symbolStore, 'aNewFunction')).toBeFalsy();
      });
    });
    describe("when includeCompletionsFromAllBuffers is enabled", function() {
      beforeEach(function() {
        atom.config.set('autocomplete-plus.includeCompletionsFromAllBuffers', true);
        waitsForPromise(function() {
          return Promise.all([
            atom.packages.activatePackage("language-coffee-script"), atom.workspace.open("sample.coffee").then(function(e) {
              return editor = e;
            })
          ]);
        });
        return runs(function() {
          return advanceClock(1);
        });
      });
      afterEach(function() {
        return atom.config.set('autocomplete-plus.includeCompletionsFromAllBuffers', false);
      });
      it("outputs unique suggestions", function() {
        var results;
        editor.setCursorBufferPosition([7, 0]);
        results = suggestionsForPrefix(provider, editor, 'qu');
        return expect(results).toHaveLength(1);
      });
      return it("outputs suggestions from the other buffer", function() {
        var results;
        editor.setCursorBufferPosition([7, 0]);
        results = suggestionsForPrefix(provider, editor, 'item');
        return expect(results[0]).toBe('items');
      });
    });
    describe("when the autocomplete.symbols changes between scopes", function() {
      beforeEach(function() {
        var commentConfig, stringConfig;
        editor.setText('// in-a-comment\ninvar = "in-a-string"');
        commentConfig = {
          incomment: {
            selector: '.comment'
          }
        };
        stringConfig = {
          instring: {
            selector: '.string'
          }
        };
        atom.config.set('autocomplete.symbols', commentConfig, {
          scopeSelector: '.source.js .comment'
        });
        return atom.config.set('autocomplete.symbols', stringConfig, {
          scopeSelector: '.source.js .string'
        });
      });
      return it("uses the config for the scope under the cursor", function() {
        var suggestions;
        editor.setCursorBufferPosition([0, 2]);
        suggestions = suggestionsForPrefix(provider, editor, 'in', {
          raw: true
        });
        expect(suggestions).toHaveLength(1);
        expect(suggestions[0].text).toBe('in-a-comment');
        expect(suggestions[0].type).toBe('incomment');
        editor.setCursorBufferPosition([1, 20]);
        editor.insertText(' ');
        suggestions = suggestionsForPrefix(provider, editor, 'in', {
          raw: true
        });
        expect(suggestions).toHaveLength(1);
        expect(suggestions[0].text).toBe('in-a-string');
        expect(suggestions[0].type).toBe('instring');
        editor.setCursorBufferPosition([1, Infinity]);
        editor.insertText(' ');
        suggestions = suggestionsForPrefix(provider, editor, 'in', {
          raw: true
        });
        expect(suggestions).toHaveLength(3);
        expect(suggestions[0].text).toBe('invar');
        return expect(suggestions[0].type).toBe('');
      });
    });
    describe("when the config contains a list of suggestion strings", function() {
      beforeEach(function() {
        var commentConfig;
        editor.setText('// abcomment');
        commentConfig = {
          comment: {
            selector: '.comment'
          },
          builtin: {
            suggestions: ['abcd', 'abcde', 'abcdef']
          }
        };
        return atom.config.set('autocomplete.symbols', commentConfig, {
          scopeSelector: '.source.js .comment'
        });
      });
      return it("adds the suggestions to the results", function() {
        var suggestions;
        editor.setCursorBufferPosition([0, 2]);
        suggestions = suggestionsForPrefix(provider, editor, 'ab', {
          raw: true
        });
        expect(suggestions).toHaveLength(4);
        expect(suggestions[0].text).toBe('abcomment');
        expect(suggestions[0].type).toBe('comment');
        expect(suggestions[1].text).toBe('abcd');
        return expect(suggestions[1].type).toBe('builtin');
      });
    });
    describe("when the symbols config contains a list of suggestion objects", function() {
      beforeEach(function() {
        var commentConfig;
        editor.setText('// abcomment');
        commentConfig = {
          comment: {
            selector: '.comment'
          },
          builtin: {
            suggestions: [
              {
                nope: 'nope1',
                rightLabel: 'will not be added to the suggestions'
              }, {
                text: 'abcd',
                rightLabel: 'one',
                type: 'function'
              }, []
            ]
          }
        };
        return atom.config.set('autocomplete.symbols', commentConfig, {
          scopeSelector: '.source.js .comment'
        });
      });
      return it("adds the suggestion objects to the results", function() {
        var suggestions;
        editor.setCursorBufferPosition([0, 2]);
        suggestions = suggestionsForPrefix(provider, editor, 'ab', {
          raw: true
        });
        expect(suggestions).toHaveLength(2);
        expect(suggestions[0].text).toBe('abcomment');
        expect(suggestions[0].type).toBe('comment');
        expect(suggestions[1].text).toBe('abcd');
        expect(suggestions[1].type).toBe('function');
        return expect(suggestions[1].rightLabel).toBe('one');
      });
    });
    describe("when the legacy completions array is used", function() {
      beforeEach(function() {
        editor.setText('// abcomment');
        return atom.config.set('editor.completions', ['abcd', 'abcde', 'abcdef'], {
          scopeSelector: '.source.js .comment'
        });
      });
      return it("uses the config for the scope under the cursor", function() {
        var suggestions;
        editor.setCursorBufferPosition([0, 2]);
        suggestions = suggestionsForPrefix(provider, editor, 'ab', {
          raw: true
        });
        expect(suggestions).toHaveLength(4);
        expect(suggestions[0].text).toBe('abcomment');
        expect(suggestions[0].type).toBe('');
        expect(suggestions[1].text).toBe('abcd');
        return expect(suggestions[1].type).toBe('builtin');
      });
    });
    return xit('adds words to the wordlist with unicode characters', function() {
      expect(provider.symbolStore.indexOf('somēthingNew')).toBeFalsy();
      editor.insertText('somēthingNew');
      editor.insertText(' ');
      return expect(provider.symbolStore.indexOf('somēthingNew')).toBeTruthy();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9zeW1ib2wtcHJvdmlkZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEhBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBeUUsT0FBQSxDQUFRLGVBQVIsQ0FBekUsRUFBQyw2QkFBQSxxQkFBRCxFQUF3QixnQ0FBQSx3QkFBeEIsRUFBa0QsMkJBQUEsbUJBRGxELENBQUE7O0FBQUEsRUFHQSxpQkFBQSxHQUFvQixTQUFDLGNBQUQsRUFBaUIsSUFBakIsR0FBQTtXQUNsQixjQUFjLENBQUMsU0FBZixDQUF5QixJQUF6QixFQURrQjtFQUFBLENBSHBCLENBQUE7O0FBQUEsRUFNQSxvQkFBQSxHQUF1QixTQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLE1BQW5CLEVBQTJCLE9BQTNCLEdBQUE7QUFDckIsUUFBQSxxRUFBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFqQixDQUFBO0FBQUEsSUFDQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyxhQUFQLENBQUEsQ0FBc0IsQ0FBQyxrQkFBdkIsQ0FBQSxDQURsQixDQUFBO0FBQUEsSUFFQSxXQUFBLEdBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0I7QUFBQSxNQUFDLFFBQUEsTUFBRDtBQUFBLE1BQVMsZ0JBQUEsY0FBVDtBQUFBLE1BQXlCLFFBQUEsTUFBekI7QUFBQSxNQUFpQyxpQkFBQSxlQUFqQztLQUF4QixDQUZkLENBQUE7QUFHQSxJQUFBLHNCQUFHLE9BQU8sQ0FBRSxZQUFaO2FBQ0UsWUFERjtLQUFBLE1BQUE7QUFHRSxNQUFBLElBQUcsV0FBSDtBQUFxQjthQUFBLGtE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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/symbol-provider-spec.coffee
