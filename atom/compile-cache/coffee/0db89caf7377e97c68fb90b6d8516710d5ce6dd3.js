(function() {
  var ProviderMetadata, Selector, selectorForScopeChain, selectorsMatchScopeChain, _ref;

  Selector = require('selector-kit').Selector;

  _ref = require('./scope-helpers'), selectorForScopeChain = _ref.selectorForScopeChain, selectorsMatchScopeChain = _ref.selectorsMatchScopeChain;

  module.exports = ProviderMetadata = (function() {
    function ProviderMetadata(provider, apiVersion) {
      var providerBlacklist, _ref1;
      this.provider = provider;
      this.apiVersion = apiVersion;
      this.selectors = Selector.create(this.provider.selector);
      if (this.provider.disableForSelector != null) {
        this.disableForSelectors = Selector.create(this.provider.disableForSelector);
      }
      if (providerBlacklist = (_ref1 = this.provider.providerblacklist) != null ? _ref1['autocomplete-plus-fuzzyprovider'] : void 0) {
        this.disableDefaultProviderSelectors = Selector.create(providerBlacklist);
      }
    }

    ProviderMetadata.prototype.matchesScopeChain = function(scopeChain) {
      if (this.disableForSelectors != null) {
        if (selectorsMatchScopeChain(this.disableForSelectors, scopeChain)) {
          return false;
        }
      }
      if (selectorsMatchScopeChain(this.selectors, scopeChain)) {
        return true;
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.shouldDisableDefaultProvider = function(scopeChain) {
      if (this.disableDefaultProviderSelectors != null) {
        return selectorsMatchScopeChain(this.disableDefaultProviderSelectors, scopeChain);
      } else {
        return false;
      }
    };

    ProviderMetadata.prototype.getSpecificity = function(scopeChain) {
      var selector;
      if (selector = selectorForScopeChain(this.selectors, scopeChain)) {
        return selector.getSpecificity();
      } else {
        return 0;
      }
    };

    return ProviderMetadata;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3Byb3ZpZGVyLW1ldGFkYXRhLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRkFBQTs7QUFBQSxFQUFDLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvRCxPQUFBLENBQVEsaUJBQVIsQ0FBcEQsRUFBQyw2QkFBQSxxQkFBRCxFQUF3QixnQ0FBQSx3QkFEeEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDBCQUFFLFFBQUYsRUFBYSxVQUFiLEdBQUE7QUFDWCxVQUFBLHdCQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUR1QixJQUFDLENBQUEsYUFBQSxVQUN4QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBMUIsQ0FBYixDQUFBO0FBQ0EsTUFBQSxJQUF3RSx3Q0FBeEU7QUFBQSxRQUFBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUExQixDQUF2QixDQUFBO09BREE7QUFJQSxNQUFBLElBQUcsaUJBQUEsNERBQWlELENBQUEsaUNBQUEsVUFBcEQ7QUFDRSxRQUFBLElBQUMsQ0FBQSwrQkFBRCxHQUFtQyxRQUFRLENBQUMsTUFBVCxDQUFnQixpQkFBaEIsQ0FBbkMsQ0FERjtPQUxXO0lBQUEsQ0FBYjs7QUFBQSwrQkFRQSxpQkFBQSxHQUFtQixTQUFDLFVBQUQsR0FBQTtBQUNqQixNQUFBLElBQUcsZ0NBQUg7QUFDRSxRQUFBLElBQWdCLHdCQUFBLENBQXlCLElBQUMsQ0FBQSxtQkFBMUIsRUFBK0MsVUFBL0MsQ0FBaEI7QUFBQSxpQkFBTyxLQUFQLENBQUE7U0FERjtPQUFBO0FBR0EsTUFBQSxJQUFHLHdCQUFBLENBQXlCLElBQUMsQ0FBQSxTQUExQixFQUFxQyxVQUFyQyxDQUFIO2VBQ0UsS0FERjtPQUFBLE1BQUE7ZUFHRSxNQUhGO09BSmlCO0lBQUEsQ0FSbkIsQ0FBQTs7QUFBQSwrQkFpQkEsNEJBQUEsR0FBOEIsU0FBQyxVQUFELEdBQUE7QUFDNUIsTUFBQSxJQUFHLDRDQUFIO2VBQ0Usd0JBQUEsQ0FBeUIsSUFBQyxDQUFBLCtCQUExQixFQUEyRCxVQUEzRCxFQURGO09BQUEsTUFBQTtlQUdFLE1BSEY7T0FENEI7SUFBQSxDQWpCOUIsQ0FBQTs7QUFBQSwrQkF1QkEsY0FBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtBQUNkLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBRyxRQUFBLEdBQVcscUJBQUEsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLFVBQWxDLENBQWQ7ZUFDRSxRQUFRLENBQUMsY0FBVCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFIRjtPQURjO0lBQUEsQ0F2QmhCLENBQUE7OzRCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/provider-metadata.coffee
