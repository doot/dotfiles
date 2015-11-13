(function() {
  var config, marked;

  marked = require('marked');

  config = require('../config');

  module.exports = {
    html: function(fpath, text, options) {
      if (options == null) {
        options = {};
      }
      marked.setOptions(options);
      return marked(text);
    },
    htmlp: function(fpath, text, options) {
      var css, cssURL, html;
      if (options == null) {
        options = {};
      }
      if (cssURL = config.markdown.cssURL) {
        css = "<link rel='stylesheet' type='text/css' href='" + cssURL + "'>";
      } else {
        css = "<link rel='stylesheet' type='text/css' href='file:///" + atom.workspace.srcdir + "/resources/markdown.css'>";
      }
      html = this.html(fpath, text, options);
      return "<html>\n  <head>\n    " + css + "\n  </head>\n  <body>\n    " + html + "\n  </body>\n</html>";
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL21hcmtkb3duLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQURULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQUssU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTs7UUFBWSxVQUFRO09BQ3ZCO0FBQUEsTUFBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUFBLENBQUE7YUFTQSxNQUFBLENBQU8sSUFBUCxFQVZHO0lBQUEsQ0FBTDtBQUFBLElBWUEsS0FBQSxFQUFNLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEdBQUE7QUFDSixVQUFBLGlCQUFBOztRQURnQixVQUFRO09BQ3hCO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQTVCO0FBQ0UsUUFBQSxHQUFBLEdBQU8sK0NBQUEsR0FBK0MsTUFBL0MsR0FBc0QsSUFBN0QsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLEdBQUEsR0FBTyx1REFBQSxHQUF1RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQXRFLEdBQTZFLDJCQUFwRixDQUhGO09BQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sRUFBWSxJQUFaLEVBQWlCLE9BQWpCLENBSlAsQ0FBQTthQU1KLHdCQUFBLEdBQ1csR0FEWCxHQUVFLDZCQUZGLEdBR2EsSUFIYixHQUlJLHVCQVhJO0lBQUEsQ0FaTjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/markdown.coffee
