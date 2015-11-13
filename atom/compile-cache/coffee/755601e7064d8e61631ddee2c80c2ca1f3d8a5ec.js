(function() {
  var CommitView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CommitView = (function(_super) {
    __extends(CommitView, _super);

    function CommitView() {
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CommitView.__super__.constructor.apply(this, arguments);
    }

    CommitView.content = function(commit) {
      return this.div({
        "class": 'commit',
        click: 'clicked'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'id'
          }, "" + (commit.shortID()));
          _this.div({
            "class": 'author-name'
          }, "(" + (commit.authorName()) + ")");
          return _this.div({
            "class": 'message text-subtle'
          }, "" + (commit.shortMessage()));
        };
      })(this));
    };

    CommitView.prototype.initialize = function(model) {
      this.model = model;
    };

    CommitView.prototype.attached = function() {
      return this.model.on('change:selected', this.showSelection);
    };

    CommitView.prototype.detached = function() {
      return this.model.off('change:selected', this.showSelection);
    };

    CommitView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    CommitView.prototype.showSelection = function() {
      this.removeClass('selected');
      if (this.model.isSelected()) {
        return this.addClass('selected');
      }
    };

    return CommitView;

  })(View);

  module.exports = CommitView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvY29tbWl0cy9jb21taXQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0osaUNBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtBQUFBLFFBQWlCLEtBQUEsRUFBTyxTQUF4QjtPQUFMLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdEMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sSUFBUDtXQUFMLEVBQWtCLEVBQUEsR0FBRSxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBRCxDQUFwQixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO1dBQUwsRUFBNEIsR0FBQSxHQUFFLENBQUMsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFELENBQUYsR0FBdUIsR0FBbkQsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQkFBUDtXQUFMLEVBQW1DLEVBQUEsR0FBRSxDQUFDLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBRCxDQUFyQyxFQUhzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUJBT0EsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQVBaLENBQUE7O0FBQUEseUJBVUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLGlCQUFWLEVBQTZCLElBQUMsQ0FBQSxhQUE5QixFQURRO0lBQUEsQ0FWVixDQUFBOztBQUFBLHlCQWNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxpQkFBWCxFQUE4QixJQUFDLENBQUEsYUFBL0IsRUFEUTtJQUFBLENBZFYsQ0FBQTs7QUFBQSx5QkFrQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLEVBRE87SUFBQSxDQWxCVCxDQUFBOztBQUFBLHlCQXNCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLFVBQWIsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsQ0FBQSxDQUF6QjtlQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVixFQUFBO09BRmE7SUFBQSxDQXRCZixDQUFBOztzQkFBQTs7S0FEdUIsS0FIekIsQ0FBQTs7QUFBQSxFQThCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQTlCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/commits/commit-view.coffee
