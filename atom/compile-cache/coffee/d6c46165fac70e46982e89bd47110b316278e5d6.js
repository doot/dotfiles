(function() {
  var AllWhitespace, Paragraph, Range, SelectAParagraph, SelectAWholeWord, SelectAWord, SelectInsideBrackets, SelectInsideParagraph, SelectInsideQuotes, SelectInsideWholeWord, SelectInsideWord, TextObject, WholeWordRegex, mergeRanges,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Range = require('atom').Range;

  AllWhitespace = /^\s$/;

  WholeWordRegex = /\S+/;

  mergeRanges = require('./utils').mergeRanges;

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    TextObject.prototype.execute = function() {
      return this.select.apply(this, arguments);
    };

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      var selection, _i, _len, _ref;
      _ref = this.editor.getSelections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        selection.expandOverWord();
      }
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideWholeWord = (function(_super) {
    __extends(SelectInsideWholeWord, _super);

    function SelectInsideWholeWord() {
      return SelectInsideWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWholeWord.prototype.select = function() {
      var range, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        _results.push(true);
      }
      return _results;
    };

    return SelectInsideWholeWord;

  })(TextObject);

  SelectInsideQuotes = (function(_super) {
    __extends(SelectInsideQuotes, _super);

    function SelectInsideQuotes(editor, char, includeQuotes) {
      this.editor = editor;
      this.char = char;
      this.includeQuotes = includeQuotes;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line, start;
      start = pos.copy();
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              if (this.isStartQuote(pos)) {
                return pos;
              } else {
                return this.lookForwardOnLine(start);
              }
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
      return this.lookForwardOnLine(start);
    };

    SelectInsideQuotes.prototype.isStartQuote = function(end) {
      var line, numQuotes;
      line = this.editor.lineTextForBufferRow(end.row);
      numQuotes = line.substring(0, end.column + 1).replace("'" + this.char, '').split(this.char).length - 1;
      return numQuotes % 2;
    };

    SelectInsideQuotes.prototype.lookForwardOnLine = function(pos) {
      var index, line;
      line = this.editor.lineTextForBufferRow(pos.row);
      index = line.substring(pos.column).indexOf(this.char);
      if (index >= 0) {
        pos.column += index;
        return pos;
      }
      return null;
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            if (this.includeQuotes) {
              --start.column;
            }
            if (this.includeQuotes) {
              ++end.column;
            }
            return end;
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningQuote(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingQuote(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(_super) {
    __extends(SelectInsideBrackets, _super);

    function SelectInsideBrackets(editor, beginChar, endChar, includeBrackets) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
      this.includeBrackets = includeBrackets;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                if (this.includeBrackets) {
                  --start.column;
                }
                if (this.includeBrackets) {
                  ++end.column;
                }
                return end;
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningBracket(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingBracket(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideBrackets;

  })(TextObject);

  SelectAWord = (function(_super) {
    __extends(SelectAWord, _super);

    function SelectAWord() {
      return SelectAWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWord.prototype.select = function() {
      var char, endPoint, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        selection.expandOverWord();
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        _results.push(true);
      }
      return _results;
    };

    return SelectAWord;

  })(TextObject);

  SelectAWholeWord = (function(_super) {
    __extends(SelectAWholeWord, _super);

    function SelectAWholeWord() {
      return SelectAWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWholeWord.prototype.select = function() {
      var char, endPoint, range, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        _results.push(true);
      }
      return _results;
    };

    return SelectAWholeWord;

  })(TextObject);

  Paragraph = (function(_super) {
    __extends(Paragraph, _super);

    function Paragraph() {
      return Paragraph.__super__.constructor.apply(this, arguments);
    }

    Paragraph.prototype.select = function() {
      var selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        _results.push(this.selectParagraph(selection));
      }
      return _results;
    };

    Paragraph.prototype.paragraphDelimitedRange = function(startPoint) {
      var inParagraph, lowerRow, upperRow;
      inParagraph = this.isParagraphLine(this.editor.lineTextForBufferRow(startPoint.row));
      upperRow = this.searchLines(startPoint.row, -1, inParagraph);
      lowerRow = this.searchLines(startPoint.row, this.editor.getLineCount(), inParagraph);
      return new Range([upperRow + 1, 0], [lowerRow, 0]);
    };

    Paragraph.prototype.searchLines = function(startRow, rowLimit, startedInParagraph) {
      var currentRow, line, _i;
      for (currentRow = _i = startRow; startRow <= rowLimit ? _i <= rowLimit : _i >= rowLimit; currentRow = startRow <= rowLimit ? ++_i : --_i) {
        line = this.editor.lineTextForBufferRow(currentRow);
        if (startedInParagraph !== this.isParagraphLine(line)) {
          return currentRow;
        }
      }
      return rowLimit;
    };

    Paragraph.prototype.isParagraphLine = function(line) {
      return /\S/.test(line);
    };

    return Paragraph;

  })(TextObject);

  SelectInsideParagraph = (function(_super) {
    __extends(SelectInsideParagraph, _super);

    function SelectInsideParagraph() {
      return SelectInsideParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectInsideParagraph.prototype.selectParagraph = function(selection) {
      var newRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      selection.setBufferRange(mergeRanges(oldRange, newRange));
      return true;
    };

    return SelectInsideParagraph;

  })(Paragraph);

  SelectAParagraph = (function(_super) {
    __extends(SelectAParagraph, _super);

    function SelectAParagraph() {
      return SelectAParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectAParagraph.prototype.selectParagraph = function(selection) {
      var newRange, nextRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      nextRange = this.paragraphDelimitedRange(newRange.end);
      selection.setBufferRange(mergeRanges(oldRange, [newRange.start, nextRange.end]));
      return true;
    };

    return SelectAParagraph;

  })(Paragraph);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideWholeWord: SelectInsideWholeWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets,
    SelectAWord: SelectAWord,
    SelectAWholeWord: SelectAWholeWord,
    SelectInsideParagraph: SelectInsideParagraph,
    SelectAParagraph: SelectAParagraph
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL3RleHQtb2JqZWN0cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbU9BQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE1BRGhCLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLEtBRmpCLENBQUE7O0FBQUEsRUFHQyxjQUFlLE9BQUEsQ0FBUSxTQUFSLEVBQWYsV0FIRCxDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLG9CQUFFLE1BQUYsRUFBVyxLQUFYLEdBQUE7QUFBbUIsTUFBbEIsSUFBQyxDQUFBLFNBQUEsTUFBaUIsQ0FBQTtBQUFBLE1BQVQsSUFBQyxDQUFBLFFBQUEsS0FBUSxDQUFuQjtJQUFBLENBQWI7O0FBQUEseUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUZaLENBQUE7O0FBQUEseUJBR0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUhkLENBQUE7O0FBQUEseUJBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLElBQWQsRUFBb0IsU0FBcEIsRUFBSDtJQUFBLENBTFQsQ0FBQTs7c0JBQUE7O01BTkYsQ0FBQTs7QUFBQSxFQWFNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLHlCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBOzZCQUFBO0FBQ0UsUUFBQSxTQUFTLENBQUMsY0FBVixDQUFBLENBQUEsQ0FERjtBQUFBLE9BQUE7YUFFQSxDQUFDLElBQUQs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

//# sourceURL=/Users/doot/.atom/packages/vim-mode/lib/text-objects.coffee
