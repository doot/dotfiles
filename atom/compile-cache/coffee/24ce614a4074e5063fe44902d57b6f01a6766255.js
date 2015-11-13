(function() {
  var helpers, settings;

  helpers = require('./spec-helper');

  settings = require('../lib/settings');

  describe("Operators", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        return vimState.resetNormalMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    normalModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      return editor.normalModeInputView.editorElement.getModel().setText(key);
    };
    describe("cancelling operations", function() {
      it("throws an error when no operation is pending", function() {
        return expect(function() {
          return vimState.pushOperations(new Input(''));
        }).toThrow();
      });
      return it("cancels and cleans up properly", function() {
        keydown('/');
        expect(vimState.isOperatorPending()).toBe(true);
        editor.normalModeInputView.viewModel.cancel();
        expect(vimState.isOperatorPending()).toBe(false);
        return expect(editor.normalModeInputView).toBe(void 0);
      });
    });
    describe("the x keybinding", function() {
      describe("on a line with content", function() {
        describe("without vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            return editor.setCursorScreenPosition([1, 4]);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters with a count", function() {
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            return expect(vimState.getRegister('"').text).toBe('bc');
          });
        });
        describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return editor.addCursorAtBufferPosition([0, 1]);
          });
          return it("is undone as one operation", function() {
            keydown('x');
            expect(editor.getText()).toBe("ac\n01235\n\nxyz");
            keydown('u');
            return expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          });
        });
        return describe("with vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return atom.config.set('vim-mode.wrapLeftRightMotion', true);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters and newlines with a count", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            expect(vimState.getRegister('"').text).toBe('bc\n');
            keydown('7');
            keydown('x');
            expect(editor.getText()).toBe('ayz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            return expect(vimState.getRegister('"').text).toBe('0123\n\nx');
          });
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("abc\n012345\n\nxyz");
          return editor.setCursorScreenPosition([2, 0]);
        });
        it("deletes nothing on an empty line when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("deletes an empty line when vim-mode.wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
      });
    });
    describe("the X keybinding", function() {
      describe("on a line with content", function() {
        beforeEach(function() {
          editor.setText("ab\n012345");
          return editor.setCursorScreenPosition([1, 2]);
        });
        return it("deletes a character", function() {
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n02345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          expect(vimState.getRegister('"').text).toBe('1');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab2345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          return editor.setCursorScreenPosition([1, 0]);
        });
        it("deletes nothing when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\n\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
        return it("deletes the newline when wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        });
      });
    });
    describe("the s keybinding", function() {
      beforeEach(function() {
        editor.setText('012345');
        return editor.setCursorScreenPosition([0, 1]);
      });
      it("deletes the character to the right and enters insert mode", function() {
        keydown('s');
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe('02345');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        return expect(vimState.getRegister('"').text).toBe('1');
      });
      it("is repeatable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        editor.setCursorScreenPosition([0, 2]);
        keydown('.');
        return expect(editor.getText()).toBe('abab');
      });
      it("is undoable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        keydown('u');
        expect(editor.getText()).toBe('012345');
        return expect(editor.getSelectedText()).toBe('');
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          editor.selectRight();
          return keydown('s');
        });
        return it("deletes the selected characters and enters insert mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          expect(editor.getText()).toBe('0345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(vimState.getRegister('"').text).toBe('12');
        });
      });
    });
    describe("the S keybinding", function() {
      beforeEach(function() {
        editor.setText("12345\nabcde\nABCDE");
        return editor.setCursorScreenPosition([1, 3]);
      });
      it("deletes the entire line and enters insert mode", function() {
        keydown('S', {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe("12345\n\nABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("abcde\n");
        return expect(vimState.getRegister('"').type).toBe('linewise');
      });
      it("is repeatable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        editor.setCursorScreenPosition([2, 3]);
        keydown('.');
        return expect(editor.getText()).toBe("12345\nabc\nabc\n");
      });
      it("is undoable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        keydown('u');
        expect(editor.getText()).toBe("12345\nabcde\nABCDE");
        return expect(editor.getSelectedText()).toBe('');
      });
      it("works when the cursor's goal column is greater than its current column", function() {
        editor.setText("\n12345");
        editor.setCursorBufferPosition([1, Infinity]);
        editor.moveUp();
        keydown("S", {
          shift: true
        });
        return expect(editor.getText()).toBe("\n12345");
      });
      return xit("respects indentation", function() {});
    });
    describe("the d keybinding", function() {
      it("enters operator-pending mode", function() {
        keydown('d');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(false);
      });
      describe("when followed by a d", function() {
        it("deletes the current line and exits operator-pending mode", function() {
          editor.setText("12345\nabcde\n\nABCDE");
          editor.setCursorScreenPosition([1, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe("abcde\n");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        it("deletes the last line", function() {
          editor.setText("12345\nabcde\nABCDE");
          editor.setCursorScreenPosition([2, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\nabcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("leaves the cursor on the first nonblank character", function() {
          editor.setText("12345\n  abcde\n");
          editor.setCursorScreenPosition([0, 4]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("  abcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("undo behavior", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          return editor.setCursorScreenPosition([1, 1]);
        });
        it("undoes both lines", function() {
          keydown('d');
          keydown('2');
          keydown('d');
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          return expect(editor.getSelectedText()).toBe('');
        });
        return describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setCursorBufferPosition([1, 1]);
            return editor.addCursorAtBufferPosition([0, 0]);
          });
          return it("is undone as one operation", function() {
            keydown('d');
            keydown('l');
            keydown('u');
            expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
      });
      describe("when followed by a w", function() {
        it("deletes the next word until the end of the line and exits operator-pending mode", function() {
          editor.setText("abcd efg\nabc");
          editor.setCursorScreenPosition([0, 5]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe("abcd abc");
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        return it("deletes to the beginning of the next word", function() {
          editor.setText('abcd efg');
          editor.setCursorScreenPosition([0, 2]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe('abefg');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setText('one two three four');
          editor.setCursorScreenPosition([0, 0]);
          keydown('d');
          keydown('3');
          keydown('w');
          expect(editor.getText()).toBe('four');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("when followed by an iw", function() {
        return it("deletes the containing word", function() {
          editor.setText("12345 abcde ABCDE");
          editor.setCursorScreenPosition([0, 9]);
          keydown('d');
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345  ABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          expect(vimState.getRegister('"').text).toBe("abcde");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
      });
      describe("when followed by a j", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE\n";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the beginning of the file", function() {
          return it("deletes the next two lines", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("ABCDE\n");
          });
        });
        describe("on the end of the file", function() {
          return it("deletes nothing", function() {
            editor.setCursorScreenPosition([4, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("on the middle of second line", function() {
          return it("deletes the last two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by an k", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the end of the file", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([2, 4]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        describe("on the beginning of the file", function() {
          return xit("deletes nothing", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("when on the middle of second line", function() {
          return it("deletes the first two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("ABCDE");
          });
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
      });
      describe("when followed by a t)", function() {
        return describe("with the entire line yanked before", function() {
          beforeEach(function() {
            editor.setText("test (xyz)");
            return editor.setCursorScreenPosition([0, 6]);
          });
          return it("deletes until the closing parenthesis", function() {
            keydown('y');
            keydown('y');
            keydown('d');
            keydown('t');
            normalModeInputKeydown(')');
            expect(editor.getText()).toBe("test ()");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      return describe("with multiple cursors", function() {
        it("deletes each selection", function() {
          editor.setText("abcd\n1234\nABCD\n");
          editor.setCursorBufferPosition([0, 1]);
          editor.addCursorAtBufferPosition([1, 2]);
          editor.addCursorAtBufferPosition([2, 3]);
          keydown('d');
          keydown('e');
          expect(editor.getText()).toBe("a\n12\nABC");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 1], [2, 2]]);
        });
        return it("doesn't delete empty selections", function() {
          editor.setText("abcd\nabc\nabd");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          keydown('d');
          keydown('t');
          normalModeInputKeydown('d');
          expect(editor.getText()).toBe("d\nabc\nd");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0], [2, 0]]);
        });
      });
    });
    describe("the D keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('D', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line", function() {
        return expect(editor.getText()).toBe("0\n");
      });
    });
    describe("the c keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("when followed by a c", function() {
        describe("with autoindent", function() {
          beforeEach(function() {
            editor.setText("12345\n  abcde\nABCDE");
            editor.setCursorScreenPosition([1, 1]);
            spyOn(editor, 'shouldAutoIndent').andReturn(true);
            spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
              return editor.indent();
            });
            return spyOn(editor.languageMode, 'suggestedIndentForLineAtBufferRow').andCallFake(function() {
              return 1;
            });
          });
          it("deletes the current line and enters insert mode", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\n  \nABCDE");
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
          it("is repeatable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12345\n  abc\n  abc\n");
          });
          return it("is undoable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            keydown('u');
            expect(editor.getText()).toBe("12345\n  abcde\nABCDE");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
        describe("when the cursor is on the last line", function() {
          return it("deletes the line's content and enters insert mode on the last line", function() {
            editor.setCursorScreenPosition([2, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\nabcde\n\n");
            expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
        return describe("when the cursor is on the only line", function() {
          return it("deletes the line's content and enters insert mode", function() {
            editor.setText("12345");
            editor.setCursorScreenPosition([0, 2]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("");
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
      });
      describe("when followed by i w", function() {
        return it("undo's and redo's completely", function() {
          editor.setCursorScreenPosition([1, 1]);
          keydown('c');
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          editor.setText("12345\nfg\nABCDE");
          keydown('escape');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          expect(editor.getText()).toBe("12345\nfg\nABCDE");
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          keydown('r', {
            ctrl: true
          });
          return expect(editor.getText()).toBe("12345\nfg\nABCDE");
        });
      });
      describe("when followed by a w", function() {
        return it("changes the word", function() {
          editor.setText("word1 word2 word3");
          editor.setCursorBufferPosition([0, "word1 w".length]);
          keydown("c");
          keydown("w");
          keydown("escape");
          return expect(editor.getText()).toBe("word1 w word3");
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
      });
      describe("when followed by a %", function() {
        beforeEach(function() {
          return editor.setText("12345(67)8\nabc(d)e\nA()BCDE");
        });
        describe("before brackets or on the first one", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            editor.addCursorAtScreenPosition([1, 1]);
            editor.addCursorAtScreenPosition([2, 1]);
            keydown('c');
            keydown('%');
            return editor.insertText('x');
          });
          it("replaces inclusively until matching bracket", function() {
            expect(editor.getText()).toBe("1x8\naxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
          return it("undoes correctly with u", function() {
            keydown('escape');
            expect(vimState.mode).toBe("normal");
            keydown('u');
            return expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nA()BCDE");
          });
        });
        describe("inside brackets or on the ending one", function() {
          return it("replaces inclusively backwards until matching bracket", function() {
            editor.setCursorScreenPosition([0, 6]);
            editor.addCursorAtScreenPosition([1, 5]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            expect(editor.getText()).toBe("12345x7)8\nabcxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
        });
        describe("after or without brackets", function() {
          return it("deletes nothing", function() {
            editor.setText("12345(67)8\nabc(d)e\nABCDE");
            editor.setCursorScreenPosition([0, 9]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nABCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
        return describe("repetition with .", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            return keydown('escape');
          });
          it("repeats correctly before a bracket", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the opening bracket", function() {
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly inside brackets", function() {
            editor.setCursorScreenPosition([1, 4]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcx)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the closing bracket", function() {
            editor.setCursorScreenPosition([1, 5]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          return it("does nothing when repeated after a bracket", function() {
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabc(d)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          return editor.setText("12345\nabcde\nABCDE");
        });
        describe("on the beginning of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText("123456789\nabcde\nfghijklmnopq\nuvwxyz");
          return editor.setCursorScreenPosition([1, 1]);
        });
        describe("with characterwise selection on a single line", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('2');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naabe\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1ab56789\naabe\nfghijklmnopq\nuvwxyz");
          });
          it("repeats shortened with . near the end of the line", function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line regardless of whether motion wrapping is enabled", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
        });
        describe("is repeatable with characterwise selection over multiple lines", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('j');
            keydown('3');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1xnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line", function() {
            keydown('v');
            keydown('j');
            keydown('6');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1x\nuvwxyz");
          });
        });
        describe("is repeatable with linewise selection", function() {
          describe("with one line selected", function() {
            return it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              expect(editor.getText()).toBe("x\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([2, 0]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nx\nx\nuvwxyz");
            });
          });
          return describe("with multiple lines selected", function() {
            it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nuvwxyz");
            });
            return it("repeats shortened with . near the end of the file", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([1, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("123456789\nx\n");
            });
          });
        });
        return xdescribe("is repeatable with block selection", function() {});
      });
    });
    describe("the C keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('C', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line and enters insert mode", function() {
        expect(editor.getText()).toBe("0\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('normal-mode')).toBe(false);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
    });
    describe("the y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\ndefg\n");
        editor.setCursorScreenPosition([0, 4]);
        return vimState.setRegister('"', {
          text: '345'
        });
      });
      describe("when selected lines in visual linewise mode", function() {
        beforeEach(function() {
          keydown('V', {
            shift: true
          });
          keydown('j');
          return keydown('y');
        });
        it("is in linewise motion", function() {
          return expect(vimState.getRegister('"').type).toEqual("linewise");
        });
        it("saves the lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("places the cursor at the beginning of the selection", function() {
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0]]);
        });
      });
      describe("when followed by a second y ", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("when useClipboardAsDefaultRegister enabled", function() {
        return it("writes to clipboard", function() {
          atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
          keydown('y');
          keydown('y');
          return expect(atom.clipboard.read()).toBe('012 345\n');
        });
      });
      describe("when followed with a repeated y", function() {
        beforeEach(function() {
          keydown('y');
          keydown('2');
          return keydown('y');
        });
        it("copies n lines, starting from the current", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with a register", function() {
        beforeEach(function() {
          keydown('"');
          keydown('a');
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the a register", function() {
          return expect(vimState.getRegister('a').text).toBe("012 345\n");
        });
        return it("appends the line to the A register", function() {
          keydown('"');
          keydown('A', {
            shift: true
          });
          keydown('y');
          keydown('y');
          return expect(vimState.getRegister('a').text).toBe("012 345\n012 345\n");
        });
      });
      describe("with a forward motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('e');
        });
        it("saves the selected text to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe('345');
        });
        it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
        return it("does not yank when motion fails", function() {
          keydown('y');
          keydown('t');
          normalModeInputKeydown('x');
          return expect(vimState.getRegister('"').text).toBe('345');
        });
      });
      describe("with a text object", function() {
        return it("moves the cursor to the beginning of the text object", function() {
          editor.setCursorBufferPosition([0, 5]);
          keydown("y");
          keydown("i");
          keydown("w");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 4]]);
        });
      });
      describe("with a left motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('h');
        });
        it("saves the left letter to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe(" ");
        });
        return it("moves the cursor position to the left", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
      describe("with a down motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('j');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with an up motion", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([2, 2]);
          keydown('y');
          return keydown('k');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("abc\ndefg\n");
        });
        return it("puts the cursor on the first line and the original column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
      });
      describe("with multiple cursors", function() {
        return it("moves each cursor and copies the last selection's text", function() {
          editor.setText("  abcd\n  1234");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 5]);
          keydown("y");
          keydown("^");
          expect(vimState.getRegister('"').text).toBe('123');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 2]]);
        });
      });
      return describe("in a long file", function() {
        beforeEach(function() {
          var i, text, _i;
          editor.setHeight(400);
          editor.setLineHeightInPixels(10);
          editor.setDefaultCharWidth(10);
          text = "";
          for (i = _i = 1; _i <= 200; i = ++_i) {
            text += "" + i + "\n";
          }
          return editor.setText(text);
        });
        describe("yanking many lines forward", function() {
          return it("does not scroll the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([40, 1]);
            previousScrollTop = editor.getScrollTop();
            keydown('y');
            keydown('1');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editor.getScrollTop()).toEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([40, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(121);
          });
        });
        return describe("yanking many lines backwards", function() {
          return it("scrolls the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([140, 1]);
            previousScrollTop = editor.getScrollTop();
            keydown('y');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editor.getScrollTop()).toNotEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([59, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(83);
          });
        });
      });
    });
    describe("the yy keybinding", function() {
      describe("on a single line file", function() {
        beforeEach(function() {
          editor.getBuffer().setText("exclamation!\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("exclamation!\n");
          return expect(editor.getText()).toBe("exclamation!\nexclamation!\n");
        });
      });
      return describe("on a single line file with no newline", function() {
        beforeEach(function() {
          editor.getBuffer().setText("no newline!");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!");
        });
        return it("copies the entire line and pastes it respecting count and new lines", function() {
          keydown('y');
          keydown('y');
          keydown('2');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!\nno newline!");
        });
      });
    });
    describe("the Y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\n");
        return editor.setCursorScreenPosition([0, 4]);
      });
      return it("saves the line to the default register", function() {
        keydown('Y', {
          shift: true
        });
        expect(vimState.getRegister('"').text).toBe("012 345\n");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
    });
    describe("the p keybinding", function() {
      describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return atom.clipboard.write("clip");
        });
        describe("from the default register", function() {
          beforeEach(function() {
            return keydown('p');
          });
          return it("inserts the contents", function() {
            expect(editor.getText()).toBe("034512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          });
        });
        describe("at the end of a line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            return keydown('p');
          });
          return it("positions cursor correctly", function() {
            expect(editor.getText()).toBe("012345\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          });
        });
        describe("when useClipboardAsDefaultRegister enabled", function() {
          return it("inserts contents from clipboard", function() {
            atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
            keydown('p');
            return expect(editor.getText()).toBe("0clip12\n");
          });
        });
        describe("from a specified register", function() {
          beforeEach(function() {
            keydown('"');
            keydown('a');
            return keydown('p');
          });
          return it("inserts the contents of the 'a' register", function() {
            expect(editor.getText()).toBe("0a12\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        describe("at the end of a line", function() {
          return it("inserts before the current line's newline", function() {
            editor.setText("abcde\none two three");
            editor.setCursorScreenPosition([1, 4]);
            keydown('d');
            keydown('$');
            keydown('k');
            keydown('$');
            keydown('p');
            return expect(editor.getText()).toBe("abcdetwo three\none ");
          });
        });
        return describe("with a selection", function() {
          beforeEach(function() {
            editor.selectRight();
            return keydown('p');
          });
          return it("replaces the current selection", function() {
            expect(editor.getText()).toBe("34512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      describe("with linewise contents", function() {
        describe("on a single line", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012");
            editor.setCursorScreenPosition([0, 1]);
            return vimState.setRegister('"', {
              text: " 345\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register", function() {
            keydown('p');
            expect(editor.getText()).toBe("012\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("replaces the current selection", function() {
            editor.selectRight();
            keydown('p');
            expect(editor.getText()).toBe("0 345\n2");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on multiple lines", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012\n 345");
            return vimState.setRegister('"', {
              text: " 456\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register at middle line", function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 456\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("inserts the contents of the default register at end of line", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 345\n 456");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          });
        });
      });
      describe("with multiple linewise contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\nabc");
          editor.setCursorScreenPosition([1, 0]);
          vimState.setRegister('"', {
            text: " 345\n 678\n",
            type: 'linewise'
          });
          return keydown('p');
        });
        return it("inserts the contents of the default register", function() {
          expect(editor.getText()).toBe("012\nabc\n 345\n 678");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
      });
      return describe("pasting twice", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          vimState.setRegister('"', {
            text: '123'
          });
          keydown('2');
          return keydown('p');
        });
        it("inserts the same line twice", function() {
          return expect(editor.getText()).toBe("12345\nab123123cde\nABCDE\nQWERT");
        });
        return describe("when undone", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("removes both lines", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the P keybinding", function() {
      return describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return keydown('P', {
            shift: true
          });
        });
        return it("inserts the contents of the default register above", function() {
          expect(editor.getText()).toBe("345012\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
    });
    describe("the O keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("  abc\n  012\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('O', {
          shift: true
        });
        expect(editor.getText()).toBe("  abc\n  \n  012\n");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
      it("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    def\n    4spaces\n");
      });
      return it("is undoable", function() {
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n");
        keydown('u');
        return expect(editor.getText()).toBe("  abc\n  012\n");
      });
    });
    describe("the o keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("abc\n  012\n");
        return editor.setCursorScreenPosition([1, 2]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('o');
        expect(editor.getText()).toBe("abc\n  012\n  \n");
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
      });
      xit("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n    4spaces\n");
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n  def\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n    def\n");
      });
      return it("is undoable", function() {
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("abc\n  012\n  def\n");
        keydown('u');
        return expect(editor.getText()).toBe("abc\n  012\n");
      });
    });
    describe("the a keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("012\n");
      });
      describe("at the beginning of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          return keydown('a');
        });
        return it("switches to insert mode and shifts to the right", function() {
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(editorElement.classList.contains('insert-mode')).toBe(true);
        });
      });
      return describe("at the end of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 3]);
          return keydown('a');
        });
        return it("doesn't linewrap", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the A keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n22\n");
      });
      return describe("at the beginning of a line", function() {
        it("switches to insert mode at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return it("repeats always as insert at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          editor.setCursorScreenPosition([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe("11abc\n22abc\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the I keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n  22\n");
      });
      return describe("at the end of a line", function() {
        it("switches to insert mode at the beginning of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
        it("switches to insert mode after leading whitespace", function() {
          editor.setCursorScreenPosition([1, 4]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
        return it("repeats always as insert at the first character of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setCursorScreenPosition([1, 4]);
          keydown('.');
          expect(editor.getText()).toBe("abc11\n  abc22\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the J keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n    456\n");
        return editor.setCursorScreenPosition([0, 1]);
      });
      describe("without repeating", function() {
        beforeEach(function() {
          return keydown('J', {
            shift: true
          });
        });
        return it("joins the contents of the current line with the one below it", function() {
          return expect(editor.getText()).toBe("012 456\n");
        });
      });
      return describe("with repeating", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          keydown('2');
          return keydown('J', {
            shift: true
          });
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("handles repeats", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the > keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("on the last line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        return describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("12345\nabcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
        });
      });
      describe("on the first line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("  12345\nabcde\nABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("when followed by a repeating >", function() {
          beforeEach(function() {
            keydown('3');
            keydown('>');
            return keydown('>');
          });
          it("indents multiple lines at once", function() {
            expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("outdents all three lines", function() {
              return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            });
          });
        });
      });
      describe("in visual mode linewise", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single indent multiple lines", function() {
          beforeEach(function() {
            return keydown('>');
          });
          it("indents both lines once and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
        return describe("multiple indent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('>');
          });
          return it("indents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 4]]]);
          });
        });
      });
      return describe("with multiple selections", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 3]);
          keydown('v');
          keydown('j');
          return editor.addCursorAtScreenPosition([0, 0]);
        });
        return it("indents the lines and keeps the cursors", function() {
          keydown('>');
          expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
          return expect(editor.getCursorScreenPositions()).toEqual([[1, 2], [0, 2]]);
        });
      });
    });
    describe("the < keybinding", function() {
      beforeEach(function() {
        editor.setText("    12345\n    abcde\nABCDE");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("when followed by a <", function() {
        beforeEach(function() {
          keydown('<');
          return keydown('<');
        });
        return it("outdents the current line", function() {
          expect(editor.getText()).toBe("  12345\n    abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("when followed by a repeating <", function() {
        beforeEach(function() {
          keydown('2');
          keydown('<');
          return keydown('<');
        });
        it("outdents multiple lines at once", function() {
          expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("indents both lines", function() {
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
      });
      return describe("in visual mode linewise", function() {
        beforeEach(function() {
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single outdent multiple lines", function() {
          beforeEach(function() {
            return keydown('<');
          });
          it("outdents the current line and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          });
        });
        return describe("multiple outdent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('<');
          });
          return it("outdents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 0]]]);
          });
        });
      });
    });
    describe("the = keybinding", function() {
      var oldGrammar;
      oldGrammar = [];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        oldGrammar = editor.getGrammar();
        editor.setText("foo\n  bar\n  baz");
        return editor.setCursorScreenPosition([1, 0]);
      });
      return describe("when used in a scope that supports auto-indent", function() {
        beforeEach(function() {
          var jsGrammar;
          jsGrammar = atom.grammars.grammarForScopeName('source.js');
          return editor.setGrammar(jsGrammar);
        });
        afterEach(function() {
          return editor.setGrammar(oldGrammar);
        });
        describe("when followed by a =", function() {
          beforeEach(function() {
            keydown('=');
            return keydown('=');
          });
          return it("indents the current line", function() {
            return expect(editor.indentationForBufferRow(1)).toBe(0);
          });
        });
        describe("when followed by a G", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('=');
            return keydown('G', {
              shift: true
            });
          });
          return it("uses the default count", function() {
            expect(editor.indentationForBufferRow(1)).toBe(0);
            return expect(editor.indentationForBufferRow(2)).toBe(0);
          });
        });
        return describe("when followed by a repeating =", function() {
          beforeEach(function() {
            keydown('2');
            keydown('=');
            return keydown('=');
          });
          it("autoindents multiple lines at once", function() {
            expect(editor.getText()).toBe("foo\nbar\nbaz");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("indents both lines", function() {
              return expect(editor.getText()).toBe("foo\n  bar\n  baz");
            });
          });
        });
      });
    });
    describe("the . keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n56\n78");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeats the last operation", function() {
        keydown('2');
        keydown('d');
        keydown('d');
        keydown('.');
        return expect(editor.getText()).toBe("");
      });
      return it("composes with motions", function() {
        keydown('d');
        keydown('d');
        keydown('2');
        keydown('.');
        return expect(editor.getText()).toBe("78");
      });
    });
    describe("the r keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n\n");
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("replaces a single character", function() {
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('x2\nx4\n\n');
      });
      it("does nothing when cancelled", function() {
        keydown('r');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        keydown('escape');
        expect(editor.getText()).toBe('12\n34\n\n');
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("replaces a single character with a line break", function() {
        keydown('r');
        atom.commands.dispatch(editor.normalModeInputView.editorElement, 'core:confirm');
        expect(editor.getText()).toBe('\n2\n\n4\n\n');
        return expect(editor.getCursorBufferPositions()).toEqual([[1, 0], [3, 0]]);
      });
      it("composes properly with motions", function() {
        keydown('2');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('xx\nxx\n\n');
      });
      it("does nothing on an empty line", function() {
        editor.setCursorBufferPosition([2, 0]);
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      it("does nothing if asked to replace more characters than there are on a line", function() {
        keydown('3');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      describe("when in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          return keydown('e');
        });
        it("replaces the entire selection with the given character", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getText()).toBe('xx\nxx\n\n');
        });
        return it("leaves the cursor at the beginning of the selection", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
        });
      });
      return describe('with accented characters', function() {
        var buildIMECompositionEvent, buildTextInputEvent;
        buildIMECompositionEvent = function(event, _arg) {
          var data, target, _ref1;
          _ref1 = _arg != null ? _arg : {}, data = _ref1.data, target = _ref1.target;
          event = new Event(event);
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        buildTextInputEvent = function(_arg) {
          var data, event, target;
          data = _arg.data, target = _arg.target;
          event = new Event('textInput');
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('r');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 's',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('s');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 'sd',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('sd');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: '速度',
            target: inputNode
          }));
          return expect(editor.getText()).toBe('速度2\n速度4\n\n');
        });
      });
    });
    describe('the m keybinding', function() {
      beforeEach(function() {
        editor.setText('12\n34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      return it('marks a position', function() {
        keydown('m');
        normalModeInputKeydown('a');
        return expect(vimState.getMark('a')).toEqual([0, 1]);
      });
    });
    describe('the ~ keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it('toggles the case and moves right', function() {
        keydown('~');
        expect(editor.getText()).toBe('ABc\nxyZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 1], [1, 1]]);
        keydown('~');
        expect(editor.getText()).toBe('Abc\nxYZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      it('takes a count', function() {
        keydown('4');
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      describe("in visual mode", function() {
        return it("toggles the case of the selected text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("V", {
            shift: true
          });
          keydown("~");
          return expect(editor.getText()).toBe('AbC\nXyZ');
        });
      });
      return describe("with g and motion", function() {
        it("toggles the case of text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("2");
          keydown("l");
          return expect(editor.getText()).toBe('Abc\nXyZ');
        });
        return it("uses default count", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("G", {
            shift: true
          });
          return expect(editor.getText()).toBe('AbC\nxYz');
        });
      });
    });
    describe('the U keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text uppercase with g and motion", function() {
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("l");
        expect(editor.getText()).toBe('ABc\nXyZ');
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("e");
        expect(editor.getText()).toBe('ABC\nXyZ');
        editor.setCursorBufferPosition([1, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("$");
        expect(editor.getText()).toBe('ABC\nXYZ');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXYZ');
      });
      return it("makes the selected text uppercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("U", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXyZ');
      });
    });
    describe('the u keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text lowercase with g and motion", function() {
        keydown("g");
        keydown("u");
        keydown("$");
        expect(editor.getText()).toBe('abc\nXyZ');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("u");
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('abc\nxyz');
      });
      return it("makes the selected text lowercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("u");
        return expect(editor.getText()).toBe('abc\nXyZ');
      });
    });
    describe("the i keybinding", function() {
      beforeEach(function() {
        editor.setText('123\n4567');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("allows undoing an entire batch of typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('i');
        editor.insertText("d");
        editor.insertText("e");
        editor.insertText("f");
        keydown('escape');
        expect(editor.getText()).toBe("abdefc123\nabdefc4567");
        keydown('u');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('u');
        return expect(editor.getText()).toBe("123\n4567");
      });
      it("allows repeating typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('.');
        expect(editor.getText()).toBe("ababcc123\nababcc4567");
        keydown('.');
        return expect(editor.getText()).toBe("abababccc123\nabababccc4567");
      });
      return describe('with nonlinear input', function() {
        beforeEach(function() {
          editor.setText('');
          return editor.setCursorBufferPosition([0, 0]);
        });
        it('deals with auto-matched brackets', function() {
          keydown('i');
          editor.insertText('()');
          editor.moveLeft();
          editor.insertText('a');
          editor.moveRight();
          editor.insertText('b\n');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe('(a)b\n(a)b\n');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it('deals with autocomplete', function() {
          keydown('i');
          editor.insertText('a');
          editor.insertText('d');
          editor.insertText('d');
          editor.setTextInBufferRange([[0, 0], [0, 3]], 'addFoo');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editor.getText()).toBe('addFoo');
          keydown('.');
          expect(editor.getText()).toBe('addFoaddFooo');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 10]);
        });
      });
    });
    describe('the a keybinding', function() {
      beforeEach(function() {
        editor.setText('');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("can be undone in one go", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        keydown('u');
        return expect(editor.getText()).toBe("");
      });
      return it("repeats correctly", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('.');
        expect(editor.getText()).toBe("abcabc");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
    });
    describe("the ctrl-a/ctrl-x keybindings", function() {
      beforeEach(function() {
        atom.config.set('vim-mode.numberRegex', settings.config.numberRegex["default"]);
        editor.setText('123\nab45\ncd-67ef\nab-5\na-bcdef');
        editor.setCursorBufferPosition([0, 0]);
        editor.addCursorAtBufferPosition([1, 0]);
        editor.addCursorAtBufferPosition([2, 0]);
        editor.addCursorAtBufferPosition([3, 3]);
        return editor.addCursorAtBufferPosition([4, 0]);
      });
      describe("increasing numbers", function() {
        it("increases the next number", function() {
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd-66ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('a', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('125\nab47\ncd-65ef\nab-3\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 2], [4, 0]]);
          expect(editor.getText()).toBe('128\nab50\ncd-62ef\nab0\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a negative number positive, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 4], [2, 3], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('222\nab144\ncd32ef\nab94\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd -66ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
      return describe("decreasing numbers", function() {
        it("decreases the next number", function() {
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd-68ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('x', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('121\nab43\ncd-69ef\nab-7\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 4], [4, 0]]);
          expect(editor.getText()).toBe('118\nab40\ncd-72ef\nab-10\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a positive number negative, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 1], [1, 4], [2, 5], [3, 5], [4, 0]]);
          expect(editor.getText()).toBe('24\nab-54\ncd-166ef\nab-104\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd -68ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    return describe('the R keybinding', function() {
      beforeEach(function() {
        editor.setText('12345\n67890');
        return editor.setCursorBufferPosition([0, 2]);
      });
      it("enters replace mode and replaces characters", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe("12ab5\n67890");
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("continues beyond end of line as insert", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("abcde");
        keydown('escape');
        return expect(editor.getText()).toBe("12abcde\n67890");
      });
      it("treats backspace as undo", function() {
        editor.insertText("foo");
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        editor.insertText("b");
        expect(editor.getText()).toBe("12fooab5\n67890");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12fooa45\n67890");
        editor.insertText("c");
        expect(editor.getText()).toBe("12fooac5\n67890");
        keydown('backspace', {
          raw: true
        });
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        expect(editor.getSelectedText()).toBe("");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        return expect(editor.getSelectedText()).toBe("");
      });
      it("can be repeated", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("ab");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12ab5\n67ab0");
        expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12abab\n67ab0");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it("can be interrupted by arrow keys and behave as insert for repeat", function() {});
      it("repeats correctly when backspace was used in the text", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        keydown('backspace', {
          raw: true
        });
        editor.insertText("b");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12b45\n67b90");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12b4b\n67b90");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      return it("doesn't replace a character if newline is entered", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("\n");
        keydown('escape');
        return expect(editor.getText()).toBe("12\n345\n67890");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvc3BlYy9vcGVyYXRvcnMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUJBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSxzRUFBQTtBQUFBLElBQUEsT0FBb0MsRUFBcEMsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLGtCQUF4QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCLENBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FEQSxDQUFBO2FBR0EsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRCxHQUFBO0FBQ3ZCLFFBQUEsYUFBQSxHQUFnQixPQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsYUFBYSxDQUFDLFFBQWQsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxhQUFhLENBQUMsUUFGekIsQ0FBQTtBQUFBLFFBR0EsUUFBUSxDQUFDLGtCQUFULENBQUEsQ0FIQSxDQUFBO2VBSUEsUUFBUSxDQUFDLGVBQVQsQ0FBQSxFQUx1QjtNQUFBLENBQXpCLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBYUEsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTs7UUFBTSxVQUFRO09BQ3RCOztRQUFBLE9BQU8sQ0FBQyxVQUFXO09BQW5CO2FBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUIsT0FBckIsRUFGUTtJQUFBLENBYlYsQ0FBQTtBQUFBLElBaUJBLHNCQUFBLEdBQXlCLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTs7UUFBTSxPQUFPO09BQ3BDO2FBQUEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxRQUF6QyxDQUFBLENBQW1ELENBQUMsT0FBcEQsQ0FBNEQsR0FBNUQsRUFEdUI7SUFBQSxDQWpCekIsQ0FBQTtBQUFBLElBb0JBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsTUFBQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO2VBR2pELE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBNEIsSUFBQSxLQUFBLENBQU0sRUFBTixDQUE1QixFQUFIO1FBQUEsQ0FBUCxDQUFpRCxDQUFDLE9BQWxELENBQUEsRUFIaUQ7TUFBQSxDQUFuRCxDQUFBLENBQUE7YUFLQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBRW5DLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sUUFBUSxDQUFDLGlCQUFULENBQUEsQ0FBUCxDQUFvQyxDQUFDLElBQXJDLENBQTBDLElBQTFDLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFyQyxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxpQkFBVCxDQUFBLENBQVAsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxLQUExQyxDQUpBLENBQUE7ZUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLG1CQUFkLENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsTUFBeEMsRUFQbUM7TUFBQSxDQUFyQyxFQU5nQztJQUFBLENBQWxDLENBcEJBLENBQUE7QUFBQSxJQW1DQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxRQUFBLFFBQUEsQ0FBUyxzQ0FBVCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBQUEsQ0FBQTttQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUlBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDLENBSEEsQ0FBQTtBQUFBLFlBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBUEEsQ0FBQTtBQUFBLFlBUUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QyxDQVJBLENBQUE7QUFBQSxZQVVBLE9BQUEsQ0FBUSxHQUFSLENBVkEsQ0FBQTtBQUFBLFlBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQVhBLENBQUE7QUFBQSxZQVlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVpBLENBQUE7QUFBQSxZQWFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FiQSxDQUFBO0FBQUEsWUFlQSxPQUFBLENBQVEsR0FBUixDQWZBLENBQUE7QUFBQSxZQWdCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCLENBaEJBLENBQUE7QUFBQSxZQWlCQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FqQkEsQ0FBQTtBQUFBLFlBa0JBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FsQkEsQ0FBQTtBQUFBLFlBb0JBLE9BQUEsQ0FBUSxHQUFSLENBcEJBLENBQUE7QUFBQSxZQXFCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUIsQ0FyQkEsQ0FBQTtBQUFBLFlBc0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQXRCQSxDQUFBO0FBQUEsWUF1QkEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QyxDQXZCQSxDQUFBO0FBQUEsWUF5QkEsT0FBQSxDQUFRLEdBQVIsQ0F6QkEsQ0FBQTtBQUFBLFlBMEJBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQTFCQSxDQUFBO0FBQUEsWUEyQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBM0JBLENBQUE7bUJBNEJBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsRUE3QndCO1VBQUEsQ0FBMUIsQ0FKQSxDQUFBO2lCQW1DQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FIQSxDQUFBO0FBQUEsWUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLElBQTVDLENBSkEsQ0FBQTtBQUFBLFlBTUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsWUFPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7QUFBQSxZQVFBLE9BQUEsQ0FBUSxHQUFSLENBUkEsQ0FBQTtBQUFBLFlBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixDQVRBLENBQUE7QUFBQSxZQVVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVZBLENBQUE7bUJBV0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QyxFQVo2QztVQUFBLENBQS9DLEVBcEMrQztRQUFBLENBQWpELENBQUEsQ0FBQTtBQUFBLFFBa0RBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO21CQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLEVBSFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFLQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvQkFBOUIsRUFKK0I7VUFBQSxDQUFqQyxFQU5nQztRQUFBLENBQWxDLENBbERBLENBQUE7ZUE4REEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtBQUM1QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWYsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7bUJBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRCxFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUtBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFFeEIsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDLENBSEEsQ0FBQTtBQUFBLFlBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBUEEsQ0FBQTtBQUFBLFlBUUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QyxDQVJBLENBQUE7QUFBQSxZQVVBLE9BQUEsQ0FBUSxHQUFSLENBVkEsQ0FBQTtBQUFBLFlBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQVhBLENBQUE7QUFBQSxZQVlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVpBLENBQUE7QUFBQSxZQWFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FiQSxDQUFBO0FBQUEsWUFlQSxPQUFBLENBQVEsR0FBUixDQWZBLENBQUE7QUFBQSxZQWdCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCLENBaEJBLENBQUE7QUFBQSxZQWlCQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FqQkEsQ0FBQTtBQUFBLFlBa0JBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FsQkEsQ0FBQTtBQUFBLFlBb0JBLE9BQUEsQ0FBUSxHQUFSLENBcEJBLENBQUE7QUFBQSxZQXFCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUIsQ0FyQkEsQ0FBQTtBQUFBLFlBc0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQXRCQSxDQUFBO0FBQUEsWUF1QkEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QyxDQXZCQSxDQUFBO0FBQUEsWUF5QkEsT0FBQSxDQUFRLEdBQVIsQ0F6QkEsQ0FBQTtBQUFBLFlBMEJBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQTFCQSxDQUFBO0FBQUEsWUEyQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBM0JBLENBQUE7bUJBNEJBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsRUE5QndCO1VBQUEsQ0FBMUIsQ0FMQSxDQUFBO2lCQXFDQSxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQSxHQUFBO0FBQzFELFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRCxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCLENBSEEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBSkEsQ0FBQTtBQUFBLFlBS0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxJQUE1QyxDQUxBLENBQUE7QUFBQSxZQU9BLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBUEEsQ0FBQTtBQUFBLFlBUUEsT0FBQSxDQUFRLEdBQVIsQ0FSQSxDQUFBO0FBQUEsWUFTQSxPQUFBLENBQVEsR0FBUixDQVRBLENBQUE7QUFBQSxZQVVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQVZBLENBQUE7QUFBQSxZQVdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVhBLENBQUE7QUFBQSxZQVlBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsTUFBNUMsQ0FaQSxDQUFBO0FBQUEsWUFjQSxPQUFBLENBQVEsR0FBUixDQWRBLENBQUE7QUFBQSxZQWVBLE9BQUEsQ0FBUSxHQUFSLENBZkEsQ0FBQTtBQUFBLFlBZ0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QixDQWhCQSxDQUFBO0FBQUEsWUFpQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBakJBLENBQUE7bUJBa0JBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsV0FBNUMsRUFuQjBEO1VBQUEsQ0FBNUQsRUF0QzRDO1FBQUEsQ0FBOUMsRUEvRGlDO01BQUEsQ0FBbkMsQ0FBQSxDQUFBO2FBMEhBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBQUEsQ0FBQTtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLEVBQUEsQ0FBRyw2RUFBSCxFQUFrRixTQUFBLEdBQUE7QUFDaEYsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELEtBQWhELENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0JBQTlCLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFKZ0Y7UUFBQSxDQUFsRixDQUpBLENBQUE7ZUFVQSxFQUFBLENBQUcsaUVBQUgsRUFBc0UsU0FBQSxHQUFBO0FBQ3BFLFVBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRCxDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBSm9FO1FBQUEsQ0FBdEUsRUFYMkI7TUFBQSxDQUE3QixFQTNIMkI7SUFBQSxDQUE3QixDQW5DQSxDQUFBO0FBQUEsSUErS0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWYsQ0FBQSxDQUFBO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxHQUE1QyxDQUhBLENBQUE7QUFBQSxVQUtBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FMQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FOQSxDQUFBO0FBQUEsVUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FQQSxDQUFBO0FBQUEsVUFRQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDLENBUkEsQ0FBQTtBQUFBLFVBVUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQVA7V0FBYixDQVZBLENBQUE7QUFBQSxVQVdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQVhBLENBQUE7QUFBQSxVQVlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVpBLENBQUE7QUFBQSxVQWFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FiQSxDQUFBO0FBQUEsVUFlQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLEVBQWdELElBQWhELENBZkEsQ0FBQTtBQUFBLFVBZ0JBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FoQkEsQ0FBQTtBQUFBLFVBaUJBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQWpCQSxDQUFBO0FBQUEsVUFrQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBbEJBLENBQUE7aUJBbUJBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUMsRUFwQndCO1FBQUEsQ0FBMUIsRUFMaUM7TUFBQSxDQUFuQyxDQUFBLENBQUE7YUEyQkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsa0JBQWYsQ0FBQSxDQUFBO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsS0FBaEQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBSitEO1FBQUEsQ0FBakUsQ0FKQSxDQUFBO2VBVUEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUN6RCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsSUFBaEQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBSnlEO1FBQUEsQ0FBM0QsRUFYMkI7TUFBQSxDQUE3QixFQTVCMkI7SUFBQSxDQUE3QixDQS9LQSxDQUFBO0FBQUEsSUE0TkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBZixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRywyREFBSCxFQUFnRSxTQUFBLEdBQUE7QUFDOUQsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixPQUE5QixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQUhBLENBQUE7ZUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEdBQTVDLEVBTDhEO01BQUEsQ0FBaEUsQ0FKQSxDQUFBO0FBQUEsTUFXQSxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsUUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxRQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQTlCLENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsUUFPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7ZUFRQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsTUFBOUIsRUFUa0I7TUFBQSxDQUFwQixDQVhBLENBQUE7QUFBQSxNQXNCQSxFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxRQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQTlCLENBTEEsQ0FBQTtBQUFBLFFBTUEsT0FBQSxDQUFRLEdBQVIsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUIsQ0FQQSxDQUFBO2VBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEVBQXRDLEVBVGdCO01BQUEsQ0FBbEIsQ0F0QkEsQ0FBQTthQWlDQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBREEsQ0FBQTtpQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFLQSxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFVBQUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE1BQTlCLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLElBQTVDLEVBSjJEO1FBQUEsQ0FBN0QsRUFOeUI7TUFBQSxDQUEzQixFQWxDMkI7SUFBQSxDQUE3QixDQTVOQSxDQUFBO0FBQUEsSUEwUUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUscUJBQWYsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFFBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFNBQTVDLENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsVUFBNUMsRUFObUQ7TUFBQSxDQUFyRCxDQUpBLENBQUE7QUFBQSxNQVlBLEVBQUEsQ0FBRyxlQUFILEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxRQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1CQUE5QixDQUhBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBSkEsQ0FBQTtBQUFBLFFBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO2VBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1CQUE5QixFQVBrQjtNQUFBLENBQXBCLENBWkEsQ0FBQTtBQUFBLE1BcUJBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxRQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1CQUE5QixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QixDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEMsRUFQZ0I7TUFBQSxDQUFsQixDQXJCQSxDQUFBO0FBQUEsTUE4QkEsRUFBQSxDQUFHLHdFQUFILEVBQTZFLFNBQUEsR0FBQTtBQUMzRSxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxRQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLEVBTDJFO01BQUEsQ0FBN0UsQ0E5QkEsQ0FBQTthQXNDQSxHQUFBLENBQUksc0JBQUosRUFBNEIsU0FBQSxHQUFBLENBQTVCLEVBdkMyQjtJQUFBLENBQTdCLENBMVFBLENBQUE7QUFBQSxJQW1UQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsdUJBQWpDLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RSxDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0QsRUFIaUM7TUFBQSxDQUFuQyxDQUFBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQSxHQUFBO0FBQzdELFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSx1QkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsQ0FOQSxDQUFBO0FBQUEsVUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FQQSxDQUFBO0FBQUEsVUFRQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFNBQTVDLENBUkEsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsdUJBQWpDLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxLQUF2RSxDQVRBLENBQUE7aUJBVUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELEVBWDZEO1FBQUEsQ0FBL0QsQ0FBQSxDQUFBO0FBQUEsUUFhQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxxQkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsQ0FOQSxDQUFBO2lCQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQVIwQjtRQUFBLENBQTVCLENBYkEsQ0FBQTtlQXVCQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxrQkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixDQU5BLENBQUE7aUJBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBUnNEO1FBQUEsQ0FBeEQsRUF4QitCO01BQUEsQ0FBakMsQ0FMQSxDQUFBO0FBQUEsTUF1Q0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSw0QkFBZixDQUFBLENBQUE7aUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCLENBTkEsQ0FBQTtpQkFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEMsRUFSc0I7UUFBQSxDQUF4QixDQUpBLENBQUE7ZUFjQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO21CQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFJQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFlBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRCQUE5QixDQUxBLENBQUE7bUJBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEVBQXRDLEVBUCtCO1VBQUEsQ0FBakMsRUFMZ0M7UUFBQSxDQUFsQyxFQWZ3QjtNQUFBLENBQTFCLENBdkNBLENBQUE7QUFBQSxNQW9FQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsRUFBQSxDQUFHLGlGQUFILEVBQXNGLFNBQUEsR0FBQTtBQUNwRixVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQVJBLENBQUE7QUFBQSxVQVNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVRBLENBQUE7QUFBQSxVQVdBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLHVCQUFqQyxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsS0FBdkUsQ0FYQSxDQUFBO2lCQVlBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxFQWJvRjtRQUFBLENBQXRGLENBQUEsQ0FBQTtlQWVBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxVQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsT0FBOUIsQ0FOQSxDQUFBO0FBQUEsVUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FQQSxDQUFBO0FBQUEsVUFTQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBVEEsQ0FBQTtBQUFBLFVBVUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FWQSxDQUFBO0FBQUEsVUFZQSxPQUFBLENBQVEsR0FBUixDQVpBLENBQUE7QUFBQSxVQWFBLE9BQUEsQ0FBUSxHQUFSLENBYkEsQ0FBQTtBQUFBLFVBY0EsT0FBQSxDQUFRLEdBQVIsQ0FkQSxDQUFBO0FBQUEsVUFnQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE1BQTlCLENBaEJBLENBQUE7aUJBaUJBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQWxCOEM7UUFBQSxDQUFoRCxFQWhCK0I7TUFBQSxDQUFqQyxDQXBFQSxDQUFBO0FBQUEsTUF3R0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtlQUNqQyxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyx1QkFBakMsQ0FBUCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLElBQXZFLENBSkEsQ0FBQTtBQUFBLFVBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsVUFNQSxPQUFBLENBQVEsR0FBUixDQU5BLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQVJBLENBQUE7QUFBQSxVQVNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVRBLENBQUE7QUFBQSxVQVVBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsT0FBNUMsQ0FWQSxDQUFBO0FBQUEsVUFXQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyx1QkFBakMsQ0FBUCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLEtBQXZFLENBWEEsQ0FBQTtpQkFZQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsRUFiZ0M7UUFBQSxDQUFsQyxFQURpQztNQUFBLENBQW5DLENBeEdBLENBQUE7QUFBQSxNQXdIQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsWUFBQTtBQUFBLFFBQUEsWUFBQSxHQUFlLHVCQUFmLENBQUE7QUFBQSxRQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxZQUFmLEVBRFM7UUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLFFBS0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtpQkFDdkMsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLEVBSitCO1VBQUEsQ0FBakMsRUFEdUM7UUFBQSxDQUF6QyxDQUxBLENBQUE7QUFBQSxRQVlBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7aUJBQ2pDLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QixFQUpvQjtVQUFBLENBQXRCLEVBRGlDO1FBQUEsQ0FBbkMsQ0FaQSxDQUFBO2VBbUJBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7aUJBQ3ZDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixFQUorQjtVQUFBLENBQWpDLEVBRHVDO1FBQUEsQ0FBekMsRUFwQitCO01BQUEsQ0FBakMsQ0F4SEEsQ0FBQTtBQUFBLE1BbUpBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsWUFBQSxZQUFBO0FBQUEsUUFBQSxZQUFBLEdBQWUscUJBQWYsQ0FBQTtBQUFBLFFBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWYsRUFEUztRQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsUUFLQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO2lCQUNqQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBOUIsRUFKaUM7VUFBQSxDQUFuQyxFQURpQztRQUFBLENBQW5DLENBTEEsQ0FBQTtBQUFBLFFBWUEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtpQkFDdkMsR0FBQSxDQUFJLGlCQUFKLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSnFCO1VBQUEsQ0FBdkIsRUFEdUM7UUFBQSxDQUF6QyxDQVpBLENBQUE7ZUFtQkEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtpQkFDNUMsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQTlCLEVBSmdDO1VBQUEsQ0FBbEMsRUFENEM7UUFBQSxDQUE5QyxFQXBCZ0M7TUFBQSxDQUFsQyxDQW5KQSxDQUFBO0FBQUEsTUE4S0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLFlBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxxQkFBZixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7aUJBQzlDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLEVBSmlDO1VBQUEsQ0FBbkMsRUFEOEM7UUFBQSxDQUFoRCxDQUpBLENBQUE7ZUFXQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQSxHQUFBO2lCQUMzQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUE5QixFQUppQztVQUFBLENBQW5DLEVBRDJDO1FBQUEsQ0FBN0MsRUFaK0I7TUFBQSxDQUFqQyxDQTlLQSxDQUFBO0FBQUEsTUFpTUEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLFlBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxxQkFBZixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7aUJBQzlDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsY0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQ4QztRQUFBLENBQWhELENBSkEsQ0FBQTtlQVlBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsY0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQyQztRQUFBLENBQTdDLEVBYnlDO01BQUEsQ0FBM0MsQ0FqTUEsQ0FBQTtBQUFBLE1Bc05BLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7ZUFDaEMsUUFBQSxDQUFTLG9DQUFULEVBQStDLFNBQUEsR0FBQTtBQUM3QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixDQUFBLENBQUE7bUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUlBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxZQUlBLHNCQUFBLENBQXVCLEdBQXZCLENBSkEsQ0FBQTtBQUFBLFlBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBTEEsQ0FBQTttQkFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFQMEM7VUFBQSxDQUE1QyxFQUw2QztRQUFBLENBQS9DLEVBRGdDO01BQUEsQ0FBbEMsQ0F0TkEsQ0FBQTthQXFPQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FIQSxDQUFBO0FBQUEsVUFLQSxPQUFBLENBQVEsR0FBUixDQUxBLENBQUE7QUFBQSxVQU1BLE9BQUEsQ0FBUSxHQUFSLENBTkEsQ0FBQTtBQUFBLFVBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLENBUkEsQ0FBQTtpQkFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQ2hELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FEZ0QsRUFFaEQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZnRCxFQUdoRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBSGdELENBQWxELEVBVjJCO1FBQUEsQ0FBN0IsQ0FBQSxDQUFBO2VBZ0JBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBSEEsQ0FBQTtBQUFBLFVBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsVUFNQSxPQUFBLENBQVEsR0FBUixDQU5BLENBQUE7QUFBQSxVQU9BLHNCQUFBLENBQXVCLEdBQXZCLENBUEEsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFdBQTlCLENBVEEsQ0FBQTtpQkFVQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQ2hELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FEZ0QsRUFFaEQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZnRCxFQUdoRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBSGdELENBQWxELEVBWG9DO1FBQUEsQ0FBdEMsRUFqQmdDO01BQUEsQ0FBbEMsRUF0TzJCO0lBQUEsQ0FBN0IsQ0FuVEEsQ0FBQTtBQUFBLElBMmpCQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLE9BQTNCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO2VBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixFQUhTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFLQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO2VBQ25ELE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QixFQURtRDtNQUFBLENBQXJELEVBTjJCO0lBQUEsQ0FBN0IsQ0EzakJBLENBQUE7QUFBQSxJQW9rQkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLHVCQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsWUFFQSxLQUFBLENBQU0sTUFBTixFQUFjLGtCQUFkLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsSUFBNUMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxLQUFBLENBQU0sTUFBTixFQUFjLHFCQUFkLENBQW9DLENBQUMsV0FBckMsQ0FBaUQsU0FBQyxJQUFELEdBQUE7cUJBQy9DLE1BQU0sQ0FBQyxNQUFQLENBQUEsRUFEK0M7WUFBQSxDQUFqRCxDQUhBLENBQUE7bUJBS0EsS0FBQSxDQUFNLE1BQU0sQ0FBQyxZQUFiLEVBQTJCLG1DQUEzQixDQUErRCxDQUFDLFdBQWhFLENBQTRFLFNBQUEsR0FBQTtxQkFBRyxFQUFIO1lBQUEsQ0FBNUUsRUFOUztVQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsVUFRQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFlBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QixDQUxBLENBQUE7QUFBQSxZQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQU5BLENBQUE7QUFBQSxZQU9BLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RCxDQVBBLENBQUE7bUJBUUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELEVBVG9EO1VBQUEsQ0FBdEQsQ0FSQSxDQUFBO0FBQUEsVUFtQkEsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLFFBQVIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUJBQTlCLENBSkEsQ0FBQTtBQUFBLFlBS0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FMQSxDQUFBO0FBQUEsWUFNQSxPQUFBLENBQVEsR0FBUixDQU5BLENBQUE7bUJBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVCQUE5QixFQVJrQjtVQUFBLENBQXBCLENBbkJBLENBQUE7aUJBNkJBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtBQUNoQixZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxRQUFSLENBSEEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QixDQUpBLENBQUE7QUFBQSxZQUtBLE9BQUEsQ0FBUSxHQUFSLENBTEEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVCQUE5QixDQU5BLENBQUE7bUJBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEVBQXRDLEVBUmdCO1VBQUEsQ0FBbEIsRUE5QjBCO1FBQUEsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsUUF3Q0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtpQkFDOUMsRUFBQSxDQUFHLG9FQUFILEVBQXlFLFNBQUEsR0FBQTtBQUN2RSxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxZQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FOQSxDQUFBO0FBQUEsWUFPQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0QsQ0FQQSxDQUFBO21CQVFBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxFQVR1RTtVQUFBLENBQXpFLEVBRDhDO1FBQUEsQ0FBaEQsQ0F4Q0EsQ0FBQTtlQW9EQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO2lCQUM5QyxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFlBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxZQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLEVBQTlCLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBUEEsQ0FBQTtBQUFBLFlBUUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELEtBQTdELENBUkEsQ0FBQTttQkFTQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsRUFWc0Q7VUFBQSxDQUF4RCxFQUQ4QztRQUFBLENBQWhELEVBckQrQjtNQUFBLENBQWpDLENBSEEsQ0FBQTtBQUFBLE1BcUVBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7ZUFDL0IsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxVQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixDQUxBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQU5BLENBQUE7QUFBQSxVQU9BLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQVBBLENBQUE7QUFBQSxVQVVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsa0JBQWYsQ0FWQSxDQUFBO0FBQUEsVUFXQSxPQUFBLENBQVEsUUFBUixDQVhBLENBQUE7QUFBQSxVQVlBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQVpBLENBQUE7QUFBQSxVQWFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUIsQ0FiQSxDQUFBO0FBQUEsVUFlQSxPQUFBLENBQVEsR0FBUixDQWZBLENBQUE7QUFBQSxVQWdCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUJBQTlCLENBaEJBLENBQUE7QUFBQSxVQWlCQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiLENBakJBLENBQUE7aUJBa0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUIsRUFuQmlDO1FBQUEsQ0FBbkMsRUFEK0I7TUFBQSxDQUFqQyxDQXJFQSxDQUFBO0FBQUEsTUEyRkEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtlQUMvQixFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxTQUFTLENBQUMsTUFBZCxDQUEvQixDQURBLENBQUE7QUFBQSxVQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsVUFLQSxPQUFBLENBQVEsUUFBUixDQUxBLENBQUE7aUJBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGVBQTlCLEVBUnFCO1FBQUEsQ0FBdkIsRUFEK0I7TUFBQSxDQUFqQyxDQTNGQSxDQUFBO0FBQUEsTUFzR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLFlBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxxQkFBZixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7aUJBQzlDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxRQUFSLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQ4QztRQUFBLENBQWhELENBSkEsQ0FBQTtlQVlBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxRQUFSLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQyQztRQUFBLENBQTdDLEVBYitCO01BQUEsQ0FBakMsQ0F0R0EsQ0FBQTtBQUFBLE1BMkhBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsOEJBQWYsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFHQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7bUJBS0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsRUFOUztVQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsVUFRQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFlBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCLEVBRmdEO1VBQUEsQ0FBbEQsQ0FSQSxDQUFBO2lCQVlBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxPQUFBLENBQVEsUUFBUixDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUEzQixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsOEJBQTlCLEVBSjRCO1VBQUEsQ0FBOUIsRUFiOEM7UUFBQSxDQUFoRCxDQUhBLENBQUE7QUFBQSxRQXNCQSxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQSxHQUFBO2lCQUMvQyxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQSxHQUFBO0FBQzFELFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxZQUtBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBTEEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDBCQUE5QixDQU5BLENBQUE7bUJBT0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCLEVBUjBEO1VBQUEsQ0FBNUQsRUFEK0M7UUFBQSxDQUFqRCxDQXRCQSxDQUFBO0FBQUEsUUFpQ0EsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtpQkFDcEMsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNwQixZQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsNEJBQWYsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxZQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUIsQ0FMQSxDQUFBO21CQU1BLE1BQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUEzQixFQVBvQjtVQUFBLENBQXRCLEVBRG9DO1FBQUEsQ0FBdEMsQ0FqQ0EsQ0FBQTtlQTJDQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FIQSxDQUFBO21CQUlBLE9BQUEsQ0FBUSxRQUFSLEVBTFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFVBT0EsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0JBQTlCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0IsRUFKdUM7VUFBQSxDQUF6QyxDQVBBLENBQUE7QUFBQSxVQWFBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFFBQTNCLEVBSjZDO1VBQUEsQ0FBL0MsQ0FiQSxDQUFBO0FBQUEsVUFtQkEsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0JBQTlCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0IsRUFKc0M7VUFBQSxDQUF4QyxDQW5CQSxDQUFBO0FBQUEsVUF5QkEsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUJBQTlCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBM0IsRUFKNkM7VUFBQSxDQUEvQyxDQXpCQSxDQUFBO2lCQStCQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUEzQixFQUorQztVQUFBLENBQWpELEVBaEM0QjtRQUFBLENBQTlCLEVBNUMrQjtNQUFBLENBQWpDLENBM0hBLENBQUE7QUFBQSxNQTZNQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBR0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtpQkFDOUMsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsUUFBUixDQUpBLENBQUE7bUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixFQU5xQztVQUFBLENBQXZDLEVBRDhDO1FBQUEsQ0FBaEQsQ0FIQSxDQUFBO2VBWUEsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUEsR0FBQTtpQkFDM0MsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsUUFBUixDQUpBLENBQUE7bUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixFQU5xQztVQUFBLENBQXZDLEVBRDJDO1FBQUEsQ0FBN0MsRUFieUM7TUFBQSxDQUEzQyxDQTdNQSxDQUFBO2FBbU9BLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLHdDQUFmLENBQUEsQ0FBQTtpQkFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFFBQUEsQ0FBUywrQ0FBVCxFQUEwRCxTQUFBLEdBQUE7QUFDeEQsVUFBQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQUpBLENBQUE7QUFBQSxZQUtBLE9BQUEsQ0FBUSxRQUFSLENBTEEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVDQUE5QixDQU5BLENBQUE7QUFBQSxZQVFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBUkEsQ0FBQTtBQUFBLFlBU0EsT0FBQSxDQUFRLEdBQVIsQ0FUQSxDQUFBO21CQVVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQ0FBOUIsRUFYbUI7VUFBQSxDQUFyQixDQUFBLENBQUE7QUFBQSxVQWFBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxZQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFlBS0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxPQUFBLENBQVEsUUFBUixDQU5BLENBQUE7QUFBQSxZQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQ0FBOUIsQ0FQQSxDQUFBO0FBQUEsWUFTQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQVRBLENBQUE7QUFBQSxZQVVBLE9BQUEsQ0FBUSxHQUFSLENBVkEsQ0FBQTttQkFXQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUNBQTlCLEVBWnNEO1VBQUEsQ0FBeEQsQ0FiQSxDQUFBO2lCQTJCQSxFQUFBLENBQUcsb0dBQUgsRUFBeUcsU0FBQSxHQUFBO0FBQ3ZHLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixFQUFnRCxJQUFoRCxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxZQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFlBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQU5BLENBQUE7QUFBQSxZQU9BLE9BQUEsQ0FBUSxRQUFSLENBUEEsQ0FBQTtBQUFBLFlBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFDQUE5QixDQVJBLENBQUE7QUFBQSxZQVVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBVkEsQ0FBQTtBQUFBLFlBV0EsT0FBQSxDQUFRLEdBQVIsQ0FYQSxDQUFBO21CQWFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQ0FBOUIsRUFkdUc7VUFBQSxDQUF6RyxFQTVCd0Q7UUFBQSxDQUExRCxDQUpBLENBQUE7QUFBQSxRQWdEQSxRQUFBLENBQVMsZ0VBQVQsRUFBMkUsU0FBQSxHQUFBO0FBQ3pFLFVBQUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFlBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsWUFLQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUxBLENBQUE7QUFBQSxZQU1BLE9BQUEsQ0FBUSxRQUFSLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDhCQUE5QixDQVBBLENBQUE7QUFBQSxZQVNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBVEEsQ0FBQTtBQUFBLFlBVUEsT0FBQSxDQUFRLEdBQVIsQ0FWQSxDQUFBO21CQVdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsRUFabUI7VUFBQSxDQUFyQixDQUFBLENBQUE7aUJBY0EsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUV0RCxZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFlBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsWUFLQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUxBLENBQUE7QUFBQSxZQU1BLE9BQUEsQ0FBUSxRQUFSLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJCQUE5QixDQVBBLENBQUE7QUFBQSxZQVNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBVEEsQ0FBQTtBQUFBLFlBVUEsT0FBQSxDQUFRLEdBQVIsQ0FWQSxDQUFBO21CQVdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QixFQWJzRDtVQUFBLENBQXhELEVBZnlFO1FBQUEsQ0FBM0UsQ0FoREEsQ0FBQTtBQUFBLFFBOEVBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsVUFBQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO21CQUNqQyxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxJQUFQO2VBQWIsQ0FBQSxDQUFBO0FBQUEsY0FDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxjQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBRkEsQ0FBQTtBQUFBLGNBR0EsT0FBQSxDQUFRLFFBQVIsQ0FIQSxDQUFBO0FBQUEsY0FJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0NBQTlCLENBSkEsQ0FBQTtBQUFBLGNBTUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsY0FPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7QUFBQSxjQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUIsQ0FSQSxDQUFBO0FBQUEsY0FVQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQVZBLENBQUE7QUFBQSxjQVdBLE9BQUEsQ0FBUSxHQUFSLENBWEEsQ0FBQTtxQkFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCLEVBYm1CO1lBQUEsQ0FBckIsRUFEaUM7VUFBQSxDQUFuQyxDQUFBLENBQUE7aUJBZ0JBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsWUFBQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGdCQUFBLEtBQUEsRUFBTyxJQUFQO2VBQWIsQ0FBQSxDQUFBO0FBQUEsY0FDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxjQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLGNBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FIQSxDQUFBO0FBQUEsY0FJQSxPQUFBLENBQVEsUUFBUixDQUpBLENBQUE7QUFBQSxjQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQkFBOUIsQ0FMQSxDQUFBO0FBQUEsY0FPQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQVBBLENBQUE7QUFBQSxjQVFBLE9BQUEsQ0FBUSxHQUFSLENBUkEsQ0FBQTtxQkFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsRUFWbUI7WUFBQSxDQUFyQixDQUFBLENBQUE7bUJBWUEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxjQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxnQkFBQSxLQUFBLEVBQU8sSUFBUDtlQUFiLENBQUEsQ0FBQTtBQUFBLGNBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsY0FFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxjQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtBQUFBLGNBSUEsT0FBQSxDQUFRLFFBQVIsQ0FKQSxDQUFBO0FBQUEsY0FLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0JBQTlCLENBTEEsQ0FBQTtBQUFBLGNBT0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FQQSxDQUFBO0FBQUEsY0FRQSxPQUFBLENBQVEsR0FBUixDQVJBLENBQUE7cUJBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixFQVZzRDtZQUFBLENBQXhELEVBYnVDO1VBQUEsQ0FBekMsRUFqQmdEO1FBQUEsQ0FBbEQsQ0E5RUEsQ0FBQTtlQXdIQSxTQUFBLENBQVUsb0NBQVYsRUFBZ0QsU0FBQSxHQUFBLENBQWhELEVBekh5QjtNQUFBLENBQTNCLEVBcE8yQjtJQUFBLENBQTdCLENBcGtCQSxDQUFBO0FBQUEsSUFvNkJBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsT0FBM0IsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7ZUFFQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiLEVBSFM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUtBLEVBQUEsQ0FBRyx1RUFBSCxFQUE0RSxTQUFBLEdBQUE7QUFDMUUsUUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsS0FBOUIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0QsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELEVBSjBFO01BQUEsQ0FBNUUsRUFOMkI7SUFBQSxDQUE3QixDQXA2QkEsQ0FBQTtBQUFBLElBZzdCQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLHNCQUEzQixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtlQUVBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsVUFBQSxJQUFBLEVBQU0sS0FBTjtTQUExQixFQUhTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyw2Q0FBVCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO2lCQUVBLE9BQUEsQ0FBUSxHQUFSLEVBSFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBS0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtpQkFDMUIsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxPQUF2QyxDQUErQyxVQUEvQyxFQUQwQjtRQUFBLENBQTVCLENBTEEsQ0FBQTtBQUFBLFFBUUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtpQkFDNUMsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxnQkFBNUMsRUFENEM7UUFBQSxDQUE5QyxDQVJBLENBQUE7ZUFXQSxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQSxHQUFBO2lCQUN4RCxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELENBQWxELEVBRHdEO1FBQUEsQ0FBMUQsRUFac0Q7TUFBQSxDQUF4RCxDQUxBLENBQUE7QUFBQSxNQW9CQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO2lCQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtpQkFDM0MsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxXQUE1QyxFQUQyQztRQUFBLENBQTdDLENBSkEsQ0FBQTtlQU9BLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7aUJBQy9DLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUQrQztRQUFBLENBQWpELEVBUnVDO01BQUEsQ0FBekMsQ0FwQkEsQ0FBQTtBQUFBLE1BK0JBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7ZUFDckQsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsSUFBMUQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBUCxDQUE2QixDQUFDLElBQTlCLENBQW1DLFdBQW5DLEVBSndCO1FBQUEsQ0FBMUIsRUFEcUQ7TUFBQSxDQUF2RCxDQS9CQSxDQUFBO0FBQUEsTUFzQ0EsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO2lCQUVBLE9BQUEsQ0FBUSxHQUFSLEVBSFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBS0EsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtpQkFDOUMsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxnQkFBNUMsRUFEOEM7UUFBQSxDQUFoRCxDQUxBLENBQUE7ZUFRQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO2lCQUMvQyxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFEK0M7UUFBQSxDQUFqRCxFQVQwQztNQUFBLENBQTVDLENBdENBLENBQUE7QUFBQSxNQWtEQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtpQkFHQSxPQUFBLENBQVEsR0FBUixFQUpTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQU1BLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7aUJBQ3JDLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsV0FBNUMsRUFEcUM7UUFBQSxDQUF2QyxDQU5BLENBQUE7ZUFTQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxvQkFBNUMsRUFMdUM7UUFBQSxDQUF6QyxFQVYwQjtNQUFBLENBQTVCLENBbERBLENBQUE7QUFBQSxNQW1FQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO2lCQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtpQkFDcEQsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxFQURvRDtRQUFBLENBQXRELENBSkEsQ0FBQTtBQUFBLFFBT0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtpQkFDL0MsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRCtDO1FBQUEsQ0FBakQsQ0FQQSxDQUFBO2VBVUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxzQkFBQSxDQUF1QixHQUF2QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxFQUpvQztRQUFBLENBQXRDLEVBWGdDO01BQUEsQ0FBbEMsQ0FuRUEsQ0FBQTtBQUFBLE1Bb0ZBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7ZUFDN0IsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUN6RCxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxVQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELENBQWxELEVBTHlEO1FBQUEsQ0FBM0QsRUFENkI7TUFBQSxDQUEvQixDQXBGQSxDQUFBO0FBQUEsTUE0RkEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtpQkFDQSxPQUFBLENBQVEsR0FBUixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7aUJBQ2xELE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsR0FBNUMsRUFEa0Q7UUFBQSxDQUFwRCxDQUpBLENBQUE7ZUFPQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO2lCQUMxQyxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFEMEM7UUFBQSxDQUE1QyxFQVI2QjtNQUFBLENBQS9CLENBNUZBLENBQUE7QUFBQSxNQXVHQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO2lCQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtpQkFDbEQsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxnQkFBNUMsRUFEa0Q7UUFBQSxDQUFwRCxDQUpBLENBQUE7ZUFPQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO2lCQUMvQyxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFEK0M7UUFBQSxDQUFqRCxFQVI2QjtNQUFBLENBQS9CLENBdkdBLENBQUE7QUFBQSxNQWtIQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7aUJBRUEsT0FBQSxDQUFRLEdBQVIsRUFIUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFLQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO2lCQUNsRCxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLGFBQTVDLEVBRGtEO1FBQUEsQ0FBcEQsQ0FMQSxDQUFBO2VBUUEsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUEsR0FBQTtpQkFDOUQsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRDhEO1FBQUEsQ0FBaEUsRUFUNEI7TUFBQSxDQUE5QixDQWxIQSxDQUFBO0FBQUEsTUE4SEEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLFlBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxxQkFBZixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7aUJBQzlDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQ4QztRQUFBLENBQWhELENBSkEsQ0FBQTtlQVlBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUZBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUIsRUFMaUM7VUFBQSxDQUFuQyxFQUQyQztRQUFBLENBQTdDLEVBYitCO01BQUEsQ0FBakMsQ0E5SEEsQ0FBQTtBQUFBLE1BbUpBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsY0FBQSxZQUFBO0FBQUEsVUFBQSxZQUFBLEdBQWUscUJBQWYsQ0FBQTtpQkFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWYsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO2lCQUM5QyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFlBR0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUhBLENBQUE7QUFBQSxZQUlBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FKQSxDQUFBO21CQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0QkFBOUIsRUFOaUM7VUFBQSxDQUFuQyxFQUQ4QztRQUFBLENBQWhELENBSkEsQ0FBQTtlQWFBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7aUJBQzNDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsWUFHQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsY0FBQSxLQUFBLEVBQU8sSUFBUDthQUFiLENBSEEsQ0FBQTtBQUFBLFlBSUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixDQUpBLENBQUE7bUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRCQUE5QixFQU5pQztVQUFBLENBQW5DLEVBRDJDO1FBQUEsQ0FBN0MsRUFkeUM7TUFBQSxDQUEzQyxDQW5KQSxDQUFBO0FBQUEsTUEwS0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtlQUNoQyxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnQkFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FGQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxVQUtBLE9BQUEsQ0FBUSxHQUFSLENBTEEsQ0FBQTtBQUFBLFVBT0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxDQVBBLENBQUE7aUJBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRCxFQVQyRDtRQUFBLENBQTdELEVBRGdDO01BQUEsQ0FBbEMsQ0ExS0EsQ0FBQTthQXNMQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsV0FBQTtBQUFBLFVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsR0FBakIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsRUFBN0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsRUFBM0IsQ0FGQSxDQUFBO0FBQUEsVUFHQSxJQUFBLEdBQU8sRUFIUCxDQUFBO0FBSUEsZUFBUywrQkFBVCxHQUFBO0FBQ0UsWUFBQSxJQUFBLElBQVEsRUFBQSxHQUFHLENBQUgsR0FBSyxJQUFiLENBREY7QUFBQSxXQUpBO2lCQU1BLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQVBTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQVNBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7aUJBQ3JDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsZ0JBQUEsaUJBQUE7QUFBQSxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLEVBQUQsRUFBSyxDQUFMLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsaUJBQUEsR0FBb0IsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQURwQixDQUFBO0FBQUEsWUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxZQUtBLE9BQUEsQ0FBUSxHQUFSLENBTEEsQ0FBQTtBQUFBLFlBTUEsT0FBQSxDQUFRLEdBQVIsQ0FOQSxDQUFBO0FBQUEsWUFPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7QUFBQSxZQVFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FSQSxDQUFBO0FBQUEsWUFVQSxNQUFBLENBQU8sTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFQLENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsaUJBQXRDLENBVkEsQ0FBQTtBQUFBLFlBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpELENBWEEsQ0FBQTttQkFZQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFJLENBQUMsS0FBL0IsQ0FBcUMsSUFBckMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELEdBQS9ELEVBYitCO1VBQUEsQ0FBakMsRUFEcUM7UUFBQSxDQUF2QyxDQVRBLENBQUE7ZUF5QkEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtpQkFDdkMsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixnQkFBQSxpQkFBQTtBQUFBLFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxpQkFBQSxHQUFvQixNQUFNLENBQUMsWUFBUCxDQUFBLENBRHBCLENBQUE7QUFBQSxZQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFlBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsWUFNQSxPQUFBLENBQVEsR0FBUixDQU5BLENBQUE7QUFBQSxZQU9BLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxjQUFBLEtBQUEsRUFBTyxJQUFQO2FBQWIsQ0FQQSxDQUFBO0FBQUEsWUFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFQLENBQTZCLENBQUMsVUFBOUIsQ0FBeUMsaUJBQXpDLENBVEEsQ0FBQTtBQUFBLFlBVUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLEVBQUQsRUFBSyxDQUFMLENBQWpELENBVkEsQ0FBQTttQkFXQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFJLENBQUMsS0FBL0IsQ0FBcUMsSUFBckMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELEVBQS9ELEVBWnVCO1VBQUEsQ0FBekIsRUFEdUM7UUFBQSxDQUF6QyxFQTFCeUI7TUFBQSxDQUEzQixFQXZMMkI7SUFBQSxDQUE3QixDQWg3QkEsQ0FBQTtBQUFBLElBZ3BDQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLE1BQUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixnQkFBM0IsQ0FBQSxDQUFBO2lCQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUlBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLGdCQUE1QyxDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDhCQUE5QixFQU5tRDtRQUFBLENBQXJELEVBTGdDO01BQUEsQ0FBbEMsQ0FBQSxDQUFBO2FBYUEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixhQUEzQixDQUFBLENBQUE7aUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFVBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLENBQXlCLENBQUMsSUFBakMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxlQUE1QyxDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDBCQUE5QixFQU5tRDtRQUFBLENBQXJELENBSkEsQ0FBQTtlQVlBLEVBQUEsQ0FBRyxxRUFBSCxFQUEwRSxTQUFBLEdBQUE7QUFDeEUsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxPQUFBLENBQVEsR0FBUixDQUhBLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUF5QixDQUFDLElBQWpDLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsZUFBNUMsQ0FMQSxDQUFBO2lCQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1Q0FBOUIsRUFQd0U7UUFBQSxDQUExRSxFQWJnRDtNQUFBLENBQWxELEVBZDRCO0lBQUEsQ0FBOUIsQ0FocENBLENBQUE7QUFBQSxJQW9yQ0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixnQkFBM0IsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBQyxJQUFqQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFdBQTVDLENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUoyQztNQUFBLENBQTdDLEVBTDJCO0lBQUEsQ0FBN0IsQ0FwckNBLENBQUE7QUFBQSxJQStyQ0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsT0FBM0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxVQUVBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsWUFBQSxJQUFBLEVBQU0sS0FBTjtXQUExQixDQUZBLENBQUE7QUFBQSxVQUdBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsWUFBQSxJQUFBLEVBQU0sR0FBTjtXQUExQixDQUhBLENBQUE7aUJBSUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLE1BQXJCLEVBTFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBT0EsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQUcsT0FBQSxDQUFRLEdBQVIsRUFBSDtVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUVBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFDekIsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUZ5QjtVQUFBLENBQTNCLEVBSG9DO1FBQUEsQ0FBdEMsQ0FQQSxDQUFBO0FBQUEsUUFjQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO21CQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFJQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFGK0I7VUFBQSxDQUFqQyxFQUwrQjtRQUFBLENBQWpDLENBZEEsQ0FBQTtBQUFBLFFBdUJBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7aUJBQ3JELEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFELENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixFQUhvQztVQUFBLENBQXRDLEVBRHFEO1FBQUEsQ0FBdkQsQ0F2QkEsQ0FBQTtBQUFBLFFBNkJBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTttQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBS0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRjZDO1VBQUEsQ0FBL0MsRUFOb0M7UUFBQSxDQUF0QyxDQTdCQSxDQUFBO0FBQUEsUUF1Q0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtpQkFDL0IsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsc0JBQWYsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxZQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFlBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsWUFLQSxPQUFBLENBQVEsR0FBUixDQUxBLENBQUE7QUFBQSxZQU1BLE9BQUEsQ0FBUSxHQUFSLENBTkEsQ0FBQTtBQUFBLFlBT0EsT0FBQSxDQUFRLEdBQVIsQ0FQQSxDQUFBO21CQVNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQkFBOUIsRUFWOEM7VUFBQSxDQUFoRCxFQUQrQjtRQUFBLENBQWpDLENBdkNBLENBQUE7ZUFvREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxDQUFBO21CQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFJQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFlBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFGbUM7VUFBQSxDQUFyQyxFQUwyQjtRQUFBLENBQTdCLEVBckRrQztNQUFBLENBQXBDLENBQUEsQ0FBQTtBQUFBLE1BOERBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLEtBQTNCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO21CQUVBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsY0FBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLGNBQWdCLElBQUEsRUFBTSxVQUF0QjthQUExQixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUtBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBSmlEO1VBQUEsQ0FBbkQsQ0FMQSxDQUFBO2lCQVdBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUxtQztVQUFBLENBQXJDLEVBWjJCO1FBQUEsQ0FBN0IsQ0FBQSxDQUFBO2VBbUJBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsV0FBM0IsQ0FBQSxDQUFBO21CQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsY0FBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLGNBQWdCLElBQUEsRUFBTSxVQUF0QjthQUExQixFQUZTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUlBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBTGdFO1VBQUEsQ0FBbEUsQ0FKQSxDQUFBO2lCQVdBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsWUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBTGdFO1VBQUEsQ0FBbEUsRUFaNEI7UUFBQSxDQUE5QixFQXBCaUM7TUFBQSxDQUFuQyxDQTlEQSxDQUFBO0FBQUEsTUFxR0EsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixVQUEzQixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBRUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFBQSxZQUFBLElBQUEsRUFBTSxjQUFOO0FBQUEsWUFBc0IsSUFBQSxFQUFNLFVBQTVCO1dBQTFCLENBRkEsQ0FBQTtpQkFHQSxPQUFBLENBQVEsR0FBUixFQUpTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFNQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFVBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHNCQUE5QixDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRmlEO1FBQUEsQ0FBbkQsRUFQMEM7TUFBQSxDQUE1QyxDQXJHQSxDQUFBO2FBZ0hBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsNEJBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxVQUVBLFFBQVEsQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQUEsWUFBQSxJQUFBLEVBQU0sS0FBTjtXQUExQixDQUZBLENBQUE7QUFBQSxVQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtpQkFJQSxPQUFBLENBQVEsR0FBUixFQUxTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQU9BLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7aUJBQ2hDLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQ0FBOUIsRUFEZ0M7UUFBQSxDQUFsQyxDQVBBLENBQUE7ZUFVQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULE9BQUEsQ0FBUSxHQUFSLEVBRFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFHQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO21CQUN2QixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCLEVBRHVCO1VBQUEsQ0FBekIsRUFKc0I7UUFBQSxDQUF4QixFQVh3QjtNQUFBLENBQTFCLEVBakgyQjtJQUFBLENBQTdCLENBL3JDQSxDQUFBO0FBQUEsSUFrMENBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7YUFDM0IsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixPQUEzQixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBRUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFBQSxZQUFBLElBQUEsRUFBTSxLQUFOO1dBQTFCLENBRkEsQ0FBQTtBQUFBLFVBR0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFBQSxZQUFBLElBQUEsRUFBTSxHQUFOO1dBQTFCLENBSEEsQ0FBQTtpQkFJQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLEVBTFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQU9BLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsVUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUZ1RDtRQUFBLENBQXpELEVBUmtDO01BQUEsQ0FBcEMsRUFEMkI7SUFBQSxDQUE3QixDQWwwQ0EsQ0FBQTtBQUFBLElBKzBDQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLE1BQU4sRUFBYyxrQkFBZCxDQUFpQyxDQUFDLFNBQWxDLENBQTRDLElBQTVDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxxQkFBZCxDQUFvQyxDQUFDLFdBQXJDLENBQWlELFNBQUMsSUFBRCxHQUFBO2lCQUMvQyxNQUFNLENBQUMsTUFBUCxDQUFBLEVBRCtDO1FBQUEsQ0FBakQsQ0FEQSxDQUFBO0FBQUEsUUFJQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsZ0JBQTNCLENBSkEsQ0FBQTtlQUtBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBTlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BUUEsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0JBQTlCLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxFQUpnRTtNQUFBLENBQWxFLENBUkEsQ0FBQTtBQUFBLE1BY0EsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLDZCQUEzQixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLFFBQVIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0NBQTlCLENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsUUFPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7QUFBQSxRQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQ0FBOUIsQ0FSQSxDQUFBO0FBQUEsUUFTQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQVRBLENBQUE7QUFBQSxRQVVBLE9BQUEsQ0FBUSxHQUFSLENBVkEsQ0FBQTtlQVdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixvREFBOUIsRUFaa0I7TUFBQSxDQUFwQixDQWRBLENBQUE7YUE0QkEsRUFBQSxDQUFHLGFBQUgsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLFFBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUJBQTlCLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO2VBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixFQU5nQjtNQUFBLENBQWxCLEVBN0IyQjtJQUFBLENBQTdCLENBLzBDQSxDQUFBO0FBQUEsSUFvM0NBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLGtCQUFkLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsSUFBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sTUFBTixFQUFjLHFCQUFkLENBQW9DLENBQUMsV0FBckMsQ0FBaUQsU0FBQyxJQUFELEdBQUE7aUJBQy9DLE1BQU0sQ0FBQyxNQUFQLENBQUEsRUFEK0M7UUFBQSxDQUFqRCxDQURBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixjQUEzQixDQUpBLENBQUE7ZUFLQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQU5TO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQVFBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixrQkFBOUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBSmdFO01BQUEsQ0FBbEUsQ0FSQSxDQUFBO0FBQUEsTUFpQkEsR0FBQSxDQUFJLGVBQUosRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLDZCQUEzQixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxRQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9DQUE5QixDQUxBLENBQUE7QUFBQSxRQU1BLE9BQUEsQ0FBUSxHQUFSLENBTkEsQ0FBQTtBQUFBLFFBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJDQUE5QixDQVBBLENBQUE7QUFBQSxRQVFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBUkEsQ0FBQTtBQUFBLFFBU0EsT0FBQSxDQUFRLEdBQVIsQ0FUQSxDQUFBO2VBVUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9EQUE5QixFQVhtQjtNQUFBLENBQXJCLENBakJBLENBQUE7YUE4QkEsRUFBQSxDQUFHLGFBQUgsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxRQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixFQU5nQjtNQUFBLENBQWxCLEVBL0IyQjtJQUFBLENBQTdCLENBcDNDQSxDQUFBO0FBQUEsSUEyNUNBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLE9BQTNCLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtpQkFDQSxPQUFBLENBQVEsR0FBUixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFJQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFVBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELENBQUEsQ0FBQTtpQkFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsRUFGb0Q7UUFBQSxDQUF0RCxFQUx1QztNQUFBLENBQXpDLENBSEEsQ0FBQTthQVlBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7aUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtpQkFDckIsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRHFCO1FBQUEsQ0FBdkIsRUFMaUM7TUFBQSxDQUFuQyxFQWIyQjtJQUFBLENBQTdCLENBMzVDQSxDQUFBO0FBQUEsSUFnN0NBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLFVBQTNCLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUdBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsUUFBQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFMbUQ7UUFBQSxDQUFyRCxDQUFBLENBQUE7ZUFPQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxPQUFBLENBQVEsUUFBUixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBSkEsQ0FBQTtBQUFBLFVBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsVUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZ0JBQTlCLENBUEEsQ0FBQTtBQUFBLFVBUUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELEtBQTdELENBUkEsQ0FBQTtpQkFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFWb0Q7UUFBQSxDQUF0RCxFQVJxQztNQUFBLENBQXZDLEVBSjJCO0lBQUEsQ0FBN0IsQ0FoN0NBLENBQUE7QUFBQSxJQXc4Q0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsWUFBM0IsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FEQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUx5RDtRQUFBLENBQTNELENBQUEsQ0FBQTtBQUFBLFFBT0EsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUEsR0FBQTtBQUNyRCxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQVA7V0FBYixDQURBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBTHFEO1FBQUEsQ0FBdkQsQ0FQQSxDQUFBO2VBY0EsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQVA7V0FBYixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBRkEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLFFBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUxBLENBQUE7QUFBQSxVQU1BLE9BQUEsQ0FBUSxHQUFSLENBTkEsQ0FBQTtBQUFBLFVBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QixDQVJBLENBQUE7QUFBQSxVQVNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxLQUE3RCxDQVRBLENBQUE7aUJBVUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBWGdFO1FBQUEsQ0FBbEUsRUFmK0I7TUFBQSxDQUFqQyxFQUoyQjtJQUFBLENBQTdCLENBeDhDQSxDQUFBO0FBQUEsSUF3K0NBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsZ0JBQTNCLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BSUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQUcsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQVA7V0FBYixFQUFIO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFFQSxFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQSxHQUFBO2lCQUNqRSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsV0FBOUIsRUFEaUU7UUFBQSxDQUFuRSxFQUg0QjtNQUFBLENBQTlCLENBSkEsQ0FBQTthQVVBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDRCQUFmLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7aUJBR0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQVA7V0FBYixFQUpTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFNQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUFHLE9BQUEsQ0FBUSxHQUFSLEVBQUg7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFFQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO21CQUNwQixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNEJBQTlCLEVBRG9CO1VBQUEsQ0FBdEIsRUFId0I7UUFBQSxDQUExQixFQVB5QjtNQUFBLENBQTNCLEVBWDJCO0lBQUEsQ0FBN0IsQ0F4K0NBLENBQUE7QUFBQSxJQWdnREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLHFCQUFmLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTttQkFDQSxPQUFBLENBQVEsR0FBUixFQUZTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1QkFBOUIsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUY2QjtVQUFBLENBQS9CLEVBTCtCO1FBQUEsQ0FBakMsRUFKMkI7TUFBQSxDQUE3QixDQUhBLENBQUE7QUFBQSxNQWdCQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7bUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFGUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUlBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUJBQTlCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFGNkI7VUFBQSxDQUEvQixFQUwrQjtRQUFBLENBQWpDLENBSEEsQ0FBQTtlQVlBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTttQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUtBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMkJBQTlCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFGbUM7VUFBQSxDQUFyQyxDQUxBLENBQUE7aUJBU0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFlBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtxQkFBRyxPQUFBLENBQVEsR0FBUixFQUFIO1lBQUEsQ0FBWCxDQUFBLENBQUE7bUJBRUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtxQkFDN0IsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFCQUE5QixFQUQ2QjtZQUFBLENBQS9CLEVBSHdCO1VBQUEsQ0FBMUIsRUFWeUM7UUFBQSxDQUEzQyxFQWI0QjtNQUFBLENBQTlCLENBaEJBLENBQUE7QUFBQSxNQTZDQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBUDtXQUFiLENBREEsQ0FBQTtpQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUtBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULE9BQUEsQ0FBUSxHQUFSLEVBRFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFVBR0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxZQUFBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix5QkFBOUIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFGLENBQWpELEVBSGtEO1VBQUEsQ0FBcEQsQ0FIQSxDQUFBO2lCQVFBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QixFQUZtQztVQUFBLENBQXJDLEVBVHVDO1FBQUEsQ0FBekMsQ0FMQSxDQUFBO2VBa0JBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7bUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFGUztVQUFBLENBQVgsQ0FBQSxDQUFBO2lCQUlBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsWUFBQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNkJBQTlCLENBREEsQ0FBQTttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUUsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBRixDQUFqRCxFQUhtRDtVQUFBLENBQXJELEVBTHlDO1FBQUEsQ0FBM0MsRUFuQmtDO01BQUEsQ0FBcEMsQ0E3Q0EsQ0FBQTthQTBFQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtpQkFHQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxFQUpTO1FBQUEsQ0FBWCxDQUFBLENBQUE7ZUFNQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMkJBQTlCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxELEVBSDRDO1FBQUEsQ0FBOUMsRUFQbUM7TUFBQSxDQUFyQyxFQTNFMkI7SUFBQSxDQUE3QixDQWhnREEsQ0FBQTtBQUFBLElBdWxEQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSw2QkFBZixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7aUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBSUEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtBQUM5QixVQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQkFBOUIsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUY4QjtRQUFBLENBQWhDLEVBTCtCO01BQUEsQ0FBakMsQ0FKQSxDQUFBO0FBQUEsTUFhQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7aUJBRUEsT0FBQSxDQUFRLEdBQVIsRUFIUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFLQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFVBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHlCQUE5QixDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBRm9DO1FBQUEsQ0FBdEMsQ0FMQSxDQUFBO2VBU0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTttQkFBRyxPQUFBLENBQVEsR0FBUixFQUFIO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBRUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTttQkFDdkIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QixFQUR1QjtVQUFBLENBQXpCLEVBSHdCO1FBQUEsQ0FBMUIsRUFWeUM7TUFBQSxDQUEzQyxDQWJBLENBQUE7YUE2QkEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FBQSxDQUFBO2lCQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsT0FBQSxDQUFRLEdBQVIsRUFEUztVQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsVUFHQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHlCQUE5QixDQURBLENBQUE7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFFLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQUYsQ0FBakQsRUFIb0Q7VUFBQSxDQUF0RCxDQUhBLENBQUE7aUJBUUEsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIscUJBQTlCLEVBRm1DO1VBQUEsQ0FBckMsRUFUd0M7UUFBQSxDQUExQyxDQUpBLENBQUE7ZUFpQkEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTttQkFDQSxPQUFBLENBQVEsR0FBUixFQUZTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBSUEsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxZQUFBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixxQkFBOUIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBRSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFGLENBQWpELEVBSG9EO1VBQUEsQ0FBdEQsRUFMMEM7UUFBQSxDQUE1QyxFQWxCa0M7TUFBQSxDQUFwQyxFQTlCMkI7SUFBQSxDQUE3QixDQXZsREEsQ0FBQTtBQUFBLElBaXBEQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHFCQUE5QixFQURjO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsUUFHQSxVQUFBLEdBQWEsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUhiLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxPQUFQLENBQWUsbUJBQWYsQ0FKQSxDQUFBO2VBS0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFOUztNQUFBLENBQVgsQ0FGQSxDQUFBO2FBVUEsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLFdBQWxDLENBQVosQ0FBQTtpQkFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixTQUFsQixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7aUJBQ1IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsRUFEUTtRQUFBLENBQVYsQ0FKQSxDQUFBO0FBQUEsUUFPQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO21CQUNBLE9BQUEsQ0FBUSxHQUFSLEVBRlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFJQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO21CQUM3QixNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQS9CLENBQVAsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxDQUEvQyxFQUQ2QjtVQUFBLENBQS9CLEVBTCtCO1FBQUEsQ0FBakMsQ0FQQSxDQUFBO0FBQUEsUUFlQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7bUJBRUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7YUFBYixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBS0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBL0IsQ0FBUCxDQUF5QyxDQUFDLElBQTFDLENBQStDLENBQS9DLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQS9CLENBQVAsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxDQUEvQyxFQUYyQjtVQUFBLENBQTdCLEVBTitCO1FBQUEsQ0FBakMsQ0FmQSxDQUFBO2VBeUJBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTttQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUtBLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUIsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxFQUZ1QztVQUFBLENBQXpDLENBTEEsQ0FBQTtpQkFTQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO3FCQUFHLE9BQUEsQ0FBUSxHQUFSLEVBQUg7WUFBQSxDQUFYLENBQUEsQ0FBQTttQkFFQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO3FCQUN2QixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUJBQTlCLEVBRHVCO1lBQUEsQ0FBekIsRUFId0I7VUFBQSxDQUExQixFQVZ5QztRQUFBLENBQTNDLEVBMUJ5RDtNQUFBLENBQTNELEVBWDJCO0lBQUEsQ0FBN0IsQ0FqcERBLENBQUE7QUFBQSxJQXNzREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsZ0JBQWYsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO2VBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLEVBQTlCLEVBTitCO01BQUEsQ0FBakMsQ0FKQSxDQUFBO2FBWUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxRQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QixFQU4wQjtNQUFBLENBQTVCLEVBYjJCO0lBQUEsQ0FBN0IsQ0F0c0RBLENBQUE7QUFBQSxJQTJ0REEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsWUFBZixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtlQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLEVBSFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BS0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0Esc0JBQUEsQ0FBdUIsR0FBdkIsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSGdDO01BQUEsQ0FBbEMsQ0FMQSxDQUFBO0FBQUEsTUFVQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyx1QkFBakMsQ0FBUCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLElBQXZFLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLFFBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsWUFBOUIsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELEVBTGdDO01BQUEsQ0FBbEMsQ0FWQSxDQUFBO0FBQUEsTUFpQkEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFsRCxFQUFpRSxjQUFqRSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxELEVBSmtEO01BQUEsQ0FBcEQsQ0FqQkEsQ0FBQTtBQUFBLE1BdUJBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsc0JBQUEsQ0FBdUIsR0FBdkIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSm1DO01BQUEsQ0FBckMsQ0F2QkEsQ0FBQTtBQUFBLE1BNkJBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsc0JBQUEsQ0FBdUIsR0FBdkIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSmtDO01BQUEsQ0FBcEMsQ0E3QkEsQ0FBQTtBQUFBLE1BbUNBLEVBQUEsQ0FBRywyRUFBSCxFQUFnRixTQUFBLEdBQUE7QUFDOUUsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsc0JBQUEsQ0FBdUIsR0FBdkIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSjhFO01BQUEsQ0FBaEYsQ0FuQ0EsQ0FBQTtBQUFBLE1BeUNBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7aUJBQ0EsT0FBQSxDQUFRLEdBQVIsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxzQkFBQSxDQUF1QixHQUF2QixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFlBQTlCLEVBSDJEO1FBQUEsQ0FBN0QsQ0FKQSxDQUFBO2VBU0EsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0Esc0JBQUEsQ0FBdUIsR0FBdkIsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBbEQsRUFId0Q7UUFBQSxDQUExRCxFQVY4QjtNQUFBLENBQWhDLENBekNBLENBQUE7YUF3REEsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxZQUFBLDZDQUFBO0FBQUEsUUFBQSx3QkFBQSxHQUEyQixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDekIsY0FBQSxtQkFBQTtBQUFBLGlDQURpQyxPQUFlLElBQWQsYUFBQSxNQUFNLGVBQUEsTUFDeEMsQ0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLEtBQU4sQ0FBWixDQUFBO0FBQUEsVUFDQSxLQUFLLENBQUMsSUFBTixHQUFhLElBRGIsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFBQSxZQUFBLEdBQUEsRUFBSyxTQUFBLEdBQUE7cUJBQUcsT0FBSDtZQUFBLENBQUw7V0FBdkMsQ0FGQSxDQUFBO2lCQUdBLE1BSnlCO1FBQUEsQ0FBM0IsQ0FBQTtBQUFBLFFBTUEsbUJBQUEsR0FBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsY0FBQSxtQkFBQTtBQUFBLFVBRHNCLFlBQUEsTUFBTSxjQUFBLE1BQzVCLENBQUE7QUFBQSxVQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxXQUFOLENBQVosQ0FBQTtBQUFBLFVBQ0EsS0FBSyxDQUFDLElBQU4sR0FBYSxJQURiLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQUEsWUFBQSxHQUFBLEVBQUssU0FBQSxHQUFBO3FCQUFHLE9BQUg7WUFBQSxDQUFMO1dBQXZDLENBRkEsQ0FBQTtpQkFHQSxNQUpvQjtRQUFBLENBTnRCLENBQUE7ZUFZQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLGNBQUEsb0NBQUE7QUFBQSxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EsZ0JBQUEsR0FBbUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBRDlDLENBQUE7QUFBQSxVQUVBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUZBLENBQUE7QUFBQSxVQUdBLE9BQUEsR0FBVSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsT0FIckMsQ0FBQTtBQUFBLFVBSUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxhQUFSLENBQXNCLGVBQXRCLENBSlosQ0FBQTtBQUFBLFVBS0EsT0FBTyxDQUFDLGFBQVIsQ0FBc0Isd0JBQUEsQ0FBeUIsa0JBQXpCLEVBQTZDO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBUjtXQUE3QyxDQUF0QixDQUxBLENBQUE7QUFBQSxVQU1BLE9BQU8sQ0FBQyxhQUFSLENBQXNCLHdCQUFBLENBQXlCLG1CQUF6QixFQUE4QztBQUFBLFlBQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxZQUFXLE1BQUEsRUFBUSxTQUFuQjtXQUE5QyxDQUF0QixDQU5BLENBQUE7QUFBQSxVQU9BLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxRQUFqQixDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBQSxDQUFQLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsR0FBdEQsQ0FQQSxDQUFBO0FBQUEsVUFRQSxPQUFPLENBQUMsYUFBUixDQUFzQix3QkFBQSxDQUF5QixtQkFBekIsRUFBOEM7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFBWSxNQUFBLEVBQVEsU0FBcEI7V0FBOUMsQ0FBdEIsQ0FSQSxDQUFBO0FBQUEsVUFTQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsUUFBakIsQ0FBQSxDQUEyQixDQUFDLE9BQTVCLENBQUEsQ0FBUCxDQUE2QyxDQUFDLE9BQTlDLENBQXNELElBQXRELENBVEEsQ0FBQTtBQUFBLFVBVUEsT0FBTyxDQUFDLGFBQVIsQ0FBc0Isd0JBQUEsQ0FBeUIsZ0JBQXpCLEVBQTJDO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBUjtXQUEzQyxDQUF0QixDQVZBLENBQUE7QUFBQSxVQVdBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLG1CQUFBLENBQW9CO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFlBQVksTUFBQSxFQUFRLFNBQXBCO1dBQXBCLENBQXRCLENBWEEsQ0FBQTtpQkFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsRUFiK0I7UUFBQSxDQUFqQyxFQWJtQztNQUFBLENBQXJDLEVBekQyQjtJQUFBLENBQTdCLENBM3REQSxDQUFBO0FBQUEsSUFnekRBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLGNBQWYsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0Esc0JBQUEsQ0FBdUIsR0FBdkIsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLENBQVAsQ0FBNkIsQ0FBQyxPQUE5QixDQUFzQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXRDLEVBSHFCO01BQUEsQ0FBdkIsRUFMMkI7SUFBQSxDQUE3QixDQWh6REEsQ0FBQTtBQUFBLElBMHpEQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO2VBRUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsRUFIUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFLQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxELENBRkEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FMQSxDQUFBO0FBQUEsUUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQWxELENBTkEsQ0FBQTtBQUFBLFFBUUEsT0FBQSxDQUFRLEdBQVIsQ0FSQSxDQUFBO0FBQUEsUUFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FUQSxDQUFBO2VBVUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRCxFQVhxQztNQUFBLENBQXZDLENBTEEsQ0FBQTtBQUFBLE1Ba0JBLEVBQUEsQ0FBRyxlQUFILEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRCxFQUxrQjtNQUFBLENBQXBCLENBbEJBLENBQUE7QUFBQSxNQXlCQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO2VBQ3pCLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLEVBSjBDO1FBQUEsQ0FBNUMsRUFEeUI7TUFBQSxDQUEzQixDQXpCQSxDQUFBO2FBZ0NBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLEVBTjZCO1FBQUEsQ0FBL0IsQ0FBQSxDQUFBO2VBUUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxVQUdBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFQO1dBQWIsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixFQUx1QjtRQUFBLENBQXpCLEVBVDRCO01BQUEsQ0FBOUIsRUFqQzJCO0lBQUEsQ0FBN0IsQ0ExekRBLENBQUE7QUFBQSxJQTIyREEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQUhBLENBQUE7QUFBQSxRQUtBLE9BQUEsQ0FBUSxHQUFSLENBTEEsQ0FBQTtBQUFBLFFBTUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQU5BLENBQUE7QUFBQSxRQU9BLE9BQUEsQ0FBUSxHQUFSLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFVBQTlCLENBUkEsQ0FBQTtBQUFBLFFBVUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FWQSxDQUFBO0FBQUEsUUFXQSxPQUFBLENBQVEsR0FBUixDQVhBLENBQUE7QUFBQSxRQVlBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FaQSxDQUFBO0FBQUEsUUFhQSxPQUFBLENBQVEsR0FBUixDQWJBLENBQUE7QUFBQSxRQWNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQWRBLENBQUE7ZUFlQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFoQjJDO01BQUEsQ0FBN0MsQ0FKQSxDQUFBO0FBQUEsTUFzQkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiLENBRkEsQ0FBQTtBQUFBLFFBR0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUhBLENBQUE7ZUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsRUFMdUI7TUFBQSxDQUF6QixDQXRCQSxDQUFBO2FBNkJBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBLEdBQUE7QUFDckQsUUFBQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsVUFBOUIsRUFIcUQ7TUFBQSxDQUF2RCxFQTlCMkI7SUFBQSxDQUE3QixDQTMyREEsQ0FBQTtBQUFBLElBODREQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixDQUhBLENBQUE7ZUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFMMkM7TUFBQSxDQUE3QyxDQUpBLENBQUE7QUFBQSxNQVdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiLENBSEEsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixFQUx1QjtNQUFBLENBQXpCLENBWEEsQ0FBQTthQWtCQSxFQUFBLENBQUcsa0RBQUgsRUFBdUQsU0FBQSxHQUFBO0FBQ3JELFFBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixVQUE5QixFQUhxRDtNQUFBLENBQXZELEVBbkIyQjtJQUFBLENBQTdCLENBOTREQSxDQUFBO0FBQUEsSUFzNkRBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLFdBQWYsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7ZUFFQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxFQUhTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFJQSxPQUFBLENBQVEsUUFBUixDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixpQkFBOUIsQ0FMQSxDQUFBO0FBQUEsUUFPQSxPQUFBLENBQVEsR0FBUixDQVBBLENBQUE7QUFBQSxRQVFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBUkEsQ0FBQTtBQUFBLFFBU0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FUQSxDQUFBO0FBQUEsUUFVQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQVZBLENBQUE7QUFBQSxRQVdBLE9BQUEsQ0FBUSxRQUFSLENBWEEsQ0FBQTtBQUFBLFFBWUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVCQUE5QixDQVpBLENBQUE7QUFBQSxRQWNBLE9BQUEsQ0FBUSxHQUFSLENBZEEsQ0FBQTtBQUFBLFFBZUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQWZBLENBQUE7QUFBQSxRQWlCQSxPQUFBLENBQVEsR0FBUixDQWpCQSxDQUFBO2VBa0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixXQUE5QixFQW5CNkM7TUFBQSxDQUEvQyxDQUxBLENBQUE7QUFBQSxNQTBCQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQURBLENBQUE7QUFBQSxRQUVBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLFFBQVIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCLENBTEEsQ0FBQTtBQUFBLFFBT0EsT0FBQSxDQUFRLEdBQVIsQ0FQQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUJBQTlCLENBUkEsQ0FBQTtBQUFBLFFBVUEsT0FBQSxDQUFRLEdBQVIsQ0FWQSxDQUFBO2VBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QixFQVo0QjtNQUFBLENBQTlCLENBMUJBLENBQUE7YUF3Q0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUFBLENBQUE7aUJBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUxBLENBQUE7QUFBQSxVQU1BLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FOQSxDQUFBO0FBQUEsVUFPQSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQVBBLENBQUE7QUFBQSxVQVFBLE9BQUEsQ0FBUSxRQUFSLENBUkEsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSyxDQUFMLENBQWpELENBVEEsQ0FBQTtBQUFBLFVBV0EsT0FBQSxDQUFRLEdBQVIsQ0FYQSxDQUFBO0FBQUEsVUFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsQ0FaQSxDQUFBO2lCQWFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUssQ0FBTCxDQUFqRCxFQWRxQztRQUFBLENBQXZDLENBSkEsQ0FBQTtlQW9CQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBNUIsRUFBOEMsUUFBOUMsQ0FMQSxDQUFBO0FBQUEsVUFNQSxPQUFBLENBQVEsUUFBUixDQU5BLENBQUE7QUFBQSxVQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUssQ0FBTCxDQUFqRCxDQVBBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQVJBLENBQUE7QUFBQSxVQVVBLE9BQUEsQ0FBUSxHQUFSLENBVkEsQ0FBQTtBQUFBLFVBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCLENBWEEsQ0FBQTtpQkFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFLLEVBQUwsQ0FBakQsRUFiNEI7UUFBQSxDQUE5QixFQXJCK0I7TUFBQSxDQUFqQyxFQXpDMkI7SUFBQSxDQUE3QixDQXQ2REEsQ0FBQTtBQUFBLElBbS9EQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BSUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsUUFBUixDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixFQUE5QixFQU40QjtNQUFBLENBQTlCLENBSkEsQ0FBQTthQVlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLFFBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsS0FBOUIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FKQSxDQUFBO0FBQUEsUUFLQSxPQUFBLENBQVEsR0FBUixDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQU5BLENBQUE7ZUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFSc0I7TUFBQSxDQUF4QixFQWIyQjtJQUFBLENBQTdCLENBbi9EQSxDQUFBO0FBQUEsSUEwZ0VBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQUQsQ0FBbkUsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLG1DQUFmLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FMQSxDQUFBO2VBTUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsRUFQUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFTQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFFBQUEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtBQUM5QixVQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxELENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBLEVBSjhCO1FBQUEsQ0FBaEMsQ0FBQSxDQUFBO0FBQUEsUUFNQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBYixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRCxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUIsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQSxFQUxtQjtRQUFBLENBQXJCLENBTkEsQ0FBQTtBQUFBLFFBYUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBYixDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa0NBQTlCLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUEsRUFMcUI7UUFBQSxDQUF2QixDQWJBLENBQUE7QUFBQSxRQW9CQSxFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxELENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QixDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBLEVBTmlFO1FBQUEsQ0FBbkUsQ0FwQkEsQ0FBQTtBQUFBLFFBNEJBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELENBQWxELENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUEsRUFMaUQ7UUFBQSxDQUFuRCxDQTVCQSxDQUFBO0FBQUEsUUFtQ0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsRCxDQUpBLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QixDQUxBLENBQUE7aUJBTUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUEsRUFQa0M7UUFBQSxDQUFwQyxDQW5DQSxDQUFBO2VBNENBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9DQUFmLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUxBLENBQUE7QUFBQSxVQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsaUJBQXhDLENBTkEsQ0FBQTtBQUFBLFVBT0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBYixDQVBBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQsQ0FSQSxDQUFBO0FBQUEsVUFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0NBQTlCLENBVEEsQ0FBQTtpQkFVQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUEsRUFYNkM7UUFBQSxDQUEvQyxFQTdDNkI7TUFBQSxDQUEvQixDQVRBLENBQUE7YUFtRUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsVUFBQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRCxDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUIsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQSxFQUo4QjtRQUFBLENBQWhDLENBQUEsQ0FBQTtBQUFBLFFBTUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FBbEQsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUNBQTlCLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUEsRUFMbUI7UUFBQSxDQUFyQixDQU5BLENBQUE7QUFBQSxRQWFBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxELENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9DQUE5QixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBLEVBTHFCO1FBQUEsQ0FBdkIsQ0FiQSxDQUFBO0FBQUEsUUFvQkEsRUFBQSxDQUFHLDhEQUFILEVBQW1FLFNBQUEsR0FBQTtBQUNqRSxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsRUFBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUFsRCxDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixzQ0FBOUIsQ0FKQSxDQUFBO2lCQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLEdBQUcsQ0FBQyxnQkFBdEIsQ0FBQSxFQU5pRTtRQUFBLENBQW5FLENBcEJBLENBQUE7QUFBQSxRQTRCQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx3QkFBUCxDQUFBLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxDQUFsRCxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUIsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLGdCQUFsQixDQUFBLEVBTGlEO1FBQUEsQ0FBbkQsQ0E1QkEsQ0FBQTtBQUFBLFFBbUNBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBRkEsQ0FBQTtBQUFBLFVBR0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47V0FBYixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsd0JBQVAsQ0FBQSxDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsQ0FBbEQsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsSUFBOUIsQ0FMQSxDQUFBO2lCQU1BLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBWixDQUFpQixDQUFDLGdCQUFsQixDQUFBLEVBUGtDO1FBQUEsQ0FBcEMsQ0FuQ0EsQ0FBQTtlQTRDQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQ0FBZixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQyxDQUhBLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakMsQ0FMQSxDQUFBO0FBQUEsVUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLGlCQUF4QyxDQU5BLENBQUE7QUFBQSxVQU9BLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWIsQ0FQQSxDQUFBO0FBQUEsVUFRQSxNQUFBLENBQU8sTUFBTSxDQUFDLHdCQUFQLENBQUEsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixFQUFpQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpDLENBQWxELENBUkEsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9DQUE5QixDQVRBLENBQUE7aUJBVUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUF0QixDQUFBLEVBWDZDO1FBQUEsQ0FBL0MsRUE3QzZCO01BQUEsQ0FBL0IsRUFwRXdDO0lBQUEsQ0FBMUMsQ0ExZ0VBLENBQUE7V0F3b0VBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLGNBQWYsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFFBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGNBQWpDLENBQVAsQ0FBd0QsQ0FBQyxJQUF6RCxDQUE4RCxJQUE5RCxDQUZBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCLENBSkEsQ0FBQTtBQUFBLFFBS0EsT0FBQSxDQUFRLFFBQVIsQ0FMQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsQ0FQQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsQ0FSQSxDQUFBO0FBQUEsUUFTQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsS0FBN0QsQ0FUQSxDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxjQUFqQyxDQUFQLENBQXdELENBQUMsSUFBekQsQ0FBOEQsS0FBOUQsQ0FWQSxDQUFBO2VBV0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsYUFBakMsQ0FBUCxDQUF1RCxDQUFDLElBQXhELENBQTZELElBQTdELEVBWmdEO01BQUEsQ0FBbEQsQ0FKQSxDQUFBO0FBQUEsTUFrQkEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxhQUFqQyxDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUF4QixDQUFpQyxjQUFqQyxDQUFQLENBQXdELENBQUMsSUFBekQsQ0FBOEQsSUFBOUQsQ0FGQSxDQUFBO0FBQUEsUUFJQSxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUpBLENBQUE7QUFBQSxRQUtBLE9BQUEsQ0FBUSxRQUFSLENBTEEsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUIsRUFSMkM7TUFBQSxDQUE3QyxDQWxCQSxDQUFBO0FBQUEsTUE0QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQURBLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCLENBTEEsQ0FBQTtBQUFBLFFBT0EsT0FBQSxDQUFRLFdBQVIsRUFBcUI7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFMO1NBQXJCLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQVJBLENBQUE7QUFBQSxRQVVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBVkEsQ0FBQTtBQUFBLFFBWUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQVpBLENBQUE7QUFBQSxRQWNBLE9BQUEsQ0FBUSxXQUFSLEVBQXFCO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBTDtTQUFyQixDQWRBLENBQUE7QUFBQSxRQWVBLE9BQUEsQ0FBUSxXQUFSLEVBQXFCO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBTDtTQUFyQixDQWZBLENBQUE7QUFBQSxRQWlCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUJBQTlCLENBakJBLENBQUE7QUFBQSxRQWtCQSxNQUFBLENBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsRUFBdEMsQ0FsQkEsQ0FBQTtBQUFBLFFBb0JBLE9BQUEsQ0FBUSxXQUFSLEVBQXFCO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBTDtTQUFyQixDQXBCQSxDQUFBO0FBQUEsUUFxQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixDQXJCQSxDQUFBO2VBc0JBLE1BQUEsQ0FBTyxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxFQUF0QyxFQXZCNkI7TUFBQSxDQUEvQixDQTVCQSxDQUFBO0FBQUEsTUFxREEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNwQixRQUFBLE9BQUEsQ0FBUSxHQUFSLEVBQWE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxRQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FIQSxDQUFBO0FBQUEsUUFJQSxPQUFBLENBQVEsR0FBUixDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQU5BLENBQUE7QUFBQSxRQVFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBUkEsQ0FBQTtBQUFBLFFBU0EsT0FBQSxDQUFRLEdBQVIsQ0FUQSxDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsZUFBOUIsQ0FWQSxDQUFBO2VBV0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBWm9CO01BQUEsQ0FBdEIsQ0FyREEsQ0FBQTtBQUFBLE1BbUVBLEVBQUEsQ0FBRyxrRUFBSCxFQUF1RSxTQUFBLEdBQUEsQ0FBdkUsQ0FuRUEsQ0FBQTtBQUFBLE1Bc0VBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsUUFBQSxPQUFBLENBQVEsR0FBUixFQUFhO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFiLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsV0FBUixFQUFxQjtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUw7U0FBckIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxRQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FMQSxDQUFBO0FBQUEsUUFNQSxPQUFBLENBQVEsR0FBUixDQU5BLENBQUE7QUFBQSxRQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QixDQVBBLENBQUE7QUFBQSxRQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqRCxDQVJBLENBQUE7QUFBQSxRQVVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBVkEsQ0FBQTtBQUFBLFFBV0EsT0FBQSxDQUFRLEdBQVIsQ0FYQSxDQUFBO0FBQUEsUUFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsY0FBOUIsQ0FaQSxDQUFBO2VBYUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpELEVBZDBEO01BQUEsQ0FBNUQsQ0F0RUEsQ0FBQTthQXNGQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFFBQUEsT0FBQSxDQUFRLEdBQVIsRUFBYTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7U0FBYixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGFBQWpDLENBQVAsQ0FBdUQsQ0FBQyxJQUF4RCxDQUE2RCxJQUE3RCxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLGNBQWpDLENBQVAsQ0FBd0QsQ0FBQyxJQUF6RCxDQUE4RCxJQUE5RCxDQUZBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQWxCLENBSkEsQ0FBQTtBQUFBLFFBS0EsT0FBQSxDQUFRLFFBQVIsQ0FMQSxDQUFBO2VBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGdCQUE5QixFQVJzRDtNQUFBLENBQXhELEVBdkYyQjtJQUFBLENBQTdCLEVBem9Fb0I7RUFBQSxDQUF0QixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/vim-mode/spec/operators-spec.coffee
