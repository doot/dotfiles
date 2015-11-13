(function() {
  var c2l, c2s, command, loophole;

  loophole = require('./eval');

  c2s = require('css2stylus');

  c2l = require('css2less');

  command = require('./command');

  module.exports = {
    stylus: function(fpath, text, options) {
      var converter;
      if (options == null) {
        options = {};
      }
      converter = new c2s.Converter(text);
      return converter.processCss(options).output;
    },
    less: function(fpath, text, options) {
      if (options == null) {
        options = {};
      }
      return loophole.allowUnsafe(function() {
        return c2l(text, options);
      });
    },
    sass: function(fpath, text, options) {
      if (options == null) {
        options = ['SASS'];
      }
      return command.compile(fpath, text, 'css2sass', options);
    },
    scss: function(fpath, text, options) {
      if (options == null) {
        options = ['SCSS'];
      }
      return command.compile(fpath, text, 'css2sass', options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2Nzcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsVUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7QUFDTixVQUFBLFNBQUE7O1FBRGtCLFVBQVE7T0FDMUI7QUFBQSxNQUFBLFNBQUEsR0FBZ0IsSUFBQSxHQUFHLENBQUMsU0FBSixDQUFjLElBQWQsQ0FBaEIsQ0FBQTthQUNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLE9BQXJCLENBQTZCLENBQUMsT0FGeEI7SUFBQSxDQUFSO0FBQUEsSUFJQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTs7UUFBWSxVQUFRO09BQ3hCO2FBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsU0FBQSxHQUFBO2VBQUcsR0FBQSxDQUFJLElBQUosRUFBUyxPQUFULEVBQUg7TUFBQSxDQUFyQixFQURJO0lBQUEsQ0FKTjtBQUFBLElBT0EsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLE1BQUQ7T0FDdEI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixVQUEzQixFQUFzQyxPQUF0QyxFQURFO0lBQUEsQ0FQTjtBQUFBLElBVUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLE1BQUQ7T0FDdEI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixVQUEzQixFQUFzQyxPQUF0QyxFQURFO0lBQUEsQ0FWTjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/css.coffee
