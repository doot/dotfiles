(function() {
  var DiffChunkView, DiffView, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  DiffChunkView = require('./diff-chunk-view');

  DiffView = (function(_super) {
    __extends(DiffView, _super);

    function DiffView() {
      return DiffView.__super__.constructor.apply(this, arguments);
    }

    DiffView.content = function(diff) {
      return this.div({
        "class": 'diff'
      });
    };

    DiffView.prototype.initialize = function(model) {
      var _ref;
      this.model = model;
      return _.each((_ref = this.model) != null ? _ref.chunks() : void 0, (function(_this) {
        return function(chunk) {
          return _this.append(new DiffChunkView(chunk));
        };
      })(this));
    };

    return DiffView;

  })(View);

  module.exports = DiffView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZGlmZnMvZGlmZi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFnQixPQUFBLENBQVEsUUFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0MsT0FBZSxPQUFBLENBQVEsc0JBQVIsRUFBZixJQURELENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUZoQixDQUFBOztBQUFBLEVBS007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLE1BQVA7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHVCQUlBLFVBQUEsR0FBWSxTQUFFLEtBQUYsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLFFBQUEsS0FDWixDQUFBO2FBQUEsQ0FBQyxDQUFDLElBQUYsbUNBQWEsQ0FBRSxNQUFSLENBQUEsVUFBUCxFQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQVcsS0FBQyxDQUFBLE1BQUQsQ0FBWSxJQUFBLGFBQUEsQ0FBYyxLQUFkLENBQVosRUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLEVBRFU7SUFBQSxDQUpaLENBQUE7O29CQUFBOztLQURxQixLQUx2QixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFiakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/diffs/diff-view.coffee
