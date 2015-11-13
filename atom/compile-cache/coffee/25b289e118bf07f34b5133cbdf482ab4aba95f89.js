(function() {
  var $, $$, AutocompleteView, CompositeDisposable, Range, SelectListView, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$ = _ref1.$$, SelectListView = _ref1.SelectListView;

  module.exports = AutocompleteView = (function(_super) {
    __extends(AutocompleteView, _super);

    function AutocompleteView() {
      return AutocompleteView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteView.prototype.currentBuffer = null;

    AutocompleteView.prototype.checkpoint = null;

    AutocompleteView.prototype.wordList = null;

    AutocompleteView.prototype.wordRegex = /\w+/g;

    AutocompleteView.prototype.originalSelectionBufferRanges = null;

    AutocompleteView.prototype.originalCursorPosition = null;

    AutocompleteView.prototype.aboveCursor = false;

    AutocompleteView.prototype.initialize = function(editor) {
      this.editor = editor;
      AutocompleteView.__super__.initialize.apply(this, arguments);
      this.addClass('autocomplete popover-list');
      this.handleEvents();
      return this.setCurrentBuffer(this.editor.getBuffer());
    };

    AutocompleteView.prototype.getFilterKey = function() {
      return 'word';
    };

    AutocompleteView.prototype.viewForItem = function(_arg) {
      var word;
      word = _arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    AutocompleteView.prototype.handleEvents = function() {
      this.list.on('mousewheel', function(event) {
        return event.stopPropagation();
      });
      this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.setCurrentBuffer(_this.editor.getBuffer());
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this)));
      return this.filterEditorView.getModel().onWillInsertText((function(_this) {
        return function(_arg) {
          var cancel, text;
          cancel = _arg.cancel, text = _arg.text;
          if (!text.match(_this.wordRegex)) {
            _this.confirmSelection();
            _this.editor.insertText(text);
            return cancel();
          }
        };
      })(this));
    };

    AutocompleteView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
    };

    AutocompleteView.prototype.selectItemView = function(item) {
      var match;
      AutocompleteView.__super__.selectItemView.apply(this, arguments);
      if (match = this.getSelectedItem()) {
        return this.replaceSelectedTextWithMatch(match);
      }
    };

    AutocompleteView.prototype.selectNextItemView = function() {
      AutocompleteView.__super__.selectNextItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.selectPreviousItemView = function() {
      AutocompleteView.__super__.selectPreviousItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.getCompletionsForCursorScope = function() {
      var completions, scope;
      scope = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition());
      completions = atom.config.getAll('editor.completions', {
        scope: scope
      });
      return _.uniq(_.flatten(_.pluck(completions, 'value')));
    };

    AutocompleteView.prototype.buildWordList = function() {
      var buffer, buffers, matches, word, wordHash, _i, _j, _k, _len, _len1, _len2, _ref2, _ref3;
      wordHash = {};
      if (atom.config.get('autocomplete.includeCompletionsFromAllBuffers')) {
        buffers = atom.project.getBuffers();
      } else {
        buffers = [this.currentBuffer];
      }
      matches = [];
      for (_i = 0, _len = buffers.length; _i < _len; _i++) {
        buffer = buffers[_i];
        matches.push(buffer.getText().match(this.wordRegex));
      }
      _ref2 = _.flatten(matches);
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        word = _ref2[_j];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      _ref3 = this.getCompletionsForCursorScope();
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        word = _ref3[_k];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      return this.wordList = Object.keys(wordHash).sort(function(word1, word2) {
        return word1.toLowerCase().localeCompare(word2.toLowerCase());
      });
    };

    AutocompleteView.prototype.confirmed = function(match) {
      this.editor.getSelections().forEach(function(selection) {
        return selection.clear();
      });
      this.cancel();
      if (!match) {
        return;
      }
      this.replaceSelectedTextWithMatch(match);
      return this.editor.getCursors().forEach(function(cursor) {
        var position;
        position = cursor.getBufferPosition();
        return cursor.setBufferPosition([position.row, position.column + match.suffix.length]);
      });
    };

    AutocompleteView.prototype.cancelled = function() {
      var _ref2;
      if ((_ref2 = this.overlayDecoration) != null) {
        _ref2.destroy();
      }
      if (!this.editor.isDestroyed()) {
        this.editor.revertToCheckpoint(this.checkpoint);
        this.editor.setSelectedBufferRanges(this.originalSelectionBufferRanges);
        return atom.workspace.getActivePane().activate();
      }
    };

    AutocompleteView.prototype.attach = function() {
      var cursorMarker, matches;
      this.checkpoint = this.editor.createCheckpoint();
      this.aboveCursor = false;
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      if (!this.allPrefixAndSuffixOfSelectionsMatch()) {
        return this.cancel();
      }
      this.buildWordList();
      matches = this.findMatchesForCurrentSelection();
      this.setItems(matches);
      if (matches.length === 1) {
        return this.confirmSelection();
      } else {
        cursorMarker = this.editor.getLastCursor().getMarker();
        return this.overlayDecoration = this.editor.decorateMarker(cursorMarker, {
          type: 'overlay',
          position: 'tail',
          item: this
        });
      }
    };

    AutocompleteView.prototype.destroy = function() {
      var _ref2;
      return (_ref2 = this.overlayDecoration) != null ? _ref2.destroy() : void 0;
    };

    AutocompleteView.prototype.toggle = function() {
      if (this.isVisible()) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    AutocompleteView.prototype.findMatchesForCurrentSelection = function() {
      var currentWord, prefix, regex, selection, suffix, word, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _results, _results1;
      selection = this.editor.getLastSelection();
      _ref2 = this.prefixAndSuffixOfSelection(selection), prefix = _ref2.prefix, suffix = _ref2.suffix;
      if ((prefix.length + suffix.length) > 0) {
        regex = new RegExp("^" + prefix + ".+" + suffix + "$", "i");
        currentWord = prefix + this.editor.getSelectedText() + suffix;
        _ref3 = this.wordList;
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          word = _ref3[_i];
          if (regex.test(word) && word !== currentWord) {
            _results.push({
              prefix: prefix,
              suffix: suffix,
              word: word
            });
          }
        }
        return _results;
      } else {
        _ref4 = this.wordList;
        _results1 = [];
        for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
          word = _ref4[_j];
          _results1.push({
            word: word,
            prefix: prefix,
            suffix: suffix
          });
        }
        return _results1;
      }
    };

    AutocompleteView.prototype.replaceSelectedTextWithMatch = function(match) {
      var newSelectedBufferRanges;
      newSelectedBufferRanges = [];
      return this.editor.transact((function(_this) {
        return function() {
          var selections;
          selections = _this.editor.getSelections();
          selections.forEach(function(selection, i) {
            var buffer, cursorPosition, infixLength, startPosition;
            startPosition = selection.getBufferRange().start;
            buffer = _this.editor.getBuffer();
            selection.deleteSelectedText();
            cursorPosition = _this.editor.getCursors()[i].getBufferPosition();
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, match.suffix.length));
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, -match.prefix.length));
            infixLength = match.word.length - match.prefix.length - match.suffix.length;
            return newSelectedBufferRanges.push([startPosition, [startPosition.row, startPosition.column + infixLength]]);
          });
          _this.editor.insertText(match.word);
          return _this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
        };
      })(this));
    };

    AutocompleteView.prototype.prefixAndSuffixOfSelection = function(selection) {
      var lineRange, prefix, selectionRange, suffix, _ref2;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineTextForBufferRow(selectionRange.end.row).length]];
      _ref2 = ["", ""], prefix = _ref2[0], suffix = _ref2[1];
      this.currentBuffer.scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, prefixOffset, range, stop, suffixOffset;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          suffixOffset = selectionRange.end.column - range.end.column;
          if (range.start.isLessThan(selectionRange.start)) {
            prefix = match[0].slice(0, prefixOffset);
          }
          if (range.end.isGreaterThan(selectionRange.end)) {
            return suffix = match[0].slice(suffixOffset);
          }
        }
      });
      return {
        prefix: prefix,
        suffix: suffix
      };
    };

    AutocompleteView.prototype.allPrefixAndSuffixOfSelectionsMatch = function() {
      var prefix, suffix, _ref2;
      _ref2 = {}, prefix = _ref2.prefix, suffix = _ref2.suffix;
      return this.editor.getSelections().every((function(_this) {
        return function(selection) {
          var previousPrefix, previousSuffix, _ref3, _ref4;
          _ref3 = [prefix, suffix], previousPrefix = _ref3[0], previousSuffix = _ref3[1];
          _ref4 = _this.prefixAndSuffixOfSelection(selection), prefix = _ref4.prefix, suffix = _ref4.suffix;
          if (!((previousPrefix != null) && (previousSuffix != null))) {
            return true;
          }
          return prefix === previousPrefix && suffix === previousSuffix;
        };
      })(this));
    };

    AutocompleteView.prototype.attached = function() {
      var widestCompletion;
      this.focusFilterEditor();
      widestCompletion = parseInt(this.css('min-width')) || 0;
      this.list.find('span').each(function() {
        return widestCompletion = Math.max(widestCompletion, $(this).outerWidth());
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteView.prototype.detached = function() {};

    AutocompleteView.prototype.populateList = function() {
      return AutocompleteView.__super__.populateList.apply(this, arguments);
    };

    return AutocompleteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlL2xpYi9hdXRvY29tcGxldGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBZ0MsT0FBQSxDQUFRLE1BQVIsQ0FBaEMsRUFBQyxhQUFBLEtBQUQsRUFBUSwyQkFBQSxtQkFEUixDQUFBOztBQUFBLEVBRUEsUUFBMkIsT0FBQSxDQUFRLHNCQUFSLENBQTNCLEVBQUMsVUFBQSxDQUFELEVBQUksV0FBQSxFQUFKLEVBQVEsdUJBQUEsY0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxhQUFBLEdBQWUsSUFBZixDQUFBOztBQUFBLCtCQUNBLFVBQUEsR0FBWSxJQURaLENBQUE7O0FBQUEsK0JBRUEsUUFBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSwrQkFHQSxTQUFBLEdBQVcsTUFIWCxDQUFBOztBQUFBLCtCQUlBLDZCQUFBLEdBQStCLElBSi9CLENBQUE7O0FBQUEsK0JBS0Esc0JBQUEsR0FBd0IsSUFMeEIsQ0FBQTs7QUFBQSwrQkFNQSxXQUFBLEdBQWEsS0FOYixDQUFBOztBQUFBLCtCQVFBLFVBQUEsR0FBWSxTQUFFLE1BQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFNBQUEsTUFDWixDQUFBO0FBQUEsTUFBQSxrREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSwyQkFBVixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FGQSxDQUFBO2FBR0Es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

//# sourceURL=/Users/doot/.atom/packages/autocomplete/lib/autocomplete-view.coffee
