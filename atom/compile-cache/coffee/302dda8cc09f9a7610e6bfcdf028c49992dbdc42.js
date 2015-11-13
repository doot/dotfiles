(function() {
  var Diff, DiffChunk, List, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  List = require('../list');

  DiffChunk = require('./diff-chunk');

  Diff = (function(_super) {
    __extends(Diff, _super);

    Diff.prototype.model = DiffChunk;

    Diff.prototype.isSublist = true;

    Diff.prototype.selectedIndex = -1;

    Diff.prototype.extractHeader = function() {
      var _ref, _ref1;
      return this.header = (_ref = this.raw) != null ? (_ref1 = _ref.match(/^(.*?\n){2}/)) != null ? _ref1[0] : void 0 : void 0;
    };

    function Diff(_arg) {
      var chunks, _ref;
      _ref = _arg != null ? _arg : {}, this.raw = _ref.raw, chunks = _ref.chunks;
      this.chunks = __bind(this.chunks, this);
      this.extractHeader = __bind(this.extractHeader, this);
      this.extractHeader();
      Diff.__super__.constructor.call(this, _.map(chunks, (function(_this) {
        return function(chunk) {
          return {
            chunk: chunk,
            header: _this.header
          };
        };
      })(this)));
      this.select(-1);
    }

    Diff.prototype.chunks = function() {
      return this.models;
    };

    return Diff;

  })(List);

  module.exports = Diff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2RpZmZzL2RpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBWSxPQUFBLENBQVEsU0FBUixDQURaLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBUU07QUFDSiwyQkFBQSxDQUFBOztBQUFBLG1CQUFBLEtBQUEsR0FBTyxTQUFQLENBQUE7O0FBQUEsbUJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFBQSxtQkFFQSxhQUFBLEdBQWUsQ0FBQSxDQUZmLENBQUE7O0FBQUEsbUJBTUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsV0FBQTthQUFBLElBQUMsQ0FBQSxNQUFELGtGQUFzQyxDQUFBLENBQUEsb0JBRHpCO0lBQUEsQ0FOZixDQUFBOztBQWNhLElBQUEsY0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLFlBQUE7QUFBQSw0QkFEWSxPQUFlLElBQWQsSUFBQyxDQUFBLFdBQUEsS0FBSyxjQUFBLE1BQ25CLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLHNDQUFNLENBQUMsQ0FBQyxHQUFGLENBQU0sTUFBTixFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFBVztBQUFBLFlBQUMsS0FBQSxFQUFPLEtBQVI7QUFBQSxZQUFlLE1BQUEsRUFBUSxLQUFDLENBQUEsTUFBeEI7WUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsQ0FBTixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELENBQVEsQ0FBQSxDQUFSLENBSEEsQ0FEVztJQUFBLENBZGI7O0FBQUEsbUJBdUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsT0FESztJQUFBLENBdkJSLENBQUE7O2dCQUFBOztLQURpQixLQVJuQixDQUFBOztBQUFBLEVBbUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBbkNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/diffs/diff.coffee
