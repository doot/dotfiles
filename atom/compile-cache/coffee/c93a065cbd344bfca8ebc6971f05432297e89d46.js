(function() {
  var Branch, ErrorView, LocalBranch, OutputView, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  Branch = require('./branch');

  ErrorView = require('../../views/error-view');

  OutputView = require('../../views/output-view');

  LocalBranch = (function(_super) {
    __extends(LocalBranch, _super);

    function LocalBranch() {
      this.push = __bind(this.push, this);
      this.checkout = __bind(this.checkout, this);
      this["delete"] = __bind(this["delete"], this);
      this.unpushed = __bind(this.unpushed, this);
      this.getTrackingBranch = __bind(this.getTrackingBranch, this);
      this.compareCommits = __bind(this.compareCommits, this);
      return LocalBranch.__super__.constructor.apply(this, arguments);
    }

    LocalBranch.prototype.remote = false;

    LocalBranch.prototype.local = true;

    LocalBranch.prototype.initialize = function() {
      if (atom.config.get('atomatigit.display_commit_comparisons')) {
        return this.compareCommits();
      }
    };

    LocalBranch.prototype.compareCommits = function() {
      var comparison, name;
      this.comparison = comparison = '';
      name = this.localName().trim();
      return this.getTrackingBranch(name).then((function(_this) {
        return function() {
          var tracking_branch;
          if (_this.tracking_branch === '') {
            _this.comparison = 'No upstream configured';
            return _this.trigger('comparison-loaded');
          }
          tracking_branch = _this.tracking_branch;
          return git.cmd("rev-list --count " + name + "@{u}.." + name).then(function(output) {
            var number;
            number = +output.trim();
            if (number !== 0) {
              comparison = _this.getComparisonString(number, 'ahead of', tracking_branch);
            }
            return git.cmd("rev-list --count " + name + ".." + name + "@{u}").then(function(output) {
              number = +output.trim();
              if (number !== 0) {
                if (comparison !== '') {
                  comparison += '<br>';
                }
                comparison += _this.getComparisonString(number, 'behind', tracking_branch);
              } else if (comparison === '') {
                comparison = "Up-to-date with " + tracking_branch;
              }
              _this.comparison = comparison;
              return _this.trigger('comparison-loaded');
            });
          });
        };
      })(this));
    };

    LocalBranch.prototype.getTrackingBranch = function(name) {
      this.tracking_branch = '';
      return git.cmd("config branch." + name + ".remote").then((function(_this) {
        return function(output) {
          var remote;
          output = output.trim();
          remote = "" + output + "/";
          return git.cmd("config branch." + name + ".merge").then(function(output) {
            return _this.tracking_branch = remote + output.trim().replace('refs/heads/', '');
          });
        };
      })(this))["catch"](function() {
        return '';
      });
    };

    LocalBranch.prototype.getComparisonString = function(number, ahead_of_or_behind, tracking_branch) {
      var str;
      str = "" + number + " commit";
      if (number !== 1) {
        str += "s";
      }
      str += " " + ahead_of_or_behind + " ";
      return str += tracking_branch;
    };

    LocalBranch.prototype.unpushed = function() {
      return this.get('unpushed');
    };

    LocalBranch.prototype["delete"] = function() {
      return git.cmd('branch', {
        D: true
      }, this.getName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    LocalBranch.prototype.remoteName = function() {
      return '';
    };

    LocalBranch.prototype.checkout = function(callback) {
      return git.checkout(this.localName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    LocalBranch.prototype.push = function(remote) {
      if (remote == null) {
        remote = 'origin';
      }
      return git.cmd('push', [remote, this.getName()]).then((function(_this) {
        return function() {
          _this.trigger('update');
          return new OutputView('Pushing to remote repository successful');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    return LocalBranch;

  })(Branch);

  module.exports = LocalBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2JyYW5jaGVzL2xvY2FsLWJyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBYSxPQUFBLENBQVEsd0JBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx5QkFBUixDQUhiLENBQUE7O0FBQUEsRUFNTTtBQUVKLGtDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSwwQkFBQSxNQUFBLEdBQVEsS0FBUixDQUFBOztBQUFBLDBCQUNBLEtBQUEsR0FBTyxJQURQLENBQUE7O0FBQUEsMEJBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixDQUFyQjtlQUFBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFBQTtPQURVO0lBQUEsQ0FKWixDQUFBOztBQUFBLDBCQVVBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxnQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQUFBLEdBQWEsRUFBM0IsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBWSxDQUFDLElBQWIsQ0FBQSxDQURQLENBQUE7YUFFQSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/branches/local-branch.coffee
