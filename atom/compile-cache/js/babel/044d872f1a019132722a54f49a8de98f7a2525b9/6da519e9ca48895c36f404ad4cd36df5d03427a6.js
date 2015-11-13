Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _eventKit = require('event-kit');

'use babel';

var markerTypeConfigKey = 'minimap-linter.markerType';

var MinimapBookmarksBinding = (function () {
  function MinimapBookmarksBinding(minimap) {
    var _this = this;

    _classCallCheck(this, MinimapBookmarksBinding);

    this.markerType = atom.config.get('minimap-linter.markerType');
    this.minimap = minimap;
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.editor = this.minimap.getTextEditor();
    this.decorations = [];
    this.reloadDecorations();

    atom.config.onDidChange(markerTypeConfigKey, function (_ref) {
      var newValue = _ref.newValue;

      _this.markerType = newValue;
      _this.reloadDecorations();
    });

    this.subscriptions.add(this.editor.displayBuffer.onDidAddDecoration(function (decoration) {
      return _this.processDecoration(decoration);
    }));
  }

  _createClass(MinimapBookmarksBinding, [{
    key: 'reloadDecorations',
    value: function reloadDecorations() {
      this.removeDecorations();
      for (var decorationId in this.editor.displayBuffer.decorationsById) {
        this.processDecoration(this.editor.displayBuffer.decorationsById[decorationId]);
      }
    }
  }, {
    key: 'processDecoration',
    value: function processDecoration(linterDecoration) {
      if (linterDecoration.properties && linterDecoration.properties['class'] && linterDecoration.properties['class'].indexOf('linter-') === 0) {
        var minimapDecoration = this.minimap.decorateMarker(linterDecoration.marker, { type: this.markerType, 'class': linterDecoration.properties['class'] });
        this.decorations.push(minimapDecoration);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeDecorations();
      return this.subscriptions.dispose();
    }
  }, {
    key: 'removeDecorations',
    value: function removeDecorations() {
      if (this.decorations.length === 0) return;
      this.decorations.forEach(function (decoration) {
        return decoration.destroy();
      });
      this.decorations = [];
    }
  }]);

  return MinimapBookmarksBinding;
})();

exports['default'] = MinimapBookmarksBinding;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAtbGludGVyL2xpYi9taW5pbWFwLWxpbnRlci1iaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3dCQUNvQyxXQUFXOztBQUQvQyxXQUFXLENBQUM7O0FBR1osSUFBTSxtQkFBbUIsR0FBRywyQkFBMkIsQ0FBQzs7SUFFbkMsdUJBQXVCO0FBQy9CLFdBRFEsdUJBQXVCLENBQzlCLE9BQU8sRUFBRTs7OzBCQURGLHVCQUF1Qjs7QUFFeEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsbUNBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzNDLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUV6QixRQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLElBQVksRUFBSztVQUFmLFFBQVEsR0FBVixJQUFZLENBQVYsUUFBUTs7QUFDdEQsWUFBSyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQzNCLFlBQUssaUJBQWlCLEVBQUUsQ0FBQztLQUMxQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsVUFBQSxVQUFVO2FBQUksTUFBSyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQztHQUN4SDs7ZUFma0IsdUJBQXVCOztXQWlCekIsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDekIsV0FBSyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUU7QUFDbEUsWUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO09BQ2pGO0tBQ0Y7OztXQUVpQiwyQkFBQyxnQkFBZ0IsRUFBRTtBQUNuQyxVQUFJLGdCQUFnQixDQUFDLFVBQVUsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLFNBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLFNBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2xJLFlBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLFNBQU0sRUFBRSxDQUFDLENBQUM7QUFDbEosWUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztPQUMxQztLQUNGOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNyQzs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU87QUFDMUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO2VBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN2Qjs7O1NBeENrQix1QkFBdUI7OztxQkFBdkIsdUJBQXVCIiwiZmlsZSI6Ii9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAtbGludGVyL2xpYi9taW5pbWFwLWxpbnRlci1iaW5kaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnZXZlbnQta2l0JztcblxuY29uc3QgbWFya2VyVHlwZUNvbmZpZ0tleSA9ICdtaW5pbWFwLWxpbnRlci5tYXJrZXJUeXBlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcEJvb2ttYXJrc0JpbmRpbmcge1xuICBjb25zdHJ1Y3RvcihtaW5pbWFwKSB7XG4gICAgdGhpcy5tYXJrZXJUeXBlID0gYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLWxpbnRlci5tYXJrZXJUeXBlJyk7XG4gICAgdGhpcy5taW5pbWFwID0gbWluaW1hcDtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZWRpdG9yID0gdGhpcy5taW5pbWFwLmdldFRleHRFZGl0b3IoKTtcbiAgICB0aGlzLmRlY29yYXRpb25zID0gW107XG4gICAgdGhpcy5yZWxvYWREZWNvcmF0aW9ucygpO1xuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UobWFya2VyVHlwZUNvbmZpZ0tleSwgKHsgbmV3VmFsdWUgfSkgPT4ge1xuICAgICAgdGhpcy5tYXJrZXJUeXBlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnJlbG9hZERlY29yYXRpb25zKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLmRpc3BsYXlCdWZmZXIub25EaWRBZGREZWNvcmF0aW9uKGRlY29yYXRpb24gPT4gdGhpcy5wcm9jZXNzRGVjb3JhdGlvbihkZWNvcmF0aW9uKSkpO1xuICB9XG5cbiAgcmVsb2FkRGVjb3JhdGlvbnMoKSB7XG4gICAgdGhpcy5yZW1vdmVEZWNvcmF0aW9ucygpO1xuICAgIGZvciAobGV0IGRlY29yYXRpb25JZCBpbiB0aGlzLmVkaXRvci5kaXNwbGF5QnVmZmVyLmRlY29yYXRpb25zQnlJZCkge1xuICAgICAgdGhpcy5wcm9jZXNzRGVjb3JhdGlvbih0aGlzLmVkaXRvci5kaXNwbGF5QnVmZmVyLmRlY29yYXRpb25zQnlJZFtkZWNvcmF0aW9uSWRdKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzRGVjb3JhdGlvbiAobGludGVyRGVjb3JhdGlvbikge1xuICAgIGlmIChsaW50ZXJEZWNvcmF0aW9uLnByb3BlcnRpZXMgJiYgbGludGVyRGVjb3JhdGlvbi5wcm9wZXJ0aWVzLmNsYXNzICYmIGxpbnRlckRlY29yYXRpb24ucHJvcGVydGllcy5jbGFzcy5pbmRleE9mKCdsaW50ZXItJykgPT09IDApIHtcbiAgICAgIGxldCBtaW5pbWFwRGVjb3JhdGlvbiA9IHRoaXMubWluaW1hcC5kZWNvcmF0ZU1hcmtlcihsaW50ZXJEZWNvcmF0aW9uLm1hcmtlciwgeyB0eXBlOiB0aGlzLm1hcmtlclR5cGUsIGNsYXNzOiBsaW50ZXJEZWNvcmF0aW9uLnByb3BlcnRpZXMuY2xhc3MgfSk7XG4gICAgICB0aGlzLmRlY29yYXRpb25zLnB1c2gobWluaW1hcERlY29yYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZW1vdmVEZWNvcmF0aW9ucygpO1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVtb3ZlRGVjb3JhdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgdGhpcy5kZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4gZGVjb3JhdGlvbi5kZXN0cm95KCkpO1xuICAgIHRoaXMuZGVjb3JhdGlvbnMgPSBbXTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/doot/.atom/packages/minimap-linter/lib/minimap-linter-binding.js
