(function() {
  var Dialog, PushDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = PushDialog = (function(_super) {
    __extends(PushDialog, _super);

    function PushDialog() {
      return PushDialog.__super__.constructor.apply(this, arguments);
    }

    PushDialog.content = function() {
      return this.div({
        "class": 'dialog'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon x clickable',
              click: 'cancel'
            });
            return _this.strong('Push');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.div(function() {
              return _this.button({
                click: 'upstream'
              }, function() {
                return _this.p('Push upstream', function() {
                  return _this.i({
                    "class": 'icon push'
                  });
                });
              });
            });
            _this.label('Push from branch');
            _this.input({
              "class": 'native-key-bindings',
              readonly: true,
              outlet: 'fromBranch'
            });
            _this.label('To branch');
            return _this.select({
              "class": 'native-key-bindings',
              outlet: 'toBranch'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'push'
            }, function() {
              _this.i({
                "class": 'icon push'
              });
              return _this.span('Push');
            });
            return _this.button({
              click: 'cancel'
            }, function() {
              _this.i({
                "class": 'icon x'
              });
              return _this.span('Cancel');
            });
          });
        };
      })(this));
    };

    PushDialog.prototype.activate = function(remotes) {
      var remote, _i, _len;
      this.fromBranch.val(git.getLocalBranch());
      this.toBranch.find('option').remove();
      for (_i = 0, _len = remotes.length; _i < _len; _i++) {
        remote = remotes[_i];
        this.toBranch.append("<option value='" + remote + "'>" + remote + "</option>");
      }
      return PushDialog.__super__.activate.call(this);
    };

    PushDialog.prototype.push = function() {
      var branch, remote;
      this.deactivate();
      remote = this.toBranch.val().split('/')[0];
      branch = this.toBranch.val().split('/')[1];
      this.parentView.push(remote, branch);
    };

    PushDialog.prototype.upstream = function() {
      this.deactivate();
      return this.parentView.push('', '');
    };

    return PushDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL2RpYWxvZ3MvcHVzaC1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFlBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsY0FBMEIsS0FBQSxFQUFPLFFBQWpDO2FBQUgsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsTUFBUixFQUZxQjtVQUFBLENBQXZCLENBQUEsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7V0FBTCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtxQkFDSCxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLFVBQVA7ZUFB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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/dialogs/push-dialog.coffee
