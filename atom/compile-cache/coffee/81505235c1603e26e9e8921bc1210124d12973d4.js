(function() {
  var $, CompositeDisposable, InputView, OutputViewManager, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeHolderText: 'Git command and arguments'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var _ref1;
            if ((_ref1 = _this.panel) != null) {
              _ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var args, view, _ref1;
          _this.disposables.dispose();
          if ((_ref1 = _this.panel) != null) {
            _ref1.destroy();
          }
          view = OutputViewManager["new"]();
          args = _this.commandEditor.getText().split(' ');
          if (args[0] === 1) {
            args.shift();
          }
          return git.cmd(args, {
            cwd: _this.repo.getWorkingDirectory()
          }).then(function(data) {
            var msg;
            msg = "git " + (args.join(' ')) + " was successful";
            notifier.addSuccess(msg);
            if ((data != null ? data.length : void 0) > 0) {
              view.addLine(data);
            } else {
              view.reset();
            }
            view.finish();
            git.refresh();
            return _this.currentPane.activate();
          })["catch"](function(msg) {
            if ((msg != null ? msg.length : void 0) > 0) {
              view.addLine(msg);
            } else {
              view.reset();
            }
            view.finish();
            git.refresh();
            return _this.currentPane.activate();
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcnVuLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFEcEIsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFPTTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxPQUFELENBQVMsZUFBVCxFQUE4QixJQUFBLGNBQUEsQ0FBZTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxZQUFZLGVBQUEsRUFBaUIsMkJBQTdCO1dBQWYsQ0FBOUIsRUFERztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx3QkFJQSxVQUFBLEdBQVksU0FBRSxJQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQs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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-run.coffee
