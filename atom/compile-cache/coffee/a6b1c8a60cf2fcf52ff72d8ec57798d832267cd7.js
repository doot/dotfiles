(function() {
  var Scroll, ScrollCursor, ScrollCursorToBottom, ScrollCursorToLeft, ScrollCursorToMiddle, ScrollCursorToRight, ScrollCursorToTop, ScrollDown, ScrollHorizontal, ScrollUp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Scroll = (function() {
    Scroll.prototype.isComplete = function() {
      return true;
    };

    Scroll.prototype.isRecordable = function() {
      return false;
    };

    function Scroll(editorElement) {
      this.editorElement = editorElement;
      this.scrolloff = 2;
      this.editor = this.editorElement.getModel();
      this.rows = {
        first: this.editorElement.getFirstVisibleScreenRow(),
        last: this.editorElement.getLastVisibleScreenRow(),
        final: this.editor.getLastScreenRow()
      };
    }

    return Scroll;

  })();

  ScrollDown = (function(_super) {
    __extends(ScrollDown, _super);

    function ScrollDown() {
      return ScrollDown.__super__.constructor.apply(this, arguments);
    }

    ScrollDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollUp(count);
    };

    ScrollDown.prototype.keepCursorOnScreen = function(count) {
      var column, firstScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      firstScreenRow = this.rows.first + this.scrolloff + 1;
      if (row - count <= firstScreenRow) {
        return this.editor.setCursorScreenPosition([firstScreenRow + count, column]);
      }
    };

    ScrollDown.prototype.scrollUp = function(count) {
      var lastScreenRow;
      lastScreenRow = this.rows.last - this.scrolloff;
      return this.editor.scrollToScreenPosition([lastScreenRow + count, 0]);
    };

    return ScrollDown;

  })(Scroll);

  ScrollUp = (function(_super) {
    __extends(ScrollUp, _super);

    function ScrollUp() {
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollDown(count);
    };

    ScrollUp.prototype.keepCursorOnScreen = function(count) {
      var column, lastScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      lastScreenRow = this.rows.last - this.scrolloff - 1;
      if (row + count >= lastScreenRow) {
        return this.editor.setCursorScreenPosition([lastScreenRow - count, column]);
      }
    };

    ScrollUp.prototype.scrollDown = function(count) {
      var firstScreenRow;
      firstScreenRow = this.rows.first + this.scrolloff;
      return this.editor.scrollToScreenPosition([firstScreenRow - count, 0]);
    };

    return ScrollUp;

  })(Scroll);

  ScrollCursor = (function(_super) {
    __extends(ScrollCursor, _super);

    function ScrollCursor(editorElement, opts) {
      var cursor;
      this.editorElement = editorElement;
      this.opts = opts != null ? opts : {};
      ScrollCursor.__super__.constructor.apply(this, arguments);
      cursor = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursor).top;
    }

    return ScrollCursor;

  })(Scroll);

  ScrollCursorToTop = (function(_super) {
    __extends(ScrollCursorToTop, _super);

    function ScrollCursorToTop() {
      return ScrollCursorToTop.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToTop.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollUp();
    };

    ScrollCursorToTop.prototype.scrollUp = function() {
      if (this.rows.last === this.rows.final) {
        return;
      }
      this.pixel -= this.editor.getLineHeightInPixels() * this.scrolloff;
      return this.editor.setScrollTop(this.pixel);
    };

    ScrollCursorToTop.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToTop;

  })(ScrollCursor);

  ScrollCursorToMiddle = (function(_super) {
    __extends(ScrollCursorToMiddle, _super);

    function ScrollCursorToMiddle() {
      return ScrollCursorToMiddle.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToMiddle.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollMiddle();
    };

    ScrollCursorToMiddle.prototype.scrollMiddle = function() {
      this.pixel -= this.editor.getHeight() / 2;
      return this.editor.setScrollTop(this.pixel);
    };

    ScrollCursorToMiddle.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToMiddle;

  })(ScrollCursor);

  ScrollCursorToBottom = (function(_super) {
    __extends(ScrollCursorToBottom, _super);

    function ScrollCursorToBottom() {
      return ScrollCursorToBottom.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToBottom.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollDown();
    };

    ScrollCursorToBottom.prototype.scrollDown = function() {
      var offset;
      if (this.rows.first === 0) {
        return;
      }
      offset = this.editor.getLineHeightInPixels() * (this.scrolloff + 1);
      this.pixel -= this.editor.getHeight() - offset;
      return this.editor.setScrollTop(this.pixel);
    };

    ScrollCursorToBottom.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToBottom;

  })(ScrollCursor);

  ScrollHorizontal = (function() {
    ScrollHorizontal.prototype.isComplete = function() {
      return true;
    };

    ScrollHorizontal.prototype.isRecordable = function() {
      return false;
    };

    function ScrollHorizontal(editorElement) {
      var cursorPos;
      this.editorElement = editorElement;
      this.editor = this.editorElement.getModel();
      cursorPos = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursorPos).left;
      this.cursor = this.editor.getLastCursor();
    }

    ScrollHorizontal.prototype.putCursorOnScreen = function() {
      return this.editor.scrollToCursorPosition({
        center: false
      });
    };

    return ScrollHorizontal;

  })();

  ScrollCursorToLeft = (function(_super) {
    __extends(ScrollCursorToLeft, _super);

    function ScrollCursorToLeft() {
      return ScrollCursorToLeft.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToLeft.prototype.execute = function() {
      this.editor.setScrollLeft(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToLeft;

  })(ScrollHorizontal);

  ScrollCursorToRight = (function(_super) {
    __extends(ScrollCursorToRight, _super);

    function ScrollCursorToRight() {
      return ScrollCursorToRight.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToRight.prototype.execute = function() {
      this.editor.setScrollRight(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToRight;

  })(ScrollHorizontal);

  module.exports = {
    ScrollDown: ScrollDown,
    ScrollUp: ScrollUp,
    ScrollCursorToTop: ScrollCursorToTop,
    ScrollCursorToMiddle: ScrollCursorToMiddle,
    ScrollCursorToBottom: ScrollCursorToBottom,
    ScrollCursorToLeft: ScrollCursorToLeft,
    ScrollCursorToRight: ScrollCursorToRight
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL3Njcm9sbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0tBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBQ0oscUJBQUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUFaLENBQUE7O0FBQUEscUJBQ0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQURkLENBQUE7O0FBRWEsSUFBQSxnQkFBRSxhQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxnQkFBQSxhQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBYixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxhQUFhLENBQUMsUUFBZixDQUFBLENBRFYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxhQUFhLENBQUMsd0JBQWYsQ0FBQSxDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGFBQWEsQ0FBQyx1QkFBZixDQUFBLENBRE47QUFBQSxRQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQUEsQ0FGUDtPQUhGLENBRFc7SUFBQSxDQUZiOztrQkFBQTs7TUFERixDQUFBOztBQUFBLEVBV007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDtBQUFBLE1BQUEsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQXBCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUZPO0lB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

//# sourceURL=/Users/doot/.atom/packages/vim-mode/lib/scroll.coffee
