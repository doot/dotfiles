(function() {
  var $, $$, EditorView, SelectListMultipleView, SelectStageFilesView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, EditorView = _ref.EditorView;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(_super) {
    var prettify;

    __extends(SelectStageFilesView, _super);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, _ref1;
      files = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (__indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return notifier.addSuccess("Removed " + (prettify(data)));
      });
    };

    prettify = function(data) {
      var file, i, _i, _len, _results;
      data = data.match(/rm ('.*')/g);
      if ((data != null ? data.length : void 0) >= 1) {
        _results = [];
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          file = data[i];
          _results.push(data[i] = ' ' + file.match(/rm '(.*)'/)[1]);
        }
        return _results;
      }
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlbW92ZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBO0lBQUE7O3lKQUFBOztBQUFBLEVBQUEsT0FBc0IsT0FBQSxDQUFRLHNCQUFSLENBQXRCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsa0JBQUEsVUFBUixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FKekIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixRQUFBLFFBQUE7O0FBQUEsMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1DQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUSxLQUFSLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxtQ0FNQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNkLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxTQUFQO1NBQUws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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/remove-list-view.coffee
