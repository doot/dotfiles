(function() {
  var $, OutputView, View, prettyjson, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  prettyjson = require('prettyjson');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  OutputView = (function(_super) {
    __extends(OutputView, _super);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.content = function(raw) {
      var message;
      message = _.isString(raw) ? raw : raw.message;
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-bottom atomatigit-output',
            outlet: 'messagePanel'
          }, function() {
            return _this.div({
              "class": 'panel-body padded output-message'
            }, message);
          });
        };
      })(this));
    };

    OutputView.prototype.initialize = function(error) {
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

    return OutputView;

  })(View);

  module.exports = OutputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3Mvb3V0cHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBRkosQ0FBQTs7QUFBQSxFQUtNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFhLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWCxDQUFILEdBQXdCLEdBQXhCLEdBQWlDLEdBQUcsQ0FBQyxPQUEvQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyx1Q0FBUDtBQUFBLFlBQWdELE1BQUEsRUFBUSxjQUF4RDtXQUFMLEVBQTZFLFNBQUEsR0FBQTttQkFDM0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGtDQUFQO2FBQUwsRUFBZ0QsT0FBaEQsRUFEMkU7VUFBQSxDQUE3RSxFQURHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxFQUZRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQU9BLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUI7QUFBQSxVQUFBLE9BQUEsRUFBUyxJQUFUO1NBQXpCLENBQWQsQ0FBQSxDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixJQUFDLENBQUEsTUFBM0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsV0FBbkMsQ0FBK0MsSUFBQyxDQUFBLE9BQWhELENBSkEsQ0FBQTthQUtBLFVBQUEsQ0FBVyxDQUFDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFYLEVBQTJCLEtBQTNCLEVBTlU7SUFBQSxDQVBaLENBQUE7O3NCQUFBOztLQUR1QixLQUx6QixDQUFBOztBQUFBLEVBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBckJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/output-view.coffee
