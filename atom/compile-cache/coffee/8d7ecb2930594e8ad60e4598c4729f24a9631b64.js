(function() {
  var CompositeDisposable, ErrorView, Repo, RepoView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Repo = RepoView = ErrorView = null;

  module.exports = {
    config: {
      debug: {
        title: 'Debug',
        description: 'Toggle debugging tools',
        type: 'boolean',
        "default": false,
        order: 1
      },
      pre_commit_hook: {
        title: 'Pre Commit Hook',
        description: 'Command to run for the pre commit hook',
        type: 'string',
        "default": '',
        order: 2
      },
      show_on_startup: {
        title: 'Show on Startup',
        description: 'Check this if you want atomatigit to show up when Atom is loaded',
        type: 'boolean',
        "default": false,
        order: 3
      },
      display_commit_comparisons: {
        title: 'Display Commit Comparisons',
        description: 'Display how many commits ahead/behind your branches are',
        type: 'boolean',
        "default": true,
        order: 4
      }
    },
    repo: null,
    repoView: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.insertCommands();
      this.installPackageDependencies();
      if (atom.config.get('atomatigit.show_on_startup')) {
        return this.toggle();
      }
    },
    toggle: function() {
      if (!atom.project.getRepositories()[0]) {
        return this.errorNoGitRepo();
      }
      if (!(Repo && RepoView)) {
        this.loadClasses();
      }
      if (this.repo == null) {
        this.repo = new Repo();
      }
      if (this.repoView == null) {
        this.repoView = new RepoView(this.repo);
        return this.repoView.InitPromise.then((function(_this) {
          return function() {
            return _this.repoView.toggle();
          };
        })(this));
      } else {
        return this.repoView.toggle();
      }
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.repo) != null) {
        _ref.destroy();
      }
      if ((_ref1 = this.repoView) != null) {
        _ref1.destroy();
      }
      return this.subscriptions.dispose();
    },
    errorNoGitRepo: function() {
      return atom.notifications.addError('Project is no git repository!');
    },
    insertCommands: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atomatigit:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    loadClasses: function() {
      Repo = require('./models/repo');
      return RepoView = require('./views/repo-view');
    },
    installPackageDependencies: function() {
      if (atom.packages.getLoadedPackage('language-diff')) {
        return;
      }
      return require('atom-package-dependencies').install(function() {
        atom.notifications.addSuccess('Atomatigit: Dependencies installed correctly.', {
          dismissable: true
        });
        return atom.packages.activatePackage('language-diff');
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvYXRvbWF0aWdpdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxRQUFBLEdBQVcsU0FBQSxHQUFZLElBRDlCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx3QkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFNQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdDQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BUEY7QUFBQSxNQVlBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsa0VBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FiRjtBQUFBLE1Ba0JBLDBCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw0QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFB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

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/atomatigit.coffee
