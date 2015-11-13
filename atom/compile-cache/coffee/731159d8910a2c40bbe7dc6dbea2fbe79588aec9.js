(function() {
  var DiffLine, DiffView, View, fmtNum,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  DiffLine = (function(_super) {
    __extends(DiffLine, _super);

    function DiffLine() {
      return DiffLine.__super__.constructor.apply(this, arguments);
    }

    DiffLine.content = function(line) {
      return this.div({
        "class": "line " + line.type
      }, (function(_this) {
        return function() {
          _this.pre({
            "class": "lineno " + (!line.lineno ? 'invisible' : '')
          }, line.lineno);
          return _this.pre({
            outlet: 'linetext'
          }, line.text);
        };
      })(this));
    };

    DiffLine.prototype.initialize = function(params) {
      if (params.type === 'heading') {
        return this.linetext.click(function() {
          return atom.workspace.open(params.text);
        });
      }
    };

    return DiffLine;

  })(View);

  fmtNum = function(num) {
    return ("     " + (num || '') + " ").slice(-6);
  };

  module.exports = DiffView = (function(_super) {
    __extends(DiffView, _super);

    function DiffView() {
      return DiffView.__super__.constructor.apply(this, arguments);
    }

    DiffView.content = function() {
      return this.div({
        "class": 'diff'
      });
    };

    DiffView.prototype.clearAll = function() {
      this.find('>.line').remove();
    };

    DiffView.prototype.addAll = function(diffs) {
      this.clearAll();
      diffs.forEach((function(_this) {
        return function(diff) {
          var file, noa, nob;
          if ((file = diff['+++']) === '+++ /dev/null') {
            file = diff['---'];
          }
          _this.append(new DiffLine({
            type: 'heading',
            text: file
          }));
          noa = 0;
          nob = 0;
          diff.lines.forEach(function(line) {
            var atend, atstart, klass, linea, lineb, lineno, _ref;
            klass = '';
            lineno = void 0;
            if (/^@@ /.test(line)) {
              _ref = line.replace(/-|\+/g, '').split(' '), atstart = _ref[0], linea = _ref[1], lineb = _ref[2], atend = _ref[3];
              noa = parseInt(linea, 10);
              nob = parseInt(lineb, 10);
              klass = 'subtle';
            } else {
              lineno = "" + (fmtNum(noa)) + (fmtNum(nob));
              if (/^-/.test(line)) {
                klass = 'red';
                lineno = "" + (fmtNum(noa)) + (fmtNum(0));
                noa++;
              } else if (/^\+/.test(line)) {
                klass = 'green';
                lineno = "" + (fmtNum(0)) + (fmtNum(nob));
                nob++;
              } else {
                noa++;
                nob++;
              }
            }
            _this.append(new DiffLine({
              type: klass,
              text: line,
              lineno: lineno
            }));
          });
        };
      })(this));
    };

    return DiffView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LWNvbnRyb2wvbGliL3ZpZXdzL2RpZmYtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRU07QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFRLE9BQUEsR0FBTyxJQUFJLENBQUMsSUFBcEI7T0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQy9CLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFRLFNBQUEsR0FBUSxDQUFDLENBQUEsSUFBVyxDQUFDLE1BQVosR0FBd0IsV0FBeEIsR0FBeUMsRUFBMUMsQ0FBaEI7V0FBTCxFQUFxRSxJQUFJLENBQUMsTUFBMUUsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxVQUFSO1dBQUwsRUFBeUIsSUFBSSxDQUFDLElBQTlCLEVBRitCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx1QkFLQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxTQUFsQjtlQUFpQyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLElBQUksQ0FBQyxTQUFTLENBQUMs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

//# sourceURL=/Users/doot/.atom/packages/git-control/lib/views/diff-view.coffee
