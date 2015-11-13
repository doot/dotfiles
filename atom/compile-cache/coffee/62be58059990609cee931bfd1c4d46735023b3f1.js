(function() {
  var config;

  config = require('../config');

  module.exports = function(js, src) {
    if (js == null) {
      js = true;
    }
    return {
      html: function(fpath, text, options, data) {
        var CSS, SCRIPT, css, html, resource, script, scripts, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        if (options == null) {
          options = {};
        }
        if (data == null) {
          data = {};
        }
        if (js) {
          text = this.js(fpath, text, options);
        }
        SCRIPT = CSS = '';
        if (src) {
          if (scripts = config[src].scripts) {
            for (_i = 0, _len = scripts.length; _i < _len; _i++) {
              script = scripts[_i];
              SCRIPT += "<script src='" + script + "'></script>\\n";
            }
          }
          if (resource = config[src].resources) {
            _ref = resource.csss;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              css = _ref[_j];
              CSS += "<link rel='stylesheet' type='text/css' href='file:///" + __dirname + "/resources/" + css + "'>\\n";
            }
            _ref1 = resource.scripts;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              script = _ref1[_k];
              SCRIPT += "<script src='file:///" + __dirname + "/resources/" + script + "'></script>\\n";
            }
          }
        }
        return html = "<html>\n  <head>\n    " + CSS + "\n    " + SCRIPT + "\n    <script type='text/javascript'>\n      window.onload = function(){\n        " + text + "\n      }\n    </script>\n  </head>\n  <body>\n  </body>\n</html>";
      },
      htmlp: function(fpath, text, options, data) {
        if (options == null) {
          options = {};
        }
        if (data == null) {
          data = {};
        }
        return this.html(fpath, text, options, data);
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2pzaHRtbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEVBQUQsRUFBUyxHQUFULEdBQUE7O01BQUMsS0FBRztLQUNuQjtXQUFBO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBdUIsSUFBdkIsR0FBQTtBQUNKLFlBQUEsOEZBQUE7O1VBRGdCLFVBQVE7U0FDeEI7O1VBRDJCLE9BQUs7U0FDaEM7QUFBQSxRQUFBLElBQWtDLEVBQWxDO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEVBQUQsQ0FBSSxLQUFKLEVBQVUsSUFBVixFQUFlLE9BQWYsQ0FBUCxDQUFBO1NBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxHQUFBLEdBQU0sRUFEZixDQUFBO0FBR0EsUUFBQSxJQUFHLEdBQUg7QUFDRSxVQUFBLElBQUcsT0FBQSxHQUFVLE1BQU8sQ0FBQSxHQUFBLENBQUksQ0FBQyxPQUF6QjtBQUNFLGlCQUFBLDhDQUFBO21DQUFBO0FBQ0UsY0FBQSxNQUFBLElBQVcsZUFBQSxHQUFlLE1BQWYsR0FBc0IsZ0JBQWpDLENBREY7QUFBQSxhQURGO1dBQUE7QUFHQSxVQUFBLElBQUcsUUFBQSxHQUFXLE1BQU8sQ0FBQSxHQUFBLENBQUksQ0FBQyxTQUExQjtBQUNFO0FBQUEsaUJBQUEsNkNBQUE7NkJBQUE7QUFDRSxjQUFBLEdBQUEsSUFBUSx1REFBQSxHQUF1RCxTQUF2RCxHQUFpRSxhQUFqRSxHQUE4RSxHQUE5RSxHQUFrRixPQUExRixDQURGO0FBQUEsYUFBQTtBQUVBO0FBQUEsaUJBQUEsOENBQUE7aUNBQUE7QUFDRSxjQUFBLE1BQUEsSUFBVyx1QkFBQSxHQUF1QixTQUF2QixHQUFpQyxhQUFqQyxHQUE4QyxNQUE5QyxHQUFxRCxnQkFBaEUsQ0FERjtBQUFBLGFBSEY7V0FKRjtTQUhBO2VBWUEsSUFBQSxHQUNKLHdCQUFBLEdBQ1MsR0FEVCxHQUNhLFFBRGIsR0FFSyxNQUZMLEdBRVksb0ZBRlosR0FLYyxJQUxkLEdBS21CLG9FQW5CWDtNQUFBLENBQU47QUFBQSxNQTRCQSxLQUFBLEVBQU8sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBdUIsSUFBdkIsR0FBQTs7VUFBWSxVQUFRO1NBQ3pCOztVQUQ0QixPQUFLO1NBQ2pDO2VBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLEVBQVksSUFBWixFQUFpQixPQUFqQixFQUF5QixJQUF6QixFQURLO01BQUEsQ0E1QlA7TUFEZTtFQUFBLENBRmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/jshtml.coffee
