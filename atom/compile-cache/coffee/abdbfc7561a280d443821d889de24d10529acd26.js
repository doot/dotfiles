(function() {
  var $, MenuItem, MenuView, View, items, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  items = [
    {
      id: 'compare',
      menu: 'Compare',
      icon: 'compare',
      type: 'active'
    }, {
      id: 'commit',
      menu: 'Commit',
      icon: 'commit',
      type: 'file merging'
    }, {
      id: 'reset',
      menu: 'Reset',
      icon: 'sync',
      type: 'file'
    }, {
      id: 'fetch',
      menu: 'Fetch',
      icon: 'cloud-download',
      type: 'remote'
    }, {
      id: 'pull',
      menu: 'Pull',
      icon: 'pull',
      type: 'upstream'
    }, {
      id: 'push',
      menu: 'Push',
      icon: 'push',
      type: 'downstream'
    }, {
      id: 'merge',
      menu: 'Merge',
      icon: 'merge',
      type: 'active'
    }, {
      id: 'branch',
      menu: 'Branch',
      icon: 'branch',
      type: 'active'
    }, {
      id: 'flow',
      menu: 'GitFlow',
      icon: 'flow',
      type: 'active'
    }
  ];

  MenuItem = (function(_super) {
    __extends(MenuItem, _super);

    function MenuItem() {
      return MenuItem.__super__.constructor.apply(this, arguments);
    }

    MenuItem.content = function(item) {
      var klass;
      klass = item.type === 'active' ? '' : 'inactive';
      return this.div({
        "class": "item " + klass + " " + item.type,
        id: "menu" + item.id,
        click: 'click'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "icon large " + item.icon
          });
          return _this.div(item.menu);
        };
      })(this));
    };

    MenuItem.prototype.initialize = function(item) {
      return this.item = item;
    };

    MenuItem.prototype.click = function() {
      return this.parentView.click(this.item.id);
    };

    return MenuItem;

  })(View);

  module.exports = MenuView = (function(_super) {
    __extends(MenuView, _super);

    function MenuView() {
      return MenuView.__super__.constructor.apply(this, arguments);
    }

    MenuView.content = function(item) {
      return this.div({
        "class": 'menu'
      }, (function(_this) {
        return function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(_this.subview(item.id, new MenuItem(item)));
          }
          return _results;
        };
      })(this));
    };

    MenuView.prototype.click = function(id) {
      if (!(this.find("#menu" + id).hasClass('inactive'))) {
        return this.parentView["" + id + "MenuClick"]();
      }
    };

    MenuView.prototype.activate = function(type, active) {
      var menuItems;
      menuItems = this.find(".item." + type);
      if (active) {
        menuItems.removeClass('inactive');
      } else {
        menuItems.addClass('inactive');
      }
    };

    return MenuView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL3ZpZXdzL21lbnUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUTtJQUNOO0FBQUEsTUFBRSxFQUFBLEVBQUksU0FBTjtBQUFBLE1BQWlCLElBQUEsRUFBTSxTQUF2QjtBQUFBLE1BQWtDLElBQUEsRUFBTSxTQUF4QztBQUFBLE1BQW1ELElBQUEsRUFBTSxRQUF6RDtLQURNLEVBRU47QUFBQSxNQUFFLEVBQUEsRUFBSSxRQUFOO0FBQUEsTUFBZ0IsSUFBQSxFQUFNLFFBQXRCO0FBQUEsTUFBZ0MsSUFBQSxFQUFNLFFBQXRDO0FBQUEsTUFBZ0QsSUFBQSxFQUFNLGNBQXREO0tBRk0sRUFHTjtBQUFBLE1BQUUsRUFBQSxFQUFJLE9BQU47QUFBQSxNQUFlLElBQUEsRUFBTSxPQUFyQjtBQUFBLE1BQThCLElBQUEsRUFBTSxNQUFwQztBQUFBLE1BQTRDLElBQUEsRUFBTSxNQUFsRDtLQUhNLEVBS047QUFBQSxNQUFFLEVBQUEsRUFBSSxPQUFOO0FBQUEsTUFBZSxJQUFBLEVBQU0sT0FBckI7QUFBQSxNQUE4QixJQUFBLEVBQU0sZ0JBQXBDO0FBQUEsTUFBc0QsSUFBQSxFQUFNLFFBQTVEO0tBTE0sRUFNTjtBQUFBLE1BQUUsRUFBQSxFQUFJLE1BQU47QUFBQSxNQUFjLElBQUEsRUFBTSxNQUFwQjtBQUFBLE1BQTRCLElBQUEsRUFBTSxNQUFsQztBQUFBLE1BQTBDLElBQUEsRUFBTSxVQUFoRDtLQU5NLEVBT047QUFBQSxNQUFFLEVBQUEsRUFB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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/views/menu-view.coffee
