(function() {
  var $, PanelView, ScrollView, TextEditor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  module.exports = PanelView = (function(_super) {
    __extends(PanelView, _super);

    function PanelView(title, src, grammar) {
      this.title = title;
      this.src = src;
      this.grammar = grammar;
      this.editor = new TextEditor({
        mini: false
      });
      this.attach();
      PanelView.__super__.constructor.apply(this, arguments);
    }

    PanelView.content = function() {
      return this.div({
        "class": 'atom-text-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'resizer-drag',
            mousedown: 'dragStart'
          });
          return _this.tag('atom-text-editor');
        };
      })(this));
    };

    PanelView.prototype.initialize = function() {
      var view;
      this.editor = this.view().find('atom-text-editor')[0].getModel();
      this.editor.setText(this.src);
      view = this.view();
      this.editor.setGrammar(this.grammar);
      return view.find('atom-text-editor').css('overflow', 'scroll');
    };

    PanelView.prototype.showPanel = function(src, grammar) {
      var view;
      this.show();
      view = this.view();
      view.css('max-height', '200px');
      this.editor.setText(src);
      this.editor.setGrammar(grammar);
      return this.editor.setCursorScreenPosition([1, 1]);
    };

    PanelView.prototype.getTitle = function() {
      return this.title;
    };

    PanelView.prototype.getModel = function() {
      return this.editor;
    };

    PanelView.prototype.dragStart = function(evt, ele) {
      var editorHeight, ht, top, view, width;
      view = this.view();
      editorHeight = view.find('atom-text-editor').height();
      top = view.parent().position().top;
      ht = view.height();
      width = view.width();
      view.css({
        position: 'fixed'
      });
      view.css({
        top: evt.pageY
      });
      view.css({
        width: width
      });
      view.css('max-height', '');
      view.css({
        height: ht
      });
      $(document).mousemove((function(_this) {
        return function(evt, ele) {
          var height, textEditorHeight;
          view = _this.view();
          view.css({
            top: evt.pageY
          });
          height = ht + top - evt.pageY;
          if (height < 0) {
            height = height * -1;
          }
          textEditorHeight = editorHeight + top - evt.pageY;
          if (textEditorHeight < 0) {
            textEditorHeight = textEditorHeight * -1;
          }
          view.find('atom-text-editor').css({
            height: textEditorHeight
          });
          return view.css({
            height: height
          });
        };
      })(this));
      return $(document).mouseup((function(_this) {
        return function(evt, ele) {
          view = _this.view().view();
          view.css({
            position: 'static'
          });
          return $(document).unbind('mousemove');
        };
      })(this));
    };

    PanelView.prototype.attach = function() {
      return $(document).keyup((function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            return _this.detach();
          }
        };
      })(this));
    };

    PanelView.prototype.detach = function(hide) {
      if (hide == null) {
        hide = true;
      }
      if (hide) {
        return this.hide();
      }
    };

    return PanelView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9wYW5lbC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBZSxPQUFBLENBQVEsTUFBUixFQUFmLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBREosQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixnQ0FBQSxDQUFBOztBQUFhLElBQUEsbUJBQUUsS0FBRixFQUFTLEdBQVQsRUFBYyxPQUFkLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLE1BRG1CLElBQUMsQ0FBQSxNQUFBLEdBQ3BCLENBQUE7QUFBQSxNQUR3QixJQUFDLENBQUEsVUFBQSxPQUN6QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsVUFBQSxDQUFXO0FBQUEsUUFBQSxJQUFBLEVBQUssS0FBTDtPQUFYLENBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLDRDQUFBLFNBQUEsQ0FGQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSxJQUtBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGlCQUFQO09BQUwsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3QixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTSxjQUFOO0FBQUEsWUFBc0IsU0FB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

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/panel-view.coffee
