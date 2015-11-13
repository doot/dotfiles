(function() {
  module.exports = {
    config: {
      coloured: {
        type: 'boolean',
        "default": true,
        description: 'Untick this for colourless icons'
      },
      forceShow: {
        type: 'boolean',
        "default": false,
        description: 'Force show icons - for themes that hide icons'
      },
      onChanges: {
        type: 'boolean',
        "default": false,
        description: 'Only colour icons when file is modified'
      },
      tabPaneIcon: {
        type: 'boolean',
        "default": true,
        description: 'Show file icons on tab pane'
      }
    },
    activate: function(state) {
      atom.config.onDidChange('file-icons.coloured', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.colour(newValue);
        };
      })(this));
      this.colour(atom.config.get('file-icons.coloured'));
      atom.config.onDidChange('file-icons.forceShow', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.forceShow(newValue);
        };
      })(this));
      this.forceShow(atom.config.get('file-icons.forceShow'));
      atom.config.onDidChange('file-icons.onChanges', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.onChanges(newValue);
        };
      })(this));
      this.onChanges(atom.config.get('file-icons.onChanges'));
      atom.config.onDidChange('file-icons.tabPaneIcon', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.tabPaneIcon(newValue);
        };
      })(this));
      return this.tabPaneIcon(atom.config.get('file-icons.tabPaneIcon'));
    },
    deactivate: function() {},
    serialize: function() {},
    colour: function(enable) {
      var body;
      body = document.querySelector('body');
      if (enable) {
        return body.className = body.className.replace(/\sfile-icons-colourless/, '');
      } else {
        return body.className = "" + body.className + " file-icons-colourless";
      }
    },
    forceShow: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-force-show-icons";
      } else {
        return body.className = className.replace(/\sfile-icons-force-show-icons/, '');
      }
    },
    onChanges: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-on-changes";
      } else {
        return body.className = className.replace(/\sfile-icons-on-changes/, '');
      }
    },
    tabPaneIcon: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-tab-pane-icon";
      } else {
        return body.className = className.replace(/\sfile-icons-tab-pane-icon/, '');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZmlsZS1pY29ucy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BREY7QUFBQSxNQUlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsK0NBRmI7T0FMRjtBQUFBLE1BUUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5Q0FGYjtPQVRGO0FBQUEsTUFZQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZCQUZiO09BYkY7S0FERjtBQUFBLElBa0JBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHFCQUF4QixFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDN0MsY0FBQSxrQkFBQTtBQUFBLFVBRCtDLGdCQUFBLFVBQVUsZ0JBQUEsUUFDekQsQ0FBQTtpQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsRUFENkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQyxDQUFBLENBQUE7QUFB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

//# sourceURL=/Users/doot/.atom/packages/file-icons/index.coffee
