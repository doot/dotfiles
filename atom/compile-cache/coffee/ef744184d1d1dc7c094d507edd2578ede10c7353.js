(function() {
  var ErrorView, FileList, List, StagedFile, UnstagedFile, UntrackedFile, git, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  git = require('../../git');

  List = require('../list');

  StagedFile = require('./staged-file');

  UnstagedFile = require('./unstaged-file');

  UntrackedFile = require('./untracked-file');

  ErrorView = require('../../views/error-view');

  FileList = (function(_super) {
    __extends(FileList, _super);

    function FileList() {
      this.populateList = __bind(this.populateList, this);
      this.untracked = __bind(this.untracked, this);
      this.unstaged = __bind(this.unstaged, this);
      this.staged = __bind(this.staged, this);
      this.populate = __bind(this.populate, this);
      this.reload = __bind(this.reload, this);
      return FileList.__super__.constructor.apply(this, arguments);
    }

    FileList.prototype.reload = function(_arg) {
      var silent;
      silent = (_arg != null ? _arg : {}).silent;
      return git.status().then((function(_this) {
        return function(status) {
          return _this.populate(status, silent);
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    FileList.prototype.populate = function(status, silent) {
      var _ref;
      this.reset();
      this.populateList(status.untracked, UntrackedFile);
      this.populateList(status.unstaged, UnstagedFile);
      this.populateList(status.staged, StagedFile);
      this.select((_ref = this.selectedIndex) != null ? _ref : 0);
      if (!silent) {
        return this.trigger('repaint');
      }
    };

    FileList.prototype.staged = function() {
      return this.filter(function(file) {
        return file.isStaged();
      });
    };

    FileList.prototype.unstaged = function() {
      return this.filter(function(file) {
        return file.isUnstaged();
      });
    };

    FileList.prototype.untracked = function() {
      return this.filter(function(file) {
        return file.isUntracked();
      });
    };

    FileList.prototype.populateList = function(files, Klass) {
      return _.each(files, (function(_this) {
        return function(file) {
          return _this.add(new Klass(file));
        };
      })(this));
    };

    return FileList;

  })(List);

  module.exports = FileList;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2ZpbGVzL2ZpbGUtbGlzdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFnQixPQUFBLENBQVEsV0FBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUixDQUhoQixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUpoQixDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBTmhCLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQWdCLE9BQUEsQ0FBUSx3QkFBUixDQVBoQixDQUFBOztBQUFBLEVBU007QUFFSiwrQkFBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsdUJBQUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sVUFBQSxNQUFBO0FBQUEsTUFEUSx5QkFBRCxPQUFTLElBQVIsTUFDUixDQUFBO2FBQUEsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFBWSxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBWjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FFQSxDQUFDLE9BQUQsQ0FGQSxDQUVPLFNBQUMsS0FBRCxHQUFBO2VBQWUsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFmO01BQUEsQ0FGUCxFQURNO0lBQUEsQ0FBUixDQUFBOztBQUFBLHVCQVFBLFFBQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxNQUFULEdBQUE7QUFDUixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQU0sQ0FBQyxTQUFyQixFQUFnQyxhQUFoQyxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBTSxDQUFDLFFBQXJCLEVBQStCLFlBQS9CLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsTUFBckIsRUFBNkIsVUFBN0IsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsTUFBRCw4Q0FBeUIsQ0FBekIsQ0FOQSxDQUFBO0FBT0EsTUFBQSxJQUFBLENBQUEsTUFBQTtlQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBVCxFQUFBO09BUlE7SUFBQSxDQVJWLENBQUE7O0FBQUEsdUJBbUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsTUFBRCxDQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBQSxFQUFWO01BQUEsQ0FBUixFQURNO0lBQUEsQ0FuQlIsQ0FBQTs7QUFBQSx1QkF1QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxJQUFELEdBQUE7ZUFBVSxJQUFJLENBQUMsVUFBTCxDQUFBLEVBQVY7TUFBQSxDQUFSLEVBRFE7SUFBQSxDQXZCVixDQUFBOztBQUFBLHVCQTJCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLElBQUQsR0FBQTtlQUFVLElBQUksQ0FBQyxXQUFMLENBQUEsRUFBVjtNQUFBLENBQVIsRUFEUztJQUFBLENBM0JYLENBQUE7O0FBQUEsdUJBa0NBLFlBQUEsR0FBYyxTQUFDLEtBQUQsRUFBUSxLQUFSLEdBQUE7YUFDWixDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQVUsS0FBQyxDQUFBLEdBQUQsQ0FBUyxJQUFBLEtBQUEsQ0FBTSxJQUFOLENBQVQsRUFBVjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsRUFEWTtJQUFBLENBbENkLENBQUE7O29CQUFBOztLQUZxQixLQVR2QixDQUFBOztBQUFBLEVBZ0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBaERqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/files/file-list.coffee
