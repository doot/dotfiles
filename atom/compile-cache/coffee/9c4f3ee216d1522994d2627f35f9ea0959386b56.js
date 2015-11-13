(function() {
  var CompositeDisposable, ToolBarButtonView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  module.exports = ToolBarButtonView = (function(_super) {
    __extends(ToolBarButtonView, _super);

    function ToolBarButtonView() {
      return ToolBarButtonView.__super__.constructor.apply(this, arguments);
    }

    ToolBarButtonView.content = function() {
      return this.button({
        "class": 'btn btn-default tool-bar-btn'
      });
    };

    ToolBarButtonView.prototype.initialize = function(options) {
      this.subscriptions = new CompositeDisposable;
      this.priority = options.priority;
      if (options.tooltip) {
        this.prop('title', options.tooltip);
        this.subscriptions.add(atom.tooltips.add(this, {
          title: options.tooltip,
          placement: this.getTooltipPlacement
        }));
      }
      if (options.iconset) {
        this.addClass("" + options.iconset + " " + options.iconset + "-" + options.icon);
      } else {
        this.addClass("icon-" + options.icon);
      }
      this.on('click', (function(_this) {
        return function() {
          if (!_this.hasClass('disabled')) {
            if (typeof options.callback === 'string') {
              return atom.commands.dispatch(_this.getPreviouslyFocusedElement(), options.callback);
            } else {
              return options.callback(options.data, _this.getPreviouslyFocusedElement());
            }
          }
        };
      })(this));
      return this.on('mouseover', (function(_this) {
        return function() {
          return _this.storeFocusedElement();
        };
      })(this));
    };

    ToolBarButtonView.prototype.setEnabled = function(enabled) {
      if (enabled) {
        return this.removeClass('disabled');
      } else {
        return this.addClass('disabled');
      }
    };

    ToolBarButtonView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    ToolBarButtonView.prototype.getPreviouslyFocusedElement = function() {
      if (this.previouslyFocusedElement && this.previouslyFocusedElement.nodeName !== 'BODY') {
        return this.eventElement = this.previouslyFocusedElement;
      } else {
        return this.eventElement = atom.views.getView(atom.workspace);
      }
    };

    ToolBarButtonView.prototype.storeFocusedElement = function() {
      if (!document.activeElement.classList.contains('tool-bar-btn')) {
        return this.previouslyFocusedElement = document.activeElement;
      }
    };

    ToolBarButtonView.prototype.getTooltipPlacement = function() {
      var toolbarPosition;
      toolbarPosition = atom.config.get('tool-bar.position');
      return toolbarPosition === "Top" && "bottom" || toolbarPosition === "Right" && "left" || toolbarPosition === "Bottom" && "top" || toolbarPosition === "Left" && "right";
    };

    return ToolBarButtonView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLWJ1dHRvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLFFBQUEsT0FBQSxFQUFPLDhCQUFQO09BQVIsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxnQ0FHQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxPQUFPLENBQUMsUUFGcEIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxPQUFPLENBQUMsT0FBWDtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWUsT0FBTyxDQUFDLE9BQXZCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFsQixFQUNqQjtBQUFBLFVBQUEsS0FBQSxFQUFPLE9BQU8sQ0FBQyxPQUFmO0FBQUEsVUFDQSxTQUFBLEVBQVcsSUFBQyxDQUFBLG1CQURaO1NBRGlCLENBQW5CLENBREEsQ0FERjtPQUpBO0FB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

//# sourceURL=/Users/doot/.atom/packages/tool-bar/lib/tool-bar-button-view.coffee
