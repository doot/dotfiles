(function() {
  var fs, path, temp;

  temp = require('temp').track();

  path = require('path');

  fs = require('fs-plus');

  describe('Autocomplete Manager', function() {
    var autocompleteManager, completionDelay, didAutocomplete, directory, editor, editorView, filePath, mainModule, _ref;
    _ref = [], directory = _ref[0], filePath = _ref[1], completionDelay = _ref[2], editorView = _ref[3], editor = _ref[4], mainModule = _ref[5], autocompleteManager = _ref[6], didAutocomplete = _ref[7];
    beforeEach(function() {
      runs(function() {
        var sample, workspaceElement;
        directory = temp.mkdirSync();
        sample = 'var quicksort = function () {\n  var sort = function(items) {\n    if (items.length <= 1) return items;\n    var pivot = items.shift(), current, left = [], right = [];\n    while(items.length > 0) {\n      current = items.shift();\n      current < pivot ? left.push(current) : right.push(current);\n    }\n    return sort(left).concat(pivot).concat(sort(right));\n  };\n\n  return sort(Array.apply(this, arguments));\n};\n';
        filePath = path.join(directory, 'sample.js');
        fs.writeFileSync(filePath, sample);
        atom.config.set('autosave.enabled', true);
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('editor.fontSize', '16');
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmine.attachToDOM(workspaceElement);
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autosave');
      });
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(e) {
          editor = e;
          return editorView = atom.views.getView(editor);
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-plus').then(function(a) {
          return mainModule = a.mainModule;
        });
      });
      waitsFor(function() {
        var _ref1;
        return (_ref1 = mainModule.autocompleteManager) != null ? _ref1.ready : void 0;
      });
      return runs(function() {
        var displaySuggestions;
        advanceClock(mainModule.autocompleteManager.providerManager.defaultProvider.deferBuildWordListInterval);
        autocompleteManager = mainModule.autocompleteManager;
        displaySuggestions = autocompleteManager.displaySuggestions;
        return spyOn(autocompleteManager, 'displaySuggestions').andCallFake(function(suggestions, options) {
          displaySuggestions(suggestions, options);
          return didAutocomplete = true;
        });
      });
    });
    afterEach(function() {
      return didAutocomplete = false;
    });
    return describe('autosave compatibility', function() {
      return it('keeps the suggestion list open while saving', function() {
        runs(function() {
          expect(editorView.querySelector('.autocomplete-plus')).not.toExist();
          editor.moveToBottom();
          editor.moveToBeginningOfLine();
          editor.insertText('f');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return didAutocomplete === true;
        });
        runs(function() {
          editor.save();
          didAutocomplete = false;
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          editor.insertText('u');
          return advanceClock(completionDelay);
        });
        waitsFor(function() {
          return didAutocomplete === true;
        });
        return runs(function() {
          var suggestionListView;
          editor.save();
          didAutocomplete = false;
          expect(editorView.querySelector('.autocomplete-plus')).toExist();
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          atom.commands.dispatch(suggestionListView, 'autocomplete-plus:confirm');
          return expect(editor.getBuffer().getLastLine()).toEqual('function');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9hdXRvY29tcGxldGUtbWFuYWdlci1hdXRvc2F2ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLGdIQUFBO0FBQUEsSUFBQSxPQUErRyxFQUEvRyxFQUFDLG1CQUFELEVBQVksa0JBQVosRUFBc0IseUJBQXRCLEVBQXVDLG9CQUF2QyxFQUFtRCxnQkFBbkQsRUFBMkQsb0JBQTNELEVBQXVFLDZCQUF2RSxFQUE0Rix5QkFBNUYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsd0JBQUE7QUFBQSxRQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBLENBQVosQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLHdhQURULENBQUE7QUFBQSxRQWlCQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFdBQXJCLENBakJYLENBQUE7QUFBQSxRQWtCQSxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixNQUEzQixDQWxCQSxDQUFBO0FBQUEsUUFxQkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFo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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/autocomplete-manager-autosave-spec.coffee
