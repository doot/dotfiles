(function() {
  var jade, loophole;

  loophole = require('./eval');

  jade = loophole.allowUnsafe(function() {
    return require('jade');
  });

  module.exports = {
    html: function(fpath, text, options, data) {
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      return loophole.allowUnsafe(function() {
        var fn;
        fn = jade.compile(text, options);
        return fn(data);
      });
    },
    htmlp: function(fpath, text, options, data) {
      var compiled;
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      compiled = this.html(fpath, text, options, data);
      console.log(compiled);
      return compiled;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2phZGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLFNBQUEsR0FBQTtXQUFHLE9BQUEsQ0FBUSxNQUFSLEVBQUg7RUFBQSxDQUFyQixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU8sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBdUIsSUFBdkIsR0FBQTs7UUFBWSxVQUFRO09BQ3pCOztRQUQ0QixPQUFLO09BQ2pDO2FBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFrQixPQUFsQixDQUFMLENBQUE7ZUFDQSxFQUFBLENBQUcsSUFBSCxFQUZtQjtNQUFBLENBQXJCLEVBREs7SUFBQSxDQUFQO0FBQUEsSUFLQSxLQUFBLEVBQVEsU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBdUIsSUFBdkIsR0FBQTtBQUNGLFVBQUEsUUFBQTs7UUFEYyxVQUFRO09BQ3RCOztRQUR5QixPQUFLO09BQzlCO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLEVBQVksSUFBWixFQUFpQixPQUFqQixFQUF5QixJQUF6QixDQUFYLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQURBLENBQUE7QUFFQSxhQUFPLFFBQVAsQ0FIRTtJQUFBLENBTFI7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/jade.coffee
