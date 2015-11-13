(function() {
  var Commit, CommitList, ErrorView, List, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  List = require('../list');

  Commit = require('./commit');

  ErrorView = require('../../views/error-view');

  CommitList = (function(_super) {
    __extends(CommitList, _super);

    function CommitList() {
      this.reload = __bind(this.reload, this);
      return CommitList.__super__.constructor.apply(this, arguments);
    }

    CommitList.prototype.model = Commit;

    CommitList.prototype.reload = function(branch, options) {
      var _ref, _ref1, _ref2;
      this.branch = branch;
      if (options == null) {
        options = {};
      }
      if (_.isPlainObject(this.branch)) {
        _ref = [null, this.branch], this.branch = _ref[0], options = _ref[1];
      }
      return git.log((_ref1 = (_ref2 = this.branch) != null ? _ref2.head() : void 0) != null ? _ref1 : 'HEAD').then((function(_this) {
        return function(commits) {
          _this.reset(_.map(commits, function(commit) {
            return new Commit(commit);
          }));
          if (!options.silent) {
            _this.trigger('repaint');
          }
          return _this.select(_this.selectedIndex);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    return CommitList;

  })(List);

  module.exports = CommitList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2NvbW1pdHMvY29tbWl0LWxpc3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQURULENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQVMsT0FBQSxDQUFRLFNBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsd0JBQVIsQ0FKWixDQUFBOztBQUFBLEVBTU07QUFDSixpQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLHlCQUFBLEtBQUEsR0FBTyxNQUFQLENBQUE7O0FBQUEseUJBS0EsTUFBQSxHQUFRLFNBQUUsTUFBRixFQUFVLE9BQVYsR0FBQTtBQUNOLFVBQUEsa0JBQUE7QUFBQSxNQURPLElBQUMsQ0FBQSxTQUFBLE1BQ1IsQ0FBQTs7UUFEZ0IsVUFBUTtPQUN4QjtBQUFBLE1BQUEsSUFBd0MsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLENBQXhDO0FBQUEsUUFBQSxPQUFxQixDQUFDLElBQUQsRUFBTyxJQUFDLENBQUEsTUFBUixDQUFyQixFQUFDLElBQUMsQ0FBQSxnQkFBRixFQUFVLGlCQUFWLENBQUE7T0FBQTthQUNBLEdBQUcsQ0FBQyxHQUFKLG1GQUEwQixNQUExQixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNKLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxDQUFDLENBQUMsR0FBRixDQUFNLE9BQU4sRUFBZSxTQUFDLE1BQUQsR0FBQTttQkFBZ0IsSUFBQSxNQUFBLENBQU8sTUFBUCxFQUFoQjtVQUFBLENBQWYsQ0FBUCxDQUFBLENBQUE7QUFDQSxVQUFBLElBQUEsQ0FBQSxPQUFrQyxDQUFDLE1BQW5DO0FBQUEsWUFBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFNBQVQsQ0FBQSxDQUFBO1dBREE7aUJBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBUSxLQUFDLENBQUEsYUFBVCxFQUhJO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUtBLENBQUMsT0FBRCxDQUxBLENBS08sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUxQLEVBRk07SUFBQSxDQUxSLENBQUE7O3NCQUFBOztLQUR1QixLQU56QixDQUFBOztBQUFBLEVBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBckJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/commits/commit-list.coffee
