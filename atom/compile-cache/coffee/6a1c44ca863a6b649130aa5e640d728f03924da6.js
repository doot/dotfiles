(function() {
  var path;

  path = require('path');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'node_modules', '.bin'),
        description: 'Path of the `bootlinter` executable'
      },
      flags: {
        type: 'string',
        "default": '',
        description: 'Disable certain lint checks (comma-separated), refer to bootlint github page for error codes'
      }
    },
    activate: function() {
      return console.log('activate linter-bootlint');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWJvb3RsaW50L2xpYi9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixjQUEzQixFQUEyQyxNQUEzQyxDQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEscUNBRmI7T0FERjtBQUFBLE1BSUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSw4RkFGYjtPQUxGO0tBREY7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFaLEVBRFE7SUFBQSxDQVZWO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-bootlint/lib/init.coffee
