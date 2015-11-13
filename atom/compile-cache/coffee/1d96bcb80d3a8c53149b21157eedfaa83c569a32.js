(function() {
  var DiffLine, Model, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Model = require('backbone').Model;

  DiffLine = (function(_super) {
    __extends(DiffLine, _super);

    function DiffLine() {
      this.markup = __bind(this.markup, this);
      this.repo = __bind(this.repo, this);
      this.type = __bind(this.type, this);
      this.line = __bind(this.line, this);
      return DiffLine.__super__.constructor.apply(this, arguments);
    }

    DiffLine.prototype.line = function() {
      return this.get('line');
    };

    DiffLine.prototype.type = function() {
      if (this.line().match(/^\+/)) {
        return 'addition';
      } else if (this.line().match(/^\-/)) {
        return 'subtraction';
      } else {
        return 'context';
      }
    };

    DiffLine.prototype.repo = function() {
      return this.get('repo');
    };

    DiffLine.prototype.markup = function() {
      return this.escapeHTML(this.line());
    };

    DiffLine.prototype.escapeHTML = function(string) {
      var entityMap;
      entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        ' ': '&nbsp;'
      };
      if (_.isString(string)) {
        return string.replace(/[&<>"'\/ ]/g, function(s) {
          return entityMap[s];
        });
      } else {
        return string;
      }
    };

    return DiffLine;

  })(Model);

  module.exports = DiffLine;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2RpZmZzL2RpZmYtbGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQVUsT0FBQSxDQUFRLFFBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0MsUUFBUyxPQUFBLENBQVEsVUFBUixFQUFULEtBREQsQ0FBQTs7QUFBQSxFQVFNO0FBSUosK0JBQUEsQ0FBQTs7Ozs7Ozs7S0FBQTs7QUFBQSx1QkFBQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLEVBREk7SUFBQSxDQUFOLENBQUE7O0FBQUEsdUJBU0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxDQUFIO2VBQ0UsV0FERjtPQUFBLE1BRUssSUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxDQUFIO2VBQ0gsY0FERztPQUFBLE1BQUE7ZUFHSCxVQUhHO09BSEQ7SUFBQSxDQVROLENBQUE7O0FBQUEsdUJBb0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsR0FBRCxDQUFLLE1BQUwsRUFESTtJQUFBLENBcEJOLENBQUE7O0FBQUEsdUJBMEJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBWixFQURNO0lBQUEsQ0ExQlIsQ0FBQTs7QUFBQSx1QkFrQ0EsVUFBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsUUFDQSxHQUFBLEVBQUssTUFETDtBQUFBLFFBRUEsR0FBQSxFQUFLLE1BRkw7QUFBQSxRQUdBLEdBQUEsRUFBSyxRQUhMO0FBQUEsUUFJQSxHQUFBLEVBQUssT0FKTDtBQUFBLFFBS0EsR0FBQSxFQUFLLFFBTEw7QUFBQSxRQU1BLEdBQUEsRUFBSyxRQU5MO09BREYsQ0FBQTtBQVFBLE1BQUEsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLE1BQVgsQ0FBSDtlQUNFLE1BQU0sQ0FBQyxPQUFQLENBQWUsYUFBZixFQUE4QixTQUFDLENBQUQsR0FBQTtpQkFBTyxTQUFVLENBQUEsQ0FBQSxFQUFqQjtRQUFBLENBQTlCLEVBREY7T0FBQSxNQUFBO2VBR0UsT0FIRjtPQVRVO0lBQUEsQ0FsQ1osQ0FBQTs7b0JBQUE7O0tBSnFCLE1BUnZCLENBQUE7O0FBQUEsRUE0REEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUE1RGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/diffs/diff-line.coffee
