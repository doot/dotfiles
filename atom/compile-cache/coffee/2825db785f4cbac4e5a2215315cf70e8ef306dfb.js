(function() {
  var DiffChunk, DiffLine, ErrorView, ListItem, fs, git, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  git = require('../../git');

  DiffLine = require('./diff-line');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  DiffChunk = (function(_super) {
    __extends(DiffChunk, _super);

    function DiffChunk() {
      this.unstage = __bind(this.unstage, this);
      this.stage = __bind(this.stage, this);
      this.kill = __bind(this.kill, this);
      this.patch = __bind(this.patch, this);
      return DiffChunk.__super__.constructor.apply(this, arguments);
    }

    DiffChunk.prototype.initialize = function(_arg) {
      var chunk, _ref;
      _ref = _arg != null ? _arg : {}, this.header = _ref.header, chunk = _ref.chunk;
      return this.lines = _.map(this.splitIntoLines(chunk.trim()), function(line) {
        return new DiffLine({
          line: line
        });
      });
    };

    DiffChunk.prototype.splitIntoLines = function(chunk) {
      return chunk.split(/\n/g);
    };

    DiffChunk.prototype.patch = function() {
      return this.get('header') + this.get('chunk') + '\n';
    };

    DiffChunk.prototype.kill = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --reverse '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.stage = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --cached '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.unstage = function() {
      fs.writeFileSync(this.patchPath(), this.patch());
      return git.cmd("apply --cached --reverse '" + (this.patchPath()) + "'").then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    DiffChunk.prototype.patchPath = function() {
      var _ref;
      return path.join((_ref = atom.project.getRepositories()[0]) != null ? _ref.getWorkingDirectory() : void 0, '.git/atomatigit_diff_patch');
    };

    return DiffChunk;

  })(ListItem);

  module.exports = DiffChunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2RpZmZzL2RpZmYtY2h1bmsuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBTyxPQUFBLENBQVEsSUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBWSxPQUFBLENBQVEsYUFBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FOWixDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQVBaLENBQUE7O0FBQUEsRUFhTTtBQU1KLGdDQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsd0JBQUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsNEJBRFcsT0FBaUIsSUFBaEIsSUFBQyxDQUFBLGNBQUEsUUFBUSxhQUFBLEtBQ3JCLENBQUE7YUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsS0FBSyxDQUFDLElBQU4sQ0FBQSxDQUFoQixDQUFOLEVBQXFDLFNBQUMsSUFBRCxHQUFBO2VBQ3hDLElBQUEsUUFBQSxDQUFTO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUFULEVBRHdDO01BQUEsQ0FBckMsRUFEQztJQUFBLENBQVosQ0FBQTs7QUFBQSx3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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/diffs/diff-chunk.coffee
