(function() {
  var BranchBriefView, View, branch_comparisons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  branch_comparisons = {};

  BranchBriefView = (function(_super) {
    __extends(BranchBriefView, _super);

    function BranchBriefView() {
      this.showSelection = __bind(this.showSelection, this);
      this.repaint = __bind(this.repaint, this);
      this.updateComparison = __bind(this.updateComparison, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return BranchBriefView.__super__.constructor.apply(this, arguments);
    }

    BranchBriefView.content = function() {
      return this.div({
        "class": 'branch-brief-view',
        mousedown: 'clicked'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'name',
            outlet: 'name'
          });
          _this.div({
            "class": 'commit',
            outlet: 'commit'
          });
          return _this.div({
            "class": 'comparison',
            outlet: 'comparison'
          });
        };
      })(this));
    };

    BranchBriefView.prototype.initialize = function(model) {
      this.model = model;
      return this.repaint();
    };

    BranchBriefView.prototype.attached = function() {
      this.model.on('change:selected', this.showSelection);
      if (this.model.local) {
        return this.model.on('comparison-loaded', this.updateComparison);
      }
    };

    BranchBriefView.prototype.detached = function() {
      this.model.off('change:selected', this.showSelection);
      if (this.model.local) {
        return this.model.off('comparison-loaded', this.updateComparison);
      }
    };

    BranchBriefView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    BranchBriefView.prototype.updateComparison = function() {
      var comparison, name;
      if (!atom.config.get('atomatigit.display_commit_comparisons')) {
        return;
      }
      name = this.model.getName();
      comparison = this.model.comparison || branch_comparisons[name];
      if (comparison !== '') {
        branch_comparisons[name] = comparison;
      }
      return this.comparison.html(comparison || 'Calculating...');
    };

    BranchBriefView.prototype.repaint = function() {
      this.name.html("" + (this.model.getName()));
      this.commit.html("(" + (this.model.commit().shortID()) + ": " + (this.model.commit().shortMessage()) + ")");
      if (this.model.local) {
        this.updateComparison();
      }
      this.commit.removeClass('unpushed');
      if (this.model.unpushed()) {
        this.commit.addClass('unpushed');
      }
      return this.showSelection();
    };

    BranchBriefView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return BranchBriefView;

  })(View);

  module.exports = BranchBriefView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvYnJhbmNoZXMvYnJhbmNoLWJyaWVmLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixFQUhyQixDQUFBOztBQUFBLEVBTU07QUFDSixzQ0FBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtBQUFBLFFBQTRCLFNBQUEsRUFBVyxTQUF2QztPQUFMLEVBQXVELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckQsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFlBQWUsTUFBQSxFQUFRLE1BQXZCO1dBQUwsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBUDtBQUFBLFlBQWlCLE1BQUEsRUFBUSxRQUF6QjtXQUFMLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtBQUFBLFlBQXFCLE1BQUEsRUFBUSxZQUE3QjtXQUFMLEVBSHFEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw4QkFPQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixNQURX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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/branches/branch-brief-view.coffee
