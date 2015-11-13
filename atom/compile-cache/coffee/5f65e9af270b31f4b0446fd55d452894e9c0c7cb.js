(function() {
  var Emitter, Watch, chokidar;

  chokidar = require('chokidar');

  Emitter = require('event-kit').Emitter;

  module.exports = Watch = (function() {
    function Watch(w) {
      var path, paths;
      this.emitter = new Emitter;
      paths = w.split(',');
      paths = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          _results.push(path.trim());
        }
        return _results;
      })();
      this.chokidar = chokidar.watch(paths);
      this.paths = paths;
      this.chokidar.on('change', (function(_this) {
        return function(path, stats) {
          console.log('CHOKIDAR', path, stats);
          return _this.emitter.emit('did-change', path);
        };
      })(this));
    }

    Watch.prototype.onDidChange = function(cb) {
      return this.emitter.on('did-change', cb);
    };

    return Watch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi93YXRjaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDUyxJQUFBLGVBQUMsQ0FBRCxHQUFBO0FBQ1gsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsS0FBRixDQUFRLEdBQVIsQ0FEUixDQUFBO0FBQUEsTUFFQSxLQUFBOztBQUFTO2FBQUEsNENBQUE7MkJBQUE7QUFBQSx3QkFBQSxJQUFJLENBQUMsSUFBTCxDQUFBLEVBQUEsQ0FBQTtBQUFBOztVQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBUSxDQUFDLEtBQVQsQ0FBZSxLQUFmLENBSFosQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUpULENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxRQUFRLENBQUMsRUFBVixDQUFhLFFBQWIsRUFBdUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxFQUFNLEtBQU4sR0FBQTtBQUNyQixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBWixFQUF1QixJQUF2QixFQUE0QixLQUE1QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsWUFBZCxFQUE0QixJQUE1QixFQUZxQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCLENBTEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsb0JBVUEsV0FBQSxHQUFhLFNBQUMsRUFBRCxHQUFBO2FBQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksWUFBWixFQUEwQixFQUExQixFQURXO0lBQUEsQ0FWYixDQUFBOztpQkFBQTs7TUFKSixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/watch.coffee
