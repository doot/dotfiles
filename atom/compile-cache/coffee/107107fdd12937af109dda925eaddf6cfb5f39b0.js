(function() {
  var LogLine, LogView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  LogLine = (function(_super) {
    __extends(LogLine, _super);

    function LogLine() {
      return LogLine.__super__.constructor.apply(this, arguments);
    }

    LogLine.content = function(line) {
      return this.pre({
        "class": "" + (line.iserror ? 'error' : '')
      }, line.log);
    };

    return LogLine;

  })(View);

  module.exports = LogView = (function(_super) {
    __extends(LogView, _super);

    function LogView() {
      return LogView.__super__.constructor.apply(this, arguments);
    }

    LogView.content = function() {
      return this.div({
        "class": 'logger'
      });
    };

    LogView.prototype.log = function(log, iserror) {
      this.append(new LogLine({
        iserror: iserror,
        log: log
      }));
      this.scrollToBottom();
    };

    return LogView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL3ZpZXdzL2xvZy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sRUFBQSxHQUFFLENBQUksSUFBSSxDQUFDLE9BQVIsR0FBcUIsT0FBckIsR0FBa0MsRUFBbkMsQ0FBVDtPQUFMLEVBQXVELElBQUksQ0FBQyxHQUE1RCxFQURRO0lBQUEsQ0FBVixDQUFBOzttQkFBQTs7S0FEb0IsS0FGdEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxzQkFHQSxHQUFBLEdBQUssU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBO0FBQ0gsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFZLElBQUEsT0FBQSxDQUFRO0FBQUEsUUFBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLFFBQWtCLEdBQUEsRUFBSyxHQUF2QjtPQUFSLENBQVosQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBREEsQ0FERztJQUFBLENBSEwsQ0FBQTs7bUJBQUE7O0tBRG9CLEtBUHRCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/views/log-view.coffee
