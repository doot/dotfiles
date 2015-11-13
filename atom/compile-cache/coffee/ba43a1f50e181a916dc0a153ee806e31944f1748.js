(function() {
  var command;

  command = require('./command');

  module.exports = {
    css: function(fpath, text, options) {
      if (options == null) {
        options = ['-s', '--SCSS'];
      }
      return command.compile(fpath, text, 'sass', options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL3Njc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLElBQUQsRUFBTSxRQUFOO09BRXJCO2FBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBc0IsSUFBdEIsRUFBMkIsTUFBM0IsRUFBa0MsT0FBbEMsRUFGQztJQUFBLENBQUw7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/scss.coffee
