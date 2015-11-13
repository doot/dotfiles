(function() {
  var CompositeDisposable, ToolBarView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  _ = require('underscore-plus');

  module.exports = ToolBarView = (function(_super) {
    __extends(ToolBarView, _super);

    function ToolBarView() {
      this.drawGutter = __bind(this.drawGutter, this);
      return ToolBarView.__super__.constructor.apply(this, arguments);
    }

    ToolBarView.content = function() {
      return this.div({
        "class": 'tool-bar'
      });
    };

    ToolBarView.prototype.items = [];

    ToolBarView.prototype.addItem = function(newItem) {
      var existingItem, index, newElement, nextElement, nextItem, _i, _len, _ref, _ref1, _ref2;
      if (newItem.priority == null) {
        newItem.priority = (_ref = (_ref1 = this.items[this.items.length - 1]) != null ? _ref1.priority : void 0) != null ? _ref : 50;
      }
      nextItem = null;
      _ref2 = this.items;
      for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
        existingItem = _ref2[index];
        if (existingItem.priority > newItem.priority) {
          nextItem = existingItem;
          break;
        }
      }
      this.items.splice(index, 0, newItem);
      newElement = atom.views.getView(newItem);
      nextElement = atom.views.getView(nextItem);
      this.element.insertBefore(newElement, nextElement);
      this.drawGutter();
      return nextItem;
    };

    ToolBarView.prototype.removeItem = function(item) {
      var element, index;
      index = this.items.indexOf(item);
      this.items.splice(index, 1);
      element = atom.views.getView(item);
      this.element.removeChild(element);
      return this.drawGutter();
    };

    ToolBarView.prototype.initialize = function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-top', (function(_this) {
        return function() {
          _this.updatePosition('Top');
          return atom.config.set('tool-bar.position', 'Top');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-right', (function(_this) {
        return function() {
          _this.updatePosition('Right');
          return atom.config.set('tool-bar.position', 'Right');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-bottom', (function(_this) {
        return function() {
          _this.updatePosition('Bottom');
          return atom.config.set('tool-bar.position', 'Bottom');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-left', (function(_this) {
        return function() {
          _this.updatePosition('Left');
          return atom.config.set('tool-bar.position', 'Left');
        };
      })(this)));
      atom.config.observe('tool-bar.iconSize', (function(_this) {
        return function(newValue) {
          return _this.updateSize(newValue);
        };
      })(this));
      atom.config.onDidChange('tool-bar.position', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          if (atom.config.get('tool-bar.visible')) {
            return _this.show();
          }
        };
      })(this));
      atom.config.onDidChange('tool-bar.visible', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          if (newValue) {
            return _this.show();
          } else {
            return _this.hide();
          }
        };
      })(this));
      if (atom.config.get('tool-bar.visible')) {
        this.show();
      }
      this.element.addEventListener('scroll', this.drawGutter);
      return window.addEventListener('resize', this.drawGutter);
    };

    ToolBarView.prototype.serialize = function() {};

    ToolBarView.prototype.destroy = function() {
      this.subscriptions.dispose();
      if (this.panel != null) {
        this.detach();
      }
      if (this.panel != null) {
        this.panel.destroy();
      }
      return window.removeEventListener('resize', this.drawGutter);
    };

    ToolBarView.prototype.updateSize = function(size) {
      this.removeClass('tool-bar-16px tool-bar-24px tool-bar-32px');
      return this.addClass("tool-bar-" + size);
    };

    ToolBarView.prototype.updatePosition = function(position) {
      this.removeClass('tool-bar-top tool-bar-right tool-bar-bottom tool-bar-left tool-bar-horizontal tool-bar-vertical');
      switch (position) {
        case 'Top':
          this.panel = atom.workspace.addTopPanel({
            item: this
          });
          break;
        case 'Right':
          this.panel = atom.workspace.addRightPanel({
            item: this
          });
          break;
        case 'Bottom':
          this.panel = atom.workspace.addBottomPanel({
            item: this
          });
          break;
        case 'Left':
          this.panel = atom.workspace.addLeftPanel({
            item: this,
            priority: 50
          });
      }
      this.addClass("tool-bar-" + (position.toLowerCase()));
      if (position === 'Top' || position === 'Bottom') {
        this.addClass('tool-bar-horizontal');
      } else {
        this.addClass('tool-bar-vertical');
      }
      this.updateMenu(position);
      return this.drawGutter();
    };

    ToolBarView.prototype.updateMenu = function(position) {
      var packagesMenu, positionMenu, positionsMenu, toolBarMenu;
      packagesMenu = _.find(atom.menu.template, function(_arg) {
        var label;
        label = _arg.label;
        return label === 'Packages' || label === '&Packages';
      });
      if (packagesMenu) {
        toolBarMenu = _.find(packagesMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === 'Tool Bar' || label === '&Tool Bar';
        });
      }
      if (toolBarMenu) {
        positionsMenu = _.find(toolBarMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === 'Position' || label === '&Position';
        });
      }
      if (positionsMenu) {
        positionMenu = _.find(positionsMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === position;
        });
      }
      return positionMenu != null ? positionMenu.checked = true : void 0;
    };

    ToolBarView.prototype.drawGutter = function() {
      var hiddenHeight, scrollHeight, visibleHeight;
      this.removeClass('gutter-top gutter-bottom');
      visibleHeight = this.height();
      scrollHeight = this.element.scrollHeight;
      hiddenHeight = scrollHeight - visibleHeight;
      if (visibleHeight < scrollHeight) {
        if (this.scrollTop() > 0) {
          this.addClass('gutter-top');
        }
        if (this.scrollTop() < hiddenHeight) {
          return this.addClass('gutter-bottom');
        }
      }
    };

    ToolBarView.prototype.hide = function() {
      if (this.panel != null) {
        this.detach();
      }
      if (this.panel != null) {
        return this.panel.destroy();
      }
    };

    ToolBarView.prototype.show = function() {
      this.hide();
      this.updatePosition(atom.config.get('tool-bar.position'));
      return this.updateSize(atom.config.get('tool-bar.iconSize'));
    };

    ToolBarView.prototype.toggle = function() {
      if (this.hasParent()) {
        this.hide();
        return atom.config.set('tool-bar.visible', false);
      } else {
        this.show();
        return atom.config.set('tool-bar.visible', true);
      }
    };

    return ToolBarView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixrQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sVUFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMEJBR0EsS0FBQSxHQUFPLEVBSFAsQ0FBQTs7QUFBQSwwQkFLQSxPQUFBLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUCxVQUFBLG9GQUFBOztRQUFBLE9BQU8sQ0FBQyxtSEFBa0Q7T0FBMUQ7QUFBQSxNQUNBLFFBQUEsR0FBVyxJQURYLENBQUE7QUFFQTtBQUFBLFdBQUEsNERBQUE7b0NBQUE7QUFDRSxRQUFBLElBQUcsWUFBWSxDQUFDLFFBQWIsR0FBd0IsT0FBTyxDQUFDLFFBQW5DO0FBQ0UsVUFBQSxRQUFBLEdBQVcsWUFBWCxDQUFBO0FBQ0EsZ0JBRkY7U0FERjtBQUFBLE9BRkE7QUFBQSxNQU1BLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLEtBQWQsRUFBcUIsQ0FBckIsRUFBd0IsT0FBeEIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxVQUFBLEdBQWEsSUFB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

//# sourceURL=/Users/doot/.atom/packages/tool-bar/lib/tool-bar-view.coffee
