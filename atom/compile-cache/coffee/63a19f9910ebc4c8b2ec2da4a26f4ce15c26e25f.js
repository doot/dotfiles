(function() {
  var $, $$, CreateFixtures, Q, _ref;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  Q = require('q');

  CreateFixtures = require('./create-fixtures');

  describe("remote-edit:", function() {
    var editorElement, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], editorElement = _ref1[1];
    return beforeEach(function() {
      var activationPromise, fixture;
      fixture = new CreateFixtures();
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = null;
      atom.config.set('remote-edit.defaultSerializePath', "" + (fixture.getSerializePath()));
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      runs(function() {
        editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
        activationPromise = atom.packages.activatePackage("remote-edit");
        return jasmine.attachToDOM(workspaceElement);
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvc3BlYy9yZW1vdGUtZWRpdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLE9BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQURKLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUhqQixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsc0NBQUE7QUFBQSxJQUFBLFFBQW9DLEVBQXBDLEVBQUMsMkJBQUQsRUFBbUIsd0JBQW5CLENBQUE7V0FFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSwwQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsY0FBQSxDQUFBLENBQWQsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZuQixDQUFBO0FBQUEsTUFHQSxpQkFBQSxHQUFvQixJQUhwQixDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLEVBQW9ELEVBQUEsR0FBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBUixDQUFBLENBQUQsQ0FBdEQsQ0FKQSxDQUFBO0FBQUEsTUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGM7TUFBQSxDQUFoQixDQU5BLENBQUE7QUFBQSxNQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFuQixDQUFoQixDQUFBO0FBQUEsUUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsYUFBOUIsQ0FEcEIsQ0FBQTtlQUVBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQUhHO01BQUEsQ0FBTCxDQVRBLENBQUE7YUFjQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLGtCQURjO01BQUEsQ0FBaEIsRUFmUztJQUFBLENBQVgsRUFIdUI7RUFBQSxDQUF6QixDQUxBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/remote-edit/spec/remote-edit-spec.coffee
