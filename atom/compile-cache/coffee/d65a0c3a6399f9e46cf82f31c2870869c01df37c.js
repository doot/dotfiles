(function() {
  var $, Autocomplete, AutocompleteView;

  $ = require('atom-space-pen-views').$;

  AutocompleteView = require('../lib/autocomplete-view');

  Autocomplete = require('../lib/autocomplete');

  describe("Autocomplete", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        return activationPromise = atom.packages.activatePackage('autocomplete');
      });
    });
    describe("@activate()", function() {
      return it("activates autocomplete on all existing and future editors (but not on autocomplete's own mini editor)", function() {
        var leftEditorElement, rightEditorElement, _ref1;
        spyOn(AutocompleteView.prototype, 'initialize').andCallThrough();
        expect(AutocompleteView.prototype.initialize).not.toHaveBeenCalled();
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        _ref1 = workspaceElement.querySelectorAll('atom-text-editor'), leftEditorElement = _ref1[0], rightEditorElement = _ref1[1];
        atom.commands.dispatch(leftEditorElement, 'autocomplete:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(leftEditorElement.querySelector('.autocomplete')).toExist();
          expect(rightEditorElement.querySelector('.autocomplete')).not.toExist();
          expect(AutocompleteView.prototype.initialize).toHaveBeenCalled();
          return atom.commands.dispatch(leftEditorElement.querySelector('.autocomplete'), 'core:cancel');
        });
        waits();
        runs(function() {
          expect(leftEditorElement.querySelector('.autocomplete')).not.toExist();
          return atom.commands.dispatch(rightEditorElement, 'autocomplete:toggle');
        });
        waits();
        return runs(function() {
          return expect(rightEditorElement.querySelector('.autocomplete')).toExist();
        });
      });
    });
    describe("@deactivate()", function() {
      return it("removes all autocomplete views and doesn't create new ones when new editors are opened", function() {
        var textEditorElement;
        textEditorElement = workspaceElement.querySelector('atom-text-editor');
        atom.commands.dispatch(textEditorElement, "autocomplete:toggle");
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(textEditorElement.querySelector('.autocomplete')).toExist();
          return atom.packages.deactivatePackage('autocomplete');
        });
        waits();
        runs(function() {
          expect(textEditorElement.querySelector('.autocomplete')).not.toExist();
          atom.workspace.getActivePane().splitRight({
            copyActiveItem: true
          });
          return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePaneItem()), "autocomplete:toggle");
        });
        waits();
        return runs(function() {
          return expect(workspaceElement.querySelector('.autocomplete')).not.toExist();
        });
      });
    });
    return describe("confirming an auto-completion", function() {
      return it("updates the buffer with the selected completion and restores focus", function() {
        var editor;
        editor = null;
        runs(function() {
          var editorElement;
          editor = atom.workspace.getActiveTextEditor();
          editorElement = atom.views.getView(editor);
          editorElement.setUpdatedSynchronously(false);
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          return atom.commands.dispatch(document.activeElement, 'autocomplete:toggle');
        });
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          return atom.commands.dispatch(document.activeElement, 'core:confirm');
        });
        waits();
        return runs(function() {
          return expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        });
      });
    });
  });

  describe("AutocompleteView", function() {
    var autocomplete, editor, miniEditor, _ref;
    _ref = [], autocomplete = _ref[0], editor = _ref[1], miniEditor = _ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js').then(function(anEditor) {
          return editor = anEditor;
        });
      });
      return runs(function() {
        autocomplete = new AutocompleteView(editor);
        return miniEditor = autocomplete.filterEditorView;
      });
    });
    describe("when the view is attached to the DOM", function() {
      return it("focuses the filter editor", function() {
        jasmine.attachToDOM(autocomplete.element);
        return expect(miniEditor).toHaveFocus();
      });
    });
    describe('::attach', function() {
      it("adds the autocomplete view as an overlay decoration", function() {
        var overlayDecorations;
        expect(editor.getOverlayDecorations().length).toBe(0);
        autocomplete.attach();
        overlayDecorations = editor.getOverlayDecorations();
        expect(overlayDecorations.length).toBe(1);
        return expect(overlayDecorations[0].properties.item).toBe(autocomplete);
      });
      describe("when the editor is empty", function() {
        return it("displays no matches", function() {
          var overlayDecorations;
          editor.setText('');
          expect(editor.getOverlayDecorations().length).toBe(0);
          autocomplete.attach();
          overlayDecorations = editor.getOverlayDecorations();
          expect(overlayDecorations.length).toBe(1);
          expect(overlayDecorations[0].properties.item).toBe(autocomplete);
          expect(editor.getText()).toBe('');
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
      });
      describe("when no text is selected", function() {
        it('autocompletes word when there is only a prefix', function() {
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 7], [10, 11]]);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('shift');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
        });
        it('autocompletes word when there is only a suffix', function() {
          editor.getBuffer().insert([10, 0], "extra:n:extra");
          editor.setCursorBufferPosition([10, 6]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:function:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 13]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 6], [10, 13]]);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('function');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('return');
        });
        it('autocompletes word when there is a single prefix and suffix match', function() {
          editor.getBuffer().insert([8, 43], "q");
          editor.setCursorBufferPosition([8, 44]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(8)).toBe("    return sort(left).concat(pivot).concat(quicksort(right));");
          expect(editor.getCursorBufferPosition()).toEqual([8, 52]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it("shows all words when there is no prefix or suffix", function() {
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('0');
          expect(autocomplete.list.find('li:eq(1)')).toHaveText('1');
          return expect(autocomplete.list.find('li').length).toBe(22);
        });
        it("autocompletes word and replaces case of prefix with case of word", function() {
          editor.getBuffer().insert([10, 0], "extra:SO:extra");
          editor.setCursorBufferPosition([10, 8]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 10]);
          return expect(editor.getLastSelection().isEmpty()).toBeTruthy();
        });
        it("allows the completion to be undone as a single operation", function() {
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          autocomplete.attach();
          editor.undo();
          return expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
        });
        describe("when `autocomplete.includeCompletionsFromAllBuffers` is true", function() {
          return it("shows words from all open buffers", function() {
            atom.config.set('autocomplete.includeCompletionsFromAllBuffers', true);
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            return runs(function() {
              editor.getBuffer().insert([10, 0], "extra:SO:extra");
              editor.setCursorBufferPosition([10, 8]);
              autocomplete.attach();
              expect(autocomplete.list.find('li').length).toBe(2);
              expect(autocomplete.list.find('li:eq(0)')).toHaveText('Some');
              return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
            });
          });
        });
        return describe('where many cursors are defined', function() {
          it('autocompletes word when there is only a prefix', function() {
            editor.getBuffer().insert([10, 0], "s:extra:s");
            editor.setSelectedBufferRanges([[[10, 1], [10, 1]], [[10, 9], [10, 9]]]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("shift:extra:shift");
            expect(editor.getCursorBufferPosition()).toEqual([10, 12]);
            expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 8], [10, 12]]);
            expect(editor.getSelections().length).toEqual(2);
            expect(autocomplete.list.find('li').length).toBe(2);
            expect(autocomplete.list.find('li:eq(0)')).toHaveText('shift');
            return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
          });
          return describe('where text differs between cursors', function() {
            return it('does not display the autocomplete overlay', function() {
              editor.getBuffer().insert([10, 0], "s:extra:a");
              editor.setSelectedBufferRanges([[[10, 1], [10, 1]], [[10, 9], [10, 9]]]);
              autocomplete.attach();
              expect(editor.lineTextForBufferRow(10)).toBe("s:extra:a");
              expect(editor.getSelections().length).toEqual(2);
              expect(editor.getSelections()[0].getBufferRange()).toEqual([[10, 1], [10, 1]]);
              expect(editor.getSelections()[1].getBufferRange()).toEqual([[10, 9], [10, 9]]);
              return expect(editor.getOverlayDecorations().length).toBe(0);
            });
          });
        });
      });
      return describe("when text is selected", function() {
        it('autocompletes word when there is only a prefix', function() {
          editor.getBuffer().insert([10, 0], "extra:sort:extra");
          editor.setSelectedBufferRange([[10, 7], [10, 10]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it('autocompletes word when there is only a suffix', function() {
          editor.getBuffer().insert([10, 0], "extra:current:extra");
          editor.setSelectedBufferRange([[10, 6], [10, 12]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:concat:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 6], [10, 11]]);
          expect(autocomplete.list.find('li').length).toBe(7);
          return expect(autocomplete.list.find('li:contains(current)')).not.toExist();
        });
        it('autocompletes word when there is a prefix and suffix', function() {
          editor.setSelectedBufferRange([[5, 7], [5, 12]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(5)).toBe("      concat = items.shift();");
          expect(editor.getCursorBufferPosition()).toEqual([5, 12]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it('replaces selection with selected match, moves the cursor to the end of the match, and removes the autocomplete overlay', function() {
          editor.getBuffer().insert([10, 0], "extra:sort:extra");
          editor.setSelectedBufferRange([[10, 7], [10, 9]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().isEmpty()).toBeTruthy();
          return expect(editor.getOverlayDecorations().length).toBe(0);
        });
        return describe("when many ranges are selected", function() {
          return it('replaces selection with selected match, moves the cursor to the end of the match, and removes the autocomplete overlay', function() {
            editor.getBuffer().insert([10, 0], "sort:extra:sort");
            editor.setSelectedBufferRanges([[[10, 1], [10, 3]], [[10, 12], [10, 14]]]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("shift:extra:shift");
            expect(editor.getSelections().length).toEqual(2);
            return expect(editor.getOverlayDecorations().length).toBe(0);
          });
        });
      });
    });
    describe('core:confirm event', function() {
      return describe("where there are matches", function() {
        return describe("where there is no selection", function() {
          return it("closes the menu and moves the cursor to the end", function() {
            editor.getBuffer().insert([10, 0], "extra:sh:extra");
            editor.setCursorBufferPosition([10, 8]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
            expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
            expect(editor.getLastSelection().isEmpty()).toBeTruthy();
            return expect(editor.getOverlayDecorations().length).toBe(0);
          });
        });
      });
    });
    describe('core:cancel event', function() {
      describe("when there are no matches", function() {
        return it("closes the menu without changing the buffer", function() {
          editor.getBuffer().insert([10, 0], "xxx");
          editor.setCursorBufferPosition([10, 3]);
          autocomplete.attach();
          expect(editor.getOverlayDecorations().length).toBe(1);
          expect(autocomplete.error).toHaveText("No matches found");
          atom.commands.dispatch(miniEditor.element, "core:cancel");
          expect(editor.lineTextForBufferRow(10)).toBe("xxx");
          expect(editor.getCursorBufferPosition()).toEqual([10, 3]);
          expect(editor.getLastSelection().isEmpty()).toBeTruthy();
          return expect(editor.getOverlayDecorations().length).toBe(0);
        });
      });
      it('does not replace selection, removes autocomplete view and returns focus to editor', function() {
        var originalSelectionBufferRange;
        editor.getBuffer().insert([10, 0], "extra:so:extra");
        editor.setSelectedBufferRange([[10, 7], [10, 8]]);
        originalSelectionBufferRange = editor.getLastSelection().getBufferRange();
        autocomplete.attach();
        expect(editor.getOverlayDecorations().length).toBe(1);
        editor.setCursorBufferPosition([0, 0]);
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:so:extra");
        expect(editor.getLastSelection().getBufferRange()).toEqual(originalSelectionBufferRange);
        return expect(editor.getOverlayDecorations().length).toBe(0);
      });
      it("does not clear out a previously confirmed selection when canceling with an empty list", function() {
        editor.getBuffer().insert([10, 0], "ort\n");
        editor.setCursorBufferPosition([10, 0]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:confirm");
        expect(editor.lineTextForBufferRow(10)).toBe('quicksort');
        editor.setCursorBufferPosition([11, 0]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        return expect(editor.lineTextForBufferRow(10)).toBe('quicksort');
      });
      it("restores the case of the prefix to the original value", function() {
        editor.getBuffer().insert([10, 0], "extra:S:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        atom.commands.dispatch(autocomplete.element, 'core:cancel');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:S:extra");
        return expect(editor.getCursorBufferPosition()).toEqual([10, 7]);
      });
      return it("restores the original buffer contents even if there was an additional operation after autocomplete attached (regression)", function() {
        editor.getBuffer().insert([10, 0], "extra:s:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        editor.getBuffer().append('hi');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        atom.commands.dispatch(autocomplete.element, 'core:cancel');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
        editor.redo();
        return expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
      });
    });
    describe('move-up event', function() {
      return it("highlights the previous match and replaces the selection with it", function() {
        editor.getBuffer().insert([10, 0], "extra:t:extra");
        editor.setCursorBufferPosition([10, 6]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:move-up");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(1)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(7)')).toHaveClass('selected');
        atom.commands.dispatch(miniEditor.element, "core:move-up");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(7)')).not.toHaveClass('selected');
        return expect(autocomplete.find('li:eq(6)')).toHaveClass('selected');
      });
    });
    describe('move-down event', function() {
      return it("highlights the next match and replaces the selection with it", function() {
        editor.getBuffer().insert([10, 0], "extra:s:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:move-down");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(1)')).toHaveClass('selected');
        atom.commands.dispatch(miniEditor.element, "core:move-down");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(autocomplete.find('li:eq(0)')).toHaveClass('selected');
        return expect(autocomplete.find('li:eq(1)')).not.toHaveClass('selected');
      });
    });
    describe("when a match is clicked in the match list", function() {
      return it("selects and confirms the match", function() {
        var matchToSelect;
        editor.getBuffer().insert([10, 0], "t");
        editor.setCursorBufferPosition([10, 0]);
        autocomplete.attach();
        matchToSelect = autocomplete.list.find('li:eq(1)');
        matchToSelect.mousedown();
        expect(matchToSelect).toMatchSelector('.selected');
        matchToSelect.mouseup();
        expect(autocomplete.parent()).not.toExist();
        return expect(editor.lineTextForBufferRow(10)).toBe(matchToSelect.text());
      });
    });
    describe("when the mini-editor receives keyboard input", function() {
      beforeEach(function() {
        return jasmine.attachToDOM(autocomplete.element);
      });
      describe("when text is removed from the mini-editor", function() {
        return it("reloads the match list based on the mini-editor's text", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li').length).toBe(8);
          miniEditor.getModel().insertText('c');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(3);
          miniEditor.getModel().backspace();
          window.advanceClock(autocomplete.inputThrottle);
          return expect(autocomplete.list.find('li').length).toBe(8);
        });
      });
      describe("when the text contains only word characters", function() {
        return it("narrows the list of completions with the fuzzy match algorithm", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li').length).toBe(8);
          miniEditor.getModel().insertText('i');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(4);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          expect(autocomplete.list.find('li:eq(0)')).toHaveClass('selected');
          expect(autocomplete.list.find('li:eq(1)')).toHaveText('right');
          expect(autocomplete.list.find('li:eq(2)')).toHaveText('shift');
          expect(autocomplete.list.find('li:eq(3)')).toHaveText('quicksort');
          expect(editor.lineTextForBufferRow(10)).toEqual('pivot');
          miniEditor.getModel().insertText('o');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('quicksort');
        });
      });
      return describe("when a non-word character is typed in the mini-editor", function() {
        return it("immediately confirms the current completion choice and inserts that character into the buffer", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(editor.getOverlayDecorations().length).toBe(1);
          miniEditor.getModel().insertText('iv');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          miniEditor.getModel().insertText(' ');
          window.advanceClock(autocomplete.inputThrottle);
          expect(editor.getOverlayDecorations().length).toBe(0);
          return expect(editor.lineTextForBufferRow(10)).toEqual('pivot ');
        });
      });
    });
    describe(".cancel()", function() {
      return it("removes the overlay and clears the mini editor", function() {
        autocomplete.attach();
        miniEditor.setText('foo');
        autocomplete.cancel();
        expect(editor.getOverlayDecorations().length).toBe(0);
        return expect(miniEditor.getText()).toBe('');
      });
    });
    return it("sets the width of the view to be wide enough to contain the longest completion without scrolling", function() {
      editor.insertText('thisIsAReallyReallyReallyLongCompletion ');
      editor.moveToBottom();
      editor.insertNewline();
      editor.insertText('t');
      autocomplete.attach();
      jasmine.attachToDOM(autocomplete.element);
      return expect(autocomplete.list.prop('scrollWidth')).toBeLessThan(autocomplete.list.width() + 1);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlL3NwZWMvYXV0b2NvbXBsZXRlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMEJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVIsQ0FGZixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxRQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQURBLENBQUE7ZUFFQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsRUFIakI7TUFBQSxDQUFMLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBV0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO2FBQ3RCLEVBQUEsQ0FBRyx1R0FBSCxFQUE0RyxT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

//# sourceURL=/Users/doot/.atom/packages/autocomplete/spec/autocomplete-spec.coffee
