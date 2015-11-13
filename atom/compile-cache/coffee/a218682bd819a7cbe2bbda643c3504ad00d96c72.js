(function() {
  var ErrorView, File, StagedFile, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  File = require('./file');

  ErrorView = require('../../views/error-view');

  StagedFile = (function(_super) {
    __extends(StagedFile, _super);

    function StagedFile() {
      this.getMode = __bind(this.getMode, this);
      this.loadDiff = __bind(this.loadDiff, this);
      this.discardAllChanges = __bind(this.discardAllChanges, this);
      this.kill = __bind(this.kill, this);
      this.unstage = __bind(this.unstage, this);
      return StagedFile.__super__.constructor.apply(this, arguments);
    }

    StagedFile.prototype.sortValue = 2;

    StagedFile.prototype.stage = function() {};

    StagedFile.prototype.unstage = function() {
      return git.unstage(this.path()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    StagedFile.prototype.kill = function() {
      return atom.confirm({
        message: "Discard all changes to \"" + (this.path()) + "\"?",
        buttons: {
          'Discard': this.discardAllChanges,
          'Cancel': function() {}
        }
      });
    };

    StagedFile.prototype.discardAllChanges = function() {
      this.unstage();
      return this.checkout();
    };

    StagedFile.prototype.loadDiff = function() {
      if (this.getMode() === 'D') {
        return;
      }
      return git.getDiff(this.path(), {
        staged: true
      }).then((function(_this) {
        return function(diff) {
          return _this.setDiff(diff);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    StagedFile.prototype.getMode = function() {
      return this.get('modeIndex');
    };

    StagedFile.prototype.isStaged = function() {
      return true;
    };

    return StagedFile;

  })(File);

  module.exports = StagedFile;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2ZpbGVzL3N0YWdlZC1maWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQVksT0FBQSxDQUFRLFFBQVIsQ0FEWixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUZaLENBQUE7O0FBQUEsRUFJTTtBQUdKLGlDQUFBLENBQUE7Ozs7Ozs7OztLQUFBOztBQUFBLHlCQUFBLFNBQUEsR0FBVyxDQUFYLENBQUE7O0FBQUEseUJBR0EsS0FBQSxHQUFPLFNBQUEsR0FBQSxDQUhQLENBQUE7O0FBQUEseUJBTUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFaLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLFNBQUMsS0FBRCxHQUFBO2VBQWUsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFmO01BQUEsQ0FGUCxFQURPO0lBQUEsQ0FOVCxDQUFBOztBQUFBLHlCQWFBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFJLENBQUMsT0FBTCxDQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVUsMkJBQUEsR0FBMEIsQ0FBQyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUQsQ0FBMUIsR0FBbUMsS0FBN0M7QUFBQSxRQUNBLE9BQUEsRUFDRTtBQUFBLFVBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxpQkFBWjtBQUFBLFVBQ0EsUUFBQSxFQUFVLFNBQUEsR0FBQSxDQURWO1NBRkY7T0FERixFQURJO0lBQUEsQ0FiTixDQUFBOztBQUFBLHlCQXFCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQUEsRUFGaUI7SUFBQSxDQXJCbkIsQ0FBQTs7QUFBQSx5QkEwQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBVSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQUEsS0FBYyxHQUF4QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO2FBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQVosRUFBcUI7QUFBQSxRQUFDLE1BQUEsRUFBUSxJQUFUO09BQXJCLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUFVLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFWO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUZQLEVBRlE7SUFBQSxDQTFCVixDQUFBOztBQUFBLHlCQWdDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFMLEVBRE87SUFBQSxDQWhDVCxDQUFBOztBQUFBLHlCQW1DQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBbkNWLENBQUE7O3NCQUFBOztLQUh1QixLQUp6QixDQUFBOztBQUFBLEVBNENBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBNUNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/files/staged-file.coffee
