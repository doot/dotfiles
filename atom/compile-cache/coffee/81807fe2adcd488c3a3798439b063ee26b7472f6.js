(function() {
  var $, HTMLBase, View, Watch, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  Watch = require('./watch');

  module.exports = HTMLBase = (function(_super) {
    __extends(HTMLBase, _super);

    function HTMLBase() {
      return HTMLBase.__super__.constructor.apply(this, arguments);
    }

    HTMLBase.content = function() {
      var project;
      project = this.cproject;
      if (project.watch == null) {
        project.watch = '';
      }
      return this.div({
        "class": 'preview-plus-base'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'base',
            outlet: 'base'
          }, function() {
            _this.span("HTML Base");
            return _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              id: 'href',
              value: "" + project.base
            });
          });
          _this.div({
            "class": 'url',
            outlet: 'url'
          }, function() {
            _this.span("HTML URL");
            return _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              id: 'url',
              value: "" + project.url
            });
          });
          _this.div({
            "class": 'watch',
            outlet: 'watch'
          }, function() {
            _this.span("Watch Files/Dir");
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              id: 'watch',
              value: "" + project.watch,
              placeholder: "" + project.base + "/stylesheets/*.css"
            });
            return _this.span("(separate by ',' & '*/glob/!' are allowed)");
          });
          _this.div(function() {
            _this.span("Use Default - URL/Local Server For HTML Preview  ");
            if (project.htmlu) {
              return _this.input({
                type: 'checkbox',
                id: 'htmlu',
                checked: 'checked'
              });
            } else {
              return _this.input({
                type: 'checkbox',
                id: 'htmlu'
              });
            }
          });
          return _this.div(function() {
            return _this.input({
              type: 'button',
              value: 'confirm',
              click: 'onConfirm'
            });
          });
        };
      })(this));
    };

    HTMLBase.prototype.setURL = function(evt, ele) {
      this.url.toggle();
      return this.base.toggle();
    };

    HTMLBase.prototype.initialize = function(model) {
      this.model = model;
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      return this.element.onblur = (function(_this) {
        return function() {
          return _this.close;
        };
      })(this);
    };

    HTMLBase.prototype.close = function() {
      atom.workspace.getActivePane().activate();
      return this.parent().hide();
    };

    HTMLBase.prototype.cancel = function() {
      return this.close();
    };

    HTMLBase.prototype.onConfirm = function() {
      var key, paths, val, w, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.cproject.htmlu = this.find('#htmlu').prop('checked');
      this.cproject.url = this.find('#url').val();
      this.cproject.base = this.find('#href').val();
      this.cproject.watch = this.find('#watch').val();
      _ref1 = this.cproject;
      for (key in _ref1) {
        val = _ref1[key];
        this.project[key] = val;
      }
      if ((_ref2 = this.model.previewStatus) != null) {
        _ref2.setCompilesTo(atom.workspace.getActivePaneItem());
      }
      if (paths = (_ref3 = this.model.watcher) != null ? _ref3.paths : void 0) {
        if ((_ref4 = this.model.watcher.chokidar) != null) {
          if (typeof _ref4.unwatch === "function") {
            _ref4.unwatch(paths);
          }
        }
      }
      if ((_ref5 = this.model.watcher) != null) {
        if ((_ref6 = _ref5.chokidar) != null) {
          _ref6.close();
        }
      }
      if (w = this.cproject.watch) {
        this.model.watcher = new Watch(w);
      }
      this.model.toggle();
      return this.close();
    };

    return HTMLBase;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9odG1sYmFzZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUZSLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBRUosK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7QUFFUixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsUUFBWCxDQUFBOztRQUNBLE9BQU8sQ0FBQyxRQUFTO09BRGpCO2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFNLG1CQUFOO09BQUwsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM5QixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTSxNQUFOO0FBQUEsWUFBYSxNQUFBLEVBQU8sTUFBcEI7V0FBTCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLE9BQUEsRUFBTSxxQkFBTjtBQUFBLGNBQTRCLElBQUEsRUFBSyxNQUFqQztBQUFBLGNBQXdDLEVBQUEsRUFBRyxNQUEzQztBQUFBLGNBQWtELEtBQUEsRUFBTSxFQUFBLEdBQUcsT0FBTyxDQUFDLElBQW5FO2FBQVAsRUFGK0I7VUFBQSxDQUFqQyxDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTSxLQUFOO0FBQUEsWUFBWSxNQUFBLEVBQU8sS0FBbkI7V0FBTCxFQUErQixTQUFBLEdBQUE7QUFDN0IsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFVBQU4sQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLE9BQUEsRUFBTSxxQkFBTjtBQUFBLGNBQTZCLElBQUEsRUFBSyxNQUFsQztBQUFBLGNBQXlDLEVBQUEsRUFBRyxLQUE1QztBQUFBLGNBQWtELEtBQUEsRUFBTSxFQUFBLEdBQUcsT0FBTyxDQUFDLEdBQW5FO2FBQVAsRUFGNkI7VUFBQSxDQUEvQixDQUhBLENBQUE7QUFBQSxVQU1BLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTSxPQUFOO0FBQUEsWUFBYyxNQUFBLEVBQU8sT0FBckI7V0FBTCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLGlCQUFOLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGNBQUEsT0FBQSxFQUFNLHFCQUFOO0FBQUEsY0FBNkIsSUFBQSxFQUFLLE1BQWxDO0FBQUEsY0FBeUMsRUFBQSxFQUFHLE9BQTVDO0FBQUEsY0FBb0QsS0FBQSxFQUFNLEVBQUEsR0FBRyxPQUFPLENBQUMsS0FBckU7QUFBQSxjQUE2RSxXQUFBLEVBQVksRUFBQSxHQUFHLE9BQU8sQ0FBQyxJQUFYLEdBQWdCLG9CQUF6RzthQUFQLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNLDRDQUFOLEVBSGlDO1VBQUEsQ0FBbkMsQ0FOQSxDQUFBO0FBQUEsVUFVQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxtREFBTixDQUFBLENBQUE7QUFDQSxZQUFBLElBQUcsT0FBTyxDQUFDLEtBQVg7cUJBQ0UsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGdCQUFBLElBQUEsRUFBSyxVQUFMO0FBQUEsZ0JBQWdCLEVBQUEsRUFBRyxPQUFuQjtBQUFBLGdCQUE0QixPQUFBLEVBQVEsU0FBcEM7ZUFBUCxFQURGO2FBQUEsTUFBQTtxQkFHRSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsSUFBQSxFQUFLLFVBQUw7QUFBQSxnQkFBZ0IsRUFBQSxFQUFHLE9BQW5CO2VBQVAsRUFIRjthQUZHO1VBQUEsQ0FBTCxDQVZBLENBQUE7aUJBZ0JBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO21CQUNILEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLElBQUEsRUFBSyxRQUFMO0FBQUEsY0FBYyxLQUFBLEVBQU0sU0FBcEI7QUFBQSxjQUE4QixLQUFBLEVBQU0sV0FBcEM7YUFBUCxFQURHO1VBQUEsQ0FBTCxFQWpCOEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxFQUpRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHVCQXdCQSxNQUFBLEdBQVEsU0FBQyxHQUFELEVBQUssR0FBTCxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQUZNO0lBQUEsQ0F4QlIsQ0FBQTs7QUFBQSx1QkE0QkEsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtBQUFBLFFBQ0EsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGY7T0FERixDQUFBLENBQUE7YUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBSjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEVBSlQ7SUFBQSxDQTVCWixDQUFBOztBQUFBLHVCQWtDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsSUFBVixDQUFBLEVBRks7SUFBQSxDQWxDUCxDQUFBOztBQUFBLHVCQXNDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURNO0lBQUEsQ0F0Q1IsQ0FBQTs7QUFBQSx1QkEwQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUVULFVBQUEsNERBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixHQUFrQixJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBZSxDQUFDLElBQWhCLENBQXFCLFNBQXJCLENBQWxCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixHQUFnQixJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU4sQ0FBYSxDQUFDLEdBQWQsQ0FBQSxDQURoQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsSUFBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLENBQWMsQ0FBQyxHQUFmLENBQUEsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLEdBQWtCLElBQUMsQ0FBQSxJQUFELENBQU0sUUFBTixDQUFlLENBQUMsR0FBaEIsQ0FBQSxDQUhsQixDQUFBO0FBTUE7QUFBQSxXQUFBLFlBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFULEdBQWdCLEdBQWhCLENBREY7QUFBQSxPQU5BOzthQVNvQixDQUFFLGFBQXRCLENBQW9DLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFwQztPQVRBO0FBVUEsTUFBQSxJQUE0QyxLQUFBLCtDQUFzQixDQUFFLGNBQXBFOzs7aUJBQXVCLENBQUUsUUFBUzs7U0FBbEM7T0FWQTs7O2VBV3dCLENBQUUsS0FBMUIsQ0FBQTs7T0FYQTtBQVlBLE1BQUEsSUFBaUMsQ0FBQSxHQUFJLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBL0M7QUFBQSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUFxQixJQUFBLEtBQUEsQ0FBTSxDQUFOLENBQXJCLENBQUE7T0FaQTtBQUFBLE1BYUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQUEsQ0FiQSxDQUFBO2FBY0EsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQWhCUztJQUFBLENBMUNYLENBQUE7O29CQUFBOztLQUZxQixLQUx2QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/htmlbase.coffee
