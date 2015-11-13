(function() {
  var Diff, ErrorView, File, ListItem, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  Diff = require('../diffs/diff');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  File = (function(_super) {
    __extends(File, _super);

    function File() {
      this.checkout = __bind(this.checkout, this);
      this.commitMessage = __bind(this.commitMessage, this);
      this.open = __bind(this.open, this);
      this.useSublist = __bind(this.useSublist, this);
      this.toggleDiff = __bind(this.toggleDiff, this);
      this.setDiff = __bind(this.setDiff, this);
      this.stage = __bind(this.stage, this);
      this.diff = __bind(this.diff, this);
      this.showDiffP = __bind(this.showDiffP, this);
      this.path = __bind(this.path, this);
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.initialize = function(file) {
      this.set(file);
      this.set({
        diff: false
      });
      this.loadDiff();
      return this.deselect();
    };

    File.prototype.path = function() {
      return this.get('path');
    };

    File.prototype.showDiffP = function() {
      return this.get('diff');
    };

    File.prototype.diff = function() {
      return this.sublist;
    };

    File.prototype.stage = function() {
      return git.add(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    File.prototype.setDiff = function(diff) {
      this.sublist = new Diff(diff);
      return this.trigger('change:diff');
    };

    File.prototype.toggleDiff = function() {
      return this.set({
        diff: !this.get('diff')
      });
    };

    File.prototype.useSublist = function() {
      return this.showDiffP();
    };

    File.prototype.open = function() {
      return atom.workspace.open(this.path());
    };

    File.prototype.commitMessage = function() {
      var switchState;
      switchState = function(type) {
        switch (type) {
          case 'M':
            return 'modified:   ';
          case 'R':
            return 'renamed:    ';
          case 'D':
            return 'deleted:    ';
          case 'A':
            return 'new file:   ';
          default:
            return '';
        }
      };
      return "#\t\t" + (switchState(this.getMode())) + (this.path()) + "\n";
    };

    File.prototype.checkout = function() {
      return git.checkoutFile(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    File.prototype.unstage = function() {};

    File.prototype.kill = function() {};

    File.prototype.loadDiff = function() {};

    File.prototype.getMode = function() {};

    File.prototype.isStaged = function() {
      return false;
    };

    File.prototype.isUnstaged = function() {
      return false;
    };

    File.prototype.isUntracked = function() {
      return false;
    };

    return File;

  })(ListItem);

  module.exports = File;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2ZpbGVzL2ZpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQVksT0FBQSxDQUFRLGVBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsd0JBQVIsQ0FMWixDQUFBOztBQUFBLEVBT007QUFJSiwyQkFBQSxDQUFBOzs7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLG1CQUFBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsSUFBQSxFQUFNLEtBQU47T0FBTCxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUpVO0lBQUEsQ0FBWixDQUFBOztBQUFBLG1CQVNBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFESTtJQUFBLENBVE4sQ0FBQTs7QUFBQSxtQkFlQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLEVBRFM7SUFBQSxDQWZYLENBQUE7O0FBQUEsbUJBcUJBLElB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/files/file.coffee
