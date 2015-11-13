(function() {
  var KeymapManager, NodeTypeText, buildIMECompositionEvent, buildTextInputEvent, path, temp, triggerAutocompletion, waitForAutocomplete, _ref;

  _ref = require('./spec-helper'), triggerAutocompletion = _ref.triggerAutocompletion, waitForAutocomplete = _ref.waitForAutocomplete, buildIMECompositionEvent = _ref.buildIMECompositionEvent, buildTextInputEvent = _ref.buildTextInputEvent;

  KeymapManager = require('atom').KeymapManager;

  temp = require('temp').track();

  path = require('path');

  NodeTypeText = 3;

  describe('Autocomplete Manager', function() {
    var autocompleteManager, completionDelay, editor, editorView, gutterWidth, mainModule, pixelLeftForBufferPosition, requiresGutter, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], completionDelay = _ref1[1], editorView = _ref1[2], editor = _ref1[3], mainModule = _ref1[4], autocompleteManager = _ref1[5], mainModule = _ref1[6], gutterWidth = _ref1[7];
    beforeEach(function() {
      gutterWidth = null;
      return runs(function() {
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('editor.fontSize', '16');
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        atom.config.set('autocomplete-plus.maxVisibleSuggestions', 10);
        return atom.config.set('autocomplete-plus.consumeSuffix', true);
      });
    });
    describe("when an external provider is registered", function() {
      var provider;
      provider = [][0];
      beforeEach(function() {
        waitsForPromise(function() {
          return Promise.all([
            atom.workspace.open('').then(function(e) {
              editor = e;
              return editorView = atom.views.getView(editor);
            }), atom.packages.activatePackage('autocomplete-plus').then(function(a) {
              return mainModule = a.mainModule;
            })
          ]);
        });
        waitsFor(function() {
          return mainModule.autocompleteManager;
        });
        return runs(function() {
          provider = {
            selector: '*',
            inclusionPriority: 2,
            excludeLowerPriority: true,
            getSuggestions: function(_arg) {
              var list, prefix, text, _i, _len, _results;
              prefix = _arg.prefix;
              list = ['ab', 'abc', 'abcd', 'abcde'];
              _results = [];
              for (_i = 0, _len = list.length; _i < _len; _i++) {
                text = list[_i];
                _results.push({
                  text: text
                });
              }
              return _results;
            }
          };
          return mainModule.consumeProvider(provider);
        });
      });
      it("calls the provider's onDidInsertSuggestion method when it exists", function() {
        provider.onDidInsertSuggestion = jasmine.createSpy();
        triggerAutocompletion(editor, true, 'a');
        return runs(function() {
          var suggestion, suggestionListView, triggerPosition, _ref2;
          suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
          expect(provider.onDidInsertSuggestion).toHaveBeenCalled();
          _ref2 = provider.onDidInsertSuggestion.mostRecentCall.args[0], editor = _ref2.editor, triggerPosition = _ref2.triggerPosition, suggestion = _ref2.suggestion;
          expect(editor).toBe(editor);
          expect(triggerPosition).toEqual([0, 1]);
          return expect(suggestion.text).toBe('ab');
        });
      });
      it('closes the suggestion list when saving', function() {
        var directory;
        directory = temp.mkdirSync();
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('a');
        waitForAutocomplete();
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          editor.saveAs(path.join(directory, 'spec', 'tmp', 'issue-11.js'));
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('does not show suggestions after a word has been confirmed', function() {
        var c, _i, _len, _ref2;
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        _ref2 = 'red';
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          c = _ref2[_i];
          editor.insertText(c);
        }
        waitForAutocomplete();
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('works after closing one of the copied tabs', function() {
        atom.workspace.paneForItem(editor).splitRight({
          copyActiveItem: true
        });
        atom.workspace.getActivePane().destroy();
        editor.insertNewline();
        editor.insertText('f');
        waitForAutocomplete();
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).toExist();
        });
      });
      it('closes the suggestion list when entering an empty string (e.g. carriage return)', function() {
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('a');
        waitForAutocomplete();
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          editor.insertText('\r');
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('it refocuses the editor after pressing enter', function() {
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('a');
        waitForAutocomplete();
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          editor.insertText('\n');
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          return expect(editorView).toHaveFocus();
        });
      });
      it('it hides the suggestion list when the user keeps typing', function() {
        spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
          var prefix, t, _i, _len, _ref2, _results;
          prefix = _arg.prefix;
          _ref2 = ['acd', 'ade'];
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            t = _ref2[_i];
            if (t.startsWith(prefix)) {
              _results.push({
                text: t
              });
            }
          }
          return _results;
        });
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.moveToBottom();
        editor.insertText('a');
        waitForAutocomplete();
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          editor.insertText('b');
          return waitForAutocomplete();
        });
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('does not show the suggestion list when pasting', function() {
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('red');
        waitForAutocomplete();
        return runs(function() {
          return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('only shows for the editor that currently has focus', function() {
        var editor2, editorView2;
        editor2 = atom.workspace.paneForItem(editor).splitRight({
          copyActiveItem: true
        }).getActiveItem();
        editorView2 = atom.views.getView(editor2);
        editorView.focus();
        expect(editorView).toHaveFocus();
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        expect(editorView2).not.toHaveFocus();
        expect(editorView2.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('r');
        expect(editorView).toHaveFocus();
        expect(editorView2).not.toHaveFocus();
        waitForAutocomplete();
        return runs(function() {
          expect(editorView).toHaveFocus();
          expect(editorView2).not.toHaveFocus();
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          expect(editorView2.querySelector('.autocomplete-plus')).not.toExist();
          atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
          expect(editorView).toHaveFocus();
          expect(editorView2).not.toHaveFocus();
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          return expect(editorView2.querySelector('.autocomplete-plus')).not.toExist();
        });
      });
      it('does not display empty suggestions', function() {
        spyOn(provider, 'getSuggestions').andCallFake(function() {
          var list, text, _i, _len, _results;
          list = ['ab', '', 'abcd', null];
          _results = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            text = list[_i];
            _results.push({
              text: text
            });
          }
          return _results;
        });
        expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
        editor.insertText('a');
        waitForAutocomplete();
        return runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          return expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(2);
        });
      });
      describe('when the fileBlacklist option is set', function() {
        beforeEach(function() {
          atom.config.set('autocomplete-plus.fileBlacklist', ['.*', '*.md']);
          return editor.getBuffer().setPath('blacklisted.md');
        });
        it('does not show suggestions when working with files that match the blacklist', function() {
          editor.insertText('a');
          waitForAutocomplete();
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('caches the blacklist result', function() {
          spyOn(path, 'basename').andCallThrough();
          editor.insertText('a');
          waitForAutocomplete();
          runs(function() {
            editor.insertText('b');
            return waitForAutocomplete();
          });
          runs(function() {
            editor.insertText('c');
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return expect(path.basename.callCount).toBe(1);
          });
        });
        return it('shows suggestions when the path is changed to not match the blacklist', function() {
          editor.insertText('a');
          waitForAutocomplete();
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:cancel');
            editor.getBuffer().setPath('not-blackslisted.txt');
            editor.insertText('a');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:cancel');
            editor.getBuffer().setPath('blackslisted.md');
            editor.insertText('a');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
      describe("when filterSuggestions option is true", function() {
        beforeEach(function() {
          provider = {
            selector: '*',
            filterSuggestions: true,
            inclusionPriority: 3,
            excludeLowerPriority: true,
            getSuggestions: function(_arg) {
              var list, prefix, text, _i, _len, _results;
              prefix = _arg.prefix;
              list = ['ab', 'abc', 'abcd', 'abcde'];
              _results = [];
              for (_i = 0, _len = list.length; _i < _len; _i++) {
                text = list[_i];
                _results.push({
                  text: text
                });
              }
              return _results;
            }
          };
          return mainModule.consumeProvider(provider);
        });
        return it('does not display empty suggestions', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            var list, text, _i, _len, _results;
            list = ['ab', '', 'abcd', null];
            _results = [];
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              text = list[_i];
              _results.push({
                text: text
              });
            }
            return _results;
          });
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.insertText('a');
          waitForAutocomplete();
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(2);
          });
        });
      });
      describe("when the type option has a space in it", function() {
        return it('does not display empty suggestions', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'ab',
                type: 'local function'
              }, {
                text: 'abc',
                type: ' another ~ function   '
              }
            ];
          });
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.insertText('a');
          waitForAutocomplete();
          return runs(function() {
            var items;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items).toHaveLength(2);
            expect(items[0].querySelector('.icon').className).toBe('icon local function');
            return expect(items[1].querySelector('.icon').className).toBe('icon another ~ function');
          });
        });
      });
      describe("when the className option has a space in it", function() {
        return it('does not display empty suggestions', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'ab',
                className: 'local function'
              }, {
                text: 'abc',
                className: ' another  ~ function   '
              }
            ];
          });
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.insertText('a');
          waitForAutocomplete();
          return runs(function() {
            var items;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0].className).toBe('selected local function');
            return expect(items[1].className).toBe('another ~ function');
          });
        });
      });
      describe('when multiple cursors are defined', function() {
        it('autocompletes word when there is only a prefix', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'shift'
              }
            ];
          });
          editor.getBuffer().insert([0, 0], 's:extra:s');
          editor.setSelectedBufferRanges([[[0, 1], [0, 1]], [[0, 9], [0, 9]]]);
          triggerAutocompletion(editor, false, 'h');
          waits(completionDelay);
          return runs(function() {
            autocompleteManager = mainModule.autocompleteManager;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
            expect(editor.lineTextForBufferRow(0)).toBe('shift:extra:shift');
            expect(editor.getCursorBufferPosition()).toEqual([0, 17]);
            expect(editor.getLastSelection().getBufferRange()).toEqual({
              start: {
                row: 0,
                column: 17
              },
              end: {
                row: 0,
                column: 17
              }
            });
            return expect(editor.getSelections().length).toEqual(2);
          });
        });
        return it('cancels the autocomplete when text differs between cursors', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [];
          });
          editor.getBuffer().insert([0, 0], 's:extra:a');
          editor.setCursorBufferPosition([0, 1]);
          editor.addCursorAtBufferPosition([0, 9]);
          triggerAutocompletion(editor, false, 'h');
          waits(completionDelay);
          return runs(function() {
            autocompleteManager = mainModule.autocompleteManager;
            editorView = atom.views.getView(editor);
            atom.commands.dispatch(editorView, 'autocomplete-plus:confirm');
            expect(editor.lineTextForBufferRow(0)).toBe('sh:extra:ah');
            expect(editor.getSelections().length).toEqual(2);
            expect(editor.getSelections()[0].getBufferRange()).toEqual([[0, 2], [0, 2]]);
            expect(editor.getSelections()[1].getBufferRange()).toEqual([[0, 11], [0, 11]]);
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
      describe("suppression for editorView classes", function() {
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.suppressActivationForEditorClasses', ['vim-mode.command-mode', 'vim-mode . visual-mode', ' vim-mode.operator-pending-mode ', ' ']);
        });
        it('should show the suggestion list when the suppression list does not match', function() {
          runs(function() {
            editorView.classList.add('vim-mode');
            return editorView.classList.add('insert-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        it('should not show the suggestion list when the suppression list does match', function() {
          runs(function() {
            editorView.classList.add('vim-mode');
            return editorView.classList.add('command-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('should not show the suggestion list when the suppression list does match', function() {
          runs(function() {
            editorView.classList.add('vim-mode');
            return editorView.classList.add('operator-pending-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('should not show the suggestion list when the suppression list does match', function() {
          runs(function() {
            editorView.classList.add('vim-mode');
            return editorView.classList.add('visual-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('should show the suggestion list when the suppression list does not match', function() {
          runs(function() {
            editorView.classList.add('vim-mode');
            return editorView.classList.add('some-unforeseen-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        return it('should show the suggestion list when the suppression list does not match', function() {
          runs(function() {
            return editorView.classList.add('command-mode');
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return triggerAutocompletion(editor);
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
      });
      describe("prefix passed to getSuggestions", function() {
        var prefix;
        prefix = null;
        beforeEach(function() {
          editor.setText('var something = abc');
          editor.setCursorBufferPosition([0, 10000]);
          return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            prefix = options.prefix;
            return [];
          });
        });
        it("calls with word prefix", function() {
          editor.insertText('d');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('abcd');
          });
        });
        it("calls with word prefix after punctuation", function() {
          editor.insertText('d.okyea');
          editor.insertText('h');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('okyeah');
          });
        });
        it("calls with word prefix containing a dash", function() {
          editor.insertText('-okyea');
          editor.insertText('h');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('abc-okyeah');
          });
        });
        it("calls with space character", function() {
          editor.insertText(' ');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe(' ');
          });
        });
        it("calls with non-word prefix", function() {
          editor.insertText(':');
          editor.insertText(':');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('::');
          });
        });
        it("calls with non-word bracket", function() {
          editor.insertText('[');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('[');
          });
        });
        it("calls with dot prefix", function() {
          editor.insertText('.');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe('.');
          });
        });
        it("calls with prefix after non \\b word break", function() {
          editor.insertText('=""');
          editor.insertText(' ');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe(' ');
          });
        });
        return it("calls with prefix after non \\b word break", function() {
          editor.insertText('?');
          editor.insertText(' ');
          waitForAutocomplete();
          return runs(function() {
            return expect(prefix).toBe(' ');
          });
        });
      });
      describe("when the character entered is not at the cursor position", function() {
        beforeEach(function() {
          editor.setText('some text ok');
          return editor.setCursorBufferPosition([0, 7]);
        });
        return it("does not show the suggestion list", function() {
          var buffer;
          buffer = editor.getBuffer();
          buffer.setTextInRange([[0, 0], [0, 0]], "s");
          waitForAutocomplete();
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
      describe("when number of suggestions > maxVisibleSuggestions", function() {
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.maxVisibleSuggestions', 2);
        });
        it("scrolls the list always showing the selected item", function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            var itemHeight, scroller, suggestionList;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            itemHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus li')).height);
            expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(4);
            suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            scroller = suggestionList.querySelector('.suggestion-list-scroller');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:move-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:move-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[2]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight);
            atom.commands.dispatch(suggestionList, 'core:move-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:move-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:move-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:move-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[2]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:move-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight);
            atom.commands.dispatch(suggestionList, 'core:move-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            return expect(scroller.scrollTop).toBe(0);
          });
        });
        it("pages up and down when core:page-up and core:page-down are used", function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            var itemHeight, scroller, suggestionList;
            itemHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus li')).height);
            suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            scroller = suggestionList.querySelector('.suggestion-list-scroller');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:page-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[2]).toHaveClass('selected');
            atom.commands.dispatch(suggestionList, 'core:page-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            atom.commands.dispatch(suggestionList, 'core:page-down');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:page-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
            atom.commands.dispatch(suggestionList, 'core:page-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            atom.commands.dispatch(suggestionList, 'core:page-up');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            return expect(scroller.scrollTop).toBe(0);
          });
        });
        it("moves to the top and bottom when core:move-to-top and core:move-to-bottom are used", function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            var itemHeight, scroller, suggestionList;
            itemHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus li')).height);
            suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            scroller = suggestionList.querySelector('.suggestion-list-scroller');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:move-to-bottom');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:move-to-bottom');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(itemHeight * 2);
            atom.commands.dispatch(suggestionList, 'core:move-to-top');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            expect(scroller.scrollTop).toBe(0);
            atom.commands.dispatch(suggestionList, 'core:move-to-top');
            expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
            return expect(scroller.scrollTop).toBe(0);
          });
        });
        describe("when a suggestion description is not specified", function() {
          return it("only shows the maxVisibleSuggestions in the suggestion popup", function() {
            triggerAutocompletion(editor, true, 'a');
            return runs(function() {
              var itemHeight, suggestionList;
              expect(editorView.querySelector('.autocomplete-plus')).toExist();
              itemHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus li')).height);
              expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(4);
              suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              expect(suggestionList.offsetHeight).toBe(2 * itemHeight);
              return expect(suggestionList.querySelector('.suggestion-list-scroller').style['max-height']).toBe("" + (2 * itemHeight) + "px");
            });
          });
        });
        return describe("when a suggestion description is specified", function() {
          it("shows the maxVisibleSuggestions in the suggestion popup, but with extra height for the description", function() {
            spyOn(provider, 'getSuggestions').andCallFake(function() {
              var list, text, _i, _len, _results;
              list = ['ab', 'abc', 'abcd', 'abcde'];
              _results = [];
              for (_i = 0, _len = list.length; _i < _len; _i++) {
                text = list[_i];
                _results.push({
                  text: text,
                  description: "" + text + " yeah ok"
                });
              }
              return _results;
            });
            triggerAutocompletion(editor, true, 'a');
            return runs(function() {
              var descriptionHeight, itemHeight, suggestionList;
              expect(editorView.querySelector('.autocomplete-plus')).toExist();
              itemHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus li')).height);
              expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(4);
              suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              descriptionHeight = parseInt(getComputedStyle(editorView.querySelector('.autocomplete-plus .suggestion-description')).height);
              expect(suggestionList.offsetHeight).toBe(2 * itemHeight + descriptionHeight);
              return expect(suggestionList.querySelector('.suggestion-list-scroller').style['max-height']).toBe("" + (2 * itemHeight) + "px");
            });
          });
          return it("adjusts the width when the description changes", function() {
            var listWidth;
            listWidth = null;
            spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
              var item, list, prefix, _i, _len, _results;
              prefix = _arg.prefix;
              list = [
                {
                  text: 'ab',
                  description: 'mmmmmmmmmmmmmmmmmmmmmmmmmm'
                }, {
                  text: 'abc',
                  description: 'mmmmmmmmmmmmmmmmmmmmmm'
                }, {
                  text: 'abcd',
                  description: 'mmmmmmmmmmmmmmmmmm'
                }, {
                  text: 'abcde',
                  description: 'mmmmmmmmmmmmmm'
                }
              ];
              _results = [];
              for (_i = 0, _len = list.length; _i < _len; _i++) {
                item = list[_i];
                if (item.text.startsWith(prefix)) {
                  _results.push(item);
                }
              }
              return _results;
            });
            triggerAutocompletion(editor, true, 'a');
            runs(function() {
              var suggestionList;
              suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              expect(suggestionList).toExist();
              listWidth = parseInt(suggestionList.style.width);
              expect(listWidth).toBeGreaterThan(0);
              editor.insertText('b');
              editor.insertText('c');
              return waitForAutocomplete();
            });
            return runs(function() {
              var newWidth, suggestionList;
              suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              expect(suggestionList).toExist();
              newWidth = parseInt(suggestionList.style.width);
              expect(newWidth).toBeGreaterThan(0);
              return expect(newWidth).toBeLessThan(listWidth);
            });
          });
        });
      });
      describe("when useCoreMovementCommands is toggled", function() {
        var suggestionList;
        suggestionList = [][0];
        beforeEach(function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          });
        });
        return it("binds to custom commands when unset, and binds back to core commands when set", function() {
          atom.commands.dispatch(suggestionList, 'core:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
          atom.config.set('autocomplete-plus.useCoreMovementCommands', false);
          atom.commands.dispatch(suggestionList, 'core:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[2]).toHaveClass('selected');
          atom.config.set('autocomplete-plus.useCoreMovementCommands', true);
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[2]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'core:move-down');
          return expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
        });
      });
      describe("when useCoreMovementCommands is false", function() {
        var suggestionList;
        suggestionList = [][0];
        beforeEach(function() {
          atom.config.set('autocomplete-plus.useCoreMovementCommands', false);
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
          });
        });
        return it("responds to all the custom movement commands and to no core commands", function() {
          atom.commands.dispatch(suggestionList, 'core:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[1]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-up');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:page-down');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).not.toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:page-up');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-to-bottom');
          expect(editorView.querySelectorAll('.autocomplete-plus li')[3]).toHaveClass('selected');
          atom.commands.dispatch(suggestionList, 'autocomplete-plus:move-to-top');
          return expect(editorView.querySelectorAll('.autocomplete-plus li')[0]).toHaveClass('selected');
        });
      });
      describe("when match.snippet is used", function() {
        beforeEach(function() {
          return spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var list, prefix, snippet, _i, _len, _results;
            prefix = _arg.prefix;
            list = ['method(${1:something})', 'method2(${1:something})', 'method3(${1:something})'];
            _results = [];
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              snippet = list[_i];
              _results.push({
                snippet: snippet,
                replacementPrefix: prefix
              });
            }
            return _results;
          });
        });
        return describe("when the snippets package is enabled", function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return atom.packages.activatePackage('snippets');
            });
          });
          it("displays the snippet without the `${1:}` in its own class", function() {
            triggerAutocompletion(editor, true, 'm');
            return runs(function() {
              var wordElement, wordElements;
              wordElement = editorView.querySelector('.autocomplete-plus span.word');
              expect(wordElement.textContent).toBe('method(something)');
              expect(wordElement.querySelector('.snippet-completion').textContent).toBe('something');
              wordElements = editorView.querySelectorAll('.autocomplete-plus span.word');
              return expect(wordElements).toHaveLength(3);
            });
          });
          return it("accepts the snippet when autocomplete-plus:confirm is triggered", function() {
            triggerAutocompletion(editor, true, 'm');
            return runs(function() {
              var suggestionListView;
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
              return expect(editor.getSelectedText()).toBe('something');
            });
          });
        });
      });
      describe("when the matched prefix is highlighted", function() {
        it('highlights the prefix of the word in the suggestion list', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var prefix;
            prefix = _arg.prefix;
            return [
              {
                text: 'items',
                replacementPrefix: prefix
              }
            ];
          });
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('i');
          editor.insertText('e');
          editor.insertText('m');
          waitForAutocomplete();
          return runs(function() {
            var word;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            word = editorView.querySelector('.autocomplete-plus li span.word');
            expect(word.childNodes).toHaveLength(5);
            expect(word.childNodes[0]).toHaveClass('character-match');
            expect(word.childNodes[1].nodeType).toBe(NodeTypeText);
            expect(word.childNodes[2]).toHaveClass('character-match');
            expect(word.childNodes[3]).toHaveClass('character-match');
            return expect(word.childNodes[4].nodeType).toBe(NodeTypeText);
          });
        });
        it('highlights repeated characters in the prefix', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var prefix;
            prefix = _arg.prefix;
            return [
              {
                text: 'apply',
                replacementPrefix: prefix
              }
            ];
          });
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('a');
          editor.insertText('p');
          editor.insertText('p');
          waitForAutocomplete();
          return runs(function() {
            var word;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            word = editorView.querySelector('.autocomplete-plus li span.word');
            expect(word.childNodes).toHaveLength(4);
            expect(word.childNodes[0]).toHaveClass('character-match');
            expect(word.childNodes[1]).toHaveClass('character-match');
            expect(word.childNodes[2]).toHaveClass('character-match');
            expect(word.childNodes[3].nodeType).toBe(3);
            return expect(word.childNodes[3].textContent).toBe('ly');
          });
        });
        return describe("when the prefix does not match the word", function() {
          it("does not render any character-match spans", function() {
            spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
              var prefix;
              prefix = _arg.prefix;
              return [
                {
                  text: 'omgnope',
                  replacementPrefix: prefix
                }
              ];
            });
            editor.moveToBottom();
            editor.insertText('x');
            editor.insertText('y');
            editor.insertText('z');
            waitForAutocomplete();
            return runs(function() {
              var characterMatches, text;
              expect(editorView.querySelector('.autocomplete-plus')).toExist();
              characterMatches = editorView.querySelectorAll('.autocomplete-plus li span.word .character-match');
              text = editorView.querySelector('.autocomplete-plus li span.word').textContent;
              expect(characterMatches).toHaveLength(0);
              return expect(text).toBe('omgnope');
            });
          });
          return describe("when the snippets package is enabled", function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return atom.packages.activatePackage('snippets');
              });
            });
            it("does not highlight the snippet html; ref issue 301", function() {
              spyOn(provider, 'getSuggestions').andCallFake(function() {
                return [
                  {
                    snippet: 'ab(${1:c})c'
                  }
                ];
              });
              editor.moveToBottom();
              editor.insertText('c');
              waitForAutocomplete();
              return runs(function() {
                var charMatch, word;
                word = editorView.querySelector('.autocomplete-plus li span.word');
                charMatch = editorView.querySelector('.autocomplete-plus li span.word .character-match');
                expect(word.textContent).toBe('ab(c)c');
                expect(charMatch.textContent).toBe('c');
                return expect(charMatch.parentNode).toHaveClass('snippet-completion');
              });
            });
            return it("does not highlight the snippet html when highlight beginning of the word", function() {
              spyOn(provider, 'getSuggestions').andCallFake(function() {
                return [
                  {
                    snippet: 'abcde(${1:e}, ${1:f})f'
                  }
                ];
              });
              editor.moveToBottom();
              editor.insertText('c');
              editor.insertText('e');
              editor.insertText('f');
              waitForAutocomplete();
              return runs(function() {
                var charMatches, word;
                word = editorView.querySelector('.autocomplete-plus li span.word');
                expect(word.textContent).toBe('abcde(e, f)f');
                charMatches = editorView.querySelectorAll('.autocomplete-plus li span.word .character-match');
                expect(charMatches[0].textContent).toBe('c');
                expect(charMatches[0].parentNode).toHaveClass('word');
                expect(charMatches[1].textContent).toBe('e');
                expect(charMatches[1].parentNode).toHaveClass('word');
                expect(charMatches[2].textContent).toBe('f');
                return expect(charMatches[2].parentNode).toHaveClass('snippet-completion');
              });
            });
          });
        });
      });
      describe("when a replacementPrefix is not specified", function() {
        beforeEach(function() {
          return spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'something'
              }
            ];
          });
        });
        it("replaces with the default input prefix", function() {
          editor.insertText('abc');
          triggerAutocompletion(editor, false, 'm');
          expect(editor.getText()).toBe('abcm');
          return runs(function() {
            var suggestionListView;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
            return expect(editor.getText()).toBe('something');
          });
        });
        return it("does not replace non-word prefixes with the chosen suggestion", function() {
          editor.insertText('abc');
          editor.insertText('.');
          waitForAutocomplete();
          expect(editor.getText()).toBe('abc.');
          return runs(function() {
            var suggestionListView;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
            return expect(editor.getText()).toBe('abc.something');
          });
        });
      });
      describe("when autocomplete-plus.suggestionListFollows is 'Cursor'", function() {
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.suggestionListFollows', 'Cursor');
        });
        return it("places the suggestion list at the cursor", function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: 'ab',
                leftLabel: 'void'
              }, {
                text: 'abc',
                leftLabel: 'void'
              }
            ];
          });
          editor.insertText('omghey ab');
          triggerAutocompletion(editor, false, 'c');
          return runs(function() {
            var overlayElement, suggestionList;
            overlayElement = editorView.querySelector('.autocomplete-plus');
            expect(overlayElement).toExist();
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 10]));
            suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            return expect(suggestionList.style['margin-left']).toBeFalsy();
          });
        });
      });
      describe("when autocomplete-plus.suggestionListFollows is 'Word'", function() {
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.suggestionListFollows', 'Word');
        });
        it("opens to the correct position, and correctly closes on cancel", function() {
          editor.insertText('xxxxxxxxxxx ab');
          triggerAutocompletion(editor, false, 'c');
          return runs(function() {
            var overlayElement;
            overlayElement = editorView.querySelector('.autocomplete-plus');
            expect(overlayElement).toExist();
            return expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 12]));
          });
        });
        it("displays the suggestion list taking into account the passed back replacementPrefix", function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: '::before',
                replacementPrefix: '::',
                leftLabel: 'void'
              }
            ];
          });
          editor.insertText('xxxxxxxxxxx ab:');
          triggerAutocompletion(editor, false, ':');
          return runs(function() {
            var overlayElement;
            overlayElement = editorView.querySelector('.autocomplete-plus');
            expect(overlayElement).toExist();
            return expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
          });
        });
        it("displays the suggestion list with a negative margin to align the prefix with the word-container", function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: 'ab',
                leftLabel: 'void'
              }, {
                text: 'abc',
                leftLabel: 'void'
              }
            ];
          });
          editor.insertText('omghey ab');
          triggerAutocompletion(editor, false, 'c');
          return runs(function() {
            var suggestionList, wordContainer;
            suggestionList = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            wordContainer = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list .word-container');
            return expect(suggestionList.style['margin-left']).toBe("-" + (wordContainer.offsetLeft - 1) + "px");
          });
        });
        it("keeps the suggestion list planted at the beginning of the prefix when typing", function() {
          var overlayElement;
          overlayElement = null;
          editor.insertText('xxxxxxxxxx xx');
          editor.insertText(' ');
          waitForAutocomplete();
          runs(function() {
            overlayElement = editorView.querySelector('.autocomplete-plus');
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
            editor.insertText('a');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
            editor.insertText('b');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
            editor.backspace();
            editor.backspace();
            return waitForAutocomplete();
          });
          runs(function() {
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
            editor.backspace();
            return waitForAutocomplete();
          });
          runs(function() {
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 11]));
            editor.insertText(' ');
            editor.insertText('a');
            editor.insertText('b');
            editor.insertText('c');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 14]));
          });
        });
        return it("when broken by a non-word character, the suggestion list is positioned at the beginning of the new word", function() {
          var overlayElement;
          overlayElement = null;
          editor.insertText('xxxxxxxxxxx');
          editor.insertText(' abc');
          editor.insertText('d');
          waitForAutocomplete();
          runs(function() {
            var left;
            overlayElement = editorView.querySelector('.autocomplete-plus');
            left = editorView.pixelPositionForBufferPosition([0, 12]).left;
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 12]));
            editor.insertText(' ');
            editor.insertText('a');
            editor.insertText('b');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 17]));
            editor.backspace();
            editor.backspace();
            editor.backspace();
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(overlayElement.style.left).toBe(pixelLeftForBufferPosition([0, 12]));
          });
        });
      });
      describe('accepting suggestions', function() {
        beforeEach(function() {
          editor.setText('ok then ');
          return editor.setCursorBufferPosition([0, 20]);
        });
        it('hides the suggestions list when a suggestion is confirmed', function() {
          triggerAutocompletion(editor, false, 'a');
          return runs(function() {
            var suggestionListView;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        describe("when the replacementPrefix is empty", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function() {
              return [
                {
                  text: 'someMethod()',
                  replacementPrefix: ''
                }
              ];
            });
          });
          return it("will insert the text without replacing anything", function() {
            editor.insertText('a');
            triggerAutocompletion(editor, false, '.');
            return runs(function() {
              var suggestionListView;
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe('ok then a.someMethod()');
            });
          });
        });
        describe('when tab is used to accept suggestions', function() {
          beforeEach(function() {
            return atom.config.set('autocomplete-plus.confirmCompletion', 'tab');
          });
          it('inserts the word and moves the cursor to the end of the word', function() {
            triggerAutocompletion(editor, false, 'a');
            return runs(function() {
              var bufferPosition, key;
              key = atom.keymaps.constructor.buildKeydownEvent('tab', {
                target: document.activeElement
              });
              atom.keymaps.handleKeyboardEvent(key);
              expect(editor.getText()).toBe('ok then ab');
              bufferPosition = editor.getCursorBufferPosition();
              expect(bufferPosition.row).toEqual(0);
              return expect(bufferPosition.column).toEqual(10);
            });
          });
          return it('does not insert the word when enter completion not enabled', function() {
            triggerAutocompletion(editor, false, 'a');
            return runs(function() {
              var key;
              key = atom.keymaps.constructor.buildKeydownEvent('enter', {
                keyCode: 13,
                target: document.activeElement
              });
              atom.keymaps.handleKeyboardEvent(key);
              return expect(editor.getText()).toBe('ok then a\n');
            });
          });
        });
        describe('when enter is used to accept suggestions', function() {
          beforeEach(function() {
            return atom.config.set('autocomplete-plus.confirmCompletion', 'enter');
          });
          it('inserts the word and moves the cursor to the end of the word', function() {
            triggerAutocompletion(editor, false, 'a');
            return runs(function() {
              var bufferPosition, key;
              key = atom.keymaps.constructor.buildKeydownEvent('enter', {
                target: document.activeElement
              });
              atom.keymaps.handleKeyboardEvent(key);
              expect(editor.getText()).toBe('ok then ab');
              bufferPosition = editor.getCursorBufferPosition();
              expect(bufferPosition.row).toEqual(0);
              return expect(bufferPosition.column).toEqual(10);
            });
          });
          return it('does not insert the word when tab completion not enabled', function() {
            triggerAutocompletion(editor, false, 'a');
            return runs(function() {
              var key;
              key = atom.keymaps.constructor.buildKeydownEvent('tab', {
                keyCode: 13,
                target: document.activeElement
              });
              atom.keymaps.handleKeyboardEvent(key);
              return expect(editor.getText()).toBe('ok then a ');
            });
          });
        });
        describe("when the cursor suffix matches the replacement", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function() {
              return [
                {
                  text: 'oneomgtwo',
                  replacementPrefix: 'one'
                }
              ];
            });
          });
          it('replaces the suffix with the replacement', function() {
            editor.setText('ontwothree');
            editor.setCursorBufferPosition([0, 2]);
            triggerAutocompletion(editor, false, 'e');
            return runs(function() {
              var suggestionListView;
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe('oneomgtwothree');
            });
          });
          return it('does not replace the suffix text when consumeSuffix is disabled', function() {
            atom.config.set('autocomplete-plus.consumeSuffix', false);
            editor.setText('ontwothree');
            editor.setCursorBufferPosition([0, 2]);
            triggerAutocompletion(editor, false, 'e');
            return runs(function() {
              var suggestionListView;
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe('oneomgtwotwothree');
            });
          });
        });
        return describe("when the cursor suffix does not match the replacement", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function() {
              return [
                {
                  text: 'oneomgTwo',
                  replacementPrefix: 'one'
                }
              ];
            });
          });
          return it('replaces the suffix with the replacement', function() {
            editor.setText('ontwothree');
            editor.setCursorBufferPosition([0, 2]);
            triggerAutocompletion(editor, false, 'e');
            return runs(function() {
              var suggestionListView;
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe('oneomgTwotwothree');
            });
          });
        });
      });
      describe('when auto-activation is disabled', function() {
        var options;
        options = [][0];
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.enableAutoActivation', false);
        });
        it('does not show suggestions after a delay', function() {
          triggerAutocompletion(editor);
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('shows suggestions when explicitly triggered', function() {
          triggerAutocompletion(editor);
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        it("stays open when typing", function() {
          triggerAutocompletion(editor, false, 'a');
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            editor.insertText('b');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        it('accepts the suggestion if there is one', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: 'omgok'
              }
            ];
          });
          triggerAutocompletion(editor);
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return expect(editor.getText()).toBe('omgok');
          });
        });
        it('does not accept the suggestion if the event detail is activatedManually: false', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: 'omgok'
              }
            ];
          });
          triggerAutocompletion(editor);
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate', {
              activatedManually: false
            });
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        it('does not accept the suggestion if auto-confirm single suggestion is disabled', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(options) {
            return [
              {
                text: 'omgok'
              }
            ];
          });
          triggerAutocompletion(editor);
          runs(function() {
            atom.config.set('autocomplete-plus.enableAutoConfirmSingleSuggestion', false);
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
        it('includes the correct value for activatedManually when explicitly triggered', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(o) {
            options = o;
            return [
              {
                text: 'omgok'
              }, {
                text: 'ahgok'
              }
            ];
          });
          triggerAutocompletion(editor);
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            expect(options).toBeDefined();
            return expect(options.activatedManually).toBe(true);
          });
        });
        return it('does not auto-accept a single suggestion when filtering', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var list, prefix, t, _i, _len, _results;
            prefix = _arg.prefix;
            list = [];
            if ('a'.indexOf(prefix) === 0) {
              list.push('a');
            }
            if ('abc'.indexOf(prefix) === 0) {
              list.push('abc');
            }
            _results = [];
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              t = list[_i];
              _results.push({
                text: t
              });
            }
            return _results;
          });
          editor.insertText('a');
          atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
          waitForAutocomplete();
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(2);
            editor.insertText('b');
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return expect(editorView.querySelectorAll('.autocomplete-plus li')).toHaveLength(1);
          });
        });
      });
      describe("when the replacementPrefix doesnt match the actual prefix", function() {
        describe("when snippets are not used", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function() {
              return [
                {
                  text: 'something',
                  replacementPrefix: 'bcm'
                }
              ];
            });
          });
          return it("only replaces the suggestion at cursors whos prefix matches the replacementPrefix", function() {
            editor.setText("abc abc\ndef");
            editor.setCursorBufferPosition([0, 3]);
            editor.addCursorAtBufferPosition([0, 7]);
            editor.addCursorAtBufferPosition([1, 3]);
            triggerAutocompletion(editor, false, 'm');
            return runs(function() {
              var suggestionListView;
              expect(editorView.querySelector('.autocomplete-plus')).toExist();
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe("asomething asomething\ndefm");
            });
          });
        });
        return describe("when snippets are used", function() {
          beforeEach(function() {
            spyOn(provider, 'getSuggestions').andCallFake(function() {
              return [
                {
                  snippet: 'ok(${1:omg})',
                  replacementPrefix: 'bcm'
                }
              ];
            });
            return waitsForPromise(function() {
              return atom.packages.activatePackage('snippets');
            });
          });
          return it("only replaces the suggestion at cursors whos prefix matches the replacementPrefix", function() {
            editor.setText("abc abc\ndef");
            editor.setCursorBufferPosition([0, 3]);
            editor.addCursorAtBufferPosition([0, 7]);
            editor.addCursorAtBufferPosition([1, 3]);
            triggerAutocompletion(editor, false, 'm');
            return runs(function() {
              var suggestionListView;
              expect(editorView.querySelector('.autocomplete-plus')).toExist();
              suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
              atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
              return expect(editor.getText()).toBe("aok(omg) aok(omg)\ndefm");
            });
          });
        });
      });
      describe('select-previous event', function() {
        it('selects the previous item in the list', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'ab'
              }, {
                text: 'abc'
              }, {
                text: 'abcd'
              }
            ];
          });
          triggerAutocompletion(editor, false, 'a');
          return runs(function() {
            var items;
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0]).toHaveClass('selected');
            expect(items[1]).not.toHaveClass('selected');
            expect(items[2]).not.toHaveClass('selected');
            atom.commands.dispatch(editorView, 'core:move-up');
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0]).not.toHaveClass('selected');
            expect(items[1]).not.toHaveClass('selected');
            return expect(items[2]).toHaveClass('selected');
          });
        });
        it('closes the autocomplete when up arrow pressed when only one item displayed', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var prefix;
            prefix = _arg.prefix;
            return [
              {
                text: 'quicksort'
              }, {
                text: 'quack'
              }
            ].filter(function(val) {
              return val.text.startsWith(prefix);
            });
          });
          editor.insertText('q');
          editor.insertText('u');
          waitForAutocomplete();
          runs(function() {
            var autocomplete;
            atom.commands.dispatch(editorView, 'core:move-up');
            advanceClock(1);
            autocomplete = editorView.querySelector('.autocomplete-plus');
            expect(autocomplete).toExist();
            editor.insertText('a');
            return waitForAutocomplete();
          });
          return runs(function() {
            var autocomplete;
            autocomplete = editorView.querySelector('.autocomplete-plus');
            expect(autocomplete).toExist();
            atom.commands.dispatch(editorView, 'core:move-up');
            advanceClock(1);
            autocomplete = editorView.querySelector('.autocomplete-plus');
            return expect(autocomplete).not.toExist();
          });
        });
        return it('does not close the autocomplete when up arrow pressed with multiple items displayed but triggered on one item', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function(_arg) {
            var prefix;
            prefix = _arg.prefix;
            return [
              {
                text: 'quicksort'
              }, {
                text: 'quack'
              }
            ].filter(function(val) {
              return val.text.startsWith(prefix);
            });
          });
          editor.insertText('q');
          editor.insertText('u');
          editor.insertText('a');
          waitForAutocomplete();
          runs(function() {
            editor.backspace();
            return waitForAutocomplete();
          });
          return runs(function() {
            var autocomplete;
            autocomplete = editorView.querySelector('.autocomplete-plus');
            expect(autocomplete).toExist();
            atom.commands.dispatch(editorView, 'core:move-up');
            advanceClock(1);
            autocomplete = editorView.querySelector('.autocomplete-plus');
            return expect(autocomplete).toExist();
          });
        });
      });
      describe('select-next event', function() {
        it('selects the next item in the list', function() {
          triggerAutocompletion(editor, false, 'a');
          return runs(function() {
            var items;
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0]).toHaveClass('selected');
            expect(items[1]).not.toHaveClass('selected');
            expect(items[2]).not.toHaveClass('selected');
            atom.commands.dispatch(editorView, 'core:move-down');
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0]).not.toHaveClass('selected');
            expect(items[1]).toHaveClass('selected');
            return expect(items[2]).not.toHaveClass('selected');
          });
        });
        return it('wraps to the first item when triggered at the end of the list', function() {
          spyOn(provider, 'getSuggestions').andCallFake(function() {
            return [
              {
                text: 'ab'
              }, {
                text: 'abc'
              }, {
                text: 'abcd'
              }
            ];
          });
          triggerAutocompletion(editor, false, 'a');
          return runs(function() {
            var items, suggestionListView;
            items = editorView.querySelectorAll('.autocomplete-plus li');
            expect(items[0]).toHaveClass('selected');
            expect(items[1]).not.toHaveClass('selected');
            expect(items[2]).not.toHaveClass('selected');
            suggestionListView = editorView.querySelector('.autocomplete-plus autocomplete-suggestion-list');
            items = editorView.querySelectorAll('.autocomplete-plus li');
            atom.commands.dispatch(suggestionListView, 'core:move-down');
            expect(items[1]).toHaveClass('selected');
            atom.commands.dispatch(suggestionListView, 'core:move-down');
            expect(items[2]).toHaveClass('selected');
            atom.commands.dispatch(suggestionListView, 'core:move-down');
            return expect(items[0]).toHaveClass('selected');
          });
        });
      });
      describe("label rendering", function() {
        describe("when no labels are specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok'
                }
              ];
            });
          });
          return it("displays the text in the suggestion", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var iconContainer, leftLabel, rightLabel;
              iconContainer = editorView.querySelector('.autocomplete-plus li .icon-container');
              leftLabel = editorView.querySelector('.autocomplete-plus li .right-label');
              rightLabel = editorView.querySelector('.autocomplete-plus li .right-label');
              expect(iconContainer.childNodes).toHaveLength(0);
              expect(leftLabel.childNodes).toHaveLength(0);
              return expect(rightLabel.childNodes).toHaveLength(0);
            });
          });
        });
        describe("when `type` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  type: 'omg'
                }
              ];
            });
          });
          return it("displays an icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var icon;
              icon = editorView.querySelector('.autocomplete-plus li .icon-container .icon');
              return expect(icon.textContent).toBe('o');
            });
          });
        });
        describe("when the `type` specified has a default icon", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  type: 'snippet'
                }
              ];
            });
          });
          return it("displays the default icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var icon;
              icon = editorView.querySelector('.autocomplete-plus li .icon-container .icon i');
              return expect(icon).toHaveClass('icon-move-right');
            });
          });
        });
        describe("when `type` is an empty string", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  type: ''
                }
              ];
            });
          });
          return it("does not display an icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var iconContainer;
              iconContainer = editorView.querySelector('.autocomplete-plus li .icon-container');
              return expect(iconContainer.childNodes).toHaveLength(0);
            });
          });
        });
        describe("when `iconHTML` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  iconHTML: '<i class="omg"></i>'
                }
              ];
            });
          });
          return it("displays an icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var icon;
              icon = editorView.querySelector('.autocomplete-plus li .icon-container .icon .omg');
              return expect(icon).toExist();
            });
          });
        });
        describe("when `iconHTML` is false", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  type: 'something',
                  iconHTML: false
                }
              ];
            });
          });
          return it("does not display an icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var iconContainer;
              iconContainer = editorView.querySelector('.autocomplete-plus li .icon-container');
              return expect(iconContainer.childNodes).toHaveLength(0);
            });
          });
        });
        describe("when `iconHTML` is not a string and a `type` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  type: 'something',
                  iconHTML: true
                }
              ];
            });
          });
          return it("displays the default icon in the icon-container", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var icon;
              icon = editorView.querySelector('.autocomplete-plus li .icon-container .icon');
              return expect(icon.textContent).toBe('s');
            });
          });
        });
        describe("when `iconHTML` is not a string and no type is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  iconHTML: true
                }
              ];
            });
          });
          return it("it does not display an icon", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var iconContainer;
              iconContainer = editorView.querySelector('.autocomplete-plus li .icon-container');
              return expect(iconContainer.childNodes).toHaveLength(0);
            });
          });
        });
        describe("when `rightLabel` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  rightLabel: '<i class="something">sometext</i>'
                }
              ];
            });
          });
          return it("displays the text in the suggestion", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var label;
              label = editorView.querySelector('.autocomplete-plus li .right-label');
              return expect(label).toHaveText('<i class="something">sometext</i>');
            });
          });
        });
        describe("when `rightLabelHTML` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  rightLabelHTML: '<i class="something">sometext</i>'
                }
              ];
            });
          });
          return it("displays the text in the suggestion", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var label;
              label = editorView.querySelector('.autocomplete-plus li .right-label .something');
              return expect(label).toHaveText('sometext');
            });
          });
        });
        describe("when `leftLabel` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  leftLabel: '<i class="something">sometext</i>'
                }
              ];
            });
          });
          return it("displays the text in the suggestion", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var label;
              label = editorView.querySelector('.autocomplete-plus li .left-label');
              return expect(label).toHaveText('<i class="something">sometext</i>');
            });
          });
        });
        return describe("when `leftLabelHTML` is specified", function() {
          beforeEach(function() {
            return spyOn(provider, 'getSuggestions').andCallFake(function(options) {
              return [
                {
                  text: 'ok',
                  leftLabelHTML: '<i class="something">sometext</i>'
                }
              ];
            });
          });
          return it("displays the text in the suggestion", function() {
            triggerAutocompletion(editor);
            return runs(function() {
              var label;
              label = editorView.querySelector('.autocomplete-plus li .left-label .something');
              return expect(label).toHaveText('sometext');
            });
          });
        });
      });
      return describe('when clicking in the suggestion list', function() {
        beforeEach(function() {
          return spyOn(provider, 'getSuggestions').andCallFake(function() {
            var list, text, _i, _len, _results;
            list = ['ab', 'abc', 'abcd', 'abcde'];
            _results = [];
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              text = list[_i];
              _results.push({
                text: text,
                description: "" + text + " yeah ok"
              });
            }
            return _results;
          });
        });
        it('will select the item and confirm the selection', function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            var item, mouse;
            item = editorView.querySelectorAll('.autocomplete-plus li')[1];
            mouse = document.createEvent('MouseEvents');
            mouse.initMouseEvent('mousedown', true, true, window);
            item.dispatchEvent(mouse);
            mouse = document.createEvent('MouseEvents');
            mouse.initMouseEvent('mouseup', true, true, window);
            item.dispatchEvent(mouse);
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return expect(editor.getBuffer().getLastLine()).toEqual(item.textContent.trim());
          });
        });
        return it('will not close the list when the description is clicked', function() {
          triggerAutocompletion(editor, true, 'a');
          return runs(function() {
            var description, mouse;
            description = editorView.querySelector('.autocomplete-plus .suggestion-description-content');
            mouse = document.createEvent('MouseEvents');
            mouse.initMouseEvent('mousedown', true, true, window);
            description.dispatchEvent(mouse);
            mouse = document.createEvent('MouseEvents');
            mouse.initMouseEvent('mouseup', true, true, window);
            description.dispatchEvent(mouse);
            return expect(editorView.querySelector('.autocomplete-plus')).toExist();
          });
        });
      });
    });
    describe('when opening a file without a path', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('').then(function(e) {
            editor = e;
            return editorView = atom.views.getView(editor);
          });
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-text');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('autocomplete-plus').then(function(a) {
            return mainModule = a.mainModule;
          });
        });
        waitsFor(function() {
          var _ref2;
          return (_ref2 = mainModule.autocompleteManager) != null ? _ref2.ready : void 0;
        });
        return runs(function() {
          autocompleteManager = mainModule.autocompleteManager;
          spyOn(autocompleteManager, 'findSuggestions').andCallThrough();
          return spyOn(autocompleteManager, 'displaySuggestions').andCallThrough();
        });
      });
      return describe("when strict matching is used", function() {
        beforeEach(function() {
          return atom.config.set('autocomplete-plus.strictMatching', true);
        });
        return it('using strict matching does not cause issues when typing', function() {
          runs(function() {
            editor.moveToBottom();
            editor.insertText('h');
            editor.insertText('e');
            editor.insertText('l');
            editor.insertText('l');
            editor.insertText('o');
            return advanceClock(completionDelay + 1000);
          });
          return waitsFor(function() {
            return autocompleteManager.findSuggestions.calls.length === 1;
          });
        });
      });
    });
    describe('when opening a javascript file', function() {
      beforeEach(function() {
        runs(function() {
          return atom.config.set('autocomplete-plus.enableAutoActivation', true);
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js').then(function(e) {
            editor = e;
            return editorView = atom.views.getView(editor);
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
          return autocompleteManager = mainModule.autocompleteManager;
        });
        return runs(function() {
          return advanceClock(autocompleteManager.providerManager.defaultProvider.deferBuildWordListInterval);
        });
      });
      describe('when the built-in provider is disabled', function() {
        return it('should not show the suggestion list', function() {
          atom.config.set('autocomplete-plus.enableBuiltinProvider', false);
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          triggerAutocompletion(editor);
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
      describe('when the buffer changes', function() {
        it('should show the suggestion list when suggestions are found', function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          triggerAutocompletion(editor);
          return runs(function() {
            var index, item, suggestions, _i, _len, _ref2, _results;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            suggestions = ['function', 'if', 'left', 'shift'];
            _ref2 = editorView.querySelectorAll('.autocomplete-plus li span.word');
            _results = [];
            for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
              item = _ref2[index];
              _results.push(expect(item.innerText).toEqual(suggestions[index]));
            }
            return _results;
          });
        });
        it('should not show the suggestion list when no suggestions are found', function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('x');
          waitForAutocomplete();
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('shows the suggestion list on backspace if allowed', function() {
          runs(function() {
            atom.config.set('autocomplete-plus.backspaceTriggersAutocomplete', true);
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            editor.moveToBottom();
            editor.insertText('f');
            editor.insertText('u');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            editor.insertText('\r');
            return waitForAutocomplete();
          });
          runs(function() {
            var key;
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          runs(function() {
            var key;
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return expect(editor.lineTextForBufferRow(13)).toBe('f');
          });
        });
        it('does not shows the suggestion list on backspace if disallowed', function() {
          runs(function() {
            atom.config.set('autocomplete-plus.backspaceTriggersAutocomplete', false);
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            editor.moveToBottom();
            editor.insertText('f');
            editor.insertText('u');
            return waitForAutocomplete();
          });
          runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            editor.insertText('\r');
            return waitForAutocomplete();
          });
          runs(function() {
            var key;
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          runs(function() {
            var key;
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
            return expect(editor.lineTextForBufferRow(13)).toBe('f');
          });
        });
        it("keeps the suggestion list open when it's already open on backspace", function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.insertText('f');
          editor.insertText('u');
          waitForAutocomplete();
          runs(function() {
            var key;
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(editorView.querySelector('.autocomplete-plus')).toExist();
            return expect(editor.lineTextForBufferRow(13)).toBe('f');
          });
        });
        it("does not open the suggestion on backspace when it's closed", function() {
          atom.config.set('autocomplete-plus.backspaceTriggersAutocomplete', false);
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.setCursorBufferPosition([2, 39]);
          runs(function() {
            var key;
            key = atom.keymaps.constructor.buildKeydownEvent('backspace', {
              target: document.activeElement
            });
            atom.keymaps.handleKeyboardEvent(key);
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
        it('should not update the suggestion list while composition is in progress', function() {
          var activeElement;
          triggerAutocompletion(editor);
          activeElement = editorView.rootElement.querySelector('input');
          runs(function() {
            spyOn(autocompleteManager.suggestionList, 'changeItems').andCallThrough();
            expect(autocompleteManager.suggestionList.changeItems).not.toHaveBeenCalled();
            activeElement.dispatchEvent(buildIMECompositionEvent('compositionstart', {
              target: activeElement
            }));
            activeElement.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
              data: '~',
              target: activeElement
            }));
            return waitForAutocomplete();
          });
          return runs(function() {
            expect(autocompleteManager.suggestionList.changeItems).toHaveBeenCalledWith(null);
            activeElement.dispatchEvent(buildIMECompositionEvent('compositionend', {
              target: activeElement
            }));
            activeElement.dispatchEvent(buildTextInputEvent({
              data: 'ã',
              target: activeElement
            }));
            return expect(editor.lineTextForBufferRow(13)).toBe('fã');
          });
        });
        return it('does not show the suggestion list when it is triggered then no longer needed', function() {
          runs(function() {
            editor.moveToBottom();
            editor.insertText('f');
            editor.insertText('u');
            editor.insertText('\r');
            return waitForAutocomplete();
          });
          return runs(function() {
            return expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          });
        });
      });
      return describe('.cancel()', function() {
        return it('unbinds autocomplete event handlers for move-up and move-down', function() {
          triggerAutocompletion(editor, false);
          autocompleteManager.hideSuggestionList();
          editorView = atom.views.getView(editor);
          atom.commands.dispatch(editorView, 'core:move-down');
          expect(editor.getCursorBufferPosition().row).toBe(1);
          atom.commands.dispatch(editorView, 'core:move-up');
          return expect(editor.getCursorBufferPosition().row).toBe(0);
        });
      });
    });
    describe('when a long completion exists', function() {
      beforeEach(function() {
        runs(function() {
          return atom.config.set('autocomplete-plus.enableAutoActivation', true);
        });
        waitsForPromise(function() {
          return atom.workspace.open('samplelong.js').then(function(e) {
            return editor = e;
          });
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
      return it('sets the width of the view to be wide enough to contain the longest completion without scrolling', function() {
        editor.moveToBottom();
        editor.insertNewline();
        editor.insertText('t');
        waitForAutocomplete();
        return runs(function() {
          var suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          return expect(suggestionListView.scrollWidth).toBe(suggestionListView.offsetWidth);
        });
      });
    });
    requiresGutter = function() {
      var _ref2;
      return ((_ref2 = editorView.component) != null ? _ref2.overlayManager : void 0) != null;
    };
    return pixelLeftForBufferPosition = function(bufferPosition) {
      var left;
      if (gutterWidth == null) {
        gutterWidth = editorView.shadowRoot.querySelector('.gutter').offsetWidth;
      }
      left = editorView.pixelPositionForBufferPosition(bufferPosition).left;
      left += editorView.offsetLeft;
      if (requiresGutter()) {
        left = gutterWidth + left;
      }
      return "" + (Math.round(left)) + "px";
    };
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9hdXRvY29tcGxldGUtbWFuYWdlci1pbnRlZ3JhdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3SUFBQTs7QUFBQSxFQUFBLE9BQThGLE9BQUEsQ0FBUSxlQUFSLENBQTlGLEVBQUMsNkJBQUEscUJBQUQsRUFBd0IsMkJBQUEsbUJBQXhCLEVBQTZDLGdDQUFBLHdCQUE3QyxFQUF1RSwyQkFBQSxtQkFBdkUsQ0FBQTs7QUFBQSxFQUNDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQURELENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxDQUxmLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsc0pBQUE7QUFBQSxJQUFBLFFBQW9ILEVBQXBILEVBQUMsMkJBQUQsRUFBbUIsMEJBQW5CLEVBQW9DLHFCQUFwQyxFQUFnRCxpQkFBaEQsRUFBd0QscUJBQXhELEVBQW9FLDhCQUFwRSxFQUF5RixxQkFBekYsRUFBcUcsc0JBQXJHLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLFdBQUEsR0FBYyxJQUFkLENBQUE7YUFDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBRUgsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFELENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE1B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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/autocomplete-manager-integration-spec.coffee
