(function() {
  var DiffChunkView, DiffLineView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  DiffLineView = require('./diff-line-view');

  DiffChunkView = (function(_super) {
    __extends(DiffChunkView, _super);

    function DiffChunkView() {
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return DiffChunkView.__super__.constructor.apply(this, arguments);
    }

    DiffChunkView.content = function() {
      return this.div({
        "class": 'diff-chunk',
        click: 'clicked'
      });
    };

    DiffChunkView.prototype.initialize = function(model) {
      this.model = model;
      return _.each(this.model.lines, (function(_this) {
        return function(line) {
          return _this.append(new DiffLineView(line));
        };
      })(this));
    };

    DiffChunkView.prototype.attached = function() {
      return this.model.on('change:selected', this.showSelection);
    };

    DiffChunkView.prototype.detached = function() {
      return this.model.off('change:selected', this.showSelection);
    };

    DiffChunkView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    DiffChunkView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return DiffChunkView;

  })(View);

  module.exports = DiffChunkView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZGlmZnMvZGlmZi1jaHVuay12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBZSxPQUFBLENBQVEsUUFBUixDQUFmLENBQUE7O0FBQUEsRUFDQyxPQUFjLE9BQUEsQ0FBUSxzQkFBUixFQUFkLElBREQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBS007QUFDSixvQ0FBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtBQUFBLFFBQXFCLEtBQUEsRUFBTyxTQUE1QjtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNEJBSUEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7YUFBQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBZCxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQVUsS0FBQyxDQUFBLE1BQUQsQ0FBWSxJQUFBLFlBQUEsQ0FBYSxJQUFiLENBQVosRUFBVjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLEVBRFU7SUFBQSxDQUpaLENBQUE7O0FBQUEsNEJBUUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLGlCQUFWLEVBQTZCLElBQUMsQ0FBQSxhQUE5QixFQURRO0lBQUEsQ0FSVixDQUFBOztBQUFBLDRCQVlBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxpQkFBWCxFQUE4QixJQUFDLENBQUEsYUFBL0IsRUFEUTtJQUFBLENBWlYsQ0FBQTs7QUFBQSw0QkFnQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLEVBRE87SUFBQSxDQWhCVCxDQUFBOztBQUFBLDRCQW9CQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLFVBQWIsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsQ0FBQSxDQUF6QjtlQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVixFQUFBO09BRmE7SUFBQSxDQXBCZixDQUFBOzt5QkFBQTs7S0FEMEIsS0FMNUIsQ0FBQTs7QUFBQSxFQThCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQTlCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/diffs/diff-chunk-view.coffee
