(function() {
  var PJVProvider, resetConfig;

  resetConfig = require('./test-helper').resetConfig;

  PJVProvider = require('../lib/package-json-validator-provider');

  describe("Lint package.json", function() {
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter-package-json-validator');
      });
      return resetConfig();
    });
    describe("Other json files", function() {
      return it('should not lint other.json files', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('./files/other.json').then(function(editor) {
            return PJVProvider.lint(editor);
          }).then(function(messages) {
            return expect(messages.length).toEqual(0);
          });
        });
      });
    });
    return describe("package.json - npm", function() {
      return it('should lint package.json files', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('./files/package.json').then(function(editor) {
            return PJVProvider.lint(editor);
          }).then(function(messages) {
            return expect(messages.length).toNotEqual(0);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvbGludGVyLXBhY2thZ2UtanNvbi12YWxpZGF0b3Ivc3BlYy9saW50ZXItcGFja2FnZS1qc29uLXZhbGlkYXRvci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFFLGNBQWdCLE9BQUEsQ0FBUSxlQUFSLEVBQWhCLFdBQUYsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0NBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLCtCQUE5QixFQUFIO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBQ0EsV0FBQSxDQUFBLEVBRlM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBSUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTthQUMzQixFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2VBRXJDLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixvQkFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQsR0FBQTttQkFBWSxXQUFXLENBQUMsSUFBWixDQUFpQixNQUFqQixFQUFaO1VBQUEsQ0FEUixDQUVFLENBQUMsSUFGSCxDQUVRLFNBQUMsUUFBRCxHQUFBO21CQUVKLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBaEIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFoQyxFQUZJO1VBQUEsQ0FGUixFQURjO1FBQUEsQ0FBaEIsRUFGcUM7TUFBQSxDQUF2QyxFQUQyQjtJQUFBLENBQTdCLENBSkEsQ0FBQTtXQWVBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7YUFDN0IsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtlQUVuQyxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0Isc0JBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFELEdBQUE7bUJBQVksV0FBVyxDQUFDLElBQVosQ0FBaUIsTUFBakIsRUFBWjtVQUFBLENBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxTQUFDLFFBQUQsR0FBQTttQkFFSixNQUFBLENBQU8sUUFBUSxDQUFDLE1BQWhCLENBQXVCLENBQUMsVUFBeEIsQ0FBbUMsQ0FBbkMsRUFGSTtVQUFBLENBRlIsRUFEYztRQUFBLENBQWhCLEVBRm1DO01BQUEsQ0FBckMsRUFENkI7SUFBQSxDQUEvQixFQWhCNEI7RUFBQSxDQUE5QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/linter-package-json-validator/spec/linter-package-json-validator-spec.coffee
