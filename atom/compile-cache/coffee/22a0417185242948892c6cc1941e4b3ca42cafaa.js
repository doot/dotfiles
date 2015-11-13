(function() {
  var command;

  command = require('./command');

  module.exports = {
    haml: function(fpath, text, options) {
      if (options == null) {
        options = ['-s', '-e'];
      }
      return command.compile(fpath, text, 'html2haml', options);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2VyYi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosR0FBQTs7UUFBWSxVQUFRLENBQUMsSUFBRCxFQUFNLElBQU47T0FDdEI7YUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFoQixFQUFzQixJQUF0QixFQUEyQixXQUEzQixFQUF1QyxPQUF2QyxFQURFO0lBQUEsQ0FBTjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/erb.coffee
