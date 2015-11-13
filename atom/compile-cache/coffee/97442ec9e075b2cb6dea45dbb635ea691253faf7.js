(function() {
  var Dialog, FlowDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = FlowDialog = (function(_super) {
    __extends(FlowDialog, _super);

    function FlowDialog() {
      return FlowDialog.__super__.constructor.apply(this, arguments);
    }

    FlowDialog.content = function() {
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
            return _this.strong('Workflow - GitFlow');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Git Flow ');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowType',
              change: 'flowTypeChange'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowAction',
              change: 'flowActionChange'
            });
            _this.label('Branch Name:', {
              outlet: 'labelBranchName'
            });
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'branchName'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'branchChoose'
            });
            _this.label('Message:', {
              outlet: 'labelMessage'
            });
            return _this.textarea({
              "class": 'native-key-bindings',
              outlet: 'message'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'flow'
            }, function() {
              _this.i({
                "class": 'icon flow'
              });
              return _this.span('Ok');
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

    FlowDialog.prototype.activate = function(branches) {
      var current;
      current = git.getLocalBranch();
      this.branches = branches;
      this.flowType.find('option').remove();
      this.flowType.append("<option value='feature'>feature</option>");
      this.flowType.append("<option value='release'>release</option>");
      this.flowType.append("<option value='hotfix'>hotfix</option>");
      this.flowType.append("<option value='init'>init</option>");
      this.flowAction.find('option').remove();
      this.flowAction.append("<option value='start'>start</option>");
      this.flowAction.append("<option value='finish'>finish</option>");
      this.flowAction.append("<option value='publish'>publish</option>");
      this.flowAction.append("<option value='pull'>pull</option>");
      this.flowTypeChange();
      this.flowActionChange();
      return FlowDialog.__super__.activate.call(this);
    };

    FlowDialog.prototype.flow = function() {
      var actionSelected, branchSelected;
      this.deactivate();
      if (this.flowType.val() === "init") {
        this.parentView.flow(this.flowType.val(), '-d', '');
      } else {
        branchSelected = this.branchName.val() !== '' ? this.branchName.val() : this.branchChoose.val();
        actionSelected = this.flowAction.val();
        if ((branchSelected != null) && branchSelected !== '') {
          if (actionSelected === "finish" && this.message.val() !== '') {
            actionSelected = 'finish -m "' + this.message.val() + '"';
          }
          this.parentView.flow(this.flowType.val(), actionSelected, branchSelected);
        } else {
          git.alert("> No branches selected... Git flow action not valid.");
        }
      }
    };

    FlowDialog.prototype.checkMessageNeeded = function() {
      this.message.val("");
      if (this.flowAction.val() === "finish" && (this.flowType.val() === "release" || this.flowType.val() === "hotfix")) {
        this.message.show();
        this.labelMessage.show();
      } else {
        this.message.hide();
        this.labelMessage.hide();
      }
    };

    FlowDialog.prototype.flowTypeChange = function() {
      if (this.flowType.val() === "init") {
        this.flowAction.hide();
        this.branchName.hide();
        this.branchChoose.hide();
        this.labelBranchName.hide();
      } else {
        this.flowAction.show();
        this.flowActionChange();
        this.labelBranchName.show();
      }
      this.checkMessageNeeded();
    };

    FlowDialog.prototype.flowActionChange = function() {
      var branch, value, _i, _len, _ref;
      this.checkMessageNeeded();
      if (this.flowAction.val() !== "start") {
        this.branchName.hide();
        this.branchName.val('');
        this.branchChoose.find('option').remove();
        _ref = this.branches;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          branch = _ref[_i];
          if (branch.indexOf(this.flowType.val()) !== -1) {
            value = branch.replace(this.flowType.val() + '/', '');
            this.branchChoose.append("<option value='" + value + "'>" + value + "</option>");
          }
        }
        if (this.branchChoose.find('option').length <= 0) {
          this.branchChoose.append("<option value=''> --no " + this.flowType.val() + " branches--</option>");
        }
        return this.branchChoose.show();
      } else {
        this.branchName.show();
        this.branchChoose.val('');
        return this.branchChoose.hide();
      }
    };

    return FlowDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL2RpYWxvZ3MvZmxvdy1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFlBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsY0FBMkIsS0FBQSxFQUFPLFFBQWxDO2FBQUgsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsb0JBQVIsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO1dBQUwsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxXQUFQLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFP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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/dialogs/flow-dialog.coffee
