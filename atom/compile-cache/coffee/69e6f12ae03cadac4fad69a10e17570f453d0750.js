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

    LogListView.prototype.setRepo = function(repo) {
      this.repo = repo;
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

    LogListView.prototype.branchLog = function() {
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(onlyCurrentFile, currentFile) {
      this.onlyCurrentFile = onlyCurrentFile;
      this.currentFile = currentFile;
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
      return git.cmd({
        args: args,
        cwd: this.repo.getWorkingDirectory(),
        stdout: (function(_this) {
          return function(data) {
            return _this.parseData(data);
          };
        })(this)
      });
    };

    return LogListView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2xvZy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0Msa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFdBQUEsR0FBSixFQUFTLGtCQUFBLFVBRlQsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSlYsQ0FBQTs7QUFBQSxFQU1BLHFCQUFBLEdBQXdCLFNBQUEsR0FBQTtXQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBRHNCO0VBQUEsQ0FOeEIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQ0FBUDtBQUFBLFFBQTJDLFFBQUEsRUFBVSxDQUFBLENBQXJEO09BQUwsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLFlBQUEsRUFBQSxFQUFJLGtCQUFKO0FBQUEsWUFBd0IsTUFBQSxFQUFRLGlCQUFoQztXQUFQLEVBRDRE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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/log-list-view.coffee
