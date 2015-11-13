(function() {
  var LinterLiferay, path;

  path = require('path');

  LinterLiferay = require('./linter-liferay');

  module.exports = {
    config: {
      lintJS: {
        "default": true,
        description: 'Check javascript source for errors in addition to formatting',
        title: 'Lint Javascript',
        type: 'boolean'
      },
      checkSFPath: {
        "default": path.join(__dirname, '..', 'node_modules', 'check-source-formatting', 'bin', 'index.js'),
        description: 'The absolute path to check-source-formatting\'s main. You generally should have no need to modify this.',
        title: 'Path to check-source-formatting',
        type: 'string'
      }
    },
    activate: function() {
      return this.linter = new LinterLiferay;
    },
    deactivate: function() {
      return this.linter.destroy();
    },
    provideLinter: function() {
      return this.linter.getProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLWxpZmVyYXkvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNDO0FBQUEsSUFBQSxNQUFBLEVBQ0M7QUFBQSxNQUFBLE1BQUEsRUFDQztBQUFBLFFBQUEsU0FBQSxFQUFTLElBQVQ7QUFBQSxRQUNBLFdBQUEsRUFBYSw4REFEYjtBQUFBLFFBRUEsS0FBQSxFQUFPLGlCQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sU0FITjtPQUREO0FBQUEsTUFLQSxXQUFBLEVBQ0M7QUFBQSxRQUFBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMseUJBQTNDLEVBQXNFLEtBQXRFLEVBQTZFLFVBQTdFLENBQVQ7QUFBQSxRQUNBLFdBQUEsRUFBYSx5R0FEYjtBQUFBLFFBRUEsS0FBQSxFQUFPLGlDQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sUUFITjtPQU5EO0tBREQ7QUFBQSxJQVlBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLEdBQUEsQ0FBQSxjQUREO0lBQUEsQ0FaVjtBQUFBLElBZUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLEVBRFc7SUFBQSxDQWZaO0FBQUEsSUFrQkEsYUFBQSxFQUFlLFNBQUEsR0FBQTthQUNkLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFBLEVBRGM7SUFBQSxDQWxCZjtHQUpELENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-liferay/lib/init.coffee
