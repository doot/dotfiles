(function() {
  var OutputViewManager, Path, git, notifier;

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo, _arg) {
    var file, _ref;
    file = (_arg != null ? _arg : {}).file;
    if (file == null) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    }
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    return git.getConfig('diff.tool', Path.dirname(file)).then(function(tool) {
      if (!tool) {
        return notifier.addInfo("You don't have a difftool configured.");
      } else {
        return git.cmd(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
          diffIndex = data.split('\0');
          includeStagedDiff = atom.config.get('git-plus.includeStagedDiff');
          diffsForCurrentFile = diffIndex.map(function(line, i) {
            var path, staged;
            if (i % 2 === 0) {
              staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
              path = diffIndex[i + 1];
              if (path === file && (!staged || includeStagedDiff)) {
                return true;
              }
            } else {
              return void 0;
            }
          });
          if (diffsForCurrentFile.filter(function(diff) {
            return diff != null;
          })[0] != null) {
            args = ['difftool', '--no-prompt'];
            if (includeStagedDiff) {
              args.push('HEAD');
            }
            args.push(file);
            return git.cmd(args, {
              cwd: repo.getWorkingDirectory()
            })["catch"](function(msg) {
              return OutputViewManager["new"]().addLine(msg).finish();
            });
          } else {
            return notifier.addInfo('Nothing to show.');
          }
        });
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGlmZnRvb2wuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBSHBCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDZixRQUFBLFVBQUE7QUFBQSxJQUR1Qix1QkFBRCxPQUFPLElBQU4sSUFDdkIsQ0FBQTs7TUFBQSxPQUFRLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEI7S0FBUjtBQUNBLElBQUEsSUFBRyxDQUFBLElBQUg7QUFDRSxhQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtDQUFqQixDQUFQLENBREY7S0FEQTtXQUtBLEdBQUcsQ0FBQyxTQUFKLENBQWMsV0FBZCxFQUEyQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBM0IsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxTQUFDLElBQUQsR0FBQTtBQUNsRCxNQUFBLElBQUEsQ0FBQSxJQUFBO2VBQ0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsdUNBQWpCLEVBREY7T0FBQSxNQUFBO2VBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFlBQUQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLENBQVIsRUFBc0M7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQXRDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7QUFDSixjQUFBLHVEQUFBO0FBQUEsVUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQVosQ0FBQTtBQUFBLFVBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQURwQixDQUFBO0FBQUEsVUFFQSxtQkFBQSxHQUFzQixTQUFTLENBQUMsR0FBVixDQUFjLFNBQUMsSUFBRCxFQUFPLENBQVAsR0FBQTtBQUNsQyxnQkFBQSxZQUFBO0FBQUEsWUFBQSxJQUFHLENBQUEsR0FBSSxDQUFKLEtBQVMsQ0FBWjtBQUNFLGNBQUEsTUFBQSxHQUFTLENBQUEsU0FBYSxDQUFDLElBQVYsQ0FBZSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBYixDQUFtQixHQUFuQixDQUF3QixDQUFBLENBQUEsQ0FBdkMsQ0FBYixDQUFBO0FBQUEsY0FDQSxJQUFBLEdBQU8sU0FBVSxDQUFBLENBQUEsR0FBRSxDQUFGLENBRGpCLENBQUE7QUFFQSxjQUFBLElBQVEsSUFBQSxLQUFRLElBQVIsSUFBaUIsQ0FBQyxDQUFBLE1BQUEsSUFBVyxpQkFBWixDQUF6Qjt1QkFBQSxLQUFBO2VBSEY7YUFBQSxNQUFBO3FCQUtFLE9BTEY7YUFEa0M7VUFBQSxDQUFkLENBRnRCLENBQUE7QUFVQSxVQUFBLElBQUc7O3VCQUFIO0FBQ0UsWUFBQSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsYUFBYixDQUFQLENBQUE7QUFDQSxZQUFBLElBQW9CLGlCQUFwQjtBQUFBLGNBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLENBQUEsQ0FBQTthQURBO0FBQUEsWUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FGQSxDQUFBO21CQUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO0FBQUEsY0FBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDthQUFkLENBQ0EsQ0FBQyxPQUFELENBREEsQ0FDTyxTQUFDLEdBQUQsR0FBQTtxQkFBUyxpQkFBaUIsQ0FBQyxLQUFELENBQWpCLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxHQUFoQyxDQUFvQyxDQUFDLE1BQXJDLENBQUEsRUFBVDtZQUFBLENBRFAsRUFKRjtXQUFBLE1BQUE7bUJBT0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0JBQWpCLEVBUEY7V0FYSTtRQUFBLENBRE4sRUFIRjtPQURrRDtJQUFBLENBQXBELEVBTmU7RUFBQSxDQUxqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/models/git-difftool.coffee
