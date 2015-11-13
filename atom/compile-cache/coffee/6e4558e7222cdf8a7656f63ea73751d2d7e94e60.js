(function() {
  var command;

  command = require('./command');

  module.exports = {
    css: function(fpath, text, options) {
      if (options == null) {
        options = ['-s'];
      }
      return command.compile(fpath, text, 'sass', options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL3Nhc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLElBQUQ7T0FDdkI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixNQUEzQixFQUFrQyxPQUFsQyxFQURHO0lBQUEsQ0FBTDtHQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/sass.coffee
