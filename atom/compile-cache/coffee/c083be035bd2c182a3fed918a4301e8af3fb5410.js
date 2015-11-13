(function() {
  var $, $$, GitInit, GitPaletteView, GitPlusCommands, SelectListView, fuzzy, git, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  GitPlusCommands = require('../git-plus-commands');

  GitInit = require('../models/git-init');

  fuzzy = require('../models/fuzzy').filter;

  module.exports = GitPaletteView = (function(_super) {
    __extends(GitPaletteView, _super);

    function GitPaletteView() {
      return GitPaletteView.__super__.constructor.apply(this, arguments);
    }

    GitPaletteView.prototype.initialize = function() {
      GitPaletteView.__super__.initialize.apply(this, arguments);
      this.addClass('git-palette');
      return this.toggle();
    };

    GitPaletteView.prototype.getFilterKey = function() {
      return 'description';
    };

    GitPaletteView.prototype.cancelled = function() {
      return this.hide();
    };

    GitPaletteView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    GitPaletteView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.commandElement = this.previouslyFocusedElement;
      } else {
        this.commandElement = atom.views.getView(atom.workspace);
      }
      this.keyBindings = atom.keymaps.findKeyBindings({
        target: this.commandElement[0]
      });
      return GitPlusCommands().then((function(_this) {
        return function(commands) {
          commands = commands.map(function(c) {
            return {
              name: c[0],
              description: c[1],
              func: c[2]
            };
          });
          commands = _.sortBy(commands, 'name');
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          var commands;
          (commands = []).push({
            name: 'git-plus:init',
            description: 'Init',
            func: function() {
              return GitInit();
            }
          });
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this));
    };

    GitPaletteView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, options, _i, _ref1, _ref2, _ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          pre: '<span class="text-warning" style="font-weight:bold">',
          post: "</span>",
          extract: (function(_this) {
            return function(el) {
              if (_this.getFilterKey() != null) {
                return el[_this.getFilterKey()];
              } else {
                return el;
              }
            };
          })(this)
        };
        filteredItems = fuzzy(filterQuery, this.items, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = (_ref2 = filteredItems[i].original) != null ? _ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (_ref3 = filteredItems[i].string) != null ? _ref3 : null));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    GitPaletteView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    GitPaletteView.prototype.viewForItem = function(_arg, matchedStr) {
      var description, name;
      name = _arg.name, description = _arg.description;
      return $$(function() {
        return this.li({
          "class": 'command',
          'data-command-name': name
        }, (function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(description);
            }
          };
        })(this));
      });
    };

    GitPaletteView.prototype.confirmed = function(_arg) {
      var func;
      func = _arg.func;
      this.cancel();
      return func();
    };

    return GitPaletteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2dpdC1wYWxldHRlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBRFIsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUMsTUFMbkMsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsZ0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsYUFBVixDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsNkJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLGNBRFk7SUFBQSxDQUxkLENBQUE7O0FBQUEsNkJBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtJQUFBLENBUlgsQ0FBQTs7QUFBQSw2QkFV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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/git-palette-view.coffee
