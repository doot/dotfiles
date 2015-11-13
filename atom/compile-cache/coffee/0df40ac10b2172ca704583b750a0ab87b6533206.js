(function() {
  var Commit, ErrorView, ListItem, fs, git, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  fs = require('fs-plus');

  path = require('path');

  git = require('../../git');

  ListItem = require('../list-item');

  ErrorView = require('../../views/error-view');

  Commit = (function(_super) {
    __extends(Commit, _super);

    function Commit() {
      this.showCommit = __bind(this.showCommit, this);
      this.hardReset = __bind(this.hardReset, this);
      this.reset = __bind(this.reset, this);
      this.confirmHardReset = __bind(this.confirmHardReset, this);
      this.confirmReset = __bind(this.confirmReset, this);
      this.open = __bind(this.open, this);
      this.shortMessage = __bind(this.shortMessage, this);
      this.message = __bind(this.message, this);
      this.authorName = __bind(this.authorName, this);
      this.shortID = __bind(this.shortID, this);
      this.commitID = __bind(this.commitID, this);
      return Commit.__super__.constructor.apply(this, arguments);
    }

    Commit.prototype.defaults = {
      showMessage: null,
      author: null,
      id: null,
      message: null
    };

    Commit.prototype.initialize = function(gitCommit) {
      Commit.__super__.initialize.call(this);
      if (!_.isString(gitCommit) && _.isObject(gitCommit)) {
        this.set('author', gitCommit.author);
        this.set('id', gitCommit.ref);
        return this.set('message', gitCommit.message);
      }
    };

    Commit.prototype.unicodify = function(str) {
      try {
        str = decodeURIComponent(escape(str));
      } catch (_error) {}
      return str;
    };

    Commit.prototype.commitID = function() {
      return this.get('id');
    };

    Commit.prototype.shortID = function() {
      var _ref;
      return (_ref = this.commitID()) != null ? _ref.substr(0, 6) : void 0;
    };

    Commit.prototype.authorName = function() {
      var _ref;
      return this.unicodify((_ref = this.get('author')) != null ? _ref.name : void 0);
    };

    Commit.prototype.message = function() {
      return this.unicodify(this.get('message') || '\n');
    };

    Commit.prototype.shortMessage = function() {
      return this.message().split('\n')[0];
    };

    Commit.prototype.open = function() {
      return this.confirmReset();
    };

    Commit.prototype.confirmReset = function() {
      return atom.confirm({
        message: "Soft-reset head to " + (this.shortID()) + "?",
        detailedMessage: this.message(),
        buttons: {
          'Reset': this.reset,
          'Cancel': null
        }
      });
    };

    Commit.prototype.confirmHardReset = function() {
      return atom.confirm({
        message: "Do you REALLY want to HARD-reset head to " + (this.shortID()) + "?",
        detailedMessage: this.message(),
        buttons: {
          'Cancel': null,
          'Reset': this.hardReset
        }
      });
    };

    Commit.prototype.reset = function() {
      return git.reset(this.commitID()).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Commit.prototype.hardReset = function() {
      return git.reset(this.commitID(), {
        hard: true
      }).then((function(_this) {
        return function() {
          return _this.trigger('update');
        };
      })(this))["catch"](function(error) {
        return new ErrorView(error);
      });
    };

    Commit.prototype.showCommit = function() {
      var diffPath, gitPath, _ref, _ref1, _ref2;
      if (!this.has('showMessage')) {
        return git.show(this.commitID(), {
          format: 'full'
        }).then((function(_this) {
          return function(data) {
            _this.set('showMessage', _this.unicodify(data));
            return _this.showCommit();
          };
        })(this))["catch"](function(error) {
          return new ErrorView(error);
        });
      } else {
        gitPath = ((_ref = atom.project) != null ? (_ref1 = _ref.getRepositories()[0]) != null ? _ref1.getPath() : void 0 : void 0) || ((_ref2 = atom.project) != null ? _ref2.getPath() : void 0);
        diffPath = path.join(gitPath, ".git/" + (this.commitID()));
        fs.writeFileSync(diffPath, this.get('showMessage'));
        return atom.workspace.open(diffPath).then(function(editor) {
          var grammar;
          grammar = atom.grammars.grammarForScopeName('source.diff');
          if (grammar) {
            editor.setGrammar(grammar);
          }
          return editor.buffer.onDidDestroy(function() {
            return fs.removeSync(diffPath);
          });
        });
      }
    };

    return Commit;

  })(ListItem);

  module.exports = Commit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvbW9kZWxzL2NvbW1pdHMvY29tbWl0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2Q0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQUpaLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQU5aLENBQUE7O0FBQUEsRUFRTTtBQUNKLDZCQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLHFCQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxNQUNBLE1BQUEsRUFBUSxJQURSO0FBQUEsTUFFQSxFQUFBLEVBQUksSUFGSjtBQUFBLE1BR0EsT0FBQSxFQUFTLElBSFQ7S0FERixDQUFBOztBQUFBLHFCQVNBLFVBQUEsR0FBWSxTQUFDLFNBQUQsR0FBQTtBQUNWLE1BQUEscUNBQUEsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxTQUFYLENBQUosSUFBOEIsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxTQUFYLENBQWpDO0FBQ0UsUUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFFBQUwsRUFBZSxTQUFTLENBQUMsTUFBekIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/models/commits/commit.coffee
