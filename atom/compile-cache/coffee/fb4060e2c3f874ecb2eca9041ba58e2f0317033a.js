(function() {
  var BranchBriefView, BranchListView, CompositeDisposable, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  BranchBriefView = require('./branch-brief-view');

  BranchListView = (function(_super) {
    __extends(BranchListView, _super);

    function BranchListView() {
      this.repaint = __bind(this.repaint, this);
      this.emptyLists = __bind(this.emptyLists, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return BranchListView.__super__.constructor.apply(this, arguments);
    }

    BranchListView.content = function() {
      return this.div({
        "class": 'branch-list-view list-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h2('local:');
          _this.div({
            outlet: 'localDom'
          });
          _this.h2('remote:');
          return _this.div({
            outlet: 'remoteDom'
          });
        };
      })(this));
    };

    BranchListView.prototype.initialize = function(model) {
      this.model = model;
    };

    BranchListView.prototype.attached = function() {
      return this.model.on('repaint', this.repaint);
    };

    BranchListView.prototype.detached = function() {
      return this.model.off('repaint', this.repaint);
    };

    BranchListView.prototype.emptyLists = function() {
      this.localDom.empty();
      return this.remoteDom.empty();
    };

    BranchListView.prototype.repaint = function() {
      this.emptyLists();
      _.each(this.model.local(), (function(_this) {
        return function(branch) {
          return _this.localDom.append(new BranchBriefView(branch));
        };
      })(this));
      return _.each(this.model.remote(), (function(_this) {
        return function(branch) {
          return _this.remoteDom.append(new BranchBriefView(branch));
        };
      })(this));
    };

    return BranchListView;

  })(View);

  module.exports = BranchListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvYnJhbmNoZXMvYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBSmxCLENBQUE7O0FBQUEsRUFPTTtBQUNKLHFDQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw0QkFBUDtBQUFBLFFBQXFDLFFBQUEsRUFBVSxDQUFBLENBQS9DO09BQUwsRUFBd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0RCxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksUUFBSixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxVQUFSO1dBQUwsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUosQ0FGQSxDQUFBO2lCQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxXQUFSO1dBQUwsRUFKc0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4RCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDZCQVFBLFVBQUEsR0FBWSxTQUFFLEtBQUYsR0FBQTtBQUFVLE1BQVQsSUFBQyxDQUFBLFFBQUEsS0FBUSxDQUFWO0lBQUEsQ0FSWixDQUFBOztBQUFBLDZCQVdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLElBQUMsQ0FBQSxPQUF0QixFQURRO0lBQUEsQ0FYVixDQUFBOztBQUFBLDZCQWVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxTQUFYLEVBQXNCLElBQUMsQ0FBQSxPQUF2QixFQURRO0lBQUEsQ0FmVixDQUFBOztBQUFBLDZCQW1CQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxFQUZVO0lBQUEsQ0FuQlosQ0FBQTs7QUFBQSw2QkF3QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUEsQ0FBUCxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQXFCLElBQUEsZUFBQSxDQUFnQixNQUFoQixDQUFyQixFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0FEQSxDQUFBO2FBRUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxDQUFQLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBc0IsSUFBQSxlQUFBLENBQWdCLE1BQWhCLENBQXRCLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQUhPO0lBQUEsQ0F4QlQsQ0FBQTs7MEJBQUE7O0tBRDJCLEtBUDdCLENBQUE7O0FBQUEsRUFxQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FyQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/branches/branch-list-view.coffee
