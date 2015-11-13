(function() {
  module.exports = {
    title: 'Git-Plus',
    addInfo: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addInfo(this.title, {
        detail: message,
        dismissable: dismissable
      });
    },
    addSuccess: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addSuccess(this.title, {
        detail: message,
        dismissable: dismissable
      });
    },
    addError: function(message, _arg) {
      var dismissable;
      dismissable = (_arg != null ? _arg : {}).dismissable;
      return atom.notifications.addError(this.title, {
        detail: message,
        dismissable: dismissable
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL25vdGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQU8sVUFBUDtBQUFBLElBQ0EsT0FBQSxFQUFTLFNBQUMsT0FBRCxFQUFVLElBQVYsR0FBQTtBQUNQLFVBQUEsV0FBQTtBQUFBLE1BRGtCLDhCQUFELE9BQWMsSUFBYixXQUNsQixDQUFBO2FBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixJQUFDLENBQUEsS0FBNUIsRUFBbUM7QUFBQSxRQUFBLE1BQUEsRUFBUSxPQUFSO0FBQUEsUUFBaUIsV0FBQSxFQUFhLFdBQTlCO09BQW5DLEVBRE87SUFBQSxDQURUO0FBQUEsSUFHQSxVQUFBLEVBQVksU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsTUFEcUIsOEJBQUQsT0FBYyxJQUFiLFdBQ3JCLENBQUE7YUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLElBQUMsQ0FBQSxLQUEvQixFQUFzQztBQUFBLFFBQUEsTUFBQSxFQUFRLE9BQVI7QUFBQSxRQUFpQixXQUFBLEVBQWEsV0FBOUI7T0FBdEMsRUFEVTtJQUFBLENBSFo7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDUixVQUFBLFdBQUE7QUFBQSxNQURtQiw4QkFBRCxPQUFjLElBQWIsV0FDbkIsQ0FBQTthQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsSUFBQyxDQUFBLEtBQTdCLEVBQW9DO0FBQUEsUUFBQSxNQUFBLEVBQVEsT0FBUjtBQUFBLFFBQWlCLFdBQUEsRUFBYSxXQUE5QjtPQUFwQyxFQURRO0lBQUEsQ0FMVjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/notifier.coffee
