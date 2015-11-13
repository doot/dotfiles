(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitAddAllAndCommit, GitAddAllCommitAndPush, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
    GitAdd = require('./models/git-add');
    GitAddAllAndCommit = require('./models/git-add-all-and-commit');
    GitAddAllCommitAndPush = require('./models/git-add-all-commit-and-push');
    GitAddAndCommit = require('./models/git-add-and-commit');
    GitBranch = require('./models/git-branch');
    GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');
    GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutCurrentFile = require('./models/git-checkout-current-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
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
    return git.getRepo().then(function(repo) {
      var commands;
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
          return new GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return new GitCommit(repo, {
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
          return GitAddAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return GitAddAllAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All Commit And Push', function() {
          return GitAddAllCommitAndPush(repo);
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
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC1wbHVzLWNvbW1hbmRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osUUFBQSxtY0FBQTtBQUFBLElBQUEsTUFBQSxHQUF5QixPQUFBLENBQVEsa0JBQVIsQ0FBekIsQ0FBQTtBQUFBLElBQ0Esa0JBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSLENBRHpCLENBQUE7QUFBQSxJQUVBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxzQ0FBUixDQUZ6QixDQUFBO0FBQUEsSUFHQSxlQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUixDQUh6QixDQUFBO0FBQUEsSUFJQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQUp6QixDQUFBO0FBQUEsSUFLQSxvQkFBQSxHQUF5QixPQUFBLENBQVEseUNBQVIsQ0FMekIsQ0FBQTtBQUFBLElBTUEscUJBQUEsR0FBeUIsT0FBQSxDQUFRLDBDQUFSLENBTnpCLENBQUE7QUFBQSxJQU9BLG1CQUFBLEdBQXlCLE9BQUEsQ0FBUSxpQ0FBUixDQVB6QixDQUFBO0FBQUEsSUFRQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsb0NBQVIsQ0FSekIsQ0FBQTtBQUFBLElBU0EsYUFBQSxHQUF5QixPQUFBLENBQVEsMEJBQVIsQ0FUekIsQ0FBQTtBQUFBLElBVUEsU0FBQSxHQUF5QixPQUFBLENBQVEscUJBQVIsQ0FWekIsQ0FBQTtBQUFBLElBV0EsY0FBQSxHQUF5QixPQUFBLENBQVEsMkJBQVIsQ0FYekIsQ0FBQTtBQUFBLElBWUEsT0FBQSxHQUF5QixPQUFBLENBQVEs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

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/git-plus-commands.coffee
