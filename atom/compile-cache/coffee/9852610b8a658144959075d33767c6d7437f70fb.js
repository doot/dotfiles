(function() {
  var CommitListView, CommitView, CompositeDisposable, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  CommitView = require('./commit-view');

  CommitListView = (function(_super) {
    __extends(CommitListView, _super);

    function CommitListView() {
      this.repaint = __bind(this.repaint, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return CommitListView.__super__.constructor.apply(this, arguments);
    }

    CommitListView.content = function() {
      return this.div({
        "class": 'commit-list-view list-view',
        tabindex: -1
      });
    };

    CommitListView.prototype.initialize = function(model) {
      this.model = model;
    };

    CommitListView.prototype.attached = function() {
      this.model.on('repaint', this.repaint);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add(this.element, {
        'atomatigit:showCommit': (function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.model.selection()) != null ? typeof _ref.showCommit === "function" ? _ref.showCommit() : void 0 : void 0;
          };
        })(this),
        'atomatigit:hard-reset-to-commit': (function(_this) {
          return function() {
            var _ref;
            return (_ref = _this.model.selection()) != null ? _ref.confirmHardReset() : void 0;
          };
        })(this)
      }));
    };

    CommitListView.prototype.detached = function() {
      this.model.off('repaint', this.repaint);
      return this.subscriptions.dispose();
    };

    CommitListView.prototype.repaint = function() {
      this.empty();
      return _.each(this.model.models, (function(_this) {
        return function(commit) {
          return _this.append(new CommitView(commit));
        };
      })(this));
    };

    return CommitListView;

  })(View);

  module.exports = CommitListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvY29tbWl0cy9jb21taXQtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3REFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU9NO0FBQ0oscUNBQUEsQ0FBQTs7Ozs7OztLQUFBOztBQUFBLElBQUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNEJBQVA7QUFBQSxRQUFxQyxRQUFBLEVBQVUsQ0FBQSxDQUEvQztPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNkJBSUEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQUpaLENBQUE7O0FBQUEsNkJBT0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsU0FBVixFQUFxQixJQUFDLENBQUEsT0FBdEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNqQjtBQUFBLFFBQUEsdUJBQUEsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFBRyxnQkFBQSxJQUFBOzBHQUFrQixDQUFFLCtCQUF2QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO0FBQUEsUUFDQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNqQyxnQkFBQSxJQUFBO2tFQUFrQixDQUFFLGdCQUFwQixDQUFBLFdBRGlDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEbkM7T0FEaUIsQ0FBbkIsRUFIUTtJQUFBLENBUFYsQ0FBQTs7QUFBQSw2QkFnQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsU0FBWCxFQUFzQixJQUFDLENBQUEsT0FBdkIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFGUTtJQUFBLENBaEJWLENBQUE7O0FBQUEsNkJBcUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQWQsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUMsQ0FBQSxNQUFELENBQVksSUFBQSxVQUFBLENBQVcsTUFBWCxDQUFaLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixFQUZPO0lBQUEsQ0FyQlQsQ0FBQTs7MEJBQUE7O0tBRDJCLEtBUDdCLENBQUE7O0FBQUEsRUFpQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FqQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/commits/commit-list-view.coffee
