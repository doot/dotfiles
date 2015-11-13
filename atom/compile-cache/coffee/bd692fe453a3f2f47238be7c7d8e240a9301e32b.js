(function() {
  var isFunction, isString, isType;

  isFunction = function(value) {
    return isType(value, 'function');
  };

  isString = function(value) {
    return isType(value, 'string');
  };

  isType = function(value, typeName) {
    var t;
    t = typeof value;
    if (t == null) {
      return false;
    }
    return t === typeName;
  };

  module.exports = {
    isFunction: isFunction,
    isString: isString
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3R5cGUtaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsU0FBQyxLQUFELEdBQUE7V0FDWCxNQUFBLENBQU8sS0FBUCxFQUFjLFVBQWQsRUFEVztFQUFBLENBQWIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTtXQUNULE1BQUEsQ0FBTyxLQUFQLEVBQWMsUUFBZCxFQURTO0VBQUEsQ0FIWCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUNQLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFJLE1BQUEsQ0FBQSxLQUFKLENBQUE7QUFDQSxJQUFBLElBQW9CLFNBQXBCO0FBQUEsYUFBTyxLQUFQLENBQUE7S0FEQTtXQUVBLENBQUEsS0FBSyxTQUhFO0VBQUEsQ0FOVCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFlBQUEsVUFBRDtBQUFBLElBQWEsVUFBQSxRQUFiO0dBWGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/type-helpers.coffee
