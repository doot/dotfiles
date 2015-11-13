(function() {
  var jQuery, javascript, js2c;

  js2c = require('js2coffee');

  jQuery = require('jquery');

  javascript = {
    cs: function(fpath, text, options) {
      var compiled;
      if (options == null) {
        options = {};
      }
      compiled = js2c.build(text, options);
      return compiled.code;
    }
  };

  jQuery.extend(javascript, require('./jshtml')(false));

  module.exports = javascript;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2phdmFzY3JpcHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxXQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQURULENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSyxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBO0FBQ0gsVUFBQSxRQUFBOztRQURlLFVBQVE7T0FDdkI7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsRUFBZ0IsT0FBaEIsQ0FBWCxDQUFBO2FBQ0EsUUFBUSxDQUFDLEtBRk47SUFBQSxDQUFMO0dBSEYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxNQUFQLENBQWMsVUFBZCxFQUEwQixPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLEtBQXBCLENBQTFCLENBUEEsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBUmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/javascript.coffee
