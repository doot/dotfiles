(function() {
  var $, FavView, SelectListView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, SelectListView = _ref.SelectListView;

  $ = require('jquery');

  FavView = (function(_super) {
    __extends(FavView, _super);

    function FavView() {
      return FavView.__super__.constructor.apply(this, arguments);
    }

    FavView.prototype.initialize = function(items) {
      this.items = items;
      FavView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.setItems(items);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    FavView.prototype.viewForItem = function(item) {
      var _ref1;
      return "<li><img src='" + item.favIcon + "'width='20' height='20' >&nbsp; &nbsp; " + ((_ref1 = item.title) != null ? _ref1.slice(0, 31) : void 0) + "</li>";
    };

    FavView.prototype.confirmed = function(item) {
      atom.workspace.open(item.uri, {
        split: 'left',
        searchAllPanes: true
      });
      return this.parent().remove();
    };

    FavView.prototype.cancelled = function() {
      return this.parent().remove();
    };

    FavView.prototype.getFilterKey = function() {
      return "title";
    };

    return FavView;

  })(SelectListView);

  module.exports = FavView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL2xpYi9mYXYtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXdCLE9BQUEsQ0FBUSxzQkFBUixDQUF4QixFQUFDLFlBQUEsSUFBRCxFQUFNLHNCQUFBLGNBQU4sQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUZKLENBQUE7O0FBQUEsRUFHTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTtBQUFBLE1BQUEseUNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQVYsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FGQSxDQUFBOztRQUdBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFLLElBQUw7U0FBN0I7T0FIVjtBQUFBLE1BSUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFOVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxzQkFRQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLEtBQUE7YUFBQyxnQkFBQSxHQUFnQixJQUFJLENBQUMsT0FBckIsR0FBNkIseUNBQTdCLEdBQXFFLHFDQUFhLHNCQUFiLENBQXJFLEdBQXlGLFFBRGpGO0lBQUEsQ0FSYixDQUFBOztBQUFBLHNCQVdBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNQLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxHQUF6QixFQUE4QjtBQUFBLFFBQUMsS0FBQSxFQUFNLE1BQVA7QUFBQSxRQUFjLGNBQUEsRUFBZSxJQUE3QjtPQUE5QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFWLENBQUEsRUFGTztJQUFBLENBWFgsQ0FBQTs7QUFBQSxzQkFlQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsTUFBVixDQUFBLEVBRFM7SUFBQSxDQWZYLENBQUE7O0FBQUEsc0JBa0JBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixRQURZO0lBQUEsQ0FsQmQsQ0FBQTs7bUJBQUE7O0tBRG9CLGVBSHRCLENBQUE7O0FBQUEsRUF3QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0F4QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/browser-plus/lib/fav-view.coffee
