(function() {
  var completionDelay;

  completionDelay = 100;

  beforeEach(function() {
    spyOn(atom.views, 'readDocument').andCallFake(function(fn) {
      return fn();
    });
    spyOn(atom.views, 'updateDocument').andCallFake(function(fn) {
      return fn();
    });
    atom.config.set('autocomplete-plus.defaultProvider', 'Symbol');
    atom.config.set('autocomplete-plus.minimumWordLength', 1);
    atom.config.set('autocomplete-plus.suggestionListFollows', 'Word');
    atom.config.set('autocomplete-plus.useCoreMovementCommands', true);
    return atom.config.set('autocomplete-plus.includeCompletionsFromAllBuffers', false);
  });

  exports.triggerAutocompletion = function(editor, moveCursor, char) {
    if (moveCursor == null) {
      moveCursor = true;
    }
    if (char == null) {
      char = 'f';
    }
    if (moveCursor) {
      editor.moveToBottom();
      editor.moveToBeginningOfLine();
    }
    editor.insertText(char);
    return exports.waitForAutocomplete();
  };

  exports.waitForAutocomplete = function() {
    advanceClock(completionDelay);
    return waitsFor('autocomplete to show', function(done) {
      return setImmediate(function() {
        advanceClock(10);
        return setImmediate(function() {
          advanceClock(10);
          return done();
        });
      });
    });
  };

  exports.buildIMECompositionEvent = function(event, _arg) {
    var data, target, _ref;
    _ref = _arg != null ? _arg : {}, data = _ref.data, target = _ref.target;
    event = new CustomEvent(event, {
      bubbles: true
    });
    event.data = data;
    Object.defineProperty(event, 'target', {
      get: function() {
        return target;
      }
    });
    return event;
  };

  exports.buildTextInputEvent = function(_arg) {
    var data, event, target;
    data = _arg.data, target = _arg.target;
    event = new CustomEvent('textInput', {
      bubbles: true
    });
    event.data = data;
    Object.defineProperty(event, 'target', {
      get: function() {
        return target;
      }
    });
    return event;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9zcGVjLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsR0FBbEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxJQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsS0FBWCxFQUFrQixjQUFsQixDQUFpQyxDQUFDLFdBQWxDLENBQThDLFNBQUMsRUFBRCxHQUFBO2FBQVEsRUFBQSxDQUFBLEVBQVI7SUFBQSxDQUE5QyxDQUFBLENBQUE7QUFBQSxJQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsS0FBWCxFQUFrQixnQkFBbEIsQ0FBbUMsQ0FBQyxXQUFwQyxDQUFnRCxTQUFDLEVBQUQsR0FBQTthQUFRLEVBQUEsQ0FBQSxFQUFSO0lBQUEsQ0FBaEQsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLEVBQXFELFFBQXJELENBRkEsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQixFQUF1RCxDQUF2RCxDQUhBLENBQUE7QUFBQSxJQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsRUFBMkQsTUFBM0QsQ0FKQSxDQUFBO0FBQUEsSUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLEVBQTZELElBQTdELENBTEEsQ0FBQTtXQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvREFBaEIsRUFBc0UsS0FBdEUsRUFQUztFQUFBLENBQVgsQ0FGQSxDQUFBOztBQUFBLEVBV0EsT0FBTyxDQUFDLHFCQUFSLEdBQWdDLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBNEIsSUFBNUIsR0FBQTs7TUFBUyxhQUFhO0tBQ3BEOztNQUQwRCxPQUFPO0tBQ2pFO0FBQUEsSUFBQSxJQUFHLFVBQUg7QUFDRSxNQUFBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMscUJBQVAsQ0FBQSxDQURBLENBREY7S0FBQTtBQUFBLElBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEIsQ0FIQSxDQUFBO1dBSUEsT0FBTyxDQUFDLG1CQUFSLENBQUEsRUFMOEI7RUFBQSxDQVhoQyxDQUFBOztBQUFBLEVBa0JBLE9BQU8sQ0FBQyxtQkFBUixHQUE4QixTQUFBLEdBQUE7QUFDNUIsSUFBQSxZQUFBLENBQWEsZUFBYixDQUFBLENBQUE7V0FDQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQyxJQUFELEdBQUE7YUFDL0IsWUFBQSxDQUFhLFNBQUEsR0FBQTtBQUNYLFFBQUEsWUFBQSxDQUFhLEVBQWIsQ0FBQSxDQUFBO2VBQ0EsWUFBQSxDQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsWUFBQSxDQUFhLEVBQWIsQ0FBQSxDQUFBO2lCQUNBLElBQUEsQ0FBQSxFQUZXO1FBQUEsQ0FBYixFQUZXO01BQUEsQ0FBYixFQUQrQjtJQUFBLENBQWpDLEVBRjRCO0VBQUEsQ0FsQjlCLENBQUE7O0FBQUEsRUEyQkEsT0FBTyxDQUFDLHdCQUFSLEdBQW1DLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNqQyxRQUFBLGtCQUFBO0FBQUEsMEJBRHlDLE9BQWlCLElBQWhCLFlBQUEsTUFBTSxjQUFBLE1BQ2hELENBQUE7QUFBQSxJQUFBLEtBQUEsR0FBWSxJQUFBLFdBQUEsQ0FBWSxLQUFaLEVBQW1CO0FBQUEsTUFBQyxPQUFBLEVBQVMsSUFBVjtLQUFuQixDQUFaLENBQUE7QUFBQSxJQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsSUFEYixDQUFBO0FBQUEsSUFFQSxNQUFNLENBQUMsY0FBUCxDQUFzQixLQUF0QixFQUE2QixRQUE3QixFQUF1QztBQUFBLE1BQUMsR0FBQSxFQUFLLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQUFOO0tBQXZDLENBRkEsQ0FBQTtXQUdBLE1BSmlDO0VBQUEsQ0EzQm5DLENBQUE7O0FBQUEsRUFpQ0EsT0FBTyxDQUFDLG1CQUFSLEdBQThCLFNBQUMsSUFBRCxHQUFBO0FBQzVCLFFBQUEsbUJBQUE7QUFBQSxJQUQ4QixZQUFBLE1BQU0sY0FBQSxNQUNwQyxDQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVksSUFBQSxXQUFBLENBQVksV0FBWixFQUF5QjtBQUFBLE1BQUMsT0FBQSxFQUFTLElBQVY7S0FBekIsQ0FBWixDQUFBO0FBQUEsSUFDQSxLQUFLLENBQUMsSUFBTixHQUFhLElBRGIsQ0FBQTtBQUFBLElBRUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFBQSxNQUFDLEdBQUEsRUFBSyxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FBTjtLQUF2QyxDQUZBLENBQUE7V0FHQSxNQUo0QjtFQUFBLENBakM5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/spec-helper.coffee
