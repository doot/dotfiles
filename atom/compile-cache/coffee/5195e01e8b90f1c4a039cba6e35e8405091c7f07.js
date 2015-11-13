(function() {
  var PJVProvider, fs, packageDeps, path;

  fs = require("fs");

  path = require("path");

  PJVProvider = require('./package-json-validator-provider');

  packageDeps = require('atom-package-deps');

  module.exports = {
    config: {
      show_warnings: {
        type: 'boolean',
        "default": true
      },
      show_recommendations: {
        type: 'boolean',
        "default": true
      },
      spec: {
        type: 'string',
        "default": 'npm',
        "enum": ['npm', 'commonjs_1.0', 'commonjs_1.1']
      }
    },
    activate: function() {
      if (atom.inDevMode()) {
        console.log('activate linter-package-json-validator');
      }
      return packageDeps.install('linter-package-json-validator');
    },
    provideLinter: function() {
      return PJVProvider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBhY2thZ2UtanNvbi12YWxpZGF0b3IvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG1DQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsbUJBQVIsQ0FIZCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FKRjtBQUFBLE1BTUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLE1BQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxjQUFSLEVBQXdCLGNBQXhCLENBRk47T0FQRjtLQURGO0FBQUEsSUFZQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUF3RCxJQUFJLENBQUMsU0FBTCxDQUFBLENBQXhEO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHdDQUFaLENBQUEsQ0FBQTtPQUFBO2FBRUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsK0JBQXBCLEVBSFE7SUFBQSxDQVpWO0FBQUEsSUFpQkEsYUFBQSxFQUFlLFNBQUEsR0FBQTthQUFHLFlBQUg7SUFBQSxDQWpCZjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-package-json-validator/lib/init.coffee
