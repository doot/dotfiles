(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
    GitAdd = require('./models/git-add');
    GitBranch = require('./models/git-branch');
    GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');
    GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutCurrentFile = require('./models/git-checkout-current-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDifftool = require('./models/git-difftool');
    GitDiffAll = require('./models/git-diff-all');
    GitFetch = require('./models/git-fetch');
    GitFetchPrune = require('./models/git-fetch-prune.coffee');
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    return git.getRepo().then(function(repo) {
      var commands, currentFile, _ref;
      currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
      git.refresh();
      commands = [];
      commands.push([
        'git-plus:add', 'Add', function() {
          return GitAdd(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return GitAdd(repo, {
            addAll: true
          });
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutCurrentFile(repo);
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitBranch.gitBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitBranch.gitRemoteBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitBranch.newBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteLocalBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteRemoteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo);
        }
      ]);
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:pull-using-rebase', 'Pull Using Rebase', function() {
          return GitPull(repo, {
            rebase: true
          });
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-files', 'Stage Files', function() {
          return GitStageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:unstage-files', 'Unstage Files', function() {
          return GitUnstageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-changes', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC1wbHVzLWNvbW1hbmRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osUUFBQSw4WkFBQTtBQUFBLElBQUEsTUFBQSxHQUF5QixPQUFBLENBQVEsa0JBQVIsQ0FBekIsQ0FBQTtBQUFBLElBQ0EsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVIsQ0FEekIsQ0FBQTtBQUFBLElBRUEsb0JBQUEsR0FBeUIsT0FBQSxDQUFRLHlDQUFSLENBRnpCLENBQUE7QUFBQSxJQUdBLHFCQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQ0FBUixDQUh6QixDQUFBO0FBQUEsSUFJQSxtQkFBQSxHQUF5QixPQUFBLENBQVEsaUNBQVIsQ0FKekIsQ0FBQTtBQUFBLElBS0Esc0JBQUEsR0FBeUIsT0FBQSxDQUFRLG9DQUFSLENBTHpCLENBQUE7QUFBQSxJQU1BLGFBQUEsR0FBeUIsT0FBQSxDQUFRLDBCQUFSLENBTnpCLENBQUE7QUFBQSxJQU9BLFNBQUEsR0FBeUIsT0FBQSxDQUFRLHFCQUFSLENBUHpCLENBQUE7QUFBQSxJQVFBLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSLENBUnpCLENBQUE7QUFBQSxJQVNBLE9BQUEsR0FBeUIsT0FBQSxDQUFRLG1CQUFSLENBVHpCLENBQUE7QUFBQSxJQVVBLFdBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSLENBVnpCLENBQUE7QUFBQSxJQVdBLFVBQUEsR0FBeUIsT0FBQSxDQUFRLHVCQUFSLENBWHpCLENBQUE7QUFBQSxJQVlBLFFBQUEsR0FBeUIsT0FBQSxDQUFRLG9C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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/git-plus-commands.coffee
