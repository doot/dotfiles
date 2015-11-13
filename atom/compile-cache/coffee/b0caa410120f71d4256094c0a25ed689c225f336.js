(function() {
  var CompositeDisposable, Selector, SymbolProvider, SymbolStore, fuzzaldrin, fuzzaldrinPlus, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  fuzzaldrin = require('fuzzaldrin');

  fuzzaldrinPlus = require('fuzzaldrin-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  Selector = require('selector-kit').Selector;

  SymbolStore = require('./symbol-store');

  module.exports = SymbolProvider = (function() {
    SymbolProvider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    SymbolProvider.prototype.beginningOfLineWordRegex = /^\w*[a-zA-Z_-]+\w*\b/g;

    SymbolProvider.prototype.endOfLineWordRegex = /\b\w*[a-zA-Z_-]+\w*$/g;

    SymbolProvider.prototype.symbolStore = null;

    SymbolProvider.prototype.editor = null;

    SymbolProvider.prototype.buffer = null;

    SymbolProvider.prototype.changeUpdateDelay = 300;

    SymbolProvider.prototype.selector = '*';

    SymbolProvider.prototype.inclusionPriority = 0;

    SymbolProvider.prototype.suggestionPriority = 0;

    SymbolProvider.prototype.watchedBuffers = null;

    SymbolProvider.prototype.config = null;

    SymbolProvider.prototype.defaultConfig = {
      "class": {
        selector: '.class.name, .inherited-class, .instance.type',
        typePriority: 4
      },
      "function": {
        selector: '.function.name',
        typePriority: 3
      },
      variable: {
        selector: '.variable',
        typePriority: 2
      },
      '': {
        selector: '.source',
        typePriority: 1
      }
    };

    function SymbolProvider() {
      this.buildSymbolList = __bind(this.buildSymbolList, this);
      this.buildWordListOnNextTick = __bind(this.buildWordListOnNextTick, this);
      this.getSuggestions = __bind(this.getSuggestions, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.watchEditor = __bind(this.watchEditor, this);
      this.dispose = __bind(this.dispose, this);
      this.watchedBuffers = new WeakMap;
      this.symbolStore = new SymbolStore(this.wordRegex);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('autocomplete-plus.minimumWordLength', (function(_this) {
        return function(minimumWordLength) {
          _this.minimumWordLength = minimumWordLength;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.includeCompletionsFromAllBuffers', (function(_this) {
        return function(includeCompletionsFromAllBuffers) {
          _this.includeCompletionsFromAllBuffers = includeCompletionsFromAllBuffers;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.useAlternateScoring', (function(_this) {
        return function(useAlternateScoring) {
          _this.useAlternateScoring = useAlternateScoring;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.useLocalityBonus', (function(_this) {
        return function(useLocalityBonus) {
          _this.useLocalityBonus = useLocalityBonus;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.subscriptions.add(atom.workspace.observeTextEditors(this.watchEditor));
    }

    SymbolProvider.prototype.dispose = function() {
      return this.subscriptions.dispose();
    };

    SymbolProvider.prototype.watchEditor = function(editor) {
      var buffer, bufferEditors, bufferSubscriptions, editorSubscriptions;
      buffer = editor.getBuffer();
      editorSubscriptions = new CompositeDisposable;
      editorSubscriptions.add(editor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.buildWordListOnNextTick(editor);
        };
      })(this)));
      editorSubscriptions.add(editor.onDidDestroy((function(_this) {
        return function() {
          var editors, index;
          index = _this.getWatchedEditorIndex(editor);
          editors = _this.watchedBuffers.get(editor.getBuffer());
          if (index > -1) {
            editors.splice(index, 1);
          }
          return editorSubscriptions.dispose();
        };
      })(this)));
      if (bufferEditors = this.watchedBuffers.get(buffer)) {
        return bufferEditors.push(editor);
      } else {
        bufferSubscriptions = new CompositeDisposable;
        bufferSubscriptions.add(buffer.onWillChange((function(_this) {
          return function(_arg) {
            var editors, newRange, oldRange;
            oldRange = _arg.oldRange, newRange = _arg.newRange;
            editors = _this.watchedBuffers.get(buffer);
            if (editors && editors.length && (editor = editors[0])) {
              _this.symbolStore.removeTokensInBufferRange(editor, oldRange);
              return _this.symbolStore.adjustBufferRows(editor, oldRange, newRange);
            }
          };
        })(this)));
        bufferSubscriptions.add(buffer.onDidChange((function(_this) {
          return function(_arg) {
            var editors, newRange;
            newRange = _arg.newRange;
            editors = _this.watchedBuffers.get(buffer);
            if (editors && editors.length && (editor = editors[0])) {
              return _this.symbolStore.addTokensInBufferRange(editor, newRange);
            }
          };
        })(this)));
        bufferSubscriptions.add(buffer.onDidDestroy((function(_this) {
          return function() {
            _this.symbolStore.clear(buffer);
            bufferSubscriptions.dispose();
            return _this.watchedBuffers["delete"](buffer);
          };
        })(this)));
        this.watchedBuffers.set(buffer, [editor]);
        return this.buildWordListOnNextTick(editor);
      }
    };

    SymbolProvider.prototype.isWatchingEditor = function(editor) {
      return this.getWatchedEditorIndex(editor) > -1;
    };

    SymbolProvider.prototype.isWatchingBuffer = function(buffer) {
      return this.watchedBuffers.get(buffer) != null;
    };

    SymbolProvider.prototype.getWatchedEditorIndex = function(editor) {
      var editors;
      if (editors = this.watchedBuffers.get(editor.getBuffer())) {
        return editors.indexOf(editor);
      } else {
        return -1;
      }
    };

    SymbolProvider.prototype.updateCurrentEditor = function(currentPaneItem) {
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      this.editor = null;
      if (this.paneItemIsValid(currentPaneItem)) {
        return this.editor = currentPaneItem;
      }
    };

    SymbolProvider.prototype.buildConfigIfScopeChanged = function(_arg) {
      var editor, scopeDescriptor;
      editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor;
      if (!this.scopeDescriptorsEqual(this.configScopeDescriptor, scopeDescriptor)) {
        this.buildConfig(scopeDescriptor);
        return this.configScopeDescriptor = scopeDescriptor;
      }
    };

    SymbolProvider.prototype.buildConfig = function(scopeDescriptor) {
      var addedConfigEntry, allConfigEntries, legacyCompletions, value, _i, _j, _len, _len1;
      this.config = {};
      legacyCompletions = this.settingsForScopeDescriptor(scopeDescriptor, 'editor.completions');
      allConfigEntries = this.settingsForScopeDescriptor(scopeDescriptor, 'autocomplete.symbols');
      allConfigEntries.reverse();
      for (_i = 0, _len = legacyCompletions.length; _i < _len; _i++) {
        value = legacyCompletions[_i].value;
        if (Array.isArray(value) && value.length) {
          this.addLegacyConfigEntry(value);
        }
      }
      addedConfigEntry = false;
      for (_j = 0, _len1 = allConfigEntries.length; _j < _len1; _j++) {
        value = allConfigEntries[_j].value;
        if (!Array.isArray(value) && typeof value === 'object') {
          this.addConfigEntry(value);
          addedConfigEntry = true;
        }
      }
      if (!addedConfigEntry) {
        return this.addConfigEntry(this.defaultConfig);
      }
    };

    SymbolProvider.prototype.addLegacyConfigEntry = function(suggestions) {
      var suggestion, _base;
      suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
          suggestion = suggestions[_i];
          _results.push({
            text: suggestion,
            type: 'builtin'
          });
        }
        return _results;
      })();
      if ((_base = this.config).builtin == null) {
        _base.builtin = {
          suggestions: []
        };
      }
      return this.config.builtin.suggestions = this.config.builtin.suggestions.concat(suggestions);
    };

    SymbolProvider.prototype.addConfigEntry = function(config) {
      var options, suggestions, type, _base, _ref;
      for (type in config) {
        options = config[type];
        if ((_base = this.config)[type] == null) {
          _base[type] = {};
        }
        if (options.selector != null) {
          this.config[type].selectors = Selector.create(options.selector);
        }
        this.config[type].typePriority = (_ref = options.typePriority) != null ? _ref : 1;
        this.config[type].wordRegex = this.wordRegex;
        suggestions = this.sanitizeSuggestionsFromConfig(options.suggestions, type);
        if ((suggestions != null) && suggestions.length) {
          this.config[type].suggestions = suggestions;
        }
      }
    };

    SymbolProvider.prototype.sanitizeSuggestionsFromConfig = function(suggestions, type) {
      var sanitizedSuggestions, suggestion, _i, _len;
      if ((suggestions != null) && Array.isArray(suggestions)) {
        sanitizedSuggestions = [];
        for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
          suggestion = suggestions[_i];
          if (typeof suggestion === 'string') {
            sanitizedSuggestions.push({
              text: suggestion,
              type: type
            });
          } else if (typeof suggestions[0] === 'object' && ((suggestion.text != null) || (suggestion.snippet != null))) {
            suggestion = _.clone(suggestion);
            if (suggestion.type == null) {
              suggestion.type = type;
            }
            sanitizedSuggestions.push(suggestion);
          }
        }
        return sanitizedSuggestions;
      } else {
        return null;
      }
    };

    SymbolProvider.prototype.uniqueFilter = function(completion) {
      return completion.text;
    };

    SymbolProvider.prototype.paneItemIsValid = function(paneItem) {
      if (paneItem == null) {
        return false;
      }
      return paneItem.getText != null;
    };


    /*
    Section: Suggesting Completions
     */

    SymbolProvider.prototype.getSuggestions = function(options) {
      var buffer, bufferPosition, cursor, editor, numberOfWordsMatchingPrefix, prefix, symbolList, word, wordUnderCursor, words, _i, _j, _len, _len1, _ref, _ref1;
      prefix = (_ref = options.prefix) != null ? _ref.trim() : void 0;
      if (!((prefix != null ? prefix.length : void 0) && (prefix != null ? prefix.length : void 0) >= this.minimumWordLength)) {
        return;
      }
      if (!this.symbolStore.getLength()) {
        return;
      }
      this.buildConfigIfScopeChanged(options);
      editor = options.editor, prefix = options.prefix, bufferPosition = options.bufferPosition;
      numberOfWordsMatchingPrefix = 1;
      wordUnderCursor = this.wordAtBufferPosition(editor, bufferPosition);
      _ref1 = editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        if (cursor === editor.getLastCursor()) {
          continue;
        }
        word = this.wordAtBufferPosition(editor, cursor.getBufferPosition());
        if (word === wordUnderCursor) {
          numberOfWordsMatchingPrefix += 1;
        }
      }
      buffer = this.includeCompletionsFromAllBuffers ? null : this.editor.getBuffer();
      symbolList = this.symbolStore.symbolsForConfig(this.config, buffer, wordUnderCursor, numberOfWordsMatchingPrefix);
      words = atom.config.get("autocomplete-plus.strictMatching") ? symbolList.filter(function(match) {
        var _ref2;
        return ((_ref2 = match.text) != null ? _ref2.indexOf(options.prefix) : void 0) === 0;
      }) : this.fuzzyFilter(symbolList, this.editor.getBuffer(), options);
      for (_j = 0, _len1 = words.length; _j < _len1; _j++) {
        word = words[_j];
        word.replacementPrefix = options.prefix;
      }
      return words;
    };

    SymbolProvider.prototype.wordAtBufferPosition = function(editor, bufferPosition) {
      var lineFromPosition, lineToPosition, prefix, suffix, _ref, _ref1;
      lineToPosition = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      prefix = ((_ref = lineToPosition.match(this.endOfLineWordRegex)) != null ? _ref[0] : void 0) || '';
      lineFromPosition = editor.getTextInRange([bufferPosition, [bufferPosition.row, Infinity]]);
      suffix = ((_ref1 = lineFromPosition.match(this.beginningOfLineWordRegex)) != null ? _ref1[0] : void 0) || '';
      return prefix + suffix;
    };

    SymbolProvider.prototype.fuzzyFilter = function(symbolList, buffer, _arg) {
      var bufferPosition, candidates, fuzzaldrinProvider, index, prefix, prefixCache, results, score, symbol, text, _i, _j, _len, _len1, _ref;
      bufferPosition = _arg.bufferPosition, prefix = _arg.prefix;
      candidates = [];
      if (this.useAlternateScoring) {
        fuzzaldrinProvider = fuzzaldrinPlus;
        prefixCache = fuzzaldrinPlus.prepQuery(prefix);
      } else {
        fuzzaldrinProvider = fuzzaldrin;
        prefixCache = null;
      }
      for (_i = 0, _len = symbolList.length; _i < _len; _i++) {
        symbol = symbolList[_i];
        text = symbol.snippet || symbol.text;
        if (!(text && prefix[0].toLowerCase() === text[0].toLowerCase())) {
          continue;
        }
        score = fuzzaldrinProvider.score(text, prefix, prefixCache);
        if (this.useLocalityBonus) {
          score *= this.getLocalityScore(bufferPosition, typeof symbol.bufferRowsForBuffer === "function" ? symbol.bufferRowsForBuffer(buffer) : void 0);
        }
        if (score > 0) {
          candidates.push({
            symbol: symbol,
            score: score
          });
        }
      }
      candidates.sort(this.symbolSortReverseIterator);
      results = [];
      for (index = _j = 0, _len1 = candidates.length; _j < _len1; index = ++_j) {
        _ref = candidates[index], symbol = _ref.symbol, score = _ref.score;
        if (index === 20) {
          break;
        }
        results.push(symbol);
      }
      return results;
    };

    SymbolProvider.prototype.symbolSortReverseIterator = function(a, b) {
      return b.score - a.score;
    };

    SymbolProvider.prototype.getLocalityScore = function(bufferPosition, bufferRowsContainingSymbol) {
      var bufferRow, locality, rowDifference, _i, _len;
      if (bufferRowsContainingSymbol != null) {
        rowDifference = Number.MAX_VALUE;
        for (_i = 0, _len = bufferRowsContainingSymbol.length; _i < _len; _i++) {
          bufferRow = bufferRowsContainingSymbol[_i];
          rowDifference = Math.min(rowDifference, bufferRow - bufferPosition.row);
        }
        locality = this.computeLocalityModifier(rowDifference);
        return locality;
      } else {
        return 1;
      }
    };

    SymbolProvider.prototype.computeLocalityModifier = function(rowDifference) {
      var fade;
      rowDifference = Math.abs(rowDifference);
      if (this.useAlternateScoring) {
        fade = 25.0 / (25.0 + rowDifference);
        return 1.0 + fade * fade;
      } else {
        return 1 + Math.max(-Math.pow(.2 * rowDifference - 3, 3) / 25 + .5, 0);
      }
    };

    SymbolProvider.prototype.settingsForScopeDescriptor = function(scopeDescriptor, keyPath) {
      return atom.config.getAll(keyPath, {
        scope: scopeDescriptor
      });
    };


    /*
    Section: Word List Building
     */

    SymbolProvider.prototype.buildWordListOnNextTick = function(editor) {
      return _.defer((function(_this) {
        return function() {
          return _this.buildSymbolList(editor);
        };
      })(this));
    };

    SymbolProvider.prototype.buildSymbolList = function(editor) {
      if (!(editor != null ? editor.isAlive() : void 0)) {
        return;
      }
      this.symbolStore.clear(editor.getBuffer());
      return this.symbolStore.addTokensInBufferRange(editor, editor.getBuffer().getRange());
    };

    SymbolProvider.prototype.scopeDescriptorsEqual = function(a, b) {
      var arrayA, arrayB, i, scope, _i, _len;
      if (a === b) {
        return true;
      }
      if (!((a != null) && (b != null))) {
        return false;
      }
      arrayA = a.getScopesArray();
      arrayB = b.getScopesArray();
      if (arrayA.length !== arrayB.length) {
        return false;
      }
      for (i = _i = 0, _len = arrayA.length; _i < _len; i = ++_i) {
        scope = arrayA[i];
        if (scope !== arrayB[i]) {
          return false;
        }
      }
      return true;
    };

    return SymbolProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3N5bWJvbC1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEseUZBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGlCQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQyxzQkFBd0IsT0FBQSxDQUFRLE1BQVIsRUFBeEIsbUJBSEQsQ0FBQTs7QUFBQSxFQUlDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQUpELENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBTGQsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxTQUFBLEdBQVcsd0JBQVgsQ0FBQTs7QUFBQSw2QkFDQSx3QkFBQSxHQUEwQix1QkFEMUIsQ0FBQTs7QUFBQSw2QkFFQSxrQkFBQSxHQUFvQix1QkFGcEIsQ0FBQTs7QUFBQSw2QkFHQSxXQUFBLEdBQWEsSUFIYixDQUFBOztBQUFBLDZCQUlBLE1BQUEsR0FBUSxJQUpSLENBQUE7O0FBQUEsNkJBS0EsTUFBQSxHQUFRLElBTFIsQ0FBQTs7QUFBQSw2QkFNQSxpQkFBQSxHQUFtQixHQU5uQixDQUFBOztBQUFBLDZCQVFBLFFBQUEsR0FBVSxHQVJWLENBQUE7O0FBQUEsNkJBU0EsaUJBQUEsR0FBbUIsQ0FUbkIsQ0FBQTs7QUFBQSw2QkFVQSxrQkFBQSxHQUFvQixDQVZwQixDQUFBOztBQUFBLDZCQVlBLGNBQUEsR0FBZ0IsSUFaaEIsQ0FBQTs7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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/symbol-provider.coffee
