(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, ScrollView, amountOfCommitsToShow, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  git = require('../git');

  GitShow = require('../models/git-show');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = LogListView = (function(_super) {
    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
        };
      })(this));
    };

    LogListView.prototype.onDidChangeTitle = function() {
      return new Disposable;
    };

    LogListView.prototype.onDidChangeModified = function() {
      return new Disposable;
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      LogListView.__super__.initialize.apply(this, arguments);
      this.skipCommits = 0;
      this.on('click', '.commit-row', (function(_this) {
        return function(_arg) {
          var currentTarget;
          currentTarget = _arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      return this.scroll((function(_this) {
        return function() {
          if (_this.scrollTop() + _this.height() === _this.prop('scrollHeight')) {
            return _this.getLog();
          }
        };
      })(this));
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length > 0) {
        separator = ';|';
        newline = '_.;._';
        data = data.substring(0, data.length - newline.length - 1);
        commits = data.split(newline).map(function(line) {
          var tmpData;
          if (line.trim() !== '') {
            tmpData = line.trim().split(separator);
            return {
              hashShort: tmpData[0],
              hash: tmpData[1],
              author: tmpData[2],
              email: tmpData[3],
              message: tmpData[4],
              date: tmpData[5]
            };
          }
        });
        return this.renderLog(commits);
      }
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += amountOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, "" + commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (amountOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    return LogListView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2xvZy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0Msa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFdBQUEsR0FBSixFQUFTLGtCQUFBLFVBRlQsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSlYsQ0FBQTs7QUFBQSxFQU1BLHFCQUFBLEdBQXdCLFNBQUEsR0FBQTtXQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBRHNCO0VBQUEsQ0FOeEIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQ0FBUDtBQUFBLFFBQTJDLFFBQUEsRUFBVSxDQUFBLENBQXJEO09BQUwsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLFlBQUEsRUFBQSxFQUFJLGtCQUFKO0FBQUEsWUFBd0IsTUFBQSxFQUFRLGlCQUFoQztXQUFQLEVBRDRE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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/log-list-view.coffee
