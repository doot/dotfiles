(function() {
  var GitBridge, ResolverView, util,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ResolverView = require('../../lib/view/resolver-view').ResolverView;

  GitBridge = require('../../lib/git-bridge').GitBridge;

  util = require('../util');

  describe('ResolverView', function() {
    var fakeEditor, pkg, state, view, _ref;
    _ref = [], view = _ref[0], fakeEditor = _ref[1], pkg = _ref[2];
    state = {
      repo: {
        getWorkingDirectory: function() {
          return "/fake/gitroot/";
        },
        relativize: function(filepath) {
          return filepath.slice("/fake/gitroot/".length);
        }
      }
    };
    beforeEach(function() {
      var done;
      pkg = util.pkgEmitter();
      fakeEditor = {
        isModified: function() {
          return true;
        },
        getURI: function() {
          return '/fake/gitroot/lib/file1.txt';
        },
        save: function() {},
        onDidSave: function() {}
      };
      atom.config.set('merge-conflicts.gitPath', 'git');
      done = false;
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      waitsFor(function() {
        return done;
      });
      GitBridge.process = function(_arg) {
        var exit, stdout;
        stdout = _arg.stdout, exit = _arg.exit;
        stdout('UU lib/file1.txt');
        exit(0);
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      return view = new ResolverView(fakeEditor, state, pkg);
    });
    it('begins needing both saving and staging', function() {
      view.refresh();
      return expect(view.actionText.text()).toBe('Save and stage');
    });
    it('shows if the file only needs staged', function() {
      fakeEditor.isModified = function() {
        return false;
      };
      view.refresh();
      return expect(view.actionText.text()).toBe('Stage');
    });
    return it('saves and stages the file', function() {
      var a, c, o, _ref1;
      _ref1 = [], c = _ref1[0], a = _ref1[1], o = _ref1[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, stdout, _ref2;
        command = _arg.command, args = _arg.args, options = _arg.options, stdout = _arg.stdout, exit = _arg.exit;
        if (__indexOf.call(args, 'add') >= 0) {
          _ref2 = [command, args, options], c = _ref2[0], a = _ref2[1], o = _ref2[2];
          exit(0);
        }
        if (__indexOf.call(args, 'status') >= 0) {
          stdout('M  lib/file1.txt');
          exit(0);
        }
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      spyOn(fakeEditor, 'save');
      view.resolve();
      expect(fakeEditor.save).toHaveBeenCalled();
      expect(c).toBe('git');
      expect(a).toEqual(['add', 'lib/file1.txt']);
      return expect(o).toEqual({
        cwd: state.repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbWVyZ2UtY29uZmxpY3RzL3NwZWMvdmlldy9yZXNvbHZlci12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxlQUFnQixPQUFBLENBQVEsOEJBQVIsRUFBaEIsWUFBRCxDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsc0JBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsa0NBQUE7QUFBQSxJQUFBLE9BQTBCLEVBQTFCLEVBQUMsY0FBRCxFQUFPLG9CQUFQLEVBQW1CLGFBQW5CLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7aUJBQUcsaUJBQUg7UUFBQSxDQUFyQjtBQUFBLFFBQ0EsVUFBQSxFQUFZLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVMsZ0NBQXZCO1FBQUEsQ0FEWjtPQURGO0tBSEYsQ0FBQTtBQUFBLElBT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBTixDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWE7QUFBQSxRQUNYLFVBQUEsRUFBWSxTQUFBLEdBQUE7aUJBQUcsS0FBSDtRQUFBLENBREQ7QUFBQSxRQUVYLE1BQUEsRUFBUSxTQUFBLEdBQUE7aUJBQUcsOEJBQUg7UUFBQSxDQUZHO0FBQUEsUUFHWCxJQUFBLEVBQU0sU0FBQSxHQUFB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

//# sourceURL=/Users/doot/.atom/packages/merge-conflicts/spec/view/resolver-view-spec.coffee
