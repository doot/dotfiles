(function() {
  var RefCountedTokenList, Symbol, SymbolStore, binaryIndexOf, getObjectLength, selectorsMatchScopeChain,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RefCountedTokenList = require('./ref-counted-token-list');

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Symbol = (function() {
    Symbol.prototype.count = 0;

    Symbol.prototype.metadataByPath = null;

    Symbol.prototype.cachedConfig = null;

    Symbol.prototype.type = null;

    function Symbol(text) {
      this.text = text;
      this.metadataByPath = new Map;
    }

    Symbol.prototype.getCount = function() {
      return this.count;
    };

    Symbol.prototype.bufferRowsForBuffer = function(buffer) {
      var _ref;
      return (_ref = this.metadataByPath.get(buffer)) != null ? _ref.bufferRows : void 0;
    };

    Symbol.prototype.countForBuffer = function(buffer) {
      var bufferCount, metadata, scopeChain, scopeCount, _ref;
      metadata = this.metadataByPath.get(buffer);
      bufferCount = 0;
      if (metadata != null) {
        _ref = metadata.scopeChains;
        for (scopeChain in _ref) {
          scopeCount = _ref[scopeChain];
          bufferCount += scopeCount;
        }
      }
      return bufferCount;
    };

    Symbol.prototype.clearForBuffer = function(buffer) {
      var bufferCount;
      bufferCount = this.countForBuffer(buffer);
      if (bufferCount > 0) {
        this.count -= bufferCount;
        return delete this.metadataByPath.get(buffer);
      }
    };

    Symbol.prototype.adjustBufferRows = function(buffer, adjustmentStartRow, adjustmentDelta) {
      var bufferRows, index, length, _ref;
      bufferRows = (_ref = this.metadataByPath.get(buffer)) != null ? _ref.bufferRows : void 0;
      if (bufferRows == null) {
        return;
      }
      index = binaryIndexOf(bufferRows, adjustmentStartRow);
      length = bufferRows.length;
      while (index < length) {
        bufferRows[index] += adjustmentDelta;
        index++;
      }
    };

    Symbol.prototype.addInstance = function(buffer, bufferRow, scopeChain) {
      var metadata;
      metadata = this.metadataByPath.get(buffer);
      if (metadata == null) {
        if (metadata == null) {
          metadata = {};
        }
        this.metadataByPath.set(buffer, metadata);
      }
      this.addBufferRow(buffer, bufferRow);
      if (metadata.scopeChains == null) {
        metadata.scopeChains = {};
      }
      if (metadata.scopeChains[scopeChain] == null) {
        this.type = null;
        metadata.scopeChains[scopeChain] = 0;
      }
      metadata.scopeChains[scopeChain] += 1;
      return this.count += 1;
    };

    Symbol.prototype.removeInstance = function(buffer, bufferRow, scopeChain) {
      var metadata;
      if (!(metadata = this.metadataByPath.get(buffer))) {
        return;
      }
      this.removeBufferRow(buffer, bufferRow);
      if (metadata.scopeChains[scopeChain] != null) {
        this.count -= 1;
        metadata.scopeChains[scopeChain] -= 1;
        if (metadata.scopeChains[scopeChain] === 0) {
          delete metadata.scopeChains[scopeChain];
          this.type = null;
        }
        if (getObjectLength(metadata.scopeChains) === 0) {
          return this.metadataByPath["delete"](buffer);
        }
      }
    };

    Symbol.prototype.addBufferRow = function(buffer, row) {
      var bufferRows, index, metadata;
      metadata = this.metadataByPath.get(buffer);
      if (metadata.bufferRows == null) {
        metadata.bufferRows = [];
      }
      bufferRows = metadata.bufferRows;
      index = binaryIndexOf(bufferRows, row);
      return bufferRows.splice(index, 0, row);
    };

    Symbol.prototype.removeBufferRow = function(buffer, row) {
      var bufferRows, index, metadata;
      metadata = this.metadataByPath.get(buffer);
      bufferRows = metadata.bufferRows;
      if (!bufferRows) {
        return;
      }
      index = binaryIndexOf(bufferRows, row);
      if (bufferRows[index] === row) {
        return bufferRows.splice(index, 1);
      }
    };

    Symbol.prototype.isEqualToWord = function(word) {
      return this.text === word;
    };

    Symbol.prototype.instancesForWord = function(word) {
      if (this.text === word) {
        return this.count;
      } else {
        return 0;
      }
    };

    Symbol.prototype.appliesToConfig = function(config, buffer) {
      var options, type, typePriority, _i, _len, _ref;
      if (this.cachedConfig !== config) {
        this.type = null;
      }
      if (this.type == null) {
        typePriority = 0;
        _ref = Object.keys(config);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          options = config[type];
          if (options.selectors == null) {
            continue;
          }
          this.metadataByPath.forEach((function(_this) {
            return function(_arg) {
              var scopeChain, scopeChains, _j, _len1, _ref1;
              scopeChains = _arg.scopeChains;
              _ref1 = Object.keys(scopeChains);
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                scopeChain = _ref1[_j];
                if ((!_this.type || options.typePriority > typePriority) && selectorsMatchScopeChain(options.selectors, scopeChain)) {
                  _this.type = type;
                  typePriority = options.typePriority;
                }
              }
            };
          })(this));
        }
        this.cachedConfig = config;
      }
      if (buffer != null) {
        return (this.type != null) && this.countForBuffer(buffer) > 0;
      } else {
        return this.type != null;
      }
    };

    return Symbol;

  })();

  module.exports = SymbolStore = (function() {
    SymbolStore.prototype.count = 0;

    function SymbolStore(wordRegex) {
      this.wordRegex = wordRegex;
      this.removeSymbol = __bind(this.removeSymbol, this);
      this.removeToken = __bind(this.removeToken, this);
      this.addToken = __bind(this.addToken, this);
      this.clear();
    }

    SymbolStore.prototype.clear = function(buffer) {
      var symbol, symbolKey, _ref;
      if (buffer != null) {
        _ref = this.symbolMap;
        for (symbolKey in _ref) {
          symbol = _ref[symbolKey];
          symbol.clearForBuffer(buffer);
          if (symbol.getCount() === 0) {
            delete this.symbolMap[symbolKey];
          }
        }
      } else {
        this.symbolMap = {};
      }
    };

    SymbolStore.prototype.getLength = function() {
      return this.count;
    };

    SymbolStore.prototype.getSymbol = function(symbolKey) {
      symbolKey = this.getKey(symbolKey);
      return this.symbolMap[symbolKey];
    };

    SymbolStore.prototype.symbolsForConfig = function(config, buffer, wordUnderCursor, numberOfCursors) {
      var options, symbol, symbolKey, symbols, type, _i, _len, _ref;
      symbols = [];
      _ref = Object.keys(this.symbolMap);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        symbolKey = _ref[_i];
        symbol = this.symbolMap[symbolKey];
        if (symbol.appliesToConfig(config, buffer) && (!symbol.isEqualToWord(wordUnderCursor) || symbol.instancesForWord(wordUnderCursor) > numberOfCursors)) {
          symbols.push(symbol);
        }
      }
      for (type in config) {
        options = config[type];
        if (options.suggestions) {
          symbols = symbols.concat(options.suggestions);
        }
      }
      return symbols;
    };

    SymbolStore.prototype.adjustBufferRows = function(editor, oldRange, newRange) {
      var adjustmentDelta, adjustmentStartRow, key, symbol, _ref;
      adjustmentStartRow = oldRange.end.row + 1;
      adjustmentDelta = newRange.getRowCount() - oldRange.getRowCount();
      if (adjustmentDelta === 0) {
        return;
      }
      _ref = this.symbolMap;
      for (key in _ref) {
        symbol = _ref[key];
        symbol.adjustBufferRows(editor.getBuffer(), adjustmentStartRow, adjustmentDelta);
      }
    };

    SymbolStore.prototype.addToken = function(text, scopeChain, buffer, bufferRow) {
      var matches, symbolText, _i, _len;
      matches = text.match(this.wordRegex);
      if (matches != null) {
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          symbolText = matches[_i];
          this.addSymbol(symbolText, buffer, bufferRow, scopeChain);
        }
      }
    };

    SymbolStore.prototype.removeToken = function(text, scopeChain, buffer, bufferRow) {
      var matches, symbolText, _i, _len;
      matches = text.match(this.wordRegex);
      if (matches != null) {
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          symbolText = matches[_i];
          this.removeSymbol(symbolText, buffer, bufferRow, scopeChain);
        }
      }
    };

    SymbolStore.prototype.addTokensInBufferRange = function(editor, bufferRange) {
      return this.operateOnTokensInBufferRange(editor, bufferRange, this.addToken);
    };

    SymbolStore.prototype.removeTokensInBufferRange = function(editor, bufferRange) {
      return this.operateOnTokensInBufferRange(editor, bufferRange, this.removeToken);
    };

    SymbolStore.prototype.operateOnTokensInBufferRange = function(editor, bufferRange, operatorFunc) {
      var bufferRow, iterator, token, tokenizedLine, tokenizedLines, useTokenIterator, _i, _j, _len, _ref, _ref1, _ref2;
      tokenizedLines = this.getTokenizedLines(editor);
      useTokenIterator = null;
      for (bufferRow = _i = _ref = bufferRange.start.row, _ref1 = bufferRange.end.row; _i <= _ref1; bufferRow = _i += 1) {
        tokenizedLine = tokenizedLines[bufferRow];
        if (tokenizedLine == null) {
          continue;
        }
        if (useTokenIterator == null) {
          useTokenIterator = typeof tokenizedLine.getTokenIterator === 'function';
        }
        if (useTokenIterator) {
          iterator = typeof tokenizedLine.getTokenIterator === "function" ? tokenizedLine.getTokenIterator() : void 0;
          while (iterator.next()) {
            operatorFunc(iterator.getText(), this.buildScopeChainString(iterator.getScopes()), editor.getBuffer(), bufferRow);
          }
        } else {
          _ref2 = tokenizedLine.tokens;
          for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
            token = _ref2[_j];
            operatorFunc(token.value, this.buildScopeChainString(token.scopes), editor.getBuffer(), bufferRow);
          }
        }
      }
    };


    /*
    Private Methods
     */

    SymbolStore.prototype.addSymbol = function(symbolText, buffer, bufferRow, scopeChain) {
      var symbol, symbolKey;
      symbolKey = this.getKey(symbolText);
      symbol = this.symbolMap[symbolKey];
      if (symbol == null) {
        this.symbolMap[symbolKey] = symbol = new Symbol(symbolText);
        this.count += 1;
      }
      return symbol.addInstance(buffer, bufferRow, scopeChain);
    };

    SymbolStore.prototype.removeSymbol = function(symbolText, buffer, bufferRow, scopeChain) {
      var symbol, symbolKey;
      symbolKey = this.getKey(symbolText);
      symbol = this.symbolMap[symbolKey];
      if (symbol != null) {
        symbol.removeInstance(buffer, bufferRow, scopeChain);
        if (symbol.getCount() === 0) {
          delete this.symbolMap[symbolKey];
          return this.count -= 1;
        }
      }
    };

    SymbolStore.prototype.getTokenizedLines = function(editor) {
      return editor.displayBuffer.tokenizedBuffer.tokenizedLines;
    };

    SymbolStore.prototype.buildScopeChainString = function(scopes) {
      return '.' + scopes.join(' .');
    };

    SymbolStore.prototype.getKey = function(value) {
      return value + '$$';
    };

    return SymbolStore;

  })();

  getObjectLength = function(object) {
    var count, k, v;
    count = 0;
    for (k in object) {
      v = object[k];
      count += 1;
    }
    return count;
  };

  binaryIndexOf = function(array, searchElement) {
    var currentElement, currentIndex, maxIndex, minIndex;
    minIndex = 0;
    maxIndex = array.length - 1;
    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = array[currentIndex];
      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      } else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }
    return minIndex;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3N5bWJvbC1zdG9yZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0dBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSwwQkFBUixDQUF0QixDQUFBOztBQUFBLEVBQ0MsMkJBQTRCLE9BQUEsQ0FBUSxpQkFBUixFQUE1Qix3QkFERCxDQUFBOztBQUFBLEVBR007QUFDSixxQkFBQSxLQUFBLEdBQU8sQ0FBUCxDQUFBOztBQUFBLHFCQUNBLGNBQUEsR0FBZ0IsSUFEaEIsQ0FBQTs7QUFBQSxxQkFFQSxZQUFBLEdBQWMsSUFGZCxDQUFBOztBQUFBLHFCQUlBLElBQUEsR0FBTSxJQUpOLENBQUE7O0FBTWEsSUFBQSxnQkFBRSxJQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxPQUFBLElBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsR0FBQSxDQUFBLEdBQWxCLENBRFc7SUFBQSxDQU5iOztBQUFBLHFCQVNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsTUFBSjtJQUFBLENBVFYsQ0FBQTs7QUFBQSxxQkFXQSxtQkFBQSxHQUFxQixTQUFDLE1BQUQsR0FBQTtBQUNuQixVQUFBLElBQUE7b0VBQTJCLENBQUUsb0JBRFY7SUFBQSxDQVhyQixDQUFBOztBQUFBLHFCQWNBLGNBQUEsR0FBZ0IsU0FBQyxNQUFELEdBQUE7QUFDZCxVQUFBLG1EQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGNBQWMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixDQUFYLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxDQURkLENBQUE7QUFFQSxNQUFBLElBQUcsZ0JB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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/symbol-store.coffee
