(function() {
  var ErrorView, File, UnstagedFile, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  File = require('./file');

  git = require('../../git');

  ErrorView = require('../../views/error-view');

  module.exports = UnstagedFile = (function(_super) {
    __extends(UnstagedFile, _super);

    function UnstagedFile() {
      this.getMode = __bind(this.getMode, this);
      this.loadDiff = __bind(this.loadDiff, this);
      this.kill = __bind(this.kill, this);
      this.unstage = __bind(this.unstage, this);
      return UnstagedFile.__super__.constructor.apply(this, arguments);
    }

    UnstagedFile.prototype.sortValue = 1;

    UnstagedFile.prototype.unstage = function() {
      return git.unstage(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    UnstagedFile.prototype.kill = function() {
      return atom.confirm({
        message: "Discard unstaged changes to \"" + (this.path()) + "\"?",
        buttons: {
          'Discard': this.checkout,
          'Cancel': function() {}
        }
      });
    };

    UnstagedFile.prototype.loadDiff = function() {
      if (this.getMode() === 'D') {
        return;
      }
      return git.getDiff(this.path()).then((function(_this) {
        return function(diff) {
          return _this.setDiff(diff);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    UnstagedFile.prototype.getMode = function() {
      return this.get('modeWorkingTree');
    };

    UnstagedFile.prototype.isUnstaged = function() {
      return true;
    };

    return UnstagedFile;

  })(File);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2ZpbGVzL3Vuc3RhZ2VkLWZpbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQURaLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFHSixtQ0FBQSxDQUFBOzs7Ozs7OztLQUFBOztBQUFBLDJCQUFBLFNBQUEsR0FBVyxDQUFYLENBQUE7O0FBQUEsMkJBRUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFaLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLFNBQUMsS0FBRCxHQUFBO2VBQWUsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFmO01BQUEsQ0FGUCxFQURPO0lBQUEsQ0FGVCxDQUFBOztBQUFBLDJCQU9BLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFJLENBQUMsT0FBTCxDQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVUsZ0NBQUEsR0FBK0IsQ0FBQyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUQsQ0FBL0IsR0FBd0MsS0FBbEQ7QUFBQSxRQUNBLE9BQUEsRUFDRTtBQUFBLFVBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxRQUFaO0FBQUEsVUFDQSxRQUFBLEVBQVUsU0FBQSxHQUFBLENBRFY7U0FGRjtPQURGLEVBREk7SUFBQSxDQVBOLENBQUE7O0FBQUEsMkJBY0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBVSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQUEsS0FBYyxHQUF4QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQVosQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQVUsS0FBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQVY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBRUEsQ0FBQyxPQUFELENBRkEsQ0FFTyxTQUFDLEtBQUQsR0FBQTtlQUFlLElBQUEsU0FBQSxDQUFVLEtBQVYsRUFBZjtNQUFBLENBRlAsRUFGUTtJQUFBLENBZFYsQ0FBQTs7QUFBQSwyQkFvQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxHQUFELENBQUssaUJBQUwsRUFETztJQUFBLENBcEJULENBQUE7O0FBQUEsMkJBdUJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0F2QlosQ0FBQTs7d0JBQUE7O0tBSHlCLEtBTDNCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/files/unstaged-file.coffee
