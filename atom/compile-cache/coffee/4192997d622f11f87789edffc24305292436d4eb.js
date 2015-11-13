(function() {
  var FileListView, FileView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  View = require('atom-space-pen-views').View;

  FileView = require('./file-view');

  FileListView = (function(_super) {
    __extends(FileListView, _super);

    function FileListView() {
      this.repaint = __bind(this.repaint, this);
      this.repopulateStaged = __bind(this.repopulateStaged, this);
      this.repopulateUnstaged = __bind(this.repopulateUnstaged, this);
      this.repopulateUntracked = __bind(this.repopulateUntracked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return FileListView.__super__.constructor.apply(this, arguments);
    }

    FileListView.content = function() {
      return this.div({
        "class": 'file-list-view list-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h2({
            outlet: 'untrackedHeader'
          }, 'untracked:');
          _this.div({
            "class": 'untracked',
            outlet: 'untracked'
          });
          _this.h2({
            outlet: 'unstagedHeader'
          }, 'unstaged:');
          _this.div({
            "class": 'unstaged',
            outlet: 'unstaged'
          });
          _this.h2({
            outlet: 'stagedHeader'
          }, 'staged:');
          return _this.div({
            "class": 'staged',
            outlet: 'staged'
          });
        };
      })(this));
    };

    FileListView.prototype.initialize = function(model) {
      this.model = model;
    };

    FileListView.prototype.attached = function() {
      return this.model.on('repaint', this.repaint);
    };

    FileListView.prototype.detached = function() {
      return this.model.off('repaint', this.repaint);
    };

    FileListView.prototype.repopulateUntracked = function() {
      this.untracked.empty();
      return _.each(this.model.untracked(), (function(_this) {
        return function(file) {
          return _this.untracked.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repopulateUnstaged = function() {
      this.unstaged.empty();
      return _.each(this.model.unstaged(), (function(_this) {
        return function(file) {
          return _this.unstaged.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repopulateStaged = function() {
      this.staged.empty();
      return _.each(this.model.staged(), (function(_this) {
        return function(file) {
          return _this.staged.append(new FileView(file));
        };
      })(this));
    };

    FileListView.prototype.repaint = function() {
      this.repopulateUntracked();
      this.repopulateUnstaged();
      return this.repopulateStaged();
    };

    return FileListView;

  })(View);

  module.exports = FileListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZmlsZXMvZmlsZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxFQU9NO0FBQ0osbUNBQUEsQ0FBQTs7Ozs7Ozs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMEJBQVA7QUFBQSxRQUFtQyxRQUFBLEVBQVUsQ0FBQSxDQUE3QztPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEQsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxNQUFBLEVBQVEsaUJBQVI7V0FBSixFQUErQixZQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxXQUFQO0FBQUEsWUFBb0IsTUFBQSxFQUFRLFdBQTVCO1dBQUwsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxNQUFBLEVBQVEsZ0JBQVI7V0FBSixFQUE4QixXQUE5QixDQUZBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxVQUFQO0FBQUEsWUFBbUIsTUFB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/files/file-list-view.coffee
