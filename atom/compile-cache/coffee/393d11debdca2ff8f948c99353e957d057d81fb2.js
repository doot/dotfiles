(function() {
  var ListItem, Model,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('backbone').Model;

  ListItem = (function(_super) {
    __extends(ListItem, _super);

    function ListItem() {
      this.leaf = __bind(this.leaf, this);
      this.allowNext = __bind(this.allowNext, this);
      this.allowPrevious = __bind(this.allowPrevious, this);
      this.isSelected = __bind(this.isSelected, this);
      this.deselect = __bind(this.deselect, this);
      this.select = __bind(this.select, this);
      this.selfSelect = __bind(this.selfSelect, this);
      return ListItem.__super__.constructor.apply(this, arguments);
    }

    ListItem.prototype.selfSelect = function() {
      if (this.collection) {
        return this.collection.select(this.collection.indexOf(this));
      } else {
        return this.select();
      }
    };

    ListItem.prototype.select = function() {
      return this.set({
        selected: true
      });
    };

    ListItem.prototype.deselect = function() {
      return this.set({
        selected: false
      });
    };

    ListItem.prototype.isSelected = function() {
      return this.get('selected');
    };

    ListItem.prototype.allowPrevious = function() {
      var _ref;
      if (this.useSublist()) {
        return !((_ref = this.sublist) != null ? _ref.previous() : void 0);
      } else {
        return true;
      }
    };

    ListItem.prototype.allowNext = function() {
      var _ref;
      if (this.useSublist()) {
        return !((_ref = this.sublist) != null ? _ref.next() : void 0);
      } else {
        return true;
      }
    };

    ListItem.prototype.leaf = function() {
      if (this.useSublist()) {
        return this.sublist.leaf() || this;
      } else {
        return this;
      }
    };

    ListItem.prototype.useSublist = function() {
      return false;
    };

    return ListItem;

  })(Model);

  module.exports = ListItem;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2xpc3QtaXRlbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLFVBQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFNTTtBQUtKLCtCQUFBLENBQUE7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsdUJBQUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBRyxJQUFDLENBQUEsVUFBSjtlQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsSUFBcEIsQ0FBbkIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSEY7T0FEVTtJQUFBLENBQVosQ0FBQTs7QUFBQSx1QkFPQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsUUFBQSxFQUFVLElBQVY7T0FBTCxFQURNO0lBQUEsQ0FQUixDQUFBOztBQUFBLHVCQVdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtPQUFMLEVBRFE7SUFBQSxDQVhWLENBQUE7O0FBQUEsdUJBaUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFEVTtJQUFBLENBakJaLENBQUE7O0FBQUEsdUJBdUJBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFIO2VBQ0UsQ0FBQSxxQ0FBWSxDQUFFLFFBQVYsQ0FBQSxZQUROO09BQUEsTUFBQTtlQUdFLEtBSEY7T0FEYTtJQUFBLENBdkJmLENBQUE7O0FBQUEsdUJBZ0NBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFIO2VBQ0UsQ0FBQSxxQ0FBWSxDQUFFLElBQVYsQ0FBQSxZQUROO09BQUEsTUFBQTtlQUdFLEtBSEY7T0FEUztJQUFBLENBaENYLENBQUE7O0FBQUEsdUJBeUNBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQUEsQ0FBQSxJQUFtQixLQURyQjtPQUFBLE1BQUE7ZUFHRSxLQUhGO09BREk7SUFBQSxDQXpDTixDQUFBOztBQUFBLHVCQStDQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsTUFBSDtJQUFBLENBL0NaLENBQUE7O29CQUFBOztLQUxxQixNQU52QixDQUFBOztBQUFBLEVBNERBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBNURqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/list-item.coffee
