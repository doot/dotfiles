(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Motions", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, submitNormalModeInputText, vimState, _ref;
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
      var theEditor;
      if (opts == null) {
        opts = {};
      }
      theEditor = opts.editor || editor;
      return theEditor.normalModeInputView.editorElement.getModel().setText(key);
    };
    submitNormalModeInputText = function(text) {
      var inputEditor;
      inputEditor = editor.normalModeInputView.editorElement;
      inputEditor.getModel().setText(text);
      return atom.commands.dispatch(inputEditor, "core:confirm");
    };
    describe("simple motions", function() {
      beforeEach(function() {
        editor.setText("12345\nabcd\nABCDE");
        return editor.setCursorScreenPosition([1, 1]);
      });
      describe("the h keybinding", function() {
        describe("as a motion", function() {
          it("moves the cursor left, but not to the previous line", function() {
            keydown('h');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return it("moves the cursor to the previous line if wrapLeftRightMotion is true", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('h');
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          });
        });
        return describe("as a selection", function() {
          return it("selects the character to the left", function() {
            keydown('y');
            keydown('h');
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      describe("the j keybinding", function() {
        it("moves the cursor down, but not to the end of the last line", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
        it("moves the cursor to the end of the line, not past it", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("remembers the position it column it was in after moving to shorter line", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 4]);
        });
        return describe("when visual mode", function() {
          beforeEach(function() {
            keydown('v');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
          it("moves the cursor down", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          it("doesn't go over after the last line", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          return it("selects the text while moving", function() {
            keydown('j');
            return expect(editor.getSelectedText()).toBe("bcd\nAB");
          });
        });
      });
      describe("the k keybinding", function() {
        return it("moves the cursor up, but not to the beginning of the first line", function() {
          keydown('k');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('k');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        });
      });
      return describe("the l keybinding", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 2]);
        });
        it("moves the cursor right, but not to the next line", function() {
          keydown('l');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("moves the cursor to the next line if wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('l');
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return describe("on a blank line", function() {
          return it("doesn't move the cursor", function() {
            editor.setText("\n\n\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown('l');
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the w keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("moves the cursor to the beginning of the next word", function() {
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
        return it("moves the cursor to the end of the word if last word in file", function() {
          editor.setText("abc");
          editor.setCursorScreenPosition([0, 0]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('w');
          });
          return it("selects to the end of the word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab ');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('w');
          });
          return it("selects the whitespace", function() {
            return expect(vimState.getRegister('"').text).toBe(' ');
          });
        });
      });
    });
    describe("the W keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the beginning of the next word", function() {
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('W', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          return it("selects to the end of the whole word", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            keydown('W', {
              shift: true
            });
            return expect(vimState.getRegister('"').text).toBe('cde1+- ');
          });
        });
        it("continues past blank lines", function() {
          editor.setCursorScreenPosition([2, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\nzip");
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
        return it("doesn't go past the end of the file", function() {
          editor.setCursorScreenPosition([3, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\n\n");
          return expect(vimState.getRegister('"').text).toBe('zip');
        });
      });
    });
    describe("the e keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('e');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe(' cde1');
          });
        });
      });
    });
    describe("the E keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab  cde1+- \n xyz \n\nzip\n");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('E', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe('  cde1+-');
          });
        });
        return describe("press more than once", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('v');
            keydown('E', {
              shift: true
            });
            keydown('E', {
              shift: true
            });
            return keydown('y');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab  cde1+-');
          });
        });
      });
    });
    describe("the ) keybinding", function() {
      beforeEach(function() {
        editor.setText("This is a sentence. This is a second sentence.\nThis is a third sentence.\n\nThis sentence is past the paragraph boundary.");
        return editor.setCursorBufferPosition([0, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the next sentence", function() {
          keydown(')');
          expect(editor.getCursorBufferPosition()).toEqual([0, 20]);
          keydown(')');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown(')');
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown(')');
        });
        return it('selects to the start of the next sentence', function() {
          return expect(vimState.getRegister('"').text).toBe("This is a sentence. ");
        });
      });
    });
    describe("the ( keybinding", function() {
      beforeEach(function() {
        editor.setText("This first sentence is in its own paragraph.\n\nThis is a sentence. This is a second sentence.\nThis is a third sentence");
        return editor.setCursorBufferPosition([3, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the previous sentence", function() {
          keydown('(');
          expect(editor.getCursorBufferPosition()).toEqual([2, 20]);
          keydown('(');
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          keydown('(');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('(');
        });
        return it('selects to the end of the previous sentence', function() {
          return expect(vimState.getRegister('"').text).toBe("This is a second sentence.\n");
        });
      });
    });
    describe("the } keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the end of the paragraph", function() {
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('}');
          return expect(editor.getCursorScreenPosition()).toEqual([9, 6]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('}');
        });
        return it('selects to the end of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("abcde\n");
        });
      });
    });
    describe("the { keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([9, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the paragraph", function() {
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('{');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([7, 0]);
          keydown('y');
          return keydown('{');
        });
        return it('selects to the beginning of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("\nzip\n");
        });
      });
    });
    describe("the b keybinding", function() {
      beforeEach(function() {
        return editor.setText(" ab cde1+- \n xyz\n\nzip }\n last");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown('b');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the current word", function() {
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 4]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the last word", function() {
            expect(vimState.getRegister('"').text).toBe('ab ');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
    });
    describe("the B keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n\t xyz-123\n\n zip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('B', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        it("selects to the beginning of the whole word", function() {
          editor.setCursorScreenPosition([1, 9]);
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('xyz-12');
        });
        return it("doesn't go past the beginning of the file", function() {
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: 'abc'
          });
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('abc');
        });
      });
    });
    describe("the ^ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abcde");
      });
      describe("from the beginning of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      describe("from the first character of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("stays put", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it("does nothing", function() {
            expect(editor.getText()).toBe('  abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      return describe("from the middle of a word", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 4]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('  cde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the first column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('0');
        });
        return it('selects to the first column of the line', function() {
          expect(editor.getText()).toBe('cde');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the $ keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde\n\n1234567890");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion from empty line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 0]);
        });
        return it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('$');
        });
        it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        });
        return it("should remain in the last column when moving down", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 9]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('$');
        });
        return it("selects to the beginning of the lines", function() {
          expect(editor.getText()).toBe("  ab\n\n1234567890");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  a\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      return describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the beginning of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the - keybinding", function() {
      beforeEach(function() {
        return editor.setText("abcdefg\n  abc\n  abc\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("deletes the current and previous line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the previous one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves to the first character of the previous line (directly above)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line (directly above)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line preceded by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([4, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('-');
          });
          return it("moves the cursor to the first character of that many lines previous", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('-');
          });
          return it("deletes the current line plus that many previous lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the + keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("deletes the current and next line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the next one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves to the first character of the next line (directly below)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line (directly below)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line followed by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line", function() {
            expect(editor.getText()).toBe("abcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('+');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('+');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the _ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('_');
          });
          return it("moves the cursor to the first character of the current line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('_');
          });
          return it("deletes the current line", function() {
            expect(editor.getText()).toBe("  abc\nabcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('_');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('_');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n5\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the enter keybinding", function() {
      var keydownCodeForEnter, startingText;
      keydownCodeForEnter = '\r';
      startingText = "  abc\n  abc\nabcdefg\n";
      return describe("from the middle of a line", function() {
        var startingCursorPosition;
        startingCursorPosition = [1, 3];
        describe("as a motion", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('+');
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown(keydownCodeForEnter);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
        return describe("as a selection", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition, referenceText;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown('+');
            referenceText = editor.getText();
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown(keydownCodeForEnter);
            expect(editor.getText()).toEqual(referenceText);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
      });
    });
    describe("the gg keybinding", function() {
      beforeEach(function() {
        editor.setText(" 1abc\n 2\n3\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to the beginning of the first line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        describe("in linewise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            vimState.activateVisualMode('linewise');
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe(" 1abc\n 2\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("in characterwise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 1]);
            vimState.activateVisualMode();
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe("1abc\n 2");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
      return describe("as a repeated motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        describe("in linewise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode('linewise');
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a specified line", function() {
            return expect(editor.getSelectedText()).toBe(" 2\n3\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("in characterwise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode();
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a first character of specified line", function() {
            return expect(editor.getSelectedText()).toBe("2\n3");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
        });
      });
    });
    describe("the g_ keybinding", function() {
      beforeEach(function() {
        return editor.setText("1  \n    2  \n 3abc\n ");
      });
      describe("as a motion", function() {
        it("moves the cursor to the last nonblank character", function() {
          editor.setCursorScreenPosition([1, 0]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
        return it("will move the cursor to the beginning of the line if necessary", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("as a repeated motion", function() {
        return it("moves the cursor downward and outward", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        return it("selects the current line excluding whitespace", function() {
          editor.setCursorScreenPosition([1, 2]);
          vimState.activateVisualMode();
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getSelectedText()).toEqual("  2  \n 3abc");
        });
      });
    });
    describe("the G keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n    2\n 3abc\n ");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      describe("as a repeated motion", function() {
        beforeEach(function() {
          keydown('2');
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to a specified line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 0]);
          vimState.activateVisualMode();
          return keydown('G', {
            shift: true
          });
        });
        it("selects to the last line in the file", function() {
          return expect(editor.getSelectedText()).toBe("    2\n 3abc\n ");
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
        });
      });
    });
    describe("the / keybinding", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        pane = {
          activate: jasmine.createSpy("activate")
        };
        spyOn(atom.workspace, 'getActivePane').andReturn(pane);
        editor.setText("abc\ndef\nabc\ndef\n");
        editor.setCursorBufferPosition([0, 0]);
        vimState.globalVimState.searchHistory = [];
        return vimState.globalVimState.currentSearch = {};
      });
      describe("as a motion", function() {
        it("beeps when repeating nonexistent last search", function() {
          keydown('/');
          submitNormalModeInputText('');
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("moves the cursor to the specified search pattern", function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          expect(pane.activate).toHaveBeenCalled();
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("loops back around", function() {
          editor.setCursorBufferPosition([3, 0]);
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses a valid regex as a regex", function() {
          keydown('/');
          submitNormalModeInputText('[abc]');
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([0, 2]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses an invalid regex as a literal string", function() {
          editor.setText("abc\n[abc]\n");
          keydown('/');
          submitNormalModeInputText('[abc');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses ? as a literal string", function() {
          editor.setText("abc\n[a?c?\n");
          keydown('/');
          submitNormalModeInputText('?');
          expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('works with selection in visual mode', function() {
          editor.setText('one two three');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('th');
          expect(editor.getCursorBufferPosition()).toEqual([0, 9]);
          keydown('d');
          expect(editor.getText()).toBe('hree');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('extends selection when repeating search in visual mode', function() {
          var end, start, _ref1, _ref2;
          editor.setText('line1\nline2\nline3');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('line');
          _ref1 = editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(1);
          keydown('n');
          _ref2 = editor.getSelectedBufferRange(), start = _ref2.start, end = _ref2.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(2);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        describe("case sensitivity", function() {
          beforeEach(function() {
            editor.setText("\nabc\nABC\n");
            editor.setCursorBufferPosition([0, 0]);
            return keydown('/');
          });
          it("works in case sensitive mode", function() {
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode", function() {
            submitNormalModeInputText('\\cAbC');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode wherever \\c is", function() {
            submitNormalModeInputText('AbC\\c');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("uses case insensitive search if useSmartcaseForSearch is true and searching lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('abc');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("uses case sensitive search if useSmartcaseForSearch is true and searching uppercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
        describe("repeating", function() {
          return it("does nothing with no search history", function() {
            editor.setCursorBufferPosition([0, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
            expect(atom.beep).toHaveBeenCalled();
            editor.setCursorBufferPosition([1, 1]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
            return expect(atom.beep.callCount).toBe(2);
          });
        });
        describe("repeating with search history", function() {
          beforeEach(function() {
            keydown('/');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search with /<enter>", function() {
            keydown('/');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search with //", function() {
            keydown('/');
            submitNormalModeInputText('/');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe("the n keybinding", function() {
            return it("repeats the last search", function() {
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe("the N keybinding", function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
        return describe("composing", function() {
          it("composes with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            expect(editor.getText()).toEqual("def\nabc\ndef\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("repeats correctly with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            keydown('.');
            expect(editor.getText()).toEqual("def\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
      });
      describe("when reversed as ?", function() {
        it("moves the cursor backwards to the specified search pattern", function() {
          keydown('?');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("accepts / as a literal search pattern", function() {
          editor.setText("abc\nd/f\nabc\nd/f\n");
          editor.setCursorBufferPosition([0, 0]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return describe("repeating", function() {
          beforeEach(function() {
            keydown('?');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search as reversed with ?<enter>", function() {
            keydown('?');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search as reversed with ??", function() {
            keydown('?');
            submitNormalModeInputText('?');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe('the n keybinding', function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe('the N keybinding', function() {
            return it("repeats the last search forwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
      });
      return describe("using search history", function() {
        var inputEditor;
        inputEditor = null;
        beforeEach(function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('/');
          submitNormalModeInputText('abc');
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          return inputEditor = editor.normalModeInputView.editorElement;
        });
        it("allows searching history in the search field", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return it("resets the search field to empty when scrolling back", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe("the * keybinding", function() {
      beforeEach(function() {
        editor.setText("abd\n@def\nabd\ndef\n");
        return editor.setCursorBufferPosition([0, 0]);
      });
      return describe("as a motion", function() {
        it("moves cursor to next occurence of word under cursor", function() {
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("repeats with the n key", function() {
          keydown("*");
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that contain 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
          it("doesn't move cursor unless next match has exact word ending", function() {
            editor.setText("abc\n@def\nabc\n@def1\n");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\ndef\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
        describe("when cursor is not on a word", function() {
          return it("does a match with the next word", function() {
            editor.setText("abc\na  @def\n abc\n @def");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        return describe("when cursor is at EOF", function() {
          return it("doesn't try to do any match", function() {
            editor.setText("abc\n@def\nabc\n ");
            editor.setCursorBufferPosition([3, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the hash keybinding", function() {
      return describe("as a motion", function() {
        it("moves cursor to previous occurence of word under cursor", function() {
          editor.setText("abc\n@def\nabc\ndef\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("repeats with n", function() {
          editor.setText("abc\n@def\nabc\ndef\nabc\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          keydown("n");
          expect(editor.getCursorBufferPosition()).toEqual([4, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that containt 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\n@def\nabc\ndef\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          });
        });
        return describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the H keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([0, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(2);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('3');
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([2, 0]);
      });
    });
    describe("the L keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([10, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(6);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        keydown('3');
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([8, 0]);
      });
    });
    describe("the M keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        spyOn(editor.getLastCursor(), 'setScreenPosition');
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        return spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
      });
      return it("moves the cursor to the first row if visible", function() {
        keydown('M', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([5, 0]);
      });
    });
    describe('the mark keybindings', function() {
      beforeEach(function() {
        editor.setText('  12\n    34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      it('moves to the beginning of the line of a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
      });
      it('moves literally to a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
      });
      it('deletes to a mark by line', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('56\n');
      });
      it('deletes before to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual(' 4\n56\n');
      });
      it('deletes after to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([2, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('  12\n    36\n');
      });
      return it('moves back to previous', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('`');
        normalModeInputKeydown('`');
        editor.setCursorBufferPosition([2, 1]);
        keydown('`');
        normalModeInputKeydown('`');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 5]);
      });
    });
    describe('the f/F keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the first specified character it finds', function() {
        keydown('f');
        normalModeInputKeydown('c');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('abcbc\n');
      });
      it("cancels c when no match found", function() {
        keydown('c');
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getText()).toBe("abcabcabcabc\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(vimState.mode).toBe("normal");
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
        beforeEach(function() {
          editor.setText("abcébcabcébc\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('f');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: "´",
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('´');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            data: "é",
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: 'é',
            target: inputNode
          }));
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe('the t/T keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the character previous to the first specified character it finds', function() {
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the character after the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('t');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('abcbcabc\n');
      });
      return it("selects character under cursor even when no movement happens", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('bcabcabcabc\n');
      });
    });
    describe('the v keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('v');
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("02\n0003\n00");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects right", function() {
        keydown('v');
        keydown('l');
        expect(editor.getSelectedText()).toBe("02");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeTruthy();
      });
    });
    describe('the V keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('V', {
          shift: true
        });
        expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("002\n0003\n00004\n");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects up a line", function() {
        keydown('V', {
          shift: true
        });
        keydown('k');
        return expect(editor.getSelectedText()).toBe("01\n002\n");
      });
    });
    describe('the ; and , keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeat f in same direction", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat F in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat f in opposite direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat F in opposite direction", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("alternate repeat f in same direction and reverse", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("alternate repeat F in same direction and reverse", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat t in same direction", function() {
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("repeat t in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
      });
      it("repeat with count in same direction", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('2');
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat with count in reverse direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown('2');
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      return it("shares the most recent find/till command with other editors", function() {
        return helpers.getEditorElement(function(otherEditorElement) {
          var otherEditor;
          otherEditor = otherEditorElement.getModel();
          editor.setText("a baz bar\n");
          editor.setCursorScreenPosition([0, 0]);
          otherEditor.setText("foo bar baz");
          otherEditor.setCursorScreenPosition([0, 0]);
          keydown('f');
          normalModeInputKeydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown(';', {
            element: otherEditorElement
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('t', {
            element: otherEditorElement
          });
          normalModeInputKeydown('r', {
            editor: otherEditor
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          keydown(';');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe('the % motion', function() {
      beforeEach(function() {
        editor.setText("( ( ) )--{ text in here; and a function call(with parameters) }\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('matches the correct parenthesis', function() {
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('matches the correct brace', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 62]);
      });
      it('composes correctly with d', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('d');
        keydown('%');
        return expect(editor.getText()).toEqual("( ( ) )--\n");
      });
      it('moves correctly when composed with v going forward', function() {
        keydown('v');
        keydown('h');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
      });
      it('moves correctly when composed with v going backward', function() {
        editor.setCursorScreenPosition([0, 5]);
        keydown('v');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 26]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 60]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it("finds matches across multiple lines", function() {
        editor.setText("...(\n...)");
        editor.setCursorScreenPosition([0, 0]);
        keydown("%");
        return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
      });
      return it("does not affect search history", function() {
        keydown('/');
        submitNormalModeInputText('func');
        expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
        keydown('%');
        expect(editor.getCursorBufferPosition()).toEqual([0, 60]);
        keydown('n');
        return expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
      });
    });
    return describe("scrolling screen and keeping cursor in the same screen position", function() {
      beforeEach(function() {
        var _i, _results;
        editor.setText((function() {
          _results = [];
          for (_i = 0; _i < 80; _i++){ _results.push(_i); }
          return _results;
        }).apply(this).join("\n"));
        editor.setHeight(20 * 10);
        editor.setLineHeightInPixels(10);
        editor.setScrollTop(40 * 10);
        return editor.setCursorBufferPosition([42, 0]);
      });
      describe("the ctrl-u keybinding", function() {
        it("moves the screen up by half screen size and keeps cursor onscreen", function() {
          keydown('u', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(300);
          return expect(editor.getCursorBufferPosition()).toEqual([32, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-b keybinding", function() {
        it("moves screen up one page", function() {
          keydown('b', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(200);
          return expect(editor.getCursorScreenPosition()).toEqual([22, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-d keybinding", function() {
        it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('d', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(500);
          return expect(editor.getCursorBufferPosition()).toEqual([52, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].join("\n").slice(1, -1));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].join("\n").concat("\n"));
        });
      });
      return describe("the ctrl-f keybinding", function() {
        it("moves screen down one page", function() {
          keydown('f', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(600);
          return expect(editor.getCursorScreenPosition()).toEqual([62, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].join("\n").slice(1, -1));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].join("\n").concat("\n"));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvc3BlYy9tb3Rpb25zLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FBVixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsaUdBQUE7QUFBQSxJQUFBLE9BQW9DLEVBQXBDLEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QixrQkFBeEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQixDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxpQkFBUixDQUFBLENBREEsQ0FBQTthQUdBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixTQUFDLE9BQUQsR0FBQTtBQUN2QixRQUFBLGFBQUEsR0FBZ0IsT0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsYUFBYSxDQUFDLFFBRnpCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxrQkFBVCxDQUFBLENBSEEsQ0FBQTtlQUlBLFFBQVEsQ0FBQyxlQUFULENBQUEsRUFMdUI7TUFBQSxDQUF6QixFQUpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWFBLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7O1FBQU0sVUFBUTtPQUN0Qjs7UUFBQSxPQUFPLENBQUMsVUFBVztPQUFuQjthQUNBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEdB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

//# sourceURL=/Users/doot/.atom/packages/vim-mode/spec/motions-spec.coffee
