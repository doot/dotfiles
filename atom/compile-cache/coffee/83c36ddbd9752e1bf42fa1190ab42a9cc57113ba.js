(function() {
  var arrayEquals, objectEquals,
    __slice = [].slice;

  arrayEquals = function(arr1, arr2) {
    return arr1.forEach(function(a, i) {
      return expect(a).toEqual(arr2[i]);
    });
  };

  objectEquals = function(o1, o2) {
    return Object.keys(o1).forEach(function(prop) {
      return expect(o1[prop]).toEqual(o2[prop]);
    });
  };

  module.exports = function(obj, fn) {
    var mock, spy;
    spy = spyOn(obj, fn);
    return mock = {
      "do": function(method) {
        spy.andCallFake(method);
        return mock;
      },
      verifyCalledWith: function() {
        var args, calledWith;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        calledWith = spy.mostRecentCall.args;
        return args.forEach(function(arg, i) {
          if (arg.forEach != null) {
            arrayEquals(arg, calledWith[i]);
          }
          if (arg.charAt != null) {
            return expect(arg).toEqual(calledWith[i]);
          } else {
            return objectEquals(arg, calledWith[i]);
          }
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2NrLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtXQUNaLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2FBQ1gsTUFBQSxDQUFPLENBQVAsQ0FBUyxDQUFDLE9BQVYsQ0FBa0IsSUFBSyxDQUFBLENBQUEsQ0FBdkIsRUFEVztJQUFBLENBQWIsRUFEWTtFQUFBLENBQWQsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxTQUFDLEVBQUQsRUFBSyxFQUFMLEdBQUE7V0FDYixNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVosQ0FBZSxDQUFDLE9BQWhCLENBQXdCLFNBQUMsSUFBRCxHQUFBO2FBQ3RCLE1BQUEsQ0FBTyxFQUFHLENBQUEsSUFBQSxDQUFWLENBQWdCLENBQUMsT0FBakIsQ0FBeUIsRUFBRyxDQUFBLElBQUEsQ0FBNUIsRUFEc0I7SUFBQSxDQUF4QixFQURhO0VBQUEsQ0FKZixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxHQUFELEVBQU0sRUFBTixHQUFBO0FBQ2YsUUFBQSxTQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sS0FBQSxDQUFNLEdBQU4sRUFBVyxFQUFYLENBQU4sQ0FBQTtBQUNBLFdBQU8sSUFBQSxHQUNMO0FBQUEsTUFBQSxJQUFBLEVBQUksU0FBQyxNQUFELEdBQUE7QUFDRixRQUFBLEdBQUcsQ0FBQyxXQUFKLENBQWdCLE1BQWhCLENBQUEsQ0FBQTtBQUNBLGVBQU8sSUFBUCxDQUZFO01BQUEsQ0FBSjtBQUFBLE1BR0EsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFlBQUEsZ0JBQUE7QUFBQSxRQURpQiw4REFDakIsQ0FBQTtBQUFBLFFBQUEsVUFBQSxHQUFhLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBaEMsQ0FBQTtlQUNBLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQyxHQUFELEVBQU0sQ0FBTixHQUFBO0FBQ1gsVUFBQSxJQUFHLG1CQUFIO0FBQ0UsWUFBQSxXQUFBLENBQVksR0FBWixFQUFpQixVQUFXLENBQUEsQ0FBQSxDQUE1QixDQUFBLENBREY7V0FBQTtBQUVBLFVBQUEsSUFBRyxrQkFBSDttQkFDRSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQixVQUFXLENBQUEsQ0FBQSxDQUEvQixFQURGO1dBQUEsTUFBQTttQkFHRSxZQUFBLENBQWEsR0FBYixFQUFrQixVQUFXLENBQUEsQ0FBQSxDQUE3QixFQUhGO1dBSFc7UUFBQSxDQUFiLEVBRmdCO01BQUEsQ0FIbEI7S0FERixDQUZlO0VBQUEsQ0FSakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/git-plus/spec/mock.coffee
