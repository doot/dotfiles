(function() {
  var command;

  command = require('./command');

  module.exports = {
    html: function(fpath, text, options) {
      if (options == null) {
        options = ['-s'];
      }
      return command.compile(fpath, text, 'haml', options);
    },
    htmlp: function(fpath, text) {
      console.log(text);
      return this.html(fpath, text);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2hhbWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLElBQUQ7T0FDdEI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixNQUEzQixFQUFrQyxPQUFsQyxFQURFO0lBQUEsQ0FBTjtBQUFBLElBR0EsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFPLElBQVAsR0FBQTtBQUNMLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixFQUFZLElBQVosRUFGSztJQUFBLENBSFA7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/haml.coffee
