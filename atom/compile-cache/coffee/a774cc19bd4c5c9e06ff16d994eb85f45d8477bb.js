(function() {
  var LinterFlint;

  module.exports = LinterFlint = {
    config: {
      executablePath: {
        type: 'string',
        "default": 'flint'
      },
      skipReadme: {
        type: 'boolean',
        "default": false
      },
      skipContributing: {
        type: 'boolean',
        "default": false
      },
      skipLicense: {
        type: 'boolean',
        "default": false
      },
      skipBootstrap: {
        type: 'boolean',
        "default": false
      },
      skipTestScript: {
        type: 'boolean',
        "default": false
      },
      skipScripts: {
        type: 'boolean',
        "default": false
      },
      colorOutput: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      return require('atom-package-deps').install('linter-flint');
    },
    provideLinter: function() {
      var LinterProvider;
      LinterProvider = require('./provider');
      this.provider = new LinterProvider();
      return {
        grammarScopes: ['*'],
        scope: 'project',
        lint: this.provider.lint,
        lintOnFly: true
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWZsaW50L2xpYi9saW50ZXItZmxpbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BRFQ7T0FERjtBQUFBLE1BR0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtBQUFBLE1BTUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BUEY7QUFBQSxNQVNBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BVkY7QUFBQSxNQVlBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BYkY7QUFBQSxNQWVBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BaEJGO0FBQUEsTUFrQkEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FuQkY7QUFBQSxNQXFCQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQXRCRjtLQURGO0FBQUEsSUEwQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixDQUFDLE9BQTdCLENBQXFDLGNBQXJDLEVBRFE7SUFBQSxDQTFCVjtBQUFBLElBNkJBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLGNBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLFlBQVIsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxjQUFBLENBQUEsQ0FEaEIsQ0FBQTtBQUVBLGFBQU87QUFBQSxRQUNMLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEVjtBQUFBLFFBRUwsS0FBQSxFQUFPLFNBRkY7QUFBQSxRQUdMLElBQUEsRUFBTSxJQUFDLENBQUEsUUFBUSxDQUFDLElBSFg7QUFBQSxRQUlMLFNBQUEsRUFBVyxJQUpOO09BQVAsQ0FIYTtJQUFBLENBN0JmO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/linter-flint/lib/linter-flint.coffee
