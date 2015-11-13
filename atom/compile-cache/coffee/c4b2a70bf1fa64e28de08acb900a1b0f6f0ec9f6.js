(function() {
  var Collection, List,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('backbone').Collection;

  List = (function(_super) {
    __extends(List, _super);

    function List() {
      this.previous = __bind(this.previous, this);
      this.next = __bind(this.next, this);
      this.select = __bind(this.select, this);
      this.selection = __bind(this.selection, this);
      this.leaf = __bind(this.leaf, this);
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.selectedIndex = 0;

    List.prototype.isSublist = false;

    List.prototype.initialize = function() {
      return this.on('update', this.reload);
    };

    List.prototype.leaf = function() {
      var _ref;
      return (_ref = this.selection()) != null ? _ref.leaf() : void 0;
    };

    List.prototype.selection = function() {
      return this.at(this.selectedIndex);
    };

    List.prototype.select = function(i) {
      var oldSelection, _ref;
      oldSelection = this.selectedIndex;
      if (this.selection()) {
        this.selection().deselect();
      }
      if (this.isSublist && i < 0) {
        this.selectedIndex = -1;
        return false;
      }
      this.selectedIndex = Math.max(Math.min(i, this.length - 1), 0);
      if ((_ref = this.selection()) != null) {
        _ref.select();
      }
      return this.selectedIndex !== oldSelection;
    };

    List.prototype.next = function() {
      if (this.selection() && !this.selection().allowNext()) {
        return false;
      }
      return this.select(this.selectedIndex + 1);
    };

    List.prototype.previous = function() {
      if (this.selection() && !this.selection().allowPrevious()) {
        return false;
      }
      return this.select(this.selectedIndex - 1);
    };

    List.prototype.reload = function() {};

    return List;

  })(Collection);

  module.exports = List;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2xpc3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUtNO0FBQ0osMkJBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsbUJBQUEsYUFBQSxHQUFlLENBQWYsQ0FBQTs7QUFBQSxtQkFDQSxTQUFBLEdBQVcsS0FEWCxDQUFBOztBQUFBLG1CQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsRUFBRCxDQUFJLFFBQUosRUFBYyxJQUFDLENBQUEsTUFBZixFQURVO0lBQUEsQ0FKWixDQUFBOztBQUFBLG1CQVVBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLElBQUE7cURBQVksQ0FBRSxJQUFkLENBQUEsV0FESTtJQUFBLENBVk4sQ0FBQTs7QUFBQSxtQkFnQkEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxFQUFELENBQUksSUFBQyxDQUFBLGFBQUwsRUFEUztJQUFBLENBaEJYLENBQUE7O0FBQUEsbUJBc0JBLE1BQUEsR0FBUSxTQUFDLENBQUQsR0FBQTtBQUNOLFVBQUEsa0JBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsYUFBaEIsQ0FBQTtBQUNBLE1BQUEsSUFBMkIsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUEzQjtBQUFBLFFBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsUUFBYixDQUFBLENBQUEsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELElBQWUsQ0FBQSxHQUFJLENBQXRCO0FBQ0UsUUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUFBLENBQWpCLENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FGRjtPQUhBO0FBQUEsTUFPQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBdEIsQ0FBVCxFQUFtQyxDQUFuQyxDQVBqQixDQUFBOztZQVFZLENBQUUsTUFBZCxDQUFBO09BUkE7YUFVQSxJQUFDLENBQUEsYUFBRCxLQUFvQixhQVhkO0lBQUEsQ0F0QlIsQ0FBQTs7QUFBQSxtQkFvQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLElBQWlCLENBQUEsSUFBSyxDQUFBLFNBQUQsQ0FBQSxDQUFZLENBQUMsU0FBYixDQUFBLENBQXJDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQVMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBMUIsRUFGSTtJQUFBLENBcENOLENBQUE7O0FBQUEsbUJBeUNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQWdCLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxJQUFpQixDQUFBLElBQUssQ0FBQSxTQUFELENBQUEsQ0FBWSxDQUFDLGFBQWIsQ0FBQSxDQUFyQztBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQXpCLEVBRlE7SUFBQSxDQXpDVixDQUFBOztBQUFBLG1CQThDQSxNQUFBLEdBQVEsU0FBQSxHQUFBLENBOUNSLENBQUE7O2dCQUFBOztLQURpQixXQUxuQixDQUFBOztBQUFBLEVBc0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBdERqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/list.coffee
