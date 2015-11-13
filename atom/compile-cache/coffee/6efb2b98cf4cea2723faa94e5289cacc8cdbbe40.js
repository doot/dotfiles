(function() {
  var CompositeDisposable, Os, Path, diffFilePath, disposables, fs, git, gitDiff, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  diffFilePath = null;

  gitDiff = function(repo, _arg) {
    var args, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    if (diffStat == null) {
      diffStat = '';
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (diffStat === '') {
      args.push(file);
    }
    return git.cmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return diffStat += data;
      },
      exit: function(code) {
        if (code === 0) {
          return prepFile(diffStat);
        }
      }
    });
  };

  prepFile = function(text) {
    if ((text != null ? text.length : void 0) > 0) {
      fs.writeFileSync(diffFilePath, text, {
        flag: 'w+'
      });
      return showFile();
    } else {
      return notifier.addInfo('Nothing to show.');
    }
  };

  showFile = function() {
    return atom.workspace.open(diffFilePath, {
      searchAllPanes: true
    }).done(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return disposables.add(textEditor.onDidDestroy((function(_this) {
          return function() {
            return fs.unlink(diffFilePath);
          };
        })(this)));
      }
    });
  };

  splitPane = function(splitDir, oldEditor) {
    var directions, hookEvents, options, pane;
    pane = atom.workspace.paneForURI(diffFilePath);
    options = {
      copyActiveItem: true
    };
    hookEvents = function(textEditor) {
      oldEditor.destroy();
      return disposables.add(textEditor.onDidDestroy((function(_this) {
        return function() {
          return fs.unlink(diffFilePath);
        };
      })(this)));
    };
    directions = {
      left: (function(_this) {
        return function() {
          pane = pane.splitLeft(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      right: (function(_this) {
        return function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      up: (function(_this) {
        return function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this),
      down: (function(_this) {
        return function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        };
      })(this)
    };
    directions[splitDir]();
    return oldEditor.destroy();
  };

  module.exports = gitDiff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUhBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUxOLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FOWCxDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFSZCxDQUFBOztBQUFBLEVBU0EsWUFBQSxHQUFlLElBVGYsQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDUixRQUFBLGlDQUFBO0FBQUEsMEJBRGUsT0FBaUIsSUFBaEIsZ0JBQUEsVUFBVSxZQUFBLElBQzFCLENBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBVixFQUEwQixvQkFBMUIsQ0FBZixDQUFBOztNQUNBLE9BQVEsSUFBSSxDQUFDLFVBQUwsK0RBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtLQURSO0FBRUEsSUFBQSxJQUFHLENBQUEsSUFBSDtBQUNFLGFBQU8sUUFBUSxDQUFDLFFBQVQsQ0FBa0Isa0NBQWxCLENBQVAsQ0FERjtLQUZBOztNQUlBLFdBQVk7S0FKWjtB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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-diff.coffee
