(function() {
  var CompositeDisposable, Os, Path, disposables, fs, git, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  module.exports = function(repo, _arg) {
    var args, diffFilePath, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (!diffStat) {
      args.push(file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
    }).then(function() {
      return showFile(diffFilePath);
    }).then(function(textEditor) {
      return disposables.add(textEditor.onDidDestroy(function() {
        return fs.unlink(diffFilePath);
      }));
    });
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return notifier.addInfo('Nothing to show.');
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGlmZi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUxOLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FOWCxDQUFBOztBQUFBLEVBT0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBUFosQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBVGQsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsK0NBQUE7QUFBQSwwQkFEc0IsT0FBaUIsSUFBaEIsZ0JBQUEsVUFBVSxZQUFBLElBQ2pDLENBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBVixFQUEwQixvQkFBMUIsQ0FBZixDQUFBOztNQUNBLE9BQVEsSUFBSSxDQUFDLFVBQUwsK0RBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtLQURSO0FBRUEsSUFBQSxJQUFHLENBQUEsSUFBSDtBQUNFLGFBQU8sUUFBUSxDQUFDLFFBQVQsQ0FBa0Isa0NBQWxCLENBQVAs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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-diff.coffee
