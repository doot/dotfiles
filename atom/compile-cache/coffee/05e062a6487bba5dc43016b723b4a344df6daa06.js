(function() {
  var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(_super) {
    __extends(SelectStageHunks, _super);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patchPath, patch_full;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      items.forEach(function(item) {
        return patch_full += (item != null ? item.patch : void 0);
      });
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      return fs.writeFile(patchPath, patch_full, {
        flag: 'w+'
      }, (function(_this) {
        return function(err) {
          if (!err) {
            return git.cmd(['apply', '--cached', '--', patchPath], {
              cwd: _this.repo.getWorkingDirectory()
            }).then(function(data) {
              data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
              notifier.addSuccess(data);
              try {
                return fs.unlink(patchPath);
              } catch (_error) {}
            });
          } else {
            return notifier.addError(err);
          }
        };
      })(this));
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        hunk = data[_i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        _results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return _results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3NlbGVjdC1zdGFnZS1odW5rcy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLE9BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBREosQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0Esc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSLENBTHpCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUSxJQUFSLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsa0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUssQ0FBQSxDQUFBLENBRHJCLENBQUE7QUFFQSxNQUFBLElBQWtELElBQUksQ0FBQyxNQUFMLEtBQWUsQ0FBakU7QUFBQSxlQUFPLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUssU0FBdkIsQ0FBWCxDQUFQLENBQUE7T0FGQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/select-stage-hunks-view.coffee
