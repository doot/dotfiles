(function() {
  var DiffLineView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  DiffLineView = (function(_super) {
    __extends(DiffLineView, _super);

    function DiffLineView() {
      return DiffLineView.__super__.constructor.apply(this, arguments);
    }

    DiffLineView.content = function(line) {
      return this.div({
        "class": "diff-line " + (line.type())
      }, (function(_this) {
        return function() {
          return _this.raw(line.markup());
        };
      })(this));
    };

    DiffLineView.prototype.initialize = function(model) {
      this.model = model;
    };

    return DiffLineView;

  })(View);

  module.exports = DiffLineView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZGlmZnMvZGlmZi1saW5lLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBUSxZQUFBLEdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUQsQ0FBbkI7T0FBTCxFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN0QyxLQUFDLENBQUEsR0FBRCxDQUFLLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBTCxFQURzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMkJBS0EsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQVksTUFBWCxJQUFDLENBQUEsUUFBQSxLQUFVLENBQVo7SUFBQSxDQUxaLENBQUE7O3dCQUFBOztLQUR5QixLQUgzQixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFYakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/diffs/diff-line-view.coffee
