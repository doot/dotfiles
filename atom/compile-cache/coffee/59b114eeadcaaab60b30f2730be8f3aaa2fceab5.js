(function() {
  var jQuery, less;

  less = require('less');

  jQuery = require('jquery');

  module.exports = {
    css: function(fpath, text, options) {
      var dfd;
      if (options == null) {
        options = {};
      }
      dfd = new jQuery.Deferred();
      less.render(text, options, function(e, output) {
        if (e) {
          return dfd.fail(e);
        } else {
          return dfd.resolve(output.css);
        }
      });
      return dfd.promise();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2xlc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBO0FBQ0gsVUFBQSxHQUFBOztRQURlLFVBQVE7T0FDdkI7QUFBQSxNQUFBLEdBQUEsR0FBVSxJQUFBLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTCxDQUFZLElBQVosRUFBaUIsT0FBakIsRUFBMEIsU0FBQyxDQUFELEVBQUcsTUFBSCxHQUFBO0FBQ3hCLFFBQUEsSUFBRyxDQUFIO2lCQUNFLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQURGO1NBQUEsTUFBQTtpQkFHRSxHQUFHLENBQUMsT0FBSixDQUFZLE1BQU0sQ0FBQyxHQUFuQixFQUhGO1NBRHdCO01BQUEsQ0FBMUIsQ0FEQSxDQUFBO2FBTUEsR0FBRyxDQUFDLE9BQUosQ0FBQSxFQVBHO0lBQUEsQ0FBTDtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/less.coffee
