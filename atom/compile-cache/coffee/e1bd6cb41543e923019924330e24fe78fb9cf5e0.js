(function() {
  var OutputView, view;

  OutputView = require('./views/output-view');

  view = null;

  module.exports = {
    "new": function() {
      if (view != null) {
        view.reset();
      }
      return this.getView();
    },
    getView: function() {
      if (view === null) {
        view = new OutputView;
        atom.workspace.addBottomPanel({
          item: view
        });
        view.hide();
      }
      return view;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL291dHB1dC12aWV3LW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUFiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sSUFGUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUFLLFNBQUEsR0FBQTs7UUFDSCxJQUFJLENBQUUsS0FBTixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxDQUFBLEVBRkc7SUFBQSxDQUFMO0FBQUEsSUFJQSxPQUFBLEVBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUEsS0FBUSxJQUFYO0FBQ0UsUUFBQSxJQUFBLEdBQU8sR0FBQSxDQUFBLFVBQVAsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE5QixDQURBLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FGQSxDQURGO09BQUE7YUFJQSxLQUxPO0lBQUEsQ0FKVDtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/git-plus/lib/output-view-manager.coffee
