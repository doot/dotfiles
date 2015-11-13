(function() {
  var CompositeDisposable, Emitter, SuggestionList, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = SuggestionList = (function() {
    SuggestionList.prototype.wordPrefixRegex = /^[\w-]/;

    function SuggestionList() {
      this.destroyOverlay = __bind(this.destroyOverlay, this);
      this.hide = __bind(this.hide, this);
      this.showAtCursorPosition = __bind(this.showAtCursorPosition, this);
      this.showAtBeginningOfPrefix = __bind(this.showAtBeginningOfPrefix, this);
      this.show = __bind(this.show, this);
      this.confirmSelection = __bind(this.confirmSelection, this);
      this.confirm = __bind(this.confirm, this);
      this.cancel = __bind(this.cancel, this);
      this.active = false;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor.autocomplete-active', {
        'autocomplete-plus:confirm': this.confirmSelection,
        'autocomplete-plus:cancel': this.cancel
      }));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.useCoreMovementCommands', (function(_this) {
        return function() {
          return _this.bindToMovementCommands();
        };
      })(this)));
    }

    SuggestionList.prototype.bindToMovementCommands = function() {
      var commandNamespace, commands, useCoreMovementCommands, _ref1;
      useCoreMovementCommands = atom.config.get('autocomplete-plus.useCoreMovementCommands');
      commandNamespace = useCoreMovementCommands ? 'core' : 'autocomplete-plus';
      commands = {};
      commands["" + commandNamespace + ":move-up"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPrevious();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-down"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectNext();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":page-up"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPageUp();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":page-down"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectPageDown();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-to-top"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectTop();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      commands["" + commandNamespace + ":move-to-bottom"] = (function(_this) {
        return function(event) {
          var _ref1;
          if (_this.isActive() && ((_ref1 = _this.items) != null ? _ref1.length : void 0) > 1) {
            _this.selectBottom();
            return event.stopImmediatePropagation();
          }
        };
      })(this);
      if ((_ref1 = this.movementCommandSubscriptions) != null) {
        _ref1.dispose();
      }
      this.movementCommandSubscriptions = new CompositeDisposable;
      return this.movementCommandSubscriptions.add(atom.commands.add('atom-text-editor.autocomplete-active', commands));
    };

    SuggestionList.prototype.addKeyboardInteraction = function() {
      var completionKey, keys;
      this.removeKeyboardInteraction();
      completionKey = atom.config.get('autocomplete-plus.confirmCompletion') || '';
      keys = {};
      if (completionKey.indexOf('tab') > -1) {
        keys['tab'] = 'autocomplete-plus:confirm';
      }
      if (completionKey.indexOf('enter') > -1) {
        keys['enter'] = 'autocomplete-plus:confirm';
      }
      this.keymaps = atom.keymaps.add('atom-text-editor.autocomplete-active', {
        'atom-text-editor.autocomplete-active': keys
      });
      return this.subscriptions.add(this.keymaps);
    };

    SuggestionList.prototype.removeKeyboardInteraction = function() {
      var _ref1;
      if ((_ref1 = this.keymaps) != null) {
        _ref1.dispose();
      }
      this.keymaps = null;
      return this.subscriptions.remove(this.keymaps);
    };


    /*
    Section: Event Triggers
     */

    SuggestionList.prototype.cancel = function() {
      return this.emitter.emit('did-cancel');
    };

    SuggestionList.prototype.confirm = function(match) {
      return this.emitter.emit('did-confirm', match);
    };

    SuggestionList.prototype.confirmSelection = function() {
      return this.emitter.emit('did-confirm-selection');
    };

    SuggestionList.prototype.selectNext = function() {
      return this.emitter.emit('did-select-next');
    };

    SuggestionList.prototype.selectPrevious = function() {
      return this.emitter.emit('did-select-previous');
    };

    SuggestionList.prototype.selectPageUp = function() {
      return this.emitter.emit('did-select-page-up');
    };

    SuggestionList.prototype.selectPageDown = function() {
      return this.emitter.emit('did-select-page-down');
    };

    SuggestionList.prototype.selectTop = function() {
      return this.emitter.emit('did-select-top');
    };

    SuggestionList.prototype.selectBottom = function() {
      return this.emitter.emit('did-select-bottom');
    };


    /*
    Section: Events
     */

    SuggestionList.prototype.onDidConfirmSelection = function(fn) {
      return this.emitter.on('did-confirm-selection', fn);
    };

    SuggestionList.prototype.onDidConfirm = function(fn) {
      return this.emitter.on('did-confirm', fn);
    };

    SuggestionList.prototype.onDidSelectNext = function(fn) {
      return this.emitter.on('did-select-next', fn);
    };

    SuggestionList.prototype.onDidSelectPrevious = function(fn) {
      return this.emitter.on('did-select-previous', fn);
    };

    SuggestionList.prototype.onDidSelectPageUp = function(fn) {
      return this.emitter.on('did-select-page-up', fn);
    };

    SuggestionList.prototype.onDidSelectPageDown = function(fn) {
      return this.emitter.on('did-select-page-down', fn);
    };

    SuggestionList.prototype.onDidSelectTop = function(fn) {
      return this.emitter.on('did-select-top', fn);
    };

    SuggestionList.prototype.onDidSelectBottom = function(fn) {
      return this.emitter.on('did-select-bottom', fn);
    };

    SuggestionList.prototype.onDidCancel = function(fn) {
      return this.emitter.on('did-cancel', fn);
    };

    SuggestionList.prototype.onDidDispose = function(fn) {
      return this.emitter.on('did-dispose', fn);
    };

    SuggestionList.prototype.onDidChangeItems = function(fn) {
      return this.emitter.on('did-change-items', fn);
    };

    SuggestionList.prototype.isActive = function() {
      return this.active;
    };

    SuggestionList.prototype.show = function(editor, options) {
      var followRawPrefix, item, prefix, _i, _len, _ref1;
      if (atom.config.get('autocomplete-plus.suggestionListFollows') === 'Cursor') {
        return this.showAtCursorPosition(editor, options);
      } else {
        prefix = options.prefix;
        followRawPrefix = false;
        _ref1 = this.items;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (item.replacementPrefix != null) {
            prefix = item.replacementPrefix.trim();
            followRawPrefix = true;
            break;
          }
        }
        return this.showAtBeginningOfPrefix(editor, prefix, followRawPrefix);
      }
    };

    SuggestionList.prototype.showAtBeginningOfPrefix = function(editor, prefix, followRawPrefix) {
      var bufferPosition, marker, _ref1;
      if (followRawPrefix == null) {
        followRawPrefix = false;
      }
      if (editor == null) {
        return;
      }
      bufferPosition = editor.getCursorBufferPosition();
      if (followRawPrefix || this.wordPrefixRegex.test(prefix)) {
        bufferPosition = bufferPosition.translate([0, -prefix.length]);
      }
      if (this.active) {
        if (!bufferPosition.isEqual(this.displayBufferPosition)) {
          this.displayBufferPosition = bufferPosition;
          return (_ref1 = this.suggestionMarker) != null ? _ref1.setBufferRange([bufferPosition, bufferPosition]) : void 0;
        }
      } else {
        this.destroyOverlay();
        this.displayBufferPosition = bufferPosition;
        marker = this.suggestionMarker = editor.markBufferRange([bufferPosition, bufferPosition]);
        this.overlayDecoration = editor.decorateMarker(marker, {
          type: 'overlay',
          item: this,
          position: 'tail'
        });
        this.addKeyboardInteraction();
        return this.active = true;
      }
    };

    SuggestionList.prototype.showAtCursorPosition = function(editor) {
      var marker, _ref1;
      if (this.active || (editor == null)) {
        return;
      }
      this.destroyOverlay();
      if (marker = (_ref1 = editor.getLastCursor()) != null ? _ref1.getMarker() : void 0) {
        this.overlayDecoration = editor.decorateMarker(marker, {
          type: 'overlay',
          item: this
        });
        this.addKeyboardInteraction();
        return this.active = true;
      }
    };

    SuggestionList.prototype.hide = function() {
      if (!this.active) {
        return;
      }
      this.destroyOverlay();
      this.removeKeyboardInteraction();
      return this.active = false;
    };

    SuggestionList.prototype.destroyOverlay = function() {
      var _ref1;
      if (this.suggestionMarker != null) {
        this.suggestionMarker.destroy();
      } else {
        if ((_ref1 = this.overlayDecoration) != null) {
          _ref1.destroy();
        }
      }
      this.suggestionMarker = void 0;
      return this.overlayDecoration = void 0;
    };

    SuggestionList.prototype.changeItems = function(items) {
      this.items = items;
      return this.emitter.emit('did-change-items', items);
    };

    SuggestionList.prototype.dispose = function() {
      var _ref1;
      this.subscriptions.dispose();
      if ((_ref1 = this.movementCommandSubscriptions) != null) {
        _ref1.dispose();
      }
      this.emitter.emit('did-dispose');
      return this.emitter.dispose();
    };

    return SuggestionList;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3N1Z2dlc3Rpb24tbGlzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxlQUFBLEdBQWlCLFFBQWpCLENBQUE7O0FBRWEsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsNkRBQUEsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSx5RUFBQSxDQUFBO0FBQUEsK0VBQUEsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFGakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixzQ0FBbEIsRUFDakI7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLElBQUMsQ0FBQSxnQkFBOUI7QUFBQSxRQUNBLDBCQUFBLEVBQTRCLElBQUMsQ0FBQSxNQUQ3QjtPQURpQixDQUFuQixDQUhBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Is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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/suggestion-list.coffee
