(function() {
  var $$, GitShow, RemoteListView, SelectListView, TagView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  notifier = require('../notifier');

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(_super) {
    __extends(TagView, _super);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag) {
      this.repo = repo;
      this.tag = tag;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(_arg) {
      var cmd, description, tag;
      tag = _arg.tag, cmd = _arg.cmd, description = _arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, "" + description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(_arg) {
      var args, cmd, tag;
      tag = _arg.tag, cmd = _arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git.cmd(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteListView(_this.repo, data, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        })["catch"](function(msg) {
          return notifier.addWarning(msg);
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSLENBTGpCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxHQUFULEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxNQUFBLEdBQ25CLENBQUE7QUFBQSxNQUFBLHlDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxTQUFELENBQUEsRUFIVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxzQkFLQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsSUFBTixDQUFXO0FBQUEsUUFBQyxHQUFBLEVBQUssSUFBQyxDQUFBLEdBQVA7QUFB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/tag-view.coffee
