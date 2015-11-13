(function() {
  var Branch, Commit, ErrorView, ListItem, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  ListItem = require('../list-item');

  Commit = require('../commits/commit');

  ErrorView = require('../../views/error-view');

  Branch = (function(_super) {
    __extends(Branch, _super);

    function Branch() {
      this.checkout = __bind(this.checkout, this);
      this.open = __bind(this.open, this);
      this.kill = __bind(this.kill, this);
      return Branch.__super__.constructor.apply(this, arguments);
    }

    Branch.prototype.getName = function() {
      return decodeURIComponent(escape(this.get('name') || this.name));
    };

    Branch.prototype.localName = function() {
      return this.getName();
    };

    Branch.prototype.head = function() {
      return this.get('commit').ref;
    };

    Branch.prototype.commit = function() {
      return new Commit(this.get('commit'));
    };

    Branch.prototype.remoteName = function() {
      return '';
    };

    Branch.prototype.unpushed = function() {
      return false;
    };

    Branch.prototype.kill = function() {
      return atom.confirm({
        message: "Delete branch " + (this.getName()) + "?",
        buttons: {
          'Delete': this["delete"],
          'Cancel': null
        }
      });
    };

    Branch.prototype.open = function() {
      return this.checkout();
    };

    Branch.prototype.checkout = function(callback) {
      return git.checkout(this.localName()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Branch.prototype.push = function() {};

    Branch.prototype["delete"] = function() {};

    return Branch;

  })(ListItem);

  module.exports = Branch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2JyYW5jaGVzL2JyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRFosQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUhaLENBQUE7O0FBQUEsRUFLTTtBQUlKLDZCQUFBLENBQUE7Ozs7Ozs7S0FBQTs7QUFBQSxxQkFBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBR1Asa0JBQUEsQ0FBbUIsTUFBQSxDQUFPLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxDQUFBLElBQWdCLElBQUMsQ0FBQSxJQUF4QixDQUFuQixFQUhPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLHFCQVFBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsT0FBRCxDQUFBLEVBRFM7SUFBQSxDQVJYLENBQUE7O0FBQUEscUJBY0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxHQUFELENBQUssUUFBTCxDQUFjLENBQUMsSUFEWDtJQUFBLENBZE4sQ0FBQTs7QUFBQSxxQkFvQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNGLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxHQUFELENBQUssUUFBTCxDQUFQLEVBREU7SUFBQSxDQXBCUixDQUFBOztBQUFBLHFCQTBCQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsR0FBSDtJQUFBLENBMUJaLENBQUE7O0FBQUEscUJBK0JBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0EvQlYsQ0FBQTs7QUFBQSxxQkFrQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUksQ0FBQyxPQUFMLENBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBVSxnQkFBQSxHQUFlLENBQUMsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFELENBQWYsR0FBMkIsR0FBckM7QUFBQSxRQUNBLE9BQUEsRUFDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQUFBLENBQVg7QUFBQSxVQUNBLFFBQUEsRUFBVSxJQURWO1NBRkY7T0FERixFQURJO0lBQUEsQ0FsQ04sQ0FBQTs7QUFBQSxxQkEwQ0EsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxRQUFELENBQUEsRUFESTtJQUFBLENBMUNOLENBQUE7O0FBQUEscUJBZ0RBLFFBQUEsR0FBVSxTQUFDLFFBQUQsR0FBQTthQUNSLEdBQUcsQ0FBQyxRQUFKLENBQWEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFiLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLFNBQUMsS0FBRCxHQUFBO2VBQWUsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFmO01BQUEsQ0FGUCxFQURRO0lBQUEsQ0FoRFYsQ0FBQTs7QUFBQSxxQkFzREEsSUFBQSxHQUFNLFNBQUEsR0FBQSxDQXRETixDQUFBOztBQUFBLHFCQXlEQSxTQUFBLEdBQVEsU0FBQSxHQUFBLENBekRSLENBQUE7O2tCQUFBOztLQUptQixTQUxyQixDQUFBOztBQUFBLEVBb0VBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BcEVqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/branches/branch.coffee
