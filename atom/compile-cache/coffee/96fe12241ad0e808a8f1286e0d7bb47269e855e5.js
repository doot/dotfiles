(function() {
  var Branch, ErrorView, RemoteBranch, git,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../../git');

  Branch = require('./branch');

  ErrorView = require('../../views/error-view');

  RemoteBranch = (function(_super) {
    __extends(RemoteBranch, _super);

    function RemoteBranch() {
      this["delete"] = __bind(this["delete"], this);
      return RemoteBranch.__super__.constructor.apply(this, arguments);
    }

    RemoteBranch.prototype.remote = true;

    RemoteBranch.prototype.local = false;

    RemoteBranch.prototype["delete"] = function() {
      return git.cmd("push -f " + (this.remoteName()) + " :" + (this.localName())).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    RemoteBranch.prototype.localName = function() {
      return this.getName().replace(/.*?\//, '');
    };

    RemoteBranch.prototype.remoteName = function() {
      return this.getName().replace(/\/.*/, '');
    };

    return RemoteBranch;

  })(Branch);

  module.exports = RemoteBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2JyYW5jaGVzL3JlbW90ZS1icmFuY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBWSxPQUFBLENBQVEsVUFBUixDQURaLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLHdCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlNO0FBRUosbUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSwyQkFBQSxNQUFBLEdBQVEsSUFBUixDQUFBOztBQUFBLDJCQUNBLEtBQUEsR0FBTyxLQURQLENBQUE7O0FBQUEsMkJBTUEsU0FBQSxHQUFRLFNBQUEsR0FBQTthQUNOLEdBQUcsQ0FBQyxHQUFKLENBQVMsVUFBQSxHQUFTLENBQUMsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFELENBQVQsR0FBd0IsSUFBeEIsR0FBMkIsQ0FBQyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUQsQ0FBcEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBZSxJQUFBLFNBQUEsQ0FBVSxLQUFWLEVBQWY7TUFBQSxDQUZQLEVBRE07SUFBQSxDQU5SLENBQUE7O0FBQUEsMkJBY0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsT0FBbkIsRUFBNEIsRUFBNUIsRUFEUztJQUFBLENBZFgsQ0FBQTs7QUFBQSwyQkFvQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsRUFBMkIsRUFBM0IsRUFEVTtJQUFBLENBcEJaLENBQUE7O3dCQUFBOztLQUZ5QixPQUozQixDQUFBOztBQUFBLEVBNkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBN0JqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/branches/remote-branch.coffee
