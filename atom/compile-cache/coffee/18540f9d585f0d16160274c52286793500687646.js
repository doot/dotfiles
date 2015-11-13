(function() {
  var AllWhitespace, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToAbsoluteLine, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineAndDown, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLastNonblankCharacterOfLineAndDown, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextSentence, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousSentence, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, ScrollFullDownKeepCursor, ScrollFullUpKeepCursor, ScrollHalfDownKeepCursor, ScrollHalfUpKeepCursor, ScrollKeepingCursor, WholeWordOrEmptyLineRegex, WholeWordRegex, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  settings = require('../settings');

  WholeWordRegex = /\S+/;

  WholeWordOrEmptyLineRegex = /^\s*$|\S+/;

  AllWhitespace = /^\s$/;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    Motion.prototype.operatesInclusively = false;

    Motion.prototype.operatesLinewise = false;

    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
    }

    Motion.prototype.select = function(count, options) {
      var selection, value;
      value = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getSelections();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          if (this.isLinewise()) {
            this.moveSelectionLinewise(selection, count, options);
          } else if (this.vimState.mode === 'visual') {
            this.moveSelectionVisual(selection, count, options);
          } else if (this.operatesInclusively) {
            this.moveSelectionInclusively(selection, count, options);
          } else {
            this.moveSelection(selection, count, options);
          }
          _results.push(!selection.isEmpty());
        }
        return _results;
      }).call(this);
      this.editor.mergeCursors();
      this.editor.mergeIntersectingSelections();
      return value;
    };

    Motion.prototype.execute = function(count) {
      var cursor, _i, _len, _ref1;
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        this.moveCursor(cursor, count);
      }
      return this.editor.mergeCursors();
    };

    Motion.prototype.moveSelectionLinewise = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEndRow, newStartRow, oldEndRow, oldStartRow, wasEmpty, wasReversed, _ref1, _ref2;
          _ref1 = selection.getBufferRowRange(), oldStartRow = _ref1[0], oldEndRow = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          _ref2 = selection.getBufferRowRange(), newStartRow = _ref2[0], newEndRow = _ref2[1];
          if (isReversed && !wasReversed) {
            newEndRow = Math.max(newEndRow, oldStartRow);
          }
          if (wasReversed && !isReversed) {
            newStartRow = Math.min(newStartRow, oldEndRow);
          }
          return selection.setBufferRange([[newStartRow, 0], [newEndRow + 1, 0]]);
        };
      })(this));
    };

    Motion.prototype.moveSelectionInclusively = function(selection, count, options) {
      if (!selection.isEmpty()) {
        return this.moveSelectionVisual(selection, count, options);
      }
      return selection.modifySelection((function(_this) {
        return function() {
          var end, start, _ref1;
          _this.moveCursor(selection.cursor, count, options);
          if (selection.isEmpty()) {
            return;
          }
          if (selection.isReversed()) {
            _ref1 = selection.getBufferRange(), start = _ref1.start, end = _ref1.end;
            return selection.setBufferRange([start, [end.row, end.column + 1]]);
          } else {
            return selection.cursor.moveRight();
          }
        };
      })(this));
    };

    Motion.prototype.moveSelectionVisual = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEnd, newStart, oldEnd, oldStart, range, wasEmpty, wasReversed, _ref1, _ref2, _ref3;
          range = selection.getBufferRange();
          _ref1 = [range.start, range.end], oldStart = _ref1[0], oldEnd = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          range = selection.getBufferRange();
          _ref2 = [range.start, range.end], newStart = _ref2[0], newEnd = _ref2[1];
          if ((isReversed || isEmpty) && !(wasReversed || wasEmpty)) {
            selection.setBufferRange([newStart, [newEnd.row, oldStart.column + 1]]);
          }
          if (wasReversed && !wasEmpty && !isReversed) {
            selection.setBufferRange([[oldEnd.row, oldEnd.column - 1], newEnd]);
          }
          range = selection.getBufferRange();
          _ref3 = [range.start, range.end], newStart = _ref3[0], newEnd = _ref3[1];
          if (selection.isReversed() && newStart.row === newEnd.row && newStart.column + 1 === newEnd.column) {
            return selection.setBufferRange(range, {
              reversed: false
            });
          }
        };
      })(this));
    };

    Motion.prototype.moveSelection = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          return _this.moveCursor(selection.cursor, count, options);
        };
      })(this));
    };

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.isLinewise = function() {
      var _ref1, _ref2;
      if (((_ref1 = this.vimState) != null ? _ref1.mode : void 0) === 'visual') {
        return ((_ref2 = this.vimState) != null ? _ref2.submode : void 0) === 'linewise';
      } else {
        return this.operatesLinewise;
      }
    };

    return Motion;

  })();

  CurrentSelection = (function(_super) {
    __extends(CurrentSelection, _super);

    function CurrentSelection(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      CurrentSelection.__super__.constructor.call(this, this.editor, this.vimState);
      this.lastSelectionRange = this.editor.getSelectedBufferRange();
      this.wasLinewise = this.isLinewise();
    }

    CurrentSelection.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.vimState.mode !== 'visual') {
        if (this.wasLinewise) {
          this.selectLines();
        } else {
          this.selectCharacters();
        }
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.selectLines = function() {
      var cursor, lastSelectionExtent, selection, _i, _len, _ref1;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      _ref1 = this.editor.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        cursor = selection.cursor.getBufferPosition();
        selection.setBufferRange([[cursor.row, 0], [cursor.row + lastSelectionExtent.row, 0]]);
      }
    };

    CurrentSelection.prototype.selectCharacters = function() {
      var lastSelectionExtent, newEnd, selection, start, _i, _len, _ref1;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      _ref1 = this.editor.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        start = selection.getBufferRange().start;
        newEnd = start.traverse(lastSelectionExtent);
        selection.setBufferRange([start, newEnd]);
      }
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(_super) {
    __extends(MotionWithInput, _super);

    function MotionWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editor, this.vimState);
      this.complete = false;
    }

    MotionWithInput.prototype.isComplete = function() {
      return this.complete;
    };

    MotionWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    MotionWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new MotionError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return MotionWithInput;

  })(Motion);

  MoveLeft = (function(_super) {
    __extends(MoveLeft, _super);

    function MoveLeft() {
      return MoveLeft.__super__.constructor.apply(this, arguments);
    }

    MoveLeft.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (!cursor.isAtBeginningOfLine() || settings.wrapLeftRightMotion()) {
          return cursor.moveLeft();
        }
      });
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(_super) {
    __extends(MoveRight, _super);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var wrapToNextLine;
          wrapToNextLine = settings.wrapLeftRightMotion();
          if (_this.vimState.mode === 'operator-pending' && !cursor.isAtEndOfLine()) {
            wrapToNextLine = false;
          }
          if (!cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          if (wrapToNextLine && cursor.isAtEndOfLine()) {
            return cursor.moveRight();
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.operatesLinewise = true;

    MoveUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (cursor.getScreenRow() !== 0) {
          return cursor.moveUp();
        }
      });
    };

    return MoveUp;

  })(Motion);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.operatesLinewise = true;

    MoveDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getScreenRow() !== _this.editor.getLastScreenRow()) {
            return cursor.moveDown();
          }
        };
      })(this));
    };

    return MoveDown;

  })(Motion);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfWord();
      });
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          cursor.moveToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord(cursor) && !_this.isBeginningOfFile(cursor)) {
            _results.push(cursor.moveToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function(cursor) {
      var char;
      char = cursor.getCurrentWordPrefix().slice(-1);
      return AllWhitespace.test(char);
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function(cursor) {
      var cur;
      cur = cursor.getBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.wordRegex = null;

    MoveToNextWord.prototype.moveCursor = function(cursor, count, options) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = (options != null ? options.excludeWhitespace : void 0) ? cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          }) : cursor.getBeginningOfNextWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (_this.isEndOfFile(cursor)) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.setBufferPosition(next);
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function(cursor) {
      var cur, eof;
      cur = cursor.getBufferPosition();
      eof = this.editor.getEofBufferPosition();
      return cur.row === eof.row && cur.column === eof.column;
    };

    return MoveToNextWord;

  })(Motion);

  MoveToNextWholeWord = (function(_super) {
    __extends(MoveToNextWholeWord, _super);

    function MoveToNextWholeWord() {
      return MoveToNextWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWholeWord.prototype.wordRegex = WholeWordOrEmptyLineRegex;

    return MoveToNextWholeWord;

  })(MoveToNextWord);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.operatesInclusively = true;

    MoveToEndOfWord.prototype.wordRegex = null;

    MoveToEndOfWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (next.column > 0) {
            next.column--;
          }
          if (next.isEqual(current)) {
            cursor.moveRight();
            if (cursor.isAtEndOfLine()) {
              cursor.moveDown();
              cursor.moveToBeginningOfLine();
            }
            next = cursor.getEndOfCurrentWordBufferPosition({
              wordRegex: _this.wordRegex
            });
            if (next.column > 0) {
              next.column--;
            }
          }
          return cursor.setBufferPosition(next);
        };
      })(this));
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.wordRegex = WholeWordRegex;

    return MoveToEndOfWholeWord;

  })(MoveToEndOfWord);

  MoveToNextSentence = (function(_super) {
    __extends(MoveToNextSentence, _super);

    function MoveToNextSentence() {
      return MoveToNextSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToNextSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var eof, scanRange, start;
        start = cursor.getBufferPosition().translate(new Point(0, 1));
        eof = cursor.editor.getBuffer().getEndPosition();
        scanRange = [start, eof];
        return cursor.editor.scanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(_arg) {
          var adjustment, matchText, range, stop;
          matchText = _arg.matchText, range = _arg.range, stop = _arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToNextSentence;

  })(Motion);

  MoveToPreviousSentence = (function(_super) {
    __extends(MoveToPreviousSentence, _super);

    function MoveToPreviousSentence() {
      return MoveToPreviousSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var bof, end, scanRange;
        end = cursor.getBufferPosition().translate(new Point(0, -1));
        bof = cursor.editor.getBuffer().getFirstPosition();
        scanRange = [bof, end];
        return cursor.editor.backwardsScanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(_arg) {
          var adjustment, matchText, range, stop;
          matchText = _arg.matchText, range = _arg.range, stop = _arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToPreviousSentence;

  })(Motion);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfNextParagraph();
      });
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfPreviousParagraph();
      });
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.operatesLinewise = true;

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToAbsoluteLine = (function(_super) {
    __extends(MoveToAbsoluteLine, _super);

    function MoveToAbsoluteLine() {
      return MoveToAbsoluteLine.__super__.constructor.apply(this, arguments);
    }

    MoveToAbsoluteLine.prototype.moveCursor = function(cursor, count) {
      cursor.setBufferPosition([this.getDestinationRow(count), Infinity]);
      cursor.moveToFirstCharacterOfLine();
      if (cursor.getBufferColumn() === 0) {
        return cursor.moveToEndOfLine();
      }
    };

    return MoveToAbsoluteLine;

  })(MoveToLine);

  MoveToRelativeLine = (function(_super) {
    __extends(MoveToRelativeLine, _super);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setBufferPosition([row + (count - 1), 0]);
    };

    return MoveToRelativeLine;

  })(MoveToLine);

  MoveToScreenLine = (function(_super) {
    __extends(MoveToScreenLine, _super);

    function MoveToScreenLine(editorElement, vimState, scrolloff) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    MoveToScreenLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfLine();
      });
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine() {
      return MoveToFirstCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToBeginningOfLine();
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineAndDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineAndDown, _super);

    function MoveToFirstCharacterOfLineAndDown() {
      return MoveToFirstCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineAndDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineAndDown;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToEndOfLine();
        return cursor.goalColumn = Infinity;
      });
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToLastNonblankCharacterOfLineAndDown = (function(_super) {
    __extends(MoveToLastNonblankCharacterOfLineAndDown, _super);

    function MoveToLastNonblankCharacterOfLineAndDown() {
      return MoveToLastNonblankCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToLastNonblankCharacterOfLineAndDown.prototype.operatesInclusively = true;

    MoveToLastNonblankCharacterOfLineAndDown.prototype.skipTrailingWhitespace = function(cursor) {
      var position, scanRange, startOfTrailingWhitespace;
      position = cursor.getBufferPosition();
      scanRange = cursor.getCurrentLineBufferRange();
      startOfTrailingWhitespace = [scanRange.end.row, scanRange.end.column - 1];
      this.editor.scanInBufferRange(/[ \t]+$/, scanRange, function(_arg) {
        var range;
        range = _arg.range;
        startOfTrailingWhitespace = range.start;
        return startOfTrailingWhitespace.column -= 1;
      });
      return cursor.setBufferPosition(startOfTrailingWhitespace);
    };

    MoveToLastNonblankCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      return this.skipTrailingWhitespace(cursor);
    };

    return MoveToLastNonblankCharacterOfLineAndDown;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(_super) {
    __extends(MoveToFirstCharacterOfLineUp, _super);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveUp();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      cursor.setBufferPosition([this.getDestinationRow(count), 0]);
      if (!this.isLinewise()) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToStartOfFile;

  })(MoveToLine);

  MoveToTopOfScreen = (function(_super) {
    __extends(MoveToTopOfScreen, _super);

    function MoveToTopOfScreen() {
      return MoveToTopOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToTopOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      if (firstScreenRow > 0) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return firstScreenRow + offset;
    };

    return MoveToTopOfScreen;

  })(MoveToScreenLine);

  MoveToBottomOfScreen = (function(_super) {
    __extends(MoveToBottomOfScreen, _super);

    function MoveToBottomOfScreen() {
      return MoveToBottomOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToBottomOfScreen.prototype.getDestinationRow = function(count) {
      var lastRow, lastScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      lastRow = this.editor.getBuffer().getLastRow();
      if (lastScreenRow !== lastRow) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return lastScreenRow - offset;
    };

    return MoveToBottomOfScreen;

  })(MoveToScreenLine);

  MoveToMiddleOfScreen = (function(_super) {
    __extends(MoveToMiddleOfScreen, _super);

    function MoveToMiddleOfScreen() {
      return MoveToMiddleOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToMiddleOfScreen.prototype.getDestinationRow = function() {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

  ScrollKeepingCursor = (function(_super) {
    __extends(ScrollKeepingCursor, _super);

    ScrollKeepingCursor.prototype.operatesLinewise = true;

    ScrollKeepingCursor.prototype.cursorRow = null;

    function ScrollKeepingCursor(editorElement, vimState) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      ScrollKeepingCursor.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    ScrollKeepingCursor.prototype.select = function(count, options) {
      var scrollTop;
      scrollTop = this.scrollScreen(count);
      ScrollKeepingCursor.__super__.select.call(this, count, options);
      return this.editorElement.setScrollTop(scrollTop);
    };

    ScrollKeepingCursor.prototype.execute = function(count) {
      var scrollTop;
      scrollTop = this.scrollScreen(count);
      ScrollKeepingCursor.__super__.execute.call(this, count);
      return this.editorElement.setScrollTop(scrollTop);
    };

    ScrollKeepingCursor.prototype.moveCursor = function(cursor) {
      return cursor.setScreenPosition(Point(this.cursorRow, 0), {
        autoscroll: false
      });
    };

    ScrollKeepingCursor.prototype.scrollScreen = function(count) {
      var currentCursorRow, currentScrollTop, lineHeight, rowsPerPage, scrollRows, _ref1;
      if (count == null) {
        count = 1;
      }
      currentScrollTop = (_ref1 = this.editorElement.component.presenter.pendingScrollTop) != null ? _ref1 : this.editorElement.getScrollTop();
      currentCursorRow = this.editor.getCursorScreenPosition().row;
      rowsPerPage = this.editor.getRowsPerPage();
      lineHeight = this.editor.getLineHeightInPixels();
      scrollRows = Math.floor(this.pageScrollFraction * rowsPerPage * count);
      this.cursorRow = currentCursorRow + scrollRows;
      return currentScrollTop + scrollRows * lineHeight;
    };

    return ScrollKeepingCursor;

  })(Motion);

  ScrollHalfUpKeepCursor = (function(_super) {
    __extends(ScrollHalfUpKeepCursor, _super);

    function ScrollHalfUpKeepCursor() {
      return ScrollHalfUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfUpKeepCursor.prototype.pageScrollFraction = -1 / 2;

    return ScrollHalfUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullUpKeepCursor = (function(_super) {
    __extends(ScrollFullUpKeepCursor, _super);

    function ScrollFullUpKeepCursor() {
      return ScrollFullUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullUpKeepCursor.prototype.pageScrollFraction = -1;

    return ScrollFullUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollHalfDownKeepCursor = (function(_super) {
    __extends(ScrollHalfDownKeepCursor, _super);

    function ScrollHalfDownKeepCursor() {
      return ScrollHalfDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfDownKeepCursor.prototype.pageScrollFraction = 1 / 2;

    return ScrollHalfDownKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullDownKeepCursor = (function(_super) {
    __extends(ScrollFullDownKeepCursor, _super);

    function ScrollFullDownKeepCursor() {
      return ScrollFullDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullDownKeepCursor.prototype.pageScrollFraction = 1;

    return ScrollFullDownKeepCursor;

  })(ScrollKeepingCursor);

  module.exports = {
    Motion: Motion,
    MotionWithInput: MotionWithInput,
    CurrentSelection: CurrentSelection,
    MoveLeft: MoveLeft,
    MoveRight: MoveRight,
    MoveUp: MoveUp,
    MoveDown: MoveDown,
    MoveToPreviousWord: MoveToPreviousWord,
    MoveToPreviousWholeWord: MoveToPreviousWholeWord,
    MoveToNextWord: MoveToNextWord,
    MoveToNextWholeWord: MoveToNextWholeWord,
    MoveToEndOfWord: MoveToEndOfWord,
    MoveToNextSentence: MoveToNextSentence,
    MoveToPreviousSentence: MoveToPreviousSentence,
    MoveToNextParagraph: MoveToNextParagraph,
    MoveToPreviousParagraph: MoveToPreviousParagraph,
    MoveToAbsoluteLine: MoveToAbsoluteLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToFirstCharacterOfLineAndDown: MoveToFirstCharacterOfLineAndDown,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToLastNonblankCharacterOfLineAndDown: MoveToLastNonblankCharacterOfLineAndDown,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError,
    ScrollHalfUpKeepCursor: ScrollHalfUpKeepCursor,
    ScrollFullUpKeepCursor: ScrollFullUpKeepCursor,
    ScrollHalfDownKeepCursor: ScrollHalfDownKeepCursor,
    ScrollFullDownKeepCursor: ScrollFullDownKeepCursor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL21vdGlvbnMvZ2VuZXJhbC1tb3Rpb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxM0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRFIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFJQSxjQUFBLEdBQWlCLEtBSmpCLENBQUE7O0FBQUEsRUFLQSx5QkFBQSxHQUE0QixXQUw1QixDQUFBOztBQUFBLEVBTUEsYUFBQSxHQUFnQixNQU5oQixDQUFBOztBQUFBLEVBUU07QUFDUyxJQUFBLHFCQUFFLE9BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLGNBQVIsQ0FEVztJQUFBLENBQWI7O3VCQUFBOztNQVRGLENBQUE7O0FBQUEsRUFZTTtBQUNKLHFCQUFBLG1CQUFBLEdBQXFCLEtBQXJCLENBQUE7O0FBQUEscUJBQ0EsZ0JBQUEsR0FBa0IsS0FEbEIsQ0FBQTs7QUFHYSxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFBc0IsTUFBckIsSUFBQyxDQUFBLFNBQUEsTUFBb0IsQ0FBQTtBQUFBLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUF0QjtJQUFBLENBSGI7O0FBQUEscUJBS0EsTUFBQSxHQUFRLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTtBQUNOLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLEtBQUE7O0FB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

//# sourceURL=/Users/doot/.atom/packages/vim-mode/lib/motions/general-motions.coffee
