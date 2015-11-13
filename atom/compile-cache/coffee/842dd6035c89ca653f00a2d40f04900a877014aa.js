(function() {
  var $, ErrorView, View, prettyjson, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  prettyjson = require('prettyjson');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  ErrorView = (function(_super) {
    __extends(ErrorView, _super);

    function ErrorView() {
      return ErrorView.__super__.constructor.apply(this, arguments);
    }

    ErrorView.content = function(raw) {
      var message;
      message = _.isString(raw) ? raw : raw.message;
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-bottom atomatigit-error',
            outlet: 'messagePanel'
          }, function() {
            return _this.div({
              "class": 'panel-body padded error-message'
            }, message);
          });
        };
      })(this));
    };

    ErrorView.prototype.initialize = function(error) {
      if (atom.config.get('atomatigit.debug')) {
        console.trace(prettyjson.render(error, {
          noColor: true
        }));
      }
      this.messagePanel.on('click', this.detach);
      atom.views.getView(atom.workspace).appendChild(this.element);
      return setTimeout(((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this)), 10000);
    };

    return ErrorView;

  })(View);

  module.exports = ErrorView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZXJyb3Itdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBYSxPQUFBLENBQVEsUUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUZKLENBQUE7O0FBQUEsRUFLTTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFELEdBQUE7QUFDUixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYSxDQUFDLENBQUMsUUFBRixDQUFXLEdBQVgsQ0FBSCxHQUF3QixHQUF4QixHQUFpQyxHQUFHLENBQUMsT0FBL0MsQ0FBQTthQUNBLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sc0NBQVA7QUFBQSxZQUErQyxNQUFBLEVBQVEsY0FBdkQ7V0FBTCxFQUE0RSxTQUFBLEdBQUE7bUJBQzFFLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxpQ0FBUDthQUFMLEVBQStDLE9BQS9DLEVBRDBFO1VBQUEsQ0FBNUUsRUFERztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUwsRUFGUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx3QkFPQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLFVBQVUsQ0FBQyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCO0FBQUEsVUFBQSxPQUFBLEVBQVMsSUFBVDtTQUF6QixDQUFkLENBQUEsQ0FERjtPQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsWUFBWSxDQUFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsSUFBQyxDQUFBLE1BQTNCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQUMsQ0FBQSxPQUFoRCxDQUpBLENBQUE7YUFLQSxVQUFBLENBQVcsQ0FBQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQsQ0FBWCxFQUEyQixLQUEzQixFQU5VO0lBQUEsQ0FQWixDQUFBOztxQkFBQTs7S0FEc0IsS0FMeEIsQ0FBQTs7QUFBQSxFQXFCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQXJCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/error-view.coffee
