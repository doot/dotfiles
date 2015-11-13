(function() {
  var tsc;

  tsc = require('typescript-compiler');

  module.exports = {
    js: function(fpath, text, options) {
      var tscArgs;
      if (options == null) {
        options = {};
      }
      tscArgs = atom.config.get('preview-plus.tscArgs') || {};
      return tsc.compileString(text, tscArgs, options, function(err) {
        return console.log(err);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL3R5cGVzY3JpcHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLHFCQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSyxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBO0FBQ0gsVUFBQSxPQUFBOztRQURlLFVBQVE7T0FDdkI7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQUEsSUFBMkMsRUFBckQsQ0FBQTthQUNBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLEVBQXVCLE9BQXZCLEVBQWdDLE9BQWhDLEVBQXdDLFNBQUMsR0FBRCxHQUFBO2VBQ3RDLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWixFQURzQztNQUFBLENBQXhDLEVBRkc7SUFBQSxDQUFMO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/typescript.coffee
