(function() {
  var $, CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, prepFile, showCommitFilePath, showFile, showObject, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), "" + objectHash + ".diff");
  };

  showObject = function(repo, objectHash, file) {
    var args;
    args = ['show'];
    args.push('--format=full');
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--');
      args.push(file);
    }
    return git.cmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        if (data.length > 0) {
          return prepFile(data, objectHash);
        }
      }
    });
  };

  prepFile = function(text, objectHash) {
    fs.writeFileSync(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    });
    return showFile(objectHash);
  };

  showFile = function(objectHash) {
    var disposables, split;
    disposables = new CompositeDisposable;
    split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
    return atom.workspace.open(showCommitFilePath(objectHash), {
      split: split,
      activatePane: true
    }).done((function(_this) {
      return function(textBuffer) {
        if (textBuffer != null) {
          return disposables.add(textBuffer.onDidDestroy(function() {
            disposables.dispose();
            try {
              return fs.unlinkSync(showCommitFilePath(objectHash));
            } catch (_error) {}
          }));
        }
      };
    })(this));
  };

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show'
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
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var name, text;
            text = _this.objectHash.getModel().getText().split(' ');
            name = text.length === 2 ? text[1] : text[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.panel) != null ? _ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc2hvdy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0lBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFKRCxDQUFBOztBQUFBLEVBS0EsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksc0JBQUEsY0FBSixFQUFvQixZQUFBLElBTHBCLENBQUE7O0FBQUEsRUFPQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FQTixDQUFBOztBQUFBLEVBU0Esa0JBQUEsR0FBcUIsU0FBQyxVQUFELEdBQUE7V0FDbkIsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQVYsRUFBdUIsRUFBQSxHQUFHLFVBQUgsR0FBYyxPQUFyQyxFQURtQjtFQUFBLENBVHJCLENBQUE7O0FBQUEsRUFZQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sVUFBUCxFQUFtQixJQUFuQixHQUFBO0FBQ1gsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sQ0FBQyxNQUFELENBQVAsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxlQUFWLENBREEsQ0FBQTtBQUVBLElBQUEsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUEzQjtBQUFBLE1BQUEs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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-show.coffee
