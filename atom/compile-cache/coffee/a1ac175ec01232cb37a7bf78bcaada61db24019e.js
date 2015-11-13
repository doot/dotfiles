(function() {
  var AutocompleteView, CompositeDisposable, Disposable, _, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ = require('underscore-plus');

  AutocompleteView = require('./autocomplete-view');

  module.exports = {
    config: {
      includeCompletionsFromAllBuffers: {
        type: 'boolean',
        "default": false
      }
    },
    autocompleteViewsByEditor: null,
    deactivationDisposables: null,
    activate: function() {
      var getAutocompleteView;
      this.autocompleteViewsByEditor = new WeakMap;
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var autocompleteView, disposable;
          if (editor.mini) {
            return;
          }
          autocompleteView = new AutocompleteView(editor);
          _this.autocompleteViewsByEditor.set(editor, autocompleteView);
          disposable = new Disposable(function() {
            return autocompleteView.destroy();
          });
          _this.deactivationDisposables.add(editor.onDidDestroy(function() {
            return disposable.dispose();
          }));
          return _this.deactivationDisposables.add(disposable);
        };
      })(this)));
      getAutocompleteView = (function(_this) {
        return function(editorElement) {
          return _this.autocompleteViewsByEditor.get(editorElement.getModel());
        };
      })(this);
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete:toggle': function() {
          var _ref1;
          return (_ref1 = getAutocompleteView(this)) != null ? _ref1.toggle() : void 0;
        },
        'autocomplete:next': function() {
          var _ref1;
          return (_ref1 = getAutocompleteView(this)) != null ? _ref1.selectNextItemView() : void 0;
        },
        'autocomplete:previous': function() {
          var _ref1;
          return (_ref1 = getAutocompleteView(this)) != null ? _ref1.selectPreviousItemView() : void 0;
        }
      }));
    },
    deactivate: function() {
      return this.deactivationDisposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlL2xpYi9hdXRvY29tcGxldGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUF0QixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsZ0NBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BREY7S0FERjtBQUFBLElBS0EseUJBQUEsRUFBMkIsSUFMM0I7QUFBQSxJQU1BLHVCQUFBLEVBQXlCLElBTnpCO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxtQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLHlCQUFELEdBQTZCLEdBQUEsQ0FBQSxPQUE3QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsdUJBQUQsR0FBMkIsR0FBQSxDQUFBLG1CQUQzQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDN0QsY0FBQSw0QkFBQTtBQUFBLFVBQUEsSUFBVSxNQUFNLENBQUMsSUFBakI7QUFBQSxrQkFBQSxDQUFBO1dBQUE7QUFBQSxVQUVBLGdCQUFBLEdBQXVCLElBQUEsZ0JBQUEsQ0FBaUIsTUFBakIsQ0FGdkIsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFBLHlCQUF5QixDQUFDLEdBQTNCLENBQStCLE1BQS9CLEVBQXVDLGdCQUF2QyxDQUhBLENBQUE7QUFBQSxVQUtBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUFHLGdCQUFnQixDQUFDLE9BQWpCLENBQUEsRUFBSDtVQUFBLENBQVgsQ0FMakIsQ0FBQTtBQUFBLFVBTUEsS0FBQyxDQUFBLHVCQUF1QixDQUFDLEdBQXpCLENBQTZCLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFNBQUEsR0FBQTttQkFBRyxVQUFVLENBQUMsT0FBWCxDQUFBLEVBQUg7VUFBQSxDQUFwQixDQUE3QixDQU5BLENBQUE7aUJBT0EsS0FBQyxDQUFBLHVCQUF1QixDQUFDLEdBQXpCLENBQTZCLFVBQTdCLEVBUjZEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBN0IsQ0FIQSxDQUFBO0FBQUEsTUFhQSxtQkFBQSxHQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxhQUFELEdBQUE7aUJBQ3BCLEtBQUMsQ0FBQSx5QkFBeUIsQ0FBQyxHQUEzQixDQUErQixhQUFhLENBQUMsUUFBZCxDQUFBLENBQS9CLEVBRG9CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FidEIsQ0FBQTthQWdCQSxJQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUMzQjtBQUFBLFFBQUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLGNBQUEsS0FBQTtvRUFBeUIsQ0FBRSxNQUEzQixDQUFBLFdBRHFCO1FBQUEsQ0FBdkI7QUFBQSxRQUVBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLEtBQUE7b0VBQXlCLENBQUUsa0JBQTNCLENBQUEsV0FEbUI7UUFBQSxDQUZyQjtBQUFBLFFBSUEsdUJBQUEsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLGNBQUEsS0FBQTtvRUFBeUIsQ0FBRSxzQkFBM0IsQ0FBQSxXQUR1QjtRQUFBLENBSnpCO09BRDJCLENBQTdCLEVBakJRO0lBQUEsQ0FSVjtBQUFBLElBaUNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQSxFQURVO0lBQUEsQ0FqQ1o7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/autocomplete/lib/autocomplete.coffee
