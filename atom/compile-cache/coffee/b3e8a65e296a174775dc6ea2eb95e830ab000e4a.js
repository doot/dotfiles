(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  fs = require('fs-plus');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(_super) {
    __extends(StatusListView, _super);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(this.parseData(this.data.slice(0, -1)));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        line = files[_i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        _results.push({
          type: line[1],
          path: line[2]
        });
      }
      return _results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(_arg) {
      var getIcon, path, type;
      type = _arg.type, path = _arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(_arg) {
      var fullPath, openFile, path, type;
      type = _arg.type, path = _arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3N0YXR1cy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSlYsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUFBLGdEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxJQUFLLGFBQWpCLENBQVYsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSw2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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/status-list-view.coffee
