(function() {
  var CurrentBranchView, View, branch_comparisons,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  branch_comparisons = {};

  CurrentBranchView = (function(_super) {
    __extends(CurrentBranchView, _super);

    function CurrentBranchView() {
      this.repaint = __bind(this.repaint, this);
      this.refresh = __bind(this.refresh, this);
      this.updateComparison = __bind(this.updateComparison, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CurrentBranchView.__super__.constructor.apply(this, arguments);
    }

    CurrentBranchView.content = function() {
      return this.div({
        "class": 'current-branch-view'
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

    CurrentBranchView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.model = this.repo.currentBranch;
      return this.repaint();
    };

    CurrentBranchView.prototype.attached = function() {
      this.model.on('repaint', this.repaint);
      return this.model.on('comparison-loaded', this.updateComparison);
    };

    CurrentBranchView.prototype.detached = function() {
      this.model.off('repaint', this.repaint);
      return this.model.off('comparison-loaded', this.updateComparison);
    };

    CurrentBranchView.prototype.updateComparison = function() {
      var comparison, name;
      if (!atom.config.get('atomatigit.display_commit_comparisons')) {
        return this.comparison.html('');
      }
      name = this.model.getName();
      comparison = this.model.comparison || branch_comparisons[name];
      if (comparison !== '') {
        branch_comparisons[name] = comparison;
      }
      return this.comparison.html(comparison || 'Calculating...');
    };

    CurrentBranchView.prototype.refresh = function() {
      return this.repaint();
    };

    CurrentBranchView.prototype.repaint = function() {
      var _base, _base1;
      this.name.html("" + this.model.name);
      this.commit.html("(" + (typeof (_base = this.model.commit).shortID === "function" ? _base.shortID() : void 0) + ": " + (typeof (_base1 = this.model.commit).shortMessage === "function" ? _base1.shortMessage() : void 0) + ")");
      this.updateComparison();
      this.commit.removeClass('unpushed');
      if (this.model.unpushed()) {
        return this.commit.addClass('unpushed');
      }
    };

    return CurrentBranchView;

  })(View);

  module.exports = CurrentBranchView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvYnJhbmNoZXMvY3VycmVudC1icmFuY2gtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUdBLGtCQUFBLEdBQXFCLEVBSHJCLENBQUE7O0FBQUEsRUFNTTtBQUNKLHdDQUFBLENBQUE7Ozs7Ozs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFCQUFQO09BQUwsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsWUFBZSxNQUFBLEVBQVEsTUFBdkI7V0FBTCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsWUFBaUIsTUFBQSxFQUFRLFFBQXpCO1dBQUwsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsWUFBcUIsTUFBQSxFQUFRLFlBQTdCO1dBQUwsRUFIaUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLGdDQU9BLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/branches/current-branch-view.coffee
