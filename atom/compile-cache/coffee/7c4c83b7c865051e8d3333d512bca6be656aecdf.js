(function() {
  var command;

  command = require('./command');

  module.exports = {
    html: function(fpath, text, options) {
      if (options == null) {
        options = ['-s', '-p'];
      }
      return command.compile(fpath, text, 'slimrb', options);
    },
    erb: function(fpath, text, options) {
      if (options == null) {
        options = ['-s', '-e'];
      }
      return command.compile(fpath, text, 'slimrb', options);
    },
    htmlp: function(fpath, text, options) {
      return this.html(fpath, text, options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL3NsaW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUSxDQUFDLElBQUQsRUFBTSxJQUFOO09BQ3hCO2FBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBc0IsSUFBdEIsRUFBMkIsUUFBM0IsRUFBb0MsT0FBcEMsRUFESTtJQUFBLENBQU47QUFBQSxJQUdBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBOztRQUFZLFVBQVEsQ0FBQyxJQUFELEVBQU0sSUFBTjtPQUN2QjthQUFBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWhCLEVBQXNCLElBQXRCLEVBQTJCLFFBQTNCLEVBQW9DLE9BQXBDLEVBREc7SUFBQSxDQUhMO0FBQUEsSUFNQSxLQUFBLEVBQU8sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixFQUFZLElBQVosRUFBaUIsT0FBakIsRUFESztJQUFBLENBTlA7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/slim.coffee
