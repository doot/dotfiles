(function() {
  var File, UntrackedFile, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  File = require('./file');

  module.exports = UntrackedFile = (function(_super) {
    __extends(UntrackedFile, _super);

    function UntrackedFile() {
      this.moveToTrash = __bind(this.moveToTrash, this);
      this.kill = __bind(this.kill, this);
      return UntrackedFile.__super__.constructor.apply(this, arguments);
    }

    UntrackedFile.prototype.sortValue = 0;

    UntrackedFile.prototype.kill = function() {
      return atom.confirm({
        message: "Move \"" + (this.path()) + "\" to trash?",
        buttons: {
          'Trash': this.moveToTrash,
          'Cancel': null
        }
      });
    };

    UntrackedFile.prototype.moveToTrash = function() {
      return this.trigger('update');
    };

    UntrackedFile.prototype.isUntracked = function() {
      return true;
    };

    UntrackedFile.prototype.toggleDiff = function() {};

    return UntrackedFile;

  })(File);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2ZpbGVzL3VudHJhY2tlZC1maWxlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTyxPQUFBLENBQVEsV0FBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUdKLG9DQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLDRCQUFBLFNBQUEsR0FBVyxDQUFYLENBQUE7O0FBQUEsNEJBRUEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUksQ0FBQyxPQUFMLENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBVSxTQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUQsQ0FBUixHQUFpQixjQUEzQjtBQUFBLFFBQ0EsT0FBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQVMsSUFBQyxDQUFBLFdBQVY7QUFBQSxVQUNBLFFBQUEsRUFBVSxJQURWO1NBRkY7T0FERixFQURJO0lBQUEsQ0FGTixDQUFBOztBQUFBLDRCQVNBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFFWCxJQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFGVztJQUFBLENBVGIsQ0FBQTs7QUFBQSw0QkFhQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBYmIsQ0FBQTs7QUFBQSw0QkFlQSxVQUFBLEdBQVksU0FBQSxHQUFBLENBZlosQ0FBQTs7eUJBQUE7O0tBSDBCLEtBSjVCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/files/untracked-file.coffee
