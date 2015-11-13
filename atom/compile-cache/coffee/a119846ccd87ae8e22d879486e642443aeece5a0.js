(function() {
  var $, OutputView, ScrollView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  module.exports = OutputView = (function(_super) {
    __extends(OutputView, _super);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.prototype.message = '';

    OutputView.content = function() {
      return this.div({
        "class": 'git-plus info-view'
      }, (function(_this) {
        return function() {
          return _this.pre({
            "class": 'output'
          });
        };
      })(this));
    };

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.addLine = function(line) {
      return this.message += line;
    };

    OutputView.prototype.reset = function() {
      return this.message = '';
    };

    OutputView.prototype.finish = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addBottomPanel({
          item: this
        });
      }
      this.find(".output").append(this.message);
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    OutputView.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    return OutputView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL291dHB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFBSixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLElBRUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sb0JBQVA7T0FBTCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBUDtXQUFMLEVBRGdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFEUTtJQUFBLENBRlYsQ0FBQTs7QUFBQSx5QkFNQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsNENBQUEsU0FBQSxFQURVO0lBQUEsQ0FOWixDQUFBOztBQUFBLHlCQVNBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFELElBQVksS0FETDtJQUFBLENBVFQsQ0FBQTs7QUFBQSx5QkFZQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUROO0lBQUEsQ0FaUCxDQUFBOztBQUFBLHlCQWVBLE1BQUEsR0FBUSxTQUFBLEdBQUE7O1FBQ04sSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE5QjtPQUFWO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sQ0FBZ0IsQ0FBQyxNQUFqQixDQUF3QixJQUFDLENBQUEsT0FBekIsQ0FEQSxDQUFBO2FBRUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ1QsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQURTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBQSxHQUE2QyxJQUYvQyxFQUhNO0lBQUEsQ0FmUixDQUFBOztBQUFBLHlCQXNCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxLQUFBO2lEQUFNLENBQUUsT0FBUixDQUFBLFdBRE87SUFBQSxDQXRCVCxDQUFBOztzQkFBQTs7S0FEdUIsV0FIM0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/output-view.coffee
