(function() {
  var ECT, loophole, path;

  loophole = require('./eval');

  ECT = loophole.allowUnsafe(function() {
    return require('ect');
  });

  path = require('path');

  module.exports = {
    html: function(filePath, text, options, data) {
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      return loophole.allowUnsafe(function() {
        var fileName, renderer, root;
        fileName = path.basename(filePath);
        root = path.dirname(filePath);
        options.root = root;
        renderer = ECT(options);
        return renderer.render(fileName, data);
      });
    },
    htmlp: function(filename, text, options, data) {
      var compiled;
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      compiled = this.html(filename, text, options, data);
      console.log(compiled);
      return compiled;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2VjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLFNBQUEsR0FBQTtXQUFHLE9BQUEsQ0FBUSxLQUFSLEVBQUg7RUFBQSxDQUFyQixDQURQLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsUUFBRCxFQUFVLElBQVYsRUFBZSxPQUFmLEVBQTBCLElBQTFCLEdBQUE7O1FBQWUsVUFBUTtPQUMzQjs7UUFEOEIsT0FBSztPQUNuQzthQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLHdCQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQURQLENBQUE7QUFBQSxRQUVBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsSUFGZixDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsR0FBQSxDQUFJLE9BQUosQ0FIWCxDQUFBO2VBSUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsUUFBaEIsRUFBeUIsSUFBekIsRUFMbUI7TUFBQSxDQUFyQixFQURJO0lBQUEsQ0FBTjtBQUFBLElBUUEsS0FBQSxFQUFPLFNBQUMsUUFBRCxFQUFVLElBQVYsRUFBZSxPQUFmLEVBQTBCLElBQTFCLEdBQUE7QUFDRCxVQUFBLFFBQUE7O1FBRGdCLFVBQVE7T0FDeEI7O1FBRDJCLE9BQUs7T0FDaEM7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sRUFBZSxJQUFmLEVBQW9CLE9BQXBCLEVBQTRCLElBQTVCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaLENBREEsQ0FBQTtBQUVBLGFBQU8sUUFBUCxDQUhDO0lBQUEsQ0FSUDtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/ect.coffee
