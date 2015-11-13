(function() {
  var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzyFilter = require('../models/fuzzy').filter;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, SelectListView = _ref.SelectListView;

  module.exports = SelectListMultipleView = (function(_super) {
    var selectedItems;

    __extends(SelectListMultipleView, _super);

    function SelectListMultipleView() {
      return SelectListMultipleView.__super__.constructor.apply(this, arguments);
    }

    selectedItems = [];

    SelectListMultipleView.prototype.initialize = function() {
      SelectListMultipleView.__super__.initialize.apply(this, arguments);
      selectedItems = [];
      this.list.addClass('mark-active');
      this.on('mousedown', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.list[0] || $(target).hasClass('btn')) {
            return false;
          }
        };
      })(this));
      this.on('keypress', (function(_this) {
        return function(_arg) {
          var keyCode;
          keyCode = _arg.keyCode;
          if (keyCode === 13) {
            return _this.complete();
          }
        };
      })(this));
      return this.addButtons();
    };

    SelectListMultipleView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-complete-button'
              }, 'Confirm');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-complete-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectListMultipleView.prototype.confirmSelection = function() {
      var item, viewItem;
      item = this.getSelectedItem();
      viewItem = this.getSelectedItemView();
      if (viewItem != null) {
        return this.confirmed(item, viewItem);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.confirmed = function(item, viewItem) {
      if (__indexOf.call(selectedItems, item) >= 0) {
        selectedItems = selectedItems.filter(function(i) {
          return i !== item;
        });
        return viewItem.removeClass('active');
      } else {
        selectedItems.push(item);
        return viewItem.addClass('active');
      }
    };

    SelectListMultipleView.prototype.complete = function() {
      if (selectedItems.length > 0) {
        return this.completed(selectedItems);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.populateList = function() {
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
        filteredItems = fuzzyFilter(filterQuery, this.items, options);
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
          if (__indexOf.call(selectedItems, item) >= 0) {
            itemView.addClass('active');
          }
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    SelectListMultipleView.prototype.viewForItem = function(item, matchedStr) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListMultipleView.prototype.completed = function(items) {
      throw new Error("Subclass must implement a completed(items) method");
    };

    return SelectListMultipleView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7O3lKQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDLE1BQXpDLENBQUE7O0FBQUEsRUFDQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsRUFBYyxzQkFBQSxjQURkLENBQUE7O0FBQUEsRUFrQ0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLFFBQUEsYUFBQTs7QUFBQSw2Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFBLEdBQWdCLEVBQWhCLENBQUE7O0FBQUEscUNBS0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsd0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsRUFEaEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWUsYUFBZixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxFQUFELENBQUksV0FBSixFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDZixjQUFBLE1BQUE7QUFBQSxVQURpQixTQUFELEtBQUMsTUFDakIsQ0FBQTtBQUFBLFVBQUEsSUFBUyxNQUFBLEtBQVUsS0FBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQWhCLElBQXNCLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLEtBQW5CLENBQS9CO21CQUFBLE1BQUE7V0FEZTtRQUFBLEVB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/select-list-multiple-view.coffee
