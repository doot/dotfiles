(function() {
  var config;

  config = require('../lib/init').config;

  module.exports.resetConfig = function() {
    return Object.keys(config).forEach(function(key) {
      return atom.config.set("linter-linter-package-json-validator." + key, config[key]["default"]);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBhY2thZ2UtanNvbi12YWxpZGF0b3Ivc3BlYy90ZXN0LWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFFLFNBQVcsT0FBQSxDQUFRLGFBQVIsRUFBWCxNQUFGLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQWYsR0FBNkIsU0FBQSxHQUFBO1dBRTNCLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQUFtQixDQUFDLE9BQXBCLENBQTRCLFNBQUMsR0FBRCxHQUFBO2FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFpQix1Q0FBQSxHQUF1QyxHQUF4RCxFQUErRCxNQUFPLENBQUEsR0FBQSxDQUFJLENBQUMsU0FBRCxDQUExRSxFQUQwQjtJQUFBLENBQTVCLEVBRjJCO0VBQUEsQ0FIN0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-package-json-validator/spec/test-helper.coffee
