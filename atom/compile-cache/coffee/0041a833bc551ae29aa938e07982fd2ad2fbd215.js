(function() {
  var BranchItem, BranchView, View, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  git = require('../git');

  BranchItem = (function(_super) {
    __extends(BranchItem, _super);

    function BranchItem() {
      return BranchItem.__super__.constructor.apply(this, arguments);
    }

    BranchItem.content = function(branch) {
      var bklass, cklass, dclass;
      bklass = branch.current ? 'active' : '';
      cklass = branch.count.total ? '' : 'invisible';
      dclass = branch.current || !branch.local ? 'invisible' : '';
      return this.div({
        "class": "branch " + bklass,
        'data-name': branch.name
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'info'
          }, function() {
            _this.i({
              "class": 'icon chevron-right'
            });
            return _this.span({
              "class": 'clickable',
              click: 'checkout'
            }, branch.name);
          });
          _this.div({
            "class": "right-info " + dclass
          }, function() {
            return _this.i({
              "class": 'icon trash clickable',
              click: 'deleteThis'
            });
          });
          return _this.div({
            "class": "right-info count " + cklass
          }, function() {
            _this.span(branch.count.ahead);
            _this.i({
              "class": 'icon cloud-upload'
            });
            _this.span(branch.count.behind);
            return _this.i({
              "class": 'icon cloud-download'
            });
          });
        };
      })(this));
    };

    BranchItem.prototype.initialize = function(branch) {
      return this.branch = branch;
    };

    BranchItem.prototype.checkout = function() {
      return this.branch.checkout(this.branch.name);
    };

    BranchItem.prototype.deleteThis = function() {
      return this.branch["delete"](this.branch.name);
    };

    return BranchItem;

  })(View);

  module.exports = BranchView = (function(_super) {
    __extends(BranchView, _super);

    function BranchView() {
      return BranchView.__super__.constructor.apply(this, arguments);
    }

    BranchView.content = function(params) {
      return this.div({
        "class": 'branches'
      }, (function(_this) {
        return function() {
          return _this.div({
            click: 'toggleBranch',
            "class": 'heading clickable'
          }, function() {
            _this.i({
              "class": 'icon branch'
            });
            return _this.span(params.name);
          });
        };
      })(this));
    };

    BranchView.prototype.initialize = function(params) {
      this.params = params;
      this.branches = [];
      return this.hidden = false;
    };

    BranchView.prototype.toggleBranch = function() {
      if (this.hidden) {
        this.addAll(this.branches);
      } else {
        this.clearAll();
      }
      return this.hidden = !this.hidden;
    };

    BranchView.prototype.clearAll = function() {
      this.find('>.branch').remove();
    };

    BranchView.prototype.addAll = function(branches) {
      var checkout, remove;
      this.branches = branches;
      this.selectedBranch = git["get" + (this.params.local ? 'Local' : 'Remote') + "Branch"]();
      this.clearAll();
      remove = (function(_this) {
        return function(name) {
          return _this.deleteBranch(name);
        };
      })(this);
      checkout = (function(_this) {
        return function(name) {
          return _this.checkoutBranch(name);
        };
      })(this);
      branches.forEach((function(_this) {
        return function(branch) {
          var count, current;
          current = _this.params.local && branch === _this.selectedBranch;
          count = {
            total: 0
          };
          if (current) {
            count = git.count(branch);
            count.total = count.ahead + count.behind;
            _this.parentView.branchCount(count);
          }
          _this.append(new BranchItem({
            name: branch,
            count: count,
            current: current,
            local: _this.params.local,
            "delete": remove,
            checkout: checkout
          }));
        };
      })(this));
    };

    BranchView.prototype.checkoutBranch = function(name) {
      this.parentView.checkoutBranch(name, !this.params.local);
    };

    BranchView.prototype.deleteBranch = function(name) {
      this.parentView.deleteBranch(name);
    };

    return BranchView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL3ZpZXdzL2JyYW5jaC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FGTixDQUFBOztBQUFBLEVBSU07QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO0FBQ1IsVUFBQSxzQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFZLE1BQU0sQ0FBQyxPQUFWLEdBQXVCLFFBQXZCLEdBQXFDLEVBQTlDLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBWSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWhCLEdBQTJCLEVBQTNCLEdBQW1DLFdBRDVDLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBWSxNQUFNLENBQUMsT0FBUCxJQUFrQixDQUFBLE1BQU8sQ0FBQyxLQUE3QixHQUF3QyxXQUF4QyxHQUF5RCxFQUZsRSxDQUFBO2FBSUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFRLFNBQUEsR0FBUyxNQUFqQjtBQUFBLFFBQTJCLFdBQUEsRUFBYSxNQUFNLENBQUMsSUFBL0M7T0FBTCxFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3hELFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7V0FBTCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsWUFBQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsY0FBQSxPQUFBLEVBQU8sb0JBQVA7YUFBSCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7QUFBQSxjQUFvQixLQUFBLEVBQU8sVUFBM0I7YUFBTixFQUE2QyxNQUFNLENBQUMsSUFBcEQsRUFGa0I7VUFBQSxDQUFwQixDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBUSxhQUFBLEdBQWEsTUFBckI7V0FBTCxFQUFvQyxTQUFBLEdBQUE7bUJBQ2xDLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxzQkFBUDtBQUFBLGNBQStCLEtBQUEsRUFBTyxZQUF0QzthQUFILEVBRGtDO1VBQUEsQ0FBcEMsQ0FIQSxDQUFBO2lCQUtBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBUSxtQkFBQSxHQUFtQixNQUEzQjtXQUFMLEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFuQixDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFILENBREEsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBRkEsQ0FBQTttQkFHQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsY0FBQSxPQUFBLEVBQU8scUJBQVA7YUFBSCxFQUp3QztVQUFBLENBQTFDLEVBTndEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsRUFMUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFpQkEsVUFBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO2FBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQURBO0lBQUEsQ0FqQlosQ0FBQTs7QUFBQSx5QkFvQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQXpCLEVBRFE7SUFBQSxDQXBCVixDQUFBOztBQUFBLHlCQXVCQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFELENBQVAsQ0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQXZCLEVBRFU7SUFBQSxDQXZCWixDQUFBOztzQkFBQTs7S0FEdUIsS0FKekIsQ0FBQTs7QUFBQSxFQStCQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxVQUFQO09BQUwsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxZQUF1QixPQUFBLEVBQU8sbUJBQTlCO1dBQUwsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFlBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLGNBQUEsT0FBQSxFQUFPLGFBQVA7YUFBSCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsSUFBYixFQUZzRDtVQUFBLENBQXhELEVBRHNCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFNQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRFosQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIQTtJQUFBLENBTlosQ0FBQTs7QUFBQSx5QkFXQSxZQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFKO0FBQWdCLFFBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsUUFBVCxDQUFBLENBQWhCO09BQUEsTUFBQTtBQUF1QyxRQUFHLElBQUMsQ0FBQSxRQUFKLENBQUEsQ0FBQSxDQUF2QztPQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFBLElBQUUsQ0FBQSxPQUZDO0lBQUEsQ0FYZixDQUFBOztBQUFBLHlCQWVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sVUFBTixDQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBQSxDQURRO0lBQUEsQ0FmVixDQUFBOztBQUFBLHlCQW1CQSxNQUFBLEdBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsR0FBSSxDQUFDLEtBQUEsR0FBSSxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWCxHQUFzQixPQUF0QixHQUFtQyxRQUFwQyxDQUFKLEdBQWlELFFBQWxELENBQUosQ0FBQSxDQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFBVSxLQUFDLENBQUEsWUFBRCxDQUFjLElBQWQsRUFBVjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlQsQ0FBQTtBQUFBLE1BS0EsUUFBQSxHQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtpQkFBVSxLQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFWO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMWCxDQUFBO0FBQUEsTUFPQSxRQUFRLENBQUMsT0FBVCxDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDZixjQUFBLGNBQUE7QUFBQSxVQUFBLE9BQUEsR0FBVSxLQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsSUFBa0IsTUFBQSxLQUFVLEtBQUMsQ0FBQSxjQUF2QyxDQUFBO0FBQUEsVUFDQSxLQUFBLEdBQVE7QUFBQSxZQUFBLEtBQUEsRUFBTyxDQUFQO1dBRFIsQ0FBQTtBQUdBLFVBQUEsSUFBRyxPQUFIO0FBQ0UsWUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLENBQVIsQ0FBQTtBQUFBLFlBQ0EsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLENBQUMsS0FBTixHQUFjLEtBQUssQ0FBQyxNQURsQyxDQUFBO0FBQUEsWUFHQSxLQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsS0FBeEIsQ0FIQSxDQURGO1dBSEE7QUFBQSxVQVNBLEtBQUMsQ0FBQSxNQUFELENBQVksSUFBQSxVQUFBLENBQ1Y7QUFBQSxZQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsWUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLFlBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxZQUdBLEtBQUEsRUFBTyxLQUFDLENBQUEsTUFBTSxDQUFDLEtBSGY7QUFBQSxZQUlBLFFBQUEsRUFBUSxNQUpSO0FBQUEsWUFLQSxRQUFBLEVBQVUsUUFMVjtXQURVLENBQVosQ0FUQSxDQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FQQSxDQURNO0lBQUEsQ0FuQlIsQ0FBQTs7QUFBQSx5QkFnREEsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxjQUFaLENBQTJCLElBQTNCLEVBQWlDLENBQUEsSUFBRSxDQUFBLE1BQU0sQ0FBQyxLQUExQyxDQUFBLENBRGM7SUFBQSxDQWhEaEIsQ0FBQTs7QUFBQSx5QkFvREEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBeUIsSUFBekIsQ0FBQSxDQURZO0lBQUEsQ0FwRGQsQ0FBQTs7c0JBQUE7O0tBRHVCLEtBaEN6QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/views/branch-view.coffee
