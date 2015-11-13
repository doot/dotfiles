(function() {
  var Dialog, MergeDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = MergeDialog = (function(_super) {
    __extends(MergeDialog, _super);

    function MergeDialog() {
      return MergeDialog.__super__.constructor.apply(this, arguments);
    }

    MergeDialog.content = function() {
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
            return _this.strong('Merge');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Current Branch');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              readonly: true,
              outlet: 'toBranch'
            });
            _this.label('Merge From Branch');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'fromBranch'
            });
            return _this.div(function() {
              _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'noff'
              });
              return _this.label('No Fast-Forward');
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'merge'
            }, function() {
              _this.i({
                "class": 'icon merge'
              });
              return _this.span('Merge');
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

    MergeDialog.prototype.activate = function(branches) {
      var branch, current, _i, _len;
      current = git.getLocalBranch();
      this.toBranch.val(current);
      this.fromBranch.find('option').remove();
      for (_i = 0, _len = branches.length; _i < _len; _i++) {
        branch = branches[_i];
        if (branch !== current) {
          this.fromBranch.append("<option value='" + branch + "'>" + branch + "</option>");
        }
      }
      return MergeDialog.__super__.activate.call(this);
    };

    MergeDialog.prototype.merge = function() {
      this.deactivate();
      this.parentView.merge(this.fromBranch.val(), this.noFF());
    };

    MergeDialog.prototype.noFF = function() {
      return this.noff.is(':checked');
    };

    return MergeDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL2RpYWxvZ3MvbWVyZ2UtZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFMLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLGNBQTJCLEtBQUEsRUFBTyxRQUFsQzthQUFILENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO1dBQUwsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLE9BQUEsRUFB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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/dialogs/merge-dialog.coffee
