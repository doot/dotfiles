(function() {
  var ProviderManager, hasDisposable;

  ProviderManager = require('../lib/provider-manager');

  describe('Provider Manager', function() {
    var providerManager, registration, testProvider, _ref;
    _ref = [], providerManager = _ref[0], testProvider = _ref[1], registration = _ref[2];
    beforeEach(function() {
      atom.config.set('autocomplete-plus.enableBuiltinProvider', true);
      providerManager = new ProviderManager();
      return testProvider = {
        getSuggestions: function(options) {
          return [
            {
              text: 'ohai',
              replacementPrefix: 'ohai'
            }
          ];
        },
        selector: '.source.js',
        dispose: function() {}
      };
    });
    afterEach(function() {
      if (registration != null) {
        if (typeof registration.dispose === "function") {
          registration.dispose();
        }
      }
      registration = null;
      if (testProvider != null) {
        if (typeof testProvider.dispose === "function") {
          testProvider.dispose();
        }
      }
      testProvider = null;
      if (providerManager != null) {
        providerManager.dispose();
      }
      return providerManager = null;
    });
    describe('when no providers have been registered, and enableBuiltinProvider is true', function() {
      beforeEach(function() {
        return atom.config.set('autocomplete-plus.enableBuiltinProvider', true);
      });
      it('is constructed correctly', function() {
        expect(providerManager.providers).toBeDefined();
        expect(providerManager.subscriptions).toBeDefined();
        return expect(providerManager.defaultProvider).toBeDefined();
      });
      it('disposes correctly', function() {
        providerManager.dispose();
        expect(providerManager.providers).toBeNull();
        expect(providerManager.subscriptions).toBeNull();
        return expect(providerManager.defaultProvider).toBeNull();
      });
      it('registers the default provider for all scopes', function() {
        expect(providerManager.providersForScopeDescriptor('*').length).toBe(1);
        return expect(providerManager.providersForScopeDescriptor('*')[0]).toBe(providerManager.defaultProvider);
      });
      it('adds providers', function() {
        var apiVersion;
        expect(providerManager.isProviderRegistered(testProvider)).toEqual(false);
        expect(hasDisposable(providerManager.subscriptions, testProvider)).toBe(false);
        providerManager.addProvider(testProvider, '2.0.0');
        expect(providerManager.isProviderRegistered(testProvider)).toEqual(true);
        apiVersion = providerManager.apiVersionForProvider(testProvider);
        expect(apiVersion).toEqual('2.0.0');
        return expect(hasDisposable(providerManager.subscriptions, testProvider)).toBe(true);
      });
      it('removes providers', function() {
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        expect(hasDisposable(providerManager.subscriptions, testProvider)).toBe(false);
        providerManager.addProvider(testProvider);
        expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
        expect(hasDisposable(providerManager.subscriptions, testProvider)).toBe(true);
        providerManager.removeProvider(testProvider);
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        return expect(hasDisposable(providerManager.subscriptions, testProvider)).toBe(false);
      });
      it('can identify a provider with a missing getSuggestions', function() {
        var bogusProvider;
        bogusProvider = {
          badgetSuggestions: function(options) {},
          selector: '.source.js',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider({}, '2.0.0')).toEqual(false);
        expect(providerManager.isValidProvider(bogusProvider, '2.0.0')).toEqual(false);
        return expect(providerManager.isValidProvider(testProvider, '2.0.0')).toEqual(true);
      });
      it('can identify a provider with an invalid getSuggestions', function() {
        var bogusProvider;
        bogusProvider = {
          getSuggestions: 'yo, this is a bad handler',
          selector: '.source.js',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider({}, '2.0.0')).toEqual(false);
        expect(providerManager.isValidProvider(bogusProvider, '2.0.0')).toEqual(false);
        return expect(providerManager.isValidProvider(testProvider, '2.0.0')).toEqual(true);
      });
      it('can identify a provider with a missing selector', function() {
        var bogusProvider;
        bogusProvider = {
          getSuggestions: function(options) {},
          aSelector: '.source.js',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider(bogusProvider, '2.0.0')).toEqual(false);
        return expect(providerManager.isValidProvider(testProvider, '2.0.0')).toEqual(true);
      });
      it('can identify a provider with an invalid selector', function() {
        var bogusProvider;
        bogusProvider = {
          getSuggestions: function(options) {},
          selector: '',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider(bogusProvider, '2.0.0')).toEqual(false);
        expect(providerManager.isValidProvider(testProvider, '2.0.0')).toEqual(true);
        bogusProvider = {
          getSuggestions: function(options) {},
          selector: false,
          dispose: function() {}
        };
        return expect(providerManager.isValidProvider(bogusProvider, '2.0.0')).toEqual(false);
      });
      it('correctly identifies a 1.0 provider', function() {
        var bogusProvider, legitProvider;
        bogusProvider = {
          selector: '.source.js',
          requestHandler: 'yo, this is a bad handler',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider({}, '1.0.0')).toEqual(false);
        expect(providerManager.isValidProvider(bogusProvider, '1.0.0')).toEqual(false);
        legitProvider = {
          selector: '.source.js',
          requestHandler: function() {},
          dispose: function() {}
        };
        return expect(providerManager.isValidProvider(legitProvider, '1.0.0')).toEqual(true);
      });
      it('registers a valid provider', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        return expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
      });
      it('removes a registration', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
        registration.dispose();
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).toBe(-1);
        return expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
      });
      it('does not create duplicate registrations for the same scope', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        return expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
      });
      it('does not register an invalid provider', function() {
        var bogusProvider;
        bogusProvider = {
          getSuggestions: 'yo, this is a bad handler',
          selector: '.source.js',
          dispose: function() {}
        };
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(bogusProvider)).toBe(-1);
        expect(providerManager.metadataForProvider(bogusProvider)).toBeFalsy();
        registration = providerManager.registerProvider(bogusProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(bogusProvider)).toBe(-1);
        return expect(providerManager.metadataForProvider(bogusProvider)).toBeFalsy();
      });
      return it('registers a provider with a blacklist', function() {
        testProvider = {
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'ohai'
              }
            ];
          },
          selector: '.source.js',
          disableForSelector: '.source.js .comment',
          dispose: function() {}
        };
        expect(providerManager.isValidProvider(testProvider, '2.0.0')).toEqual(true);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).toBe(-1);
        expect(providerManager.metadataForProvider(testProvider)).toBeFalsy();
        registration = providerManager.registerProvider(testProvider);
        expect(providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(providerManager.providersForScopeDescriptor('.source.js').indexOf(testProvider)).not.toBe(-1);
        return expect(providerManager.metadataForProvider(testProvider)).toBeTruthy();
      });
    });
    describe('when no providers have been registered, and enableBuiltinProvider is false', function() {
      beforeEach(function() {
        return atom.config.set('autocomplete-plus.enableBuiltinProvider', false);
      });
      return it('does not register the default provider for all scopes', function() {
        expect(providerManager.providersForScopeDescriptor('*').length).toBe(0);
        expect(providerManager.defaultProvider).toEqual(null);
        return expect(providerManager.defaultProviderRegistration).toEqual(null);
      });
    });
    describe('when providers have been registered', function() {
      var testProvider1, testProvider2, testProvider3, testProvider4, _ref1;
      _ref1 = [], testProvider1 = _ref1[0], testProvider2 = _ref1[1], testProvider3 = _ref1[2], testProvider4 = _ref1[3];
      beforeEach(function() {
        atom.config.set('autocomplete-plus.enableBuiltinProvider', true);
        providerManager = new ProviderManager();
        testProvider1 = {
          selector: '.source.js',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai2',
                replacementPrefix: 'ohai2'
              }
            ];
          },
          dispose: function() {}
        };
        testProvider2 = {
          selector: '.source.js .variable.js',
          disableForSelector: '.source.js .variable.js .comment2',
          providerblacklist: {
            'autocomplete-plus-fuzzyprovider': '.source.js .variable.js .comment3'
          },
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai2',
                replacementPrefix: 'ohai2'
              }
            ];
          },
          dispose: function() {}
        };
        testProvider3 = {
          selector: '*',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai3',
                replacementPrefix: 'ohai3'
              }
            ];
          },
          dispose: function() {}
        };
        testProvider4 = {
          selector: '.source.js .comment',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai4',
                replacementPrefix: 'ohai4'
              }
            ];
          },
          dispose: function() {}
        };
        providerManager.registerProvider(testProvider1);
        providerManager.registerProvider(testProvider2);
        providerManager.registerProvider(testProvider3);
        return providerManager.registerProvider(testProvider4);
      });
      it('returns providers in the correct order for the given scope chain', function() {
        var defaultProvider, providers;
        defaultProvider = providerManager.defaultProvider;
        providers = providerManager.providersForScopeDescriptor('.source.other');
        expect(providers).toHaveLength(2);
        expect(providers[0]).toEqual(testProvider3);
        expect(providers[1]).toEqual(defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(testProvider1);
        expect(providers[1]).toEqual(testProvider3);
        expect(providers[2]).toEqual(defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js .comment');
        expect(providers).toHaveLength(4);
        expect(providers[0]).toEqual(testProvider4);
        expect(providers[1]).toEqual(testProvider1);
        expect(providers[2]).toEqual(testProvider3);
        expect(providers[3]).toEqual(defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js .variable.js');
        expect(providers).toHaveLength(4);
        expect(providers[0]).toEqual(testProvider2);
        expect(providers[1]).toEqual(testProvider1);
        expect(providers[2]).toEqual(testProvider3);
        expect(providers[3]).toEqual(defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js .other.js');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(testProvider1);
        expect(providers[1]).toEqual(testProvider3);
        return expect(providers[2]).toEqual(defaultProvider);
      });
      it('does not return providers if the scopeChain exactly matches a global blacklist item', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(4);
        atom.config.set('autocomplete-plus.scopeBlacklist', ['.source.js .comment']);
        return expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(0);
      });
      it('does not return providers if the scopeChain matches a global blacklist item with a wildcard', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(4);
        atom.config.set('autocomplete-plus.scopeBlacklist', ['.source.js *']);
        return expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(0);
      });
      it('does not return providers if the scopeChain matches a global blacklist item with a wildcard one level of depth below the current scope', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(4);
        atom.config.set('autocomplete-plus.scopeBlacklist', ['.source.js *']);
        return expect(providerManager.providersForScopeDescriptor('.source.js .comment .other')).toHaveLength(0);
      });
      it('does return providers if the scopeChain does not match a global blacklist item with a wildcard', function() {
        expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(4);
        atom.config.set('autocomplete-plus.scopeBlacklist', ['.source.coffee *']);
        return expect(providerManager.providersForScopeDescriptor('.source.js .comment')).toHaveLength(4);
      });
      it('filters a provider if the scopeChain matches a provider blacklist item', function() {
        var defaultProvider, providers;
        defaultProvider = providerManager.defaultProvider;
        providers = providerManager.providersForScopeDescriptor('.source.js .variable.js .other.js');
        expect(providers).toHaveLength(4);
        expect(providers[0]).toEqual(testProvider2);
        expect(providers[1]).toEqual(testProvider1);
        expect(providers[2]).toEqual(testProvider3);
        expect(providers[3]).toEqual(defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js .variable.js .comment2.js');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(testProvider1);
        expect(providers[1]).toEqual(testProvider3);
        return expect(providers[2]).toEqual(defaultProvider);
      });
      return it('filters a provider if the scopeChain matches a provider providerblacklist item', function() {
        var providers;
        providers = providerManager.providersForScopeDescriptor('.source.js .variable.js .other.js');
        expect(providers).toHaveLength(4);
        expect(providers[0]).toEqual(testProvider2);
        expect(providers[1]).toEqual(testProvider1);
        expect(providers[2]).toEqual(testProvider3);
        expect(providers[3]).toEqual(providerManager.defaultProvider);
        providers = providerManager.providersForScopeDescriptor('.source.js .variable.js .comment3.js');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(testProvider2);
        expect(providers[1]).toEqual(testProvider1);
        return expect(providers[2]).toEqual(testProvider3);
      });
    });
    describe("when inclusion priorities are used", function() {
      var accessoryProvider1, accessoryProvider2, defaultProvider, mainProvider, verySpecificProvider, _ref1;
      _ref1 = [], accessoryProvider1 = _ref1[0], accessoryProvider2 = _ref1[1], verySpecificProvider = _ref1[2], mainProvider = _ref1[3], defaultProvider = _ref1[4];
      beforeEach(function() {
        atom.config.set('autocomplete-plus.enableBuiltinProvider', true);
        providerManager = new ProviderManager();
        defaultProvider = providerManager.defaultProvider;
        accessoryProvider1 = {
          selector: '*',
          inclusionPriority: 2,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        accessoryProvider2 = {
          selector: '.source.js',
          inclusionPriority: 2,
          excludeLowerPriority: false,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        verySpecificProvider = {
          selector: '.source.js .comment',
          inclusionPriority: 2,
          excludeLowerPriority: true,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        mainProvider = {
          selector: '.source.js',
          inclusionPriority: 1,
          excludeLowerPriority: true,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        providerManager.registerProvider(accessoryProvider1);
        providerManager.registerProvider(accessoryProvider2);
        providerManager.registerProvider(verySpecificProvider);
        return providerManager.registerProvider(mainProvider);
      });
      it('returns the default provider and higher when nothing with a higher proirity is excluding the lower', function() {
        var providers;
        providers = providerManager.providersForScopeDescriptor('.source.coffee');
        expect(providers).toHaveLength(2);
        expect(providers[0]).toEqual(accessoryProvider1);
        return expect(providers[1]).toEqual(defaultProvider);
      });
      it('exclude the lower priority provider, the default, when one with a higher proirity excludes the lower', function() {
        var providers;
        providers = providerManager.providersForScopeDescriptor('.source.js');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(accessoryProvider2);
        expect(providers[1]).toEqual(mainProvider);
        return expect(providers[2]).toEqual(accessoryProvider1);
      });
      return it('excludes the all lower priority providers when multiple providers of lower priority', function() {
        var providers;
        providers = providerManager.providersForScopeDescriptor('.source.js .comment');
        expect(providers).toHaveLength(3);
        expect(providers[0]).toEqual(verySpecificProvider);
        expect(providers[1]).toEqual(accessoryProvider2);
        return expect(providers[2]).toEqual(accessoryProvider1);
      });
    });
    return describe("when suggestionPriorities are the same", function() {
      var defaultProvider, provider1, provider2, provider3, _ref1;
      _ref1 = [], provider1 = _ref1[0], provider2 = _ref1[1], provider3 = _ref1[2], defaultProvider = _ref1[3];
      beforeEach(function() {
        atom.config.set('autocomplete-plus.enableBuiltinProvider', true);
        providerManager = new ProviderManager();
        defaultProvider = providerManager.defaultProvider;
        provider1 = {
          selector: '*',
          suggestionPriority: 2,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        provider2 = {
          selector: '.source.js',
          suggestionPriority: 3,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        provider3 = {
          selector: '.source.js .comment',
          suggestionPriority: 2,
          getSuggestions: function(options) {},
          dispose: function() {}
        };
        providerManager.registerProvider(provider1);
        providerManager.registerProvider(provider2);
        return providerManager.registerProvider(provider3);
      });
      return it('sorts by specificity', function() {
        var providers;
        providers = providerManager.providersForScopeDescriptor('.source.js .comment');
        expect(providers).toHaveLength(4);
        expect(providers[0]).toEqual(provider2);
        expect(providers[1]).toEqual(provider3);
        return expect(providers[2]).toEqual(provider1);
      });
    });
  });

  hasDisposable = function(compositeDisposable, disposable) {
    var _ref, _ref1;
    if ((compositeDisposable != null ? (_ref = compositeDisposable.disposables) != null ? _ref.has : void 0 : void 0) != null) {
      return compositeDisposable.disposables.has(disposable);
    } else if ((compositeDisposable != null ? (_ref1 = compositeDisposable.disposables) != null ? _ref1.indexOf : void 0 : void 0) != null) {
      return compositeDisposable.disposables.indexOf(disposable) > -1;
    } else {
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9wcm92aWRlci1tYW5hZ2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxpREFBQTtBQUFBLElBQUEsT0FBZ0QsRUFBaEQsRUFBQyx5QkFBRCxFQUFrQixzQkFBbEIsRUFBZ0Msc0JBQWhDLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsRUFBMkQsSUFBM0QsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLEdBQXNCLElBQUEsZUFBQSxDQUFBLENBRHRCLENBQUE7YUFFQSxZQUFBLEdBQ0U7QUFBQSxRQUFBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7aUJBQ2Q7WUFBQztBQUFBLGNBQ0MsSUFBQSxFQUFNLE1BRFA7QUFBQSxjQUVDLGlCQUFBLEVBQW1CLE1BRnBCO2FBQUQ7WUFEYztRQUFBLENBQWhCO0FBQUEsUUFLQSxRQUFBLEVBQVUsWUFMVjtBQUFBLFFBTUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQU5UO1FBSk87SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBY0EsU0FBQSxDQUFVLFNBQUEsR0FBQTs7O1VBQ1IsWUFBWSxDQUFFOztPQUFkO0FBQUEsTUFDQSxZQUFBLEdBQWUsSUFEZixDQUFBOzs7VUFFQSxZQUFZLENBQUU7O09BRmQ7QUFBQSxNQUdBLFlBQUEsR0FBZSxJQUhmLENBQUE7O1FBSUEsZUFBZSxDQUFF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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/provider-manager-spec.coffee
