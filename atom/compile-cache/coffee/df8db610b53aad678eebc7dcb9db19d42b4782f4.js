(function() {
  var $$, ToolBarButtonView, ToolBarManager;

  ToolBarButtonView = require('./tool-bar-button-view');

  $$ = require('space-pen').$$;

  module.exports = ToolBarManager = (function() {
    function ToolBarManager(group, toolBar) {
      this.group = group;
      this.toolBar = toolBar;
    }

    ToolBarManager.prototype.addButton = function(options) {
      var button;
      button = new ToolBarButtonView(options);
      button.group = this.group;
      this.toolBar.addItem(button);
      return button;
    };

    ToolBarManager.prototype.addSpacer = function(options) {
      var spacer;
      spacer = $$(function() {
        return this.hr({
          "class": 'tool-bar-spacer'
        });
      });
      spacer.priority = options != null ? options.priority : void 0;
      spacer.group = this.group;
      this.toolBar.addItem(spacer);
      return spacer;
    };

    ToolBarManager.prototype.removeItems = function() {
      var items;
      items = this.toolBar.items.filter((function(_this) {
        return function(item) {
          return item.group === _this.group;
        };
      })(this));
      return items.forEach((function(_this) {
        return function(item) {
          return _this.toolBar.removeItem(item);
        };
      })(this));
    };

    return ToolBarManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBQXBCLENBQUE7O0FBQUEsRUFDQyxLQUFNLE9BQUEsQ0FBUSxXQUFSLEVBQU4sRUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDUixJQUFBLHdCQUFFLEtBQUYsRUFBVSxPQUFWLEdBQUE7QUFBb0IsTUFBbkIsSUFBQyxDQUFBLFFBQUEsS0FBa0IsQ0FBQTtBQUFBLE1BQVgsSUFBQyxDQUFBLFVBQUEsT0FBVSxDQUFwQjtJQUFBLENBQWI7O0FBQUEsNkJBRUEsU0FBQSxHQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxpQkFBQSxDQUFrQixPQUFsQixDQUFiLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBQyxDQUFBLEtBRGhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUZBLENBQUE7YUFHQSxPQUpTO0lBQUEsQ0FGWCxDQUFBOztBQUFBLDZCQVFBLFNBQUEsR0FBVyxTQUFDLE9BQUQsR0FBQTtBQUNULFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFBRyxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8saUJBQVA7U0FBSixFQUFIO01BQUEsQ0FBSCxDQUFULENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxRQUFQLHFCQUFrQixPQUFPLENBQUUsaUJBRDNCLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBQyxDQUFBLEtBRmhCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUhBLENBQUE7YUFJQSxPQUxTO0lBQUEsQ0FSWCxDQUFBOztBQUFBLDZCQWVBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFmLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFDNUIsSUFBSSxDQUFDLEtBQUwsS0FBYyxLQUFDLENBQUEsTUFEYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBQVIsQ0FBQTthQUVBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUNaLEtBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxDQUFvQixJQUFwQixFQURZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxFQUhXO0lBQUEsQ0FmYixDQUFBOzswQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/tool-bar/lib/tool-bar-manager.coffee
