(function() {
  var MyClass, SomeModule,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SomeModule = require('some-module');

  MyClass = (function(_super) {
    __extends(MyClass, _super);

    function MyClass() {}

    MyClass.prototype.quicksort = function() {};

    return MyClass;

  })(SomeModule);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9maXh0dXJlcy9zYW1wbGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVIsQ0FBYixDQUFBOztBQUFBLEVBRU07QUFDSiw4QkFBQSxDQUFBOztBQUFhLElBQUEsaUJBQUEsR0FBQSxDQUFiOztBQUFBLHNCQUVBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FGWCxDQUFBOzttQkFBQTs7S0FEb0IsV0FGdEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/fixtures/sample.coffee
