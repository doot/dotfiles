(function() {
  var Commit, CurrentBranch, ErrorView, LocalBranch, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  LocalBranch = require('./local-branch');

  Commit = require('../commits').Commit;

  ErrorView = require('../../views/error-view');

  CurrentBranch = (function(_super) {
    __extends(CurrentBranch, _super);

    function CurrentBranch() {
      this.reload = __bind(this.reload, this);
      return CurrentBranch.__super__.constructor.apply(this, arguments);
    }

    CurrentBranch.prototype.initialize = function(branchExisting) {
      if (branchExisting) {
        return this.reload();
      }
    };

    CurrentBranch.prototype.reload = function(_arg) {
      var silent;
      silent = (_arg != null ? _arg : {}).silent;
      return git.revParse('HEAD', {
        'abbrev-ref': true
      }).then((function(_this) {
        return function(name) {
          _this.name = name;
          return git.getCommit('HEAD').then(function(gitCommit) {
            _this.commit = new Commit(gitCommit);
            if (!silent) {
              _this.trigger('repaint');
              if (atom.config.get('atomatigit.display_commit_comparisons')) {
                return _this.compareCommits();
              }
            }
          });
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    CurrentBranch.prototype.head = function() {
      return 'HEAD';
    };

    CurrentBranch.prototype["delete"] = function() {};

    CurrentBranch.prototype.checkout = function() {};

    return CurrentBranch;

  })(LocalBranch);

  module.exports = CurrentBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2JyYW5jaGVzL2N1cnJlbnQtYnJhbmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBYyxPQUFBLENBQVEsV0FBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVDLFNBQWEsT0FBQSxDQUFRLFlBQVIsRUFBYixNQUZELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBSGQsQ0FBQTs7QUFBQSxFQU1NO0FBSUosb0NBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSw0QkFBQSxVQUFBLEdBQVksU0FBQyxjQUFELEdBQUE7QUFDVixNQUFBLElBQWEsY0FBYjtlQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtPQURVO0lBQUEsQ0FBWixDQUFBOztBQUFBLDRCQUlBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFVBQUEsTUFBQTtBQUFBLE1BRFEseUJBQUQsT0FBUyxJQUFSLE1BQ1IsQ0FBQTthQUFBLEdBQUcsQ0FBQyxRQUFKLENBQWEsTUFBYixFQUFxQjtBQUFBLFFBQUEsWUFBQSxFQUFjLElBQWQ7T0FBckIsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBRSxJQUFGLEdBQUE7QUFDNUMsVUFENkMsS0FBQyxDQUFBLE9BQUEsSUFDOUMsQ0FBQTtpQkFBQSxHQUFHLENBQUMsU0FBSixDQUFjLE1BQWQsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLFNBQUQsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxNQUFBLENBQU8sU0FBUCxDQUFkLENBQUE7QUFDQSxZQUFBLElBQUcsQ0FBQSxNQUFIO0FBQ0UsY0FBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFNBQVQsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxJQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLENBQXJCO3VCQUFBLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBQTtlQUZGO2FBRnlCO1VBQUEsQ0FBM0IsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QyxDQU1BLENBQUMsT0FBRCxDQU5BLENBTU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQU5QLEVBRE07SUFBQSxDQUpSLENBQUE7O0FBQUEsNEJBZ0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixPQURJO0lBQUEsQ0FoQk4sQ0FBQTs7QUFBQSw0QkFvQkEsU0FBQSxHQUFRLFNBQUEsR0FBQSxDQXBCUixDQUFBOztBQUFBLDRCQXdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBLENBeEJWLENBQUE7O3lCQUFBOztLQUowQixZQU41QixDQUFBOztBQUFBLEVBb0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBcENqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/branches/current-branch.coffee
