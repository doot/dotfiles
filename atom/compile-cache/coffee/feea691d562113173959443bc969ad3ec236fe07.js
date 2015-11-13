(function() {
  var $$, DiffView, FileView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  DiffView = require('../diffs/diff-view');

  FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      this.showDiff = __bind(this.showDiff, this);
      this.showSelection = __bind(this.showSelection, this);
      this.clicked = __bind(this.clicked, this);
      this.detached = __bind(this.detached, this);
      this.attached = __bind(this.attached, this);
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.content = function(file) {
      return this.div({
        "class": 'file',
        mousedown: 'clicked'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'mode'
          }, file.getMode());
          return _this.span({
            "class": 'path'
          }, file.path());
        };
      })(this));
    };

    FileView.prototype.initialize = function(model) {
      this.model = model;
      this.showSelection();
      return this.showDiff();
    };

    FileView.prototype.attached = function() {
      this.model.on('change:selected', this.showSelection);
      return this.model.on('change:diff', this.showDiff);
    };

    FileView.prototype.detached = function() {
      this.model.off('change:selected', this.showSelection);
      return this.model.off('change:diff', this.showDiff);
    };

    FileView.prototype.clicked = function() {
      return this.model.selfSelect();
    };

    FileView.prototype.showSelection = function() {
      return this.toggleClass('selected', this.model.isSelected());
    };

    FileView.prototype.showDiff = function() {
      this.find('.diff').remove();
      if (this.model.showDiffP()) {
        return this.append(new DiffView(this.model.diff()));
      }
    };

    return FileView;

  })(View);

  module.exports = FileView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXRvbWF0aWdpdC9saWIvdmlld3MvZmlsZXMvZmlsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxVQUFBLEVBQUQsRUFBSyxZQUFBLElBQUwsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBSU07QUFDSiwrQkFBQSxDQUFBOzs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFFBQWUsU0FBQSxFQUFXLFNBQTFCO09BQUwsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN4QyxVQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO1dBQU4sRUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFyQixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7V0FBTixFQUFxQixJQUFJLENBQUMsSUFBTCxDQUFBLENBQXJCLEVBRndDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx1QkFNQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFBLEVBRlU7SUFBQSxDQU5aLENBQUE7O0FBQUEsdUJBV0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsaUJBQVYsRUFBNkIsSUFBQyxDQUFBLGFBQTlCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsRUFBUCxDQUFVLGFBQVYsRUFBeUIsSUFBQyxDQUFBLFFBQTFCLEVBRlE7SUFBQSxDQVhWLENBQUE7O0FBQUEsdUJBZ0JBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLGlCQUFYLEVBQThCLElBQUMsQ0FBQSxhQUEvQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxhQUFYLEVBQTBCLElBQUMsQ0FBQSxRQUEzQixFQUZRO0lBQUEsQ0FoQlYsQ0FBQTs7QUFBQSx1QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLEVBRE87SUFBQSxDQXJCVCxDQUFBOztBQUFBLHVCQXlCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxVQUFiLEVBQXlCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFBLENBQXpCLEVBRGE7SUFBQSxDQXpCZixDQUFBOztBQUFBLHVCQTZCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLE9BQU4sQ0FBYyxDQUFDLE1BQWYsQ0FBQSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQXVDLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQXZDO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBWSxJQUFBLFFBQUEsQ0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQUFULENBQVosRUFBQTtPQUZRO0lBQUEsQ0E3QlYsQ0FBQTs7b0JBQUE7O0tBRHFCLEtBSnZCLENBQUE7O0FBQUEsRUFzQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUF0Q2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/atomatigit/lib/views/files/file-view.coffee
