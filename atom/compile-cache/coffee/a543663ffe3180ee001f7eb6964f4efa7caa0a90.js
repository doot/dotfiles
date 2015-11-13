(function() {
  var $, OutputView, ScrollView, defaultMessage, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  defaultMessage = 'Nothing new to show';

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
          }, defaultMessage);
        };
      })(this));
    };

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.addLine = function(line) {
      if (this.message === defaultMessage) {
        this.message = '';
      }
      this.message += line;
      return this;
    };

    OutputView.prototype.reset = function() {
      return this.message = defaultMessage;
    };

    OutputView.prototype.finish = function() {
      this.find(".output").text(this.message);
      this.show();
      return this.timeout = setTimeout((function(_this) {
        return function() {
          return _this.hide();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    OutputView.prototype.toggle = function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return $.fn.toggle.call(this);
    };

    return OutputView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL291dHB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFBSixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixxQkFGakIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsT0FBQSxHQUFTLEVBQVQsQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9CQUFQO09BQUwsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDaEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixjQUF0QixFQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUZWLENBQUE7O0FBQUEseUJBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLDRDQUFBLFNBQUEsRUFEVTtJQUFBLENBTlosQ0FBQTs7QUFBQSx5QkFTQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLElBQWlCLElBQUMsQ0FBQSxPQUFELEtBQVksY0FBN0I7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELElBQVksSUFEWixDQUFBO2FBRUEsS0FITztJQUFBLENBVFQsQ0FBQTs7QUFBQSx5QkFjQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQUQsR0FBVyxlQUFkO0lBQUEsQ0FkUCxDQUFBOztBQUFBLHlCQWdCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixJQUFDLENBQUEsT0FBdkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3BCLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFEb0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBRVQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUFBLEdBQTZDLElBRnBDLEVBSEw7SUFBQSxDQWhCUixDQUFBOztBQUFBLHlCQXVCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUF5QixJQUFDLENBQUEsT0FBMUI7QUFBQSxRQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxDQUFBLENBQUE7T0FBQTthQUNBLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQVosQ0FBaUIsSUFBakIsRUFGTTtJQUFBLENBdkJSLENBQUE7O3NCQUFBOztLQUR1QixXQUozQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/output-view.coffee
