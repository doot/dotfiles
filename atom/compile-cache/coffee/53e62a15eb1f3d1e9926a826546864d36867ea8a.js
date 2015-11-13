(function() {
  var $$, BufferedProcess, ListView, OutputView, PullBranchListView, SelectListView, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  OutputView = require('./output-view');

  PullBranchListView = require('./pull-branch-list-view');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data, _arg) {
      this.repo = repo;
      this.data = data;
      this.mode = _arg.mode, this.tag = _arg.tag, this.extraArgs = _arg.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var item, items, remotes, _i, _len;
      items = this.data.split("\n");
      remotes = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item !== '') {
          remotes.push({
            name: item
          });
        }
      }
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var name;
      name = _arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (this.mode === 'pull') {
        git.cmd({
          args: ['branch', '-r'],
          cwd: this.repo.getWorkingDirectory(),
          stdout: (function(_this) {
            return function(data) {
              return new PullBranchListView(_this.repo, data, name, _this.extraArgs);
            };
          })(this)
        });
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs) {
      var args, view;
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = new OutputView();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]);
      return git.cmd({
        args: args,
        cwd: this.repo.getWorkingDirectory(),
        stdout: function(data) {
          return view.addLine(data.toString());
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        },
        exit: (function(_this) {
          return function(code) {
            if (code === 128) {
              view.reset();
              return git.cmd({
                args: [_this.mode, '-u', remote, 'HEAD'],
                cwd: _this.repo.getWorkingDirectory(),
                stdout: function(data) {
                  return view.addLine(data.toString());
                },
                stderr: function(data) {
                  return view.addLine(data.toString());
                },
                exit: function(code) {
                  return view.finish();
                }
              });
            } else {
              return view.finish();
            }
          };
        })(this)
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FETCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixPQUFBLENBQVEseUJBQVIsQ0FMckIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsRUFBZSxJQUFmLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUQwQixJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxXQUFBLEtBQUssSUFBQyxDQUFBLGlCQUFBLFNBQ3hDLENBQUE7QUFBQSxNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPO09BRFI7O1FBRUEsSUFBQyxDQUFBLFlBQWE7T0FGZDtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBTFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsdUJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsOEJBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQVIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLEVBRFYsQ0FBQTtBQUVBLFdBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQWlDLElBQUEsS0FBUSxFQUF6QztBQUFBLFVBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYTtBQUFBLFlBQUMsSUFBQSxFQUFNLElBQVA7V0FBYixDQUFBLENBQUE7U0FERjtBQUFBLE9BRkE7QUFJQSxNQUFBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7ZUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLE9BQVEsQ0FBQSxDQUFBLENBQW5CLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKRjtPQUxTO0lBQUEsQ0FQWCxDQUFBOztBQUFBLHVCQWtCQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBbEJkLENBQUE7O0FBQUEsdUJBb0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUFWO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQURBLENBQUE7YUFHQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxFQUpJO0lBQUEsQ0FwQk4sQ0FBQTs7QUFBQSx1QkEwQkEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtJQUFBLENBMUJYLENBQUE7O0FBQUEsdUJBNEJBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLEtBQUE7aURBQU0sQ0FBRSxPQUFSLENBQUEsV0FESTtJQUFBLENBNUJOLENBQUE7O0FBQUEsdUJBK0JBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRGEsT0FBRCxLQUFDLElBQ2IsQ0FBQTthQUFBLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFEQztNQUFBLENBQUgsRUFEVztJQUFBLENBL0JiLENBQUE7O0FBQUEsdUJBbUNBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BRFcsT0FBRCxLQUFDLElBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBRCxLQUFTLE1BQVo7QUFDRSxRQUFBLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxDQUFDLFFBQUQsRUFBVyxJQUFYLENBQU47QUFBQSxVQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FETDtBQUFBLFVBRUEsTUFBQSxFQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxJQUFELEdBQUE7cUJBQWMsSUFBQSxrQkFBQSxDQUFtQixLQUFDLENBQUEsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFBc0MsS0FBQyxDQUFBLFNBQXZDLEVBQWQ7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSO1NBREYsQ0FBQSxDQURGO09BQUEsTUFLSyxJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsYUFBWjtBQUNILFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFSLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLFNBQWYsQ0FEQSxDQURHO09BQUEsTUFBQTtBQUlILFFBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULENBQUEsQ0FKRztPQUxMO2FBVUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQVhTO0lBQUEsQ0FuQ1gsQ0FBQTs7QUFBQSx1QkFnREEsT0FBQSxHQUFTLFNBQUMsTUFBRCxFQUFTLFNBQVQsR0FBQTtBQUNQLFVBQUEsVUFBQTs7UUFEZ0IsWUFBVTtPQUMxQjtBQUFBLE1BQUEsSUFBQSxHQUFXLElBQUEsVUFBQSxDQUFBLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLElBQUYsQ0FEUCxDQUFBO0FBRUEsTUFBQSxJQUFHLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQXRCO0FBQ0UsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsQ0FBQSxDQURGO09BRkE7QUFBQSxNQUlBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsTUFBRCxFQUFTLElBQUMsQ0FBQSxHQUFWLENBQVosQ0FKUCxDQUFBO2FBS0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FETDtBQUFBLFFBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2lCQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFiLEVBQVY7UUFBQSxDQUZSO0FBQUEsUUFHQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7aUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWIsRUFBVjtRQUFBLENBSFI7QUFBQSxRQUlBLElBQUEsRUFBTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ0osWUFBQSxJQUFHLElBQUEsS0FBUSxHQUFYO0FBQ0UsY0FBQSxJQUFJLENBQUMsS0FBTCxDQUFBLENBQUEsQ0FBQTtxQkFDQSxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLENBQUMsS0FBQyxDQUFBLElBQUYsRUFBUSxJQUFSLEVBQWMsTUFBZCxFQUFzQixNQUF0QixDQUFOO0FBQUEsZ0JBQ0EsR0FBQSxFQUFLLEtBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQURMO0FBQUEsZ0JBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO3lCQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFiLEVBQVY7Z0JBQUEsQ0FGUjtBQUFBLGdCQUdBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTt5QkFBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBYixFQUFWO2dCQUFBLENBSFI7QUFBQSxnQkFJQSxJQUFBLEVBQU0sU0FBQyxJQUFELEdBQUE7eUJBQVUsSUFBSSxDQUFDLE1BQUwsQ0FBQSxFQUFWO2dCQUFBLENBSk47ZUFERixFQUZGO2FBQUEsTUFBQTtxQkFTRSxJQUFJLENBQUMsTUFBTCxDQUFBLEVBVEY7YUFESTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSk47T0FERixFQU5PO0lBQUEsQ0FoRFQsQ0FBQTs7b0JBQUE7O0tBRHFCLGVBUnZCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/remote-list-view.coffee
