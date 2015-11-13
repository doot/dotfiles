(function() {
  var stylus;

  stylus = require('stylus');

  module.exports = {
    css: function(fpath, text, options) {
      if (options == null) {
        options = {};
      }
      return stylus(text).set(options).render();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL3N0eWx1cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTs7UUFBWSxVQUFRO09BRXZCO2FBQUEsTUFBQSxDQUFPLElBQVAsQ0FDRSxDQUFDLEdBREgsQ0FDTyxPQURQLENBRUUsQ0FBQyxNQUZILENBQUEsRUFGRztJQUFBLENBQUw7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/stylus.coffee
