(function() {
  var beautify, jQuery, jsx, reactTools;

  reactTools = require('react-tools');

  beautify = require('js-beautify').js_beautify;

  jQuery = require('jquery');

  jsx = {
    js: function(fpath, text, options) {
      var compiled;
      if (options == null) {
        options = {};
      }
      compiled = reactTools.transform(text, options);
      return beautify(compiled);
    }
  };

  jQuery.extend(jsx, require('./jshtml')(true, 'jsx'));

  module.exports = jsx;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2pzeC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsV0FEbEMsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUZULENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSyxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixHQUFBO0FBQ0gsVUFBQSxRQUFBOztRQURlLFVBQVE7T0FDdkI7QUFBQSxNQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsU0FBWCxDQUFxQixJQUFyQixFQUEwQixPQUExQixDQUFYLENBQUE7YUFDQSxRQUFBLENBQVMsUUFBVCxFQUZHO0lBQUEsQ0FBTDtHQUxGLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsTUFBUCxDQUFjLEdBQWQsRUFBbUIsT0FBQSxDQUFRLFVBQVIsQ0FBQSxDQUFvQixJQUFwQixFQUF5QixLQUF6QixDQUFuQixDQVZBLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQVhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/jsx.coffee
