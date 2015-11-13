(function() {
  var $$, ListView, SelectListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.args = ['checkout'];

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.parseData();
      return this.currentPane = atom.workspace.getActivePane();
    };

    ListView.prototype.parseData = function() {
      var branches, item, items, _i, _len;
      items = this.data.split("\n");
      branches = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
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
      var current, name;
      name = _arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.checkout(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.checkout = function(branch) {
      return git.cmd({
        cwd: this.repo.getWorkingDirectory(),
        args: this.args.concat(branch),
        stderr: (function(_this) {
          return function(data) {
            notifier.addSuccess(data.toString());
            atom.workspace.observeTextEditors(function(editor) {
              var filepath, _ref1;
              if (filepath = (_ref1 = editor.getPath()) != null ? _ref1.toString() : void 0) {
                return fs.exists(filepath, function(exists) {
                  if (!exists) {
                    return editor.destroy();
                  }
                });
              }
            });
            git.refresh();
            return _this.currentPane.activate();
          };
        })(this)
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2JyYW5jaC1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FETCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxDQUFDLFVBQUQsQ0FBTixDQUFBOztBQUFBLHVCQUVBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLEVBSkw7SUFBQSxDQUZaLENBQUE7O0FBQUEsdUJBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsK0JBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEVBRFgsQ0FBQTtBQUVBLFdBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FBUCxDQUFBO0FBQ0EsUUFBQSxJQUFPLElBQUEsS0FBUSxFQUFmO0FBQ0UsVUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjO0FBQUEsWUFBQyxJQUFBLEVBQU0sSUFBUDtXQUFkLENBQUEsQ0FERjtTQUZGO0FBQUEsT0FGQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLENBTkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBUlM7SUFBQSxDQVJYLENBQUE7O0FBQUEsdUJBa0JBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FsQmQsQ0FBQTs7QUFBQSx1QkFvQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BQVY7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBREEsQ0FBQTthQUdBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBSkk7SUFBQSxDQXBCTixDQUFBOztBQUFBLHVCQTBCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO0lBQUEsQ0ExQlgsQ0FBQTs7QUFBQSx1QkE0QkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsS0FBQTtpREFBTSxDQUFFLE9BQVIsQ0FBQSxXQURJO0lBQUEsQ0E1Qk4sQ0FBQTs7QUFBQSx1QkErQkEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxhQUFBO0FBQUEsTUFEYSxPQUFELEtBQUMsSUFDYixDQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsS0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLENBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsQ0FBUCxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsSUFEVixDQURGO09BREE7YUFJQSxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ1IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7YUFBTCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsY0FBQSxJQUFvQixPQUFwQjt1QkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sRUFBQTtlQUR3QjtZQUFBLENBQTFCLEVBRFE7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWLEVBREM7TUFBQSxDQUFILEVBTFc7SUFBQSxDQS9CYixDQUFBOztBQUFBLHVCQXlDQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLElBQUE7QUFBQSxNQURXLE9BQUQsS0FBQyxJQUNYLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFYLENBQXNCLENBQUEsQ0FBQSxDQUFoQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRlM7SUFBQSxDQXpDWCxDQUFBOztBQUFBLHVCQTZDQSxRQUFBLEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7QUFBQSxRQUNBLElBQUEsRUFBTSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxNQUFiLENBRE47QUFBQSxRQUdBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ04sWUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQXBCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxrQkFBQSxlQUFBO0FBQUEsY0FBQSxJQUFHLFFBQUEsNkNBQTJCLENBQUUsUUFBbEIsQ0FBQSxVQUFkO3VCQUNFLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixTQUFDLE1BQUQsR0FBQTtBQUNsQixrQkFBQSxJQUFvQixDQUFBLE1BQXBCOzJCQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFBQTttQkFEa0I7Z0JBQUEsQ0FBcEIsRUFERjtlQURnQztZQUFBLENBQWxDLENBREEsQ0FBQTtBQUFBLFlBS0EsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUxBLENBQUE7bUJBTUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsRUFQTTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFI7T0FERixFQURRO0lBQUEsQ0E3Q1YsQ0FBQTs7b0JBQUE7O0tBRHFCLGVBTnZCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/views/branch-list-view.coffee
