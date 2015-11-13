(function() {
  var EscapeCharacterRegex, cachedMatchesBySelector, getCachedMatch, parseScopeChain, selectorForScopeChain, selectorsMatchScopeChain, setCachedMatch, slick;

  slick = require('atom-slick');

  EscapeCharacterRegex = /[-!"#$%&'*+,/:;=?@|^~()<>{}[\]]/g;

  cachedMatchesBySelector = new WeakMap;

  getCachedMatch = function(selector, scopeChain) {
    var cachedMatchesByScopeChain;
    if (cachedMatchesByScopeChain = cachedMatchesBySelector.get(selector)) {
      return cachedMatchesByScopeChain[scopeChain];
    }
  };

  setCachedMatch = function(selector, scopeChain, match) {
    var cachedMatchesByScopeChain;
    if (!(cachedMatchesByScopeChain = cachedMatchesBySelector.get(selector))) {
      cachedMatchesByScopeChain = {};
      cachedMatchesBySelector.set(selector, cachedMatchesByScopeChain);
    }
    return cachedMatchesByScopeChain[scopeChain] = match;
  };

  parseScopeChain = function(scopeChain) {
    var scope, _i, _len, _ref, _ref1, _results;
    scopeChain = scopeChain.replace(EscapeCharacterRegex, function(match) {
      return "\\" + match[0];
    });
    _ref1 = (_ref = slick.parse(scopeChain)[0]) != null ? _ref : [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      scope = _ref1[_i];
      _results.push(scope);
    }
    return _results;
  };

  selectorForScopeChain = function(selectors, scopeChain) {
    var cachedMatch, scopes, selector, _i, _len;
    for (_i = 0, _len = selectors.length; _i < _len; _i++) {
      selector = selectors[_i];
      cachedMatch = getCachedMatch(selector, scopeChain);
      if (cachedMatch != null) {
        if (cachedMatch) {
          return selector;
        } else {
          continue;
        }
      } else {
        scopes = parseScopeChain(scopeChain);
        while (scopes.length > 0) {
          if (selector.matches(scopes)) {
            setCachedMatch(selector, scopeChain, true);
            return selector;
          }
          scopes.pop();
        }
        setCachedMatch(selector, scopeChain, false);
      }
    }
    return null;
  };

  selectorsMatchScopeChain = function(selectors, scopeChain) {
    return selectorForScopeChain(selectors, scopeChain) != null;
  };

  module.exports = {
    parseScopeChain: parseScopeChain,
    selectorsMatchScopeChain: selectorsMatchScopeChain,
    selectorForScopeChain: selectorForScopeChain
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3Njb3BlLWhlbHBlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUVBLG9CQUFBLEdBQXVCLGtDQUZ2QixDQUFBOztBQUFBLEVBSUEsdUJBQUEsR0FBMEIsR0FBQSxDQUFBLE9BSjFCLENBQUE7O0FBQUEsRUFNQSxjQUFBLEdBQWlCLFNBQUMsUUFBRCxFQUFXLFVBQVgsR0FBQTtBQUNmLFFBQUEseUJBQUE7QUFBQSxJQUFBLElBQUcseUJBQUEsR0FBNEIsdUJBQXVCLENBQUMsR0FBeEIsQ0FBNEIsUUFBNUIsQ0FBL0I7QUFDRSxhQUFPLHlCQUEwQixDQUFBLFVBQUEsQ0FBakMsQ0FERjtLQURlO0VBQUEsQ0FOakIsQ0FBQTs7QUFBQSxFQVVBLGNBQUEsR0FBaUIsU0FBQyxRQUFELEVBQVcsVUFBWCxFQUF1QixLQUF2QixHQUFBO0FBQ2YsUUFBQSx5QkFBQTtBQUFBLElBQUEsSUFBQSxDQUFBLENBQU8seUJBQUEsR0FBNEIsdUJBQXVCLENBQUMsR0FBeEIsQ0FBNEIsUUFBNUIsQ0FBNUIsQ0FBUDtBQUNFLE1BQUEseUJBQUEsR0FBNEIsRUFBNUIsQ0FBQTtBQUFBLE1BQ0EsdUJBQXVCLENBQUMsR0FBeEIsQ0FBNEIsUUFBNUIsRUFBc0MseUJBQXRDLENBREEsQ0FERjtLQUFBO1dBR0EseUJBQTBCLENBQUEsVUFBQSxDQUExQixHQUF3QyxNQUp6QjtFQUFBLENBVmpCLENBQUE7O0FBQUEsRUFnQkEsZUFBQSxHQUFrQixTQUFDLFVBQUQsR0FBQTtBQUNoQixRQUFBLHNDQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsb0JBQW5CLEVBQXlDLFNBQUMsS0FBRCxHQUFBO2FBQVksSUFBQSxHQUFJLEtBQU0sQ0FBQSxDQUFBLEVBQXRCO0lBQUEsQ0FBekMsQ0FBYixDQUFBO0FBQ0E7QUFBQTtTQUFBLDRDQUFBO3dCQUFBO0FBQUEsb0JBQUEsTUFBQSxDQUFBO0FBQUE7b0JBRmdCO0VBQUEsQ0FoQmxCLENBQUE7O0FBQUEsRUFvQkEscUJBQUEsR0FBd0IsU0FBQyxTQUFELEVBQVksVUFBWixHQUFBO0FBQ3RCLFFBQUEsdUNBQUE7QUFBQSxTQUFBLGdEQUFBOytCQUFBO0FBQ0UsTUFBQSxXQUFBLEdBQWMsY0FBQSxDQUFlLFFBQWYsRUFBeUIsVUFBekIsQ0FBZCxDQUFBO0FBQ0EsTUFBQSxJQUFHLG1CQUFIO0FBQ0UsUUFBQSxJQUFHLFdBQUg7QUFDRSxpQkFBTyxRQUFQLENBREY7U0FBQSxNQUFBO0FBR0UsbUJBSEY7U0FERjtPQUFBLE1BQUE7QUFNRSxRQUFBLE1BQUEsR0FBUyxlQUFBLENBQWdCLFVBQWhCLENBQVQsQ0FBQTtBQUNBLGVBQU0sTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBdEIsR0FBQTtBQUNFLFVBQUEsSUFBRyxRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUFIO0FBQ0UsWUFBQSxjQUFBLENBQWUsUUFBZixFQUF5QixVQUF6QixFQUFxQyxJQUFyQyxDQUFBLENBQUE7QUFDQSxtQkFBTyxRQUFQLENBRkY7V0FBQTtBQUFBLFVBR0EsTUFBTSxDQUFDLEdBQVAsQ0FBQSxDQUhBLENBREY7UUFBQSxDQURBO0FBQUEsUUFNQSxjQUFBLENBQWUsUUFBZixFQUF5QixVQUF6QixFQUFxQyxLQUFyQyxDQU5BLENBTkY7T0FGRjtBQUFBLEtBQUE7V0FnQkEsS0FqQnNCO0VBQUEsQ0FwQnhCLENBQUE7O0FBQUEsRUF1Q0Esd0JBQUEsR0FBMkIsU0FBQyxTQUFELEVBQVksVUFBWixHQUFBO1dBQ3pCLHFEQUR5QjtFQUFBLENBdkMzQixDQUFBOztBQUFBLEVBMENBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxpQkFBQSxlQUFEO0FBQUEsSUFBa0IsMEJBQUEsd0JBQWxCO0FBQUEsSUFBNEMsdUJBQUEscUJBQTVDO0dBMUNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/scope-helpers.coffee
