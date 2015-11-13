Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _eventKit = require('event-kit');

var _minimapLinterBinding = require('./minimap-linter-binding');

var _minimapLinterBinding2 = _interopRequireDefault(_minimapLinterBinding);

'use babel';

var MinimapLinter = (function () {
  function MinimapLinter() {
    _classCallCheck(this, MinimapLinter);

    this.config = {
      markerType: {
        type: 'string',
        'default': 'highlight-over',
        'enum': ['line', 'highlight-under', 'highlight-over', 'highlight-outline'],
        description: 'Marker type'
      }
    };
    this.bindings = [];
  }

  _createClass(MinimapLinter, [{
    key: 'isActive',
    value: function isActive() {
      return this.minimapsSubscription !== undefined && !this.minimapsSubscription.disposed;
    }
  }, {
    key: 'activate',
    value: function activate() {
      this.subscriptions = new _eventKit.CompositeDisposable();
    }
  }, {
    key: 'consumeMinimapServiceV1',
    value: function consumeMinimapServiceV1(minimap) {
      this.minimap = minimap;
      this.minimap.registerPlugin('linter', this);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.minimap.unregisterPlugin('linter');
      this.minimap = null;
    }
  }, {
    key: 'activatePlugin',
    value: function activatePlugin() {
      var _this = this;

      if (this.isActive()) return;

      this.minimapsSubscription = this.minimap.observeMinimaps(function (minimap) {
        var subscription = undefined,
            binding = undefined;
        _this.bindings.push(binding = new _minimapLinterBinding2['default'](minimap));
        return _this.subscriptions.add(subscription = minimap.onDidDestroy(function () {
          binding.destroy();
          _this.subscriptions.remove(subscription);
          return subscription.dispose();
        }));
      });
    }
  }, {
    key: 'deactivatePlugin',
    value: function deactivatePlugin() {
      this.bindings.forEach(function (binding) {
        return binding.destroy();
      });
      this.bindings = [];
      this.minimapsSubscription.dispose();
      return this.subscriptions.dispose();
    }
  }]);

  return MinimapLinter;
})();

exports['default'] = new MinimapLinter();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAtbGludGVyL2xpYi9taW5pbWFwLWxpbnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3dCQUNvQyxXQUFXOztvQ0FDZCwwQkFBMEI7Ozs7QUFGM0QsV0FBVyxDQUFDOztJQUlOLGFBQWE7QUFDSixXQURULGFBQWEsR0FDRDswQkFEWixhQUFhOztBQUViLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixnQkFBVSxFQUFFO0FBQ1YsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxnQkFBZ0I7QUFDekIsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7QUFDeEUsbUJBQVcsRUFBRSxhQUFhO09BQzNCO0tBQ0YsQ0FBQztBQUNGLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0dBQ3BCOztlQVhDLGFBQWE7O1dBYVAsb0JBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDO0tBQ3ZGOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxhQUFhLEdBQUcsbUNBQXlCLENBQUM7S0FDaEQ7OztXQUVzQixpQ0FBQyxPQUFPLEVBQUU7QUFDL0IsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdDOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDckI7OztXQUVhLDBCQUFHOzs7QUFDZixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPOztBQUU1QixVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDcEUsWUFBSSxZQUFZLFlBQUE7WUFBRSxPQUFPLFlBQUEsQ0FBQztBQUMxQixjQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLHNDQUF5QixPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLGVBQU8sTUFBSyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDdEUsaUJBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQixnQkFBSyxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLGlCQUFPLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMvQixDQUFDLENBQUMsQ0FBQztPQUNMLENBQUMsQ0FBQztLQUNKOzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDckM7OztTQWxEQyxhQUFhOzs7cUJBcURKLElBQUksYUFBYSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9kb290Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAtbGludGVyL2xpYi9taW5pbWFwLWxpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgTWluaW1hcExpbnRlckJpbmRpbmcgZnJvbSAnLi9taW5pbWFwLWxpbnRlci1iaW5kaW5nJztcblxuY2xhc3MgTWluaW1hcExpbnRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgbWFya2VyVHlwZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdoaWdobGlnaHQtb3ZlcicsXG4gICAgICAgICAgZW51bTogWydsaW5lJywgJ2hpZ2hsaWdodC11bmRlcicsICdoaWdobGlnaHQtb3ZlcicsICdoaWdobGlnaHQtb3V0bGluZSddLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFya2VyIHR5cGUnXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLmJpbmRpbmdzID0gW107XG4gICAgfVxuXG4gICAgaXNBY3RpdmUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5taW5pbWFwc1N1YnNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkICYmICF0aGlzLm1pbmltYXBzU3Vic2NyaXB0aW9uLmRpc3Bvc2VkO1xuICAgIH1cblxuICAgIGFjdGl2YXRlKCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB9XG5cbiAgICBjb25zdW1lTWluaW1hcFNlcnZpY2VWMShtaW5pbWFwKSB7XG4gICAgICB0aGlzLm1pbmltYXAgPSBtaW5pbWFwO1xuICAgICAgdGhpcy5taW5pbWFwLnJlZ2lzdGVyUGx1Z2luKCdsaW50ZXInLCB0aGlzKTtcbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgdGhpcy5taW5pbWFwLnVucmVnaXN0ZXJQbHVnaW4oJ2xpbnRlcicpO1xuICAgICAgdGhpcy5taW5pbWFwID0gbnVsbDtcbiAgICB9XG5cbiAgICBhY3RpdmF0ZVBsdWdpbigpIHtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKCkpIHJldHVybjtcblxuICAgICAgdGhpcy5taW5pbWFwc1N1YnNjcmlwdGlvbiA9IHRoaXMubWluaW1hcC5vYnNlcnZlTWluaW1hcHMoKG1pbmltYXApID0+IHtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiwgYmluZGluZztcbiAgICAgICAgdGhpcy5iaW5kaW5ncy5wdXNoKGJpbmRpbmcgPSBuZXcgTWluaW1hcExpbnRlckJpbmRpbmcobWluaW1hcCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb24gPSBtaW5pbWFwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgYmluZGluZy5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb24pO1xuICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlUGx1Z2luKCkge1xuICAgICAgdGhpcy5iaW5kaW5ncy5mb3JFYWNoKGJpbmRpbmcgPT4gYmluZGluZy5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IFtdO1xuICAgICAgdGhpcy5taW5pbWFwc1N1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNaW5pbWFwTGludGVyKCk7XG4iXX0=
//# sourceURL=/Users/doot/.atom/packages/minimap-linter/lib/minimap-linter.js
