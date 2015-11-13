(function() {
  var coffee, coffeescript, jQuery;

  coffee = require('coffee-script');

  jQuery = require('jquery');

  coffeescript = {
    js: function(fpath, text, options) {
      return coffee.compile(text, options);
    }
  };

  jQuery.extend(coffeescript, require('./jshtml')(true));

  module.exports = coffeescript;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2NvZmZlZXNjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FDRTtBQUFBLElBQUEsRUFBQSxFQUFLLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7YUFDSCxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsRUFBcUIsT0FBckIsRUFERztJQUFBLENBQUw7R0FIRixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxZQUFkLEVBQTRCLE9BQUEsQ0FBUSxVQUFSLENBQUEsQ0FBb0IsSUFBcEIsQ0FBNUIsQ0FOQSxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/coffeescript.coffee
