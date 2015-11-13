(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(_super) {
    __extends(TagListView, _super);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.data.reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_/.]+)\s(.*)/);
            _results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return _results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(_arg) {
      var annotation, tag;
      tag = _arg.tag, annotation = _arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(_arg) {
      var tag;
      tag = _arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FETCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBSmhCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDBCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxzQkFBQSxPQUFLLEVBQ3hCLENBQUE7QUFBQSxNQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxTQUFELENBQUEsRUFIVTtJQUFBLENBQVosQ0FBQTs7QUFBQSwwQkFLQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxnQkFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sR0FBZSxDQUFsQjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQWtCLGFBQTFCLENB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/tag-list-view.coffee
