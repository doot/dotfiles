(function() {
  var BranchList, ErrorView, List, LocalBranch, RemoteBranch, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  List = require('../list');

  LocalBranch = require('./local-branch');

  RemoteBranch = require('./remote-branch');

  ErrorView = require('../../views/error-view');

  BranchList = (function(_super) {
    __extends(BranchList, _super);

    function BranchList() {
      this.remote = __bind(this.remote, this);
      this.local = __bind(this.local, this);
      this.reload = __bind(this.reload, this);
      return BranchList.__super__.constructor.apply(this, arguments);
    }

    BranchList.prototype.reload = function(_arg) {
      var silent;
      silent = (_arg != null ? _arg : {}).silent;
      return git.branches().then((function(_this) {
        return function(branches) {
          _this.reset();
          _.each(branches, function(branch) {
            return _this.add(new LocalBranch(branch));
          });
          return git.remoteBranches().then(function(branches) {
            _.each(branches, function(branch) {
              return _this.add(new RemoteBranch(branch));
            });
            _this.select(_this.selectedIndex);
            if (!silent) {
              return _this.trigger('repaint');
            }
          });
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    BranchList.prototype.local = function() {
      return this.filter(function(branch) {
        return branch.local;
      });
    };

    BranchList.prototype.remote = function() {
      return this.filter(function(branch) {
        return branch.remote;
      });
    };

    return BranchList;

  })(List);

  module.exports = BranchList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2JyYW5jaGVzL2JyYW5jaC1saXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4REFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQWUsT0FBQSxDQUFRLFdBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFlLE9BQUEsQ0FBUSxTQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVIsQ0FKZixDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUxmLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBTmYsQ0FBQTs7QUFBQSxFQVNNO0FBRUosaUNBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsTUFBQTtBQUFBLE1BRFEseUJBQUQsT0FBUyxJQUFSLE1BQ1IsQ0FBQTthQUFBLEdBQUcsQ0FBQyxRQUFKLENBQUEsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUCxFQUFpQixTQUFDLE1BQUQsR0FBQTttQkFBWSxLQUFDLENBQUEsR0FBRCxDQUFTLElBQUEsV0FBQSxDQUFZLE1BQVosQ0FBVCxFQUFaO1VBQUEsQ0FBakIsQ0FEQSxDQUFBO2lCQUVBLEdBQUcsQ0FBQyxjQUFKLENBQUEsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixTQUFDLFFBQUQsR0FBQTtBQUN4QixZQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUCxFQUFpQixTQUFDLE1BQUQsR0FBQTtxQkFBWSxLQUFDLENBQUEsR0FBRCxDQUFTLElBQUEsWUFBQSxDQUFhLE1BQWIsQ0FBVCxFQUFaO1lBQUEsQ0FBakIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLEtBQUMsQ0FBQSxhQUFULENBREEsQ0FBQTtBQUVBLFlBQUEsSUFBQSxDQUFBLE1BQUE7cUJBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQUE7YUFId0I7VUFBQSxDQUExQixFQUhrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLENBT0EsQ0FBQyxPQUFELENBUEEsQ0FPTyxTQUFDLEtBQUQsR0FBQTtlQUFlLElBQUEsU0FBQSxDQUFVLEtBQVYsRUFBZjtNQUFBLENBUFAsRUFETTtJQUFBLENBQVIsQ0FBQTs7QUFBQSx5QkFhQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLE1BQUQsR0FBQTtlQUFZLE1BQU0sQ0FBQyxNQUFuQjtNQUFBLENBQVIsRUFESztJQUFBLENBYlAsQ0FBQTs7QUFBQSx5QkFtQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxNQUFELEdBQUE7ZUFBWSxNQUFNLENBQUMsT0FBbkI7TUFBQSxDQUFSLEVBRE07SUFBQSxDQW5CUixDQUFBOztzQkFBQTs7S0FGdUIsS0FUekIsQ0FBQTs7QUFBQSxFQWlDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQWpDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/branches/branch-list.coffee
