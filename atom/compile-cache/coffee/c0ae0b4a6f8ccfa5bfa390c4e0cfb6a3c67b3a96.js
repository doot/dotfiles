(function() {
  var MockDeprecation, grim, triggerAutocompletion, waitForAutocomplete, _ref;

  _ref = require('./spec-helper'), waitForAutocomplete = _ref.waitForAutocomplete, triggerAutocompletion = _ref.triggerAutocompletion;

  grim = require('grim');

  MockDeprecation = (function() {
    function MockDeprecation(message) {
      this.message = message;
    }

    MockDeprecation.prototype.getMessage = function() {
      return this.message;
    };

    return MockDeprecation;

  })();

  describe('Provider API Legacy', function() {
    var autocompleteManager, completionDelay, editor, mainModule, registration, testProvider, _ref1;
    _ref1 = [], completionDelay = _ref1[0], editor = _ref1[1], mainModule = _ref1[2], autocompleteManager = _ref1[3], registration = _ref1[4], testProvider = _ref1[5];
    beforeEach(function() {
      runs(function() {
        var deprecations, workspaceElement;
        deprecations = [];
        spyOn(grim, 'deprecate').andCallFake(function(message) {
          return deprecations.push(new MockDeprecation(message));
        });
        spyOn(grim, 'getDeprecationsLength').andCallFake(function() {
          return deprecations.length;
        });
        spyOn(grim, 'getDeprecations').andCallFake(function() {
          return deprecations;
        });
        atom.config.set('autocomplete-plus.enableAutoActivation', true);
        atom.config.set('editor.fontSize', '16');
        completionDelay = 100;
        atom.config.set('autocomplete-plus.autoActivationDelay', completionDelay);
        completionDelay += 100;
        workspaceElement = atom.views.getView(atom.workspace);
        return jasmine.attachToDOM(workspaceElement);
      });
      waitsForPromise(function() {
        return Promise.all([
          atom.packages.activatePackage('language-javascript'), atom.workspace.open('sample.js').then(function(e) {
            return editor = e;
          }), atom.packages.activatePackage('autocomplete-plus').then(function(a) {
            return mainModule = a.mainModule;
          })
        ]);
      });
      return waitsFor(function() {
        return autocompleteManager = mainModule.autocompleteManager;
      });
    });
    afterEach(function() {
      if ((registration != null ? registration.dispose : void 0) != null) {
        if (registration != null) {
          registration.dispose();
        }
      }
      registration = null;
      if ((testProvider != null ? testProvider.dispose : void 0) != null) {
        if (testProvider != null) {
          testProvider.dispose();
        }
      }
      return testProvider = null;
    });
    describe('Provider with API v1.0 registered as 2.0', function() {
      it("raises deprecations for provider attributes on registration", function() {
        var SampleProvider, deprecation, deprecations, numberDeprecations;
        numberDeprecations = grim.getDeprecationsLength();
        SampleProvider = (function() {
          function SampleProvider() {}

          SampleProvider.prototype.id = 'sample-provider';

          SampleProvider.prototype.selector = '.source.js,.source.coffee';

          SampleProvider.prototype.blacklist = '.comment';

          SampleProvider.prototype.requestHandler = function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai'
              }
            ];
          };

          return SampleProvider;

        })();
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', new SampleProvider);
        expect(grim.getDeprecationsLength() - numberDeprecations).toBe(3);
        deprecations = grim.getDeprecations();
        deprecation = deprecations[deprecations.length - 3];
        expect(deprecation.getMessage()).toContain('`id`');
        expect(deprecation.getMessage()).toContain('SampleProvider');
        deprecation = deprecations[deprecations.length - 2];
        expect(deprecation.getMessage()).toContain('`requestHandler`');
        deprecation = deprecations[deprecations.length - 1];
        return expect(deprecation.getMessage()).toContain('`blacklist`');
      });
      it("raises deprecations when old API parameters are used in the 2.0 API", function() {
        var SampleProvider, numberDeprecations;
        SampleProvider = (function() {
          function SampleProvider() {}

          SampleProvider.prototype.selector = '.source.js,.source.coffee';

          SampleProvider.prototype.getSuggestions = function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai',
                label: '<span style="color: red">ohai</span>',
                renderLabelAsHtml: true,
                className: 'ohai'
              }
            ];
          };

          return SampleProvider;

        })();
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', new SampleProvider);
        numberDeprecations = grim.getDeprecationsLength();
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var deprecation, deprecations;
          expect(grim.getDeprecationsLength() - numberDeprecations).toBe(3);
          deprecations = grim.getDeprecations();
          deprecation = deprecations[deprecations.length - 3];
          expect(deprecation.getMessage()).toContain('`word`');
          expect(deprecation.getMessage()).toContain('SampleProvider');
          deprecation = deprecations[deprecations.length - 2];
          expect(deprecation.getMessage()).toContain('`prefix`');
          deprecation = deprecations[deprecations.length - 1];
          return expect(deprecation.getMessage()).toContain('`label`');
        });
      });
      return it("raises deprecations when hooks are passed via each suggestion", function() {
        var SampleProvider, numberDeprecations;
        SampleProvider = (function() {
          function SampleProvider() {}

          SampleProvider.prototype.selector = '.source.js,.source.coffee';

          SampleProvider.prototype.getSuggestions = function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'ohai',
                onWillConfirm: function() {},
                onDidConfirm: function() {}
              }
            ];
          };

          return SampleProvider;

        })();
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', new SampleProvider);
        numberDeprecations = grim.getDeprecationsLength();
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var deprecation, deprecations;
          expect(grim.getDeprecationsLength() - numberDeprecations).toBe(2);
          deprecations = grim.getDeprecations();
          deprecation = deprecations[deprecations.length - 2];
          expect(deprecation.getMessage()).toContain('`onWillConfirm`');
          expect(deprecation.getMessage()).toContain('SampleProvider');
          deprecation = deprecations[deprecations.length - 1];
          return expect(deprecation.getMessage()).toContain('`onDidConfirm`');
        });
      });
    });
    describe('Provider API v1.1.0', function() {
      return it('registers the provider specified by {providers: [provider]}', function() {
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        testProvider = {
          selector: '.source.js,.source.coffee',
          requestHandler: function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '1.1.0', {
          providers: [testProvider]
        });
        return expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
      });
    });
    return describe('Provider API v1.0.0', function() {
      var registration1, registration2, registration3, _ref2;
      _ref2 = [], registration1 = _ref2[0], registration2 = _ref2[1], registration3 = _ref2[2];
      afterEach(function() {
        if (registration1 != null) {
          registration1.dispose();
        }
        if (registration2 != null) {
          registration2.dispose();
        }
        return registration3 != null ? registration3.dispose() : void 0;
      });
      it('passes the correct parameters to requestHandler', function() {
        testProvider = {
          selector: '.source.js,.source.coffee',
          requestHandler: function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '1.0.0', {
          provider: testProvider
        });
        spyOn(testProvider, 'requestHandler');
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var args;
          args = testProvider.requestHandler.mostRecentCall.args[0];
          expect(args.editor).toBeDefined();
          expect(args.buffer).toBeDefined();
          expect(args.cursor).toBeDefined();
          expect(args.position).toBeDefined();
          expect(args.scope).toBeDefined();
          expect(args.scopeChain).toBeDefined();
          return expect(args.prefix).toBeDefined();
        });
      });
      it('should allow registration of a provider', function() {
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        testProvider = {
          requestHandler: function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai',
                label: '<span style="color: red">ohai</span>',
                renderLabelAsHtml: true,
                className: 'ohai'
              }
            ];
          },
          selector: '.source.js,.source.coffee'
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '1.0.0', {
          provider: testProvider
        });
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          expect(suggestionListView.querySelector('li .right-label')).toHaveHtml('<span style="color: red">ohai</span>');
          return expect(suggestionListView.querySelector('li')).toHaveClass('ohai');
        });
      });
      it('should dispose a provider registration correctly', function() {
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        testProvider = {
          requestHandler: function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai'
              }
            ];
          },
          selector: '.source.js,.source.coffee'
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '1.0.0', {
          provider: testProvider
        });
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        registration.dispose();
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        registration.dispose();
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        return expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
      });
      return it('should remove a providers registration if the provider is disposed', function() {
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        testProvider = {
          requestHandler: function(options) {
            return [
              {
                word: 'ohai',
                prefix: 'ohai'
              }
            ];
          },
          selector: '.source.js,.source.coffee',
          dispose: function() {}
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '1.0.0', {
          provider: testProvider
        });
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(2);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(testProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[1]).toEqual(autocompleteManager.providerManager.defaultProvider);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.go')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        testProvider.dispose();
        expect(autocompleteManager.providerManager.store).toBeDefined();
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee').length).toEqual(1);
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
        return expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.coffee')[0]).toEqual(autocompleteManager.providerManager.defaultProvider);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9wcm92aWRlci1hcGktbGVnYWN5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUEsT0FBK0MsT0FBQSxDQUFRLGVBQVIsQ0FBL0MsRUFBQywyQkFBQSxtQkFBRCxFQUFzQiw2QkFBQSxxQkFBdEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHTTtBQUNTLElBQUEseUJBQUUsT0FBRixHQUFBO0FBQVksTUFBWCxJQUFDLENBQUEsVUFBQSxPQUFVLENBQVo7SUFBQSxDQUFiOztBQUFBLDhCQUNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBSjtJQUFBLENBRFosQ0FBQTs7MkJBQUE7O01BSkYsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSwyRkFBQTtBQUFBLElBQUEsUUFBeUYsRUFBekYsRUFBQywwQkFBRCxFQUFrQixpQkFBbEIsRUFBMEIscUJBQTFCLEVBQXNDLDhCQUF0QyxFQUEyRCx1QkFBM0QsRUFBeUUsdUJBQXpFLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLDhCQUFBO0FBQUEsUUFBQSxZQUFBLEdBQWUsRUFBZixDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLFdBQVosQ0FBd0IsQ0FBQyxXQUF6QixDQUFxQyxTQUFDLE9BQUQsR0FBQTtpQkFDbkMsWUFBWSxDQUFDLElBQWIsQ0FBc0IsSUFBQSxlQUFBLENBQWdCLE9BQWhCLENBQXRCLEVBRG1DO1FBQUEsQ0FBckMsQ0FEQSxDQUFBO0FBQUEsUUFHQSxLQUFBLENBQU0sSUFBTixFQUFZLHVCQUFaLENBQW9DLENBQUMsV0FBckMsQ0FBaUQsU0FBQSxHQUFBO2lCQUMvQyxZQUFZLENBQUMsT0FEa0M7UUFBQSxDQUFqRCxDQUhBLENBQUE7QUFBQSxRQUtBLEtBQUEsQ0FBTSxJQUFOLEVBQVksaUJBQVosQ0FBOEIsQ0FBQyxXQUEvQixDQUEyQyxTQUFBLEdBQUE7aUJBQ3pDLGFBRHlDO1FBQUEsQ0FBM0MsQ0FMQSxDQUFBO0FBQUEsUUFTQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBQTBELElBQTFELENBVEEsQ0FBQTtBQUFBLFFBVUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQyxJQUFuQyxDQVZBLENBQUE7QUFBQSxRQWFBLGVBQUEsR0FBa0IsR0FibEIsQ0FBQTtBQUFBLFFBY0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixFQUF5RCxlQUF6RCxDQWRBLENBQUE7QUFBQSxRQWVBLGVBQUEsSUFBbUIsR0FmbkIsQ0FBQTtBQUFBLFFBaUJBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FqQm5CLENBQUE7ZUFrQkEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLEVBbkJHO01BQUEsQ0FBTCxDQUFBLENBQUE7QUFBQSxNQXFCQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVk7VUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCLENBRFUsRUFFVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFDLENBQUQsR0FBQTttQkFBTyxNQUFBLEdBQVMsRUFBaEI7VUFBQSxDQUF0QyxDQUZVLEVBR1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG1CQUE5QixDQUFrRCxDQUFDLElBQW5ELENBQXdELFNBQUMsQ0FBRCxHQUFBO21CQUN0RCxVQUFBLEdBQWEsQ0FBQyxDQUFDLFdBRHVDO1VBQUEsQ0FBeEQsQ0FIVTtTQUFaLEVBRGM7TUFBQSxDQUFoQixDQXJCQSxDQUFBO2FBNkJBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFDUCxtQkFBQSxHQUFzQixVQUFVLENBQUMsb0JBRDFCO01BQUEsQ0FBVCxFQTlCUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFtQ0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBMkIsOERBQTNCOztVQUFBLFlBQVksQ0FBRSxPQUFkLENBQUE7U0FBQTtPQUFBO0FBQUEsTUFDQSxZQUFBLEdBQWUsSUFEZixDQUFBO0FBRUEsTUFBQSxJQUEyQiw4REFBM0I7O1VBQUEsWUFBWSxDQUFFLE9BQWQsQ0FBQTtTQUFBO09BRkE7YUFHQSxZQUFBLEdBQWUsS0FKUDtJQUFBLENBQVYsQ0FuQ0EsQ0FBQTtBQUFBLElBeUNBLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsTUFBQSxFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLFlBQUEsNkRBQUE7QUFBQSxRQUFBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxxQkFBTCxDQUFBLENBQXJCLENBQUE7QUFBQSxRQUVNO3NDQUNKOztBQUFBLG1DQUFBLEVBQUEsR0FBSSxpQkFBSixDQUFBOztBQUFBLG1DQUNBLFFBQUEsR0FBVSwyQkFEVixDQUFBOztBQUFBLG1DQUVBLFNBQUEsR0FBVyxVQUZYLENBQUE7O0FBQUEsbUNBR0EsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTttQkFBYTtjQUFDO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFBYyxNQUFBLEVBQVEsTUFBdEI7ZUFBRDtjQUFiO1VBQUEsQ0FIaEIsQ0FBQTs7Z0NBQUE7O1lBSEYsQ0FBQTtBQUFBLFFBUUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRSxHQUFBLENBQUEsY0FBbkUsQ0FSZixDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sSUFBSSxDQUFDLHFCQUFMLENBQUEsQ0FBQSxHQUErQixrQkFBdEMsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxDQUEvRCxDQVZBLENBQUE7QUFBQSxRQVlBLFlBQUEsR0FBZSxJQUFJLENBQUMsZUFBTCxDQUFBLENBWmYsQ0FBQTtBQUFBLFFBY0EsV0FBQSxHQUFjLFlBQWEsQ0FBQSxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixDQWQzQixDQUFBO0FBQUEsUUFlQSxNQUFBLENBQU8sV0FBVyxDQUFDLFVBQVosQ0FBQSxDQUFQLENBQWdDLENBQUMsU0FBakMsQ0FBMkMsTUFBM0MsQ0FmQSxDQUFBO0FBQUEsUUFnQkEsTUFBQSxDQUFPLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBUCxDQUFnQyxDQUFDLFNBQWpDLENBQTJDLGdCQUEzQyxDQWhCQSxDQUFBO0FBQUEsUUFrQkEsV0FBQSxHQUFjLFlBQWEsQ0FBQSxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixDQWxCM0IsQ0FBQTtBQUFBLFFBbUJBLE1BQUEsQ0FBTyxXQUFXLENBQUMsVUFBWixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxTQUFqQyxDQUEyQyxrQkFBM0MsQ0FuQkEsQ0FBQTtBQUFBLFFBcUJBLFdBQUEsR0FBYyxZQUFhLENBQUEsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBdEIsQ0FyQjNCLENBQUE7ZUFzQkEsTUFBQSxDQUFPLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBUCxDQUFnQyxDQUFDLFNBQWpDLENBQTJDLGFBQTNDLEVBdkJnRTtNQUFBLENBQWxFLENBQUEsQ0FBQTtBQUFBLE1BeUJBLEVBQUEsQ0FBRyxxRUFBSCxFQUEwRSxTQUFBLEdBQUE7QUFDeEUsWUFBQSxrQ0FBQTtBQUFBLFFBQU07c0NBQ0o7O0FBQUEsbUNBQUEsUUFBQSxHQUFVLDJCQUFWLENBQUE7O0FBQUEsbUNBQ0EsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTttQkFDZDtjQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFDQSxNQUFBLEVBQVEsTUFEUjtBQUFBLGdCQUVBLEtBQUEsRUFBTyxzQ0FGUDtBQUFBLGdCQUdBLGlCQUFBLEVBQW1CLElBSG5CO0FBQUEsZ0JBSUEsU0FBQSxFQUFXLE1BSlg7ZUFERjtjQURjO1VBQUEsQ0FEaEIsQ0FBQTs7Z0NBQUE7O1lBREYsQ0FBQTtBQUFBLFFBVUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRSxHQUFBLENBQUEsY0FBbkUsQ0FWZixDQUFBO0FBQUEsUUFXQSxrQkFBQSxHQUFxQixJQUFJLENBQUMscUJBQUwsQ0FBQSxDQVhyQixDQUFBO0FBQUEsUUFZQSxxQkFBQSxDQUFzQixNQUF0QixFQUE4QixJQUE5QixFQUFvQyxHQUFwQyxDQVpBLENBQUE7ZUFjQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSx5QkFBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxxQkFBTCxDQUFBLENBQUEsR0FBK0Isa0JBQXRDLENBQXlELENBQUMsSUFBMUQsQ0FBK0QsQ0FBL0QsQ0FBQSxDQUFBO0FBQUEsVUFFQSxZQUFBLEdBQWUsSUFBSSxDQUFDLGVBQUwsQ0FBQSxDQUZmLENBQUE7QUFBQSxVQUlBLFdBQUEsR0FBYyxZQUFhLENBQUEsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBdEIsQ0FKM0IsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBUCxDQUFnQyxDQUFDLFNBQWpDLENBQTJDLFFBQTNDLENBTEEsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBUCxDQUFnQyxDQUFDLFNBQWpDLENBQTJDLGdCQUEzQyxDQU5BLENBQUE7QUFBQSxVQVFBLFdBQUEsR0FBYyxZQUFhLENBQUEsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBdEIsQ0FSM0IsQ0FBQTtBQUFBLFVBU0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxVQUFaLENBQUEsQ0FBUCxDQUFnQyxDQUFDLFNBQWpDLENBQTJDLFVBQTNDLENBVEEsQ0FBQTtBQUFBLFVBV0EsV0FBQSxHQUFjLFlBQWEsQ0FBQSxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixDQVgzQixDQUFBO2lCQVlBLE1BQUEsQ0FBTyxXQUFXLENBQUMsVUFBWixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxTQUFqQyxDQUEyQyxTQUEzQyxFQWJHO1FBQUEsQ0FBTCxFQWZ3RTtNQUFBLENBQTFFLENBekJBLENBQUE7YUF1REEsRUFBQSxDQUFHLCtEQUFILEVBQW9FLFNBQUEsR0FBQTtBQUNsRSxZQUFBLGtDQUFBO0FBQUEsUUFBTTtzQ0FDSjs7QUFBQSxtQ0FBQSxRQUFBLEdBQVUsMkJBQVYsQ0FBQTs7QUFBQSxtQ0FDQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO21CQUNkO2NBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLGdCQUNBLGlCQUFBLEVBQW1CLE1BRG5CO0FBQUEsZ0JBRUEsYUFBQSxFQUFlLFNBQUEsR0FBQSxDQUZmO0FBQUEsZ0JBR0EsWUFBQSxFQUFjLFNBQUEsR0FBQSxDQUhkO2VBREY7Y0FEYztVQUFBLENBRGhCLENBQUE7O2dDQUFBOztZQURGLENBQUE7QUFBQSxRQVNBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyx1QkFBakMsRUFBMEQsT0FBMUQsRUFBbUUsR0FBQSxDQUFBLGNBQW5FLENBVGYsQ0FBQTtBQUFBLFFBVUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLHFCQUFMLENBQUEsQ0FWckIsQ0FBQTtBQUFBLFFBV0EscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsR0FBcEMsQ0FYQSxDQUFBO2VBYUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEseUJBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMscUJBQUwsQ0FBQSxDQUFBLEdBQStCLGtCQUF0QyxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBQUEsQ0FBQTtBQUFBLFVBRUEsWUFBQSxHQUFlLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FGZixDQUFBO0FBQUEsVUFJQSxXQUFBLEdBQWMsWUFBYSxDQUFBLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXRCLENBSjNCLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxXQUFXLENBQUMsVUFBWixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxTQUFqQyxDQUEyQyxpQkFBM0MsQ0FMQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sV0FBVyxDQUFDLFVBQVosQ0FBQSxDQUFQLENBQWdDLENBQUMsU0FBakMsQ0FBMkMsZ0JBQTNDLENBTkEsQ0FBQTtBQUFBLFVBUUEsV0FBQSxHQUFjLFlBQWEsQ0FBQSxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixDQVIzQixDQUFBO2lCQVNBLE1BQUEsQ0FBTyxXQUFXLENBQUMsVUFBWixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxTQUFqQyxDQUEyQyxnQkFBM0MsRUFWRztRQUFBLENBQUwsRUFka0U7TUFBQSxDQUFwRSxFQXhEbUQ7SUFBQSxDQUFyRCxDQXpDQSxDQUFBO0FBQUEsSUEySEEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTthQUM5QixFQUFBLENBQUcsNkRBQUgsRUFBa0UsU0FBQSxHQUFBO0FBQ2hFLFFBQUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBQUEsQ0FBQTtBQUFBLFFBRUEsWUFBQSxHQUNFO0FBQUEsVUFBQSxRQUFBLEVBQVUsMkJBQVY7QUFBQSxVQUNBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7bUJBQWE7Y0FBQztBQUFBLGdCQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsZ0JBQWMsTUFBQSxFQUFRLE1BQXRCO2VBQUQ7Y0FBYjtVQUFBLENBRGhCO1NBSEYsQ0FBQTtBQUFBLFFBTUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRTtBQUFBLFVBQUMsU0FBQSxFQUFXLENBQUMsWUFBRCxDQUFaO1NBQW5FLENBTmYsQ0FBQTtlQVFBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxFQVRnRTtNQUFBLENBQWxFLEVBRDhCO0lBQUEsQ0FBaEMsQ0EzSEEsQ0FBQTtXQXVJQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFVBQUEsa0RBQUE7QUFBQSxNQUFBLFFBQWdELEVBQWhELEVBQUMsd0JBQUQsRUFBZ0Isd0JBQWhCLEVBQStCLHdCQUEvQixDQUFBO0FBQUEsTUFFQSxTQUFBLENBQVUsU0FBQSxHQUFBOztVQUNSLGFBQWEsQ0FBRSxPQUFmLENBQUE7U0FBQTs7VUFDQSxhQUFhLENBQUUsT0FBZixDQUFBO1NBREE7dUNBRUEsYUFBYSxDQUFFLE9BQWYsQ0FBQSxXQUhRO01BQUEsQ0FBVixDQUZBLENBQUE7QUFBQSxNQU9BLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsUUFBQSxZQUFBLEdBQ0U7QUFBQSxVQUFBLFFBQUEsRUFBVSwyQkFBVjtBQUFBLFVBQ0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTttQkFBYTtjQUFFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFBYyxNQUFBLEVBQVEsTUFBdEI7ZUFBRjtjQUFiO1VBQUEsQ0FEaEI7U0FERixDQUFBO0FBQUEsUUFHQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FO0FBQUEsVUFBQyxRQUFBLEVBQVUsWUFBWDtTQUFuRSxDQUhmLENBQUE7QUFBQSxRQUtBLEtBQUEsQ0FBTSxZQUFOLEVBQW9CLGdCQUFwQixDQUxBLENBQUE7QUFBQSxRQU1BLHFCQUFBLENBQXNCLE1BQXRCLEVBQThCLElBQTlCLEVBQW9DLEdBQXBDLENBTkEsQ0FBQTtlQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxZQUFZLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUF2RCxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQVosQ0FBbUIsQ0FBQyxXQUFwQixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFaLENBQW1CLENBQUMsV0FBcEIsQ0FBQSxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLFdBQXBCLENBQUEsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVosQ0FBcUIsQ0FBQyxXQUF0QixDQUFBLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFaLENBQWtCLENBQUMsV0FBbkIsQ0FBQSxDQUxBLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxJQUFJLENBQUMsVUFBWixDQUF1QixDQUFDLFdBQXhCLENBQUEsQ0FOQSxDQUFBO2lCQU9BLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLFdBQXBCLENBQUEsRUFSRztRQUFBLENBQUwsRUFUb0Q7TUFBQSxDQUF0RCxDQVBBLENBQUE7QUFBQSxNQTBCQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxLQUEzQyxDQUFpRCxDQUFDLFdBQWxELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE2RSxDQUFDLE1BQXJGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsQ0FBckcsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBaUYsQ0FBQyxNQUF6RixDQUFnRyxDQUFDLE9BQWpHLENBQXlHLENBQXpHLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXJJLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWtGLENBQUEsQ0FBQSxDQUF6RixDQUE0RixDQUFDLE9BQTdGLENBQXFHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUF6SSxDQUpBLENBQUE7QUFBQSxRQU1BLFlBQUEsR0FDRTtBQUFBLFVBQUEsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTttQkFDZDtjQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFDQSxNQUFBLEVBQVEsTUFEUjtBQUFBLGdCQUVBLEtBQUEsRUFBTyxzQ0FGUDtBQUFBLGdCQUdBLGlCQUFBLEVBQW1CLElBSG5CO0FBQUEsZ0JBSUEsU0FBQSxFQUFXLE1BSlg7ZUFERjtjQURjO1VBQUEsQ0FBaEI7QUFBQSxVQVFBLFFBQUEsRUFBVSwyQkFSVjtTQVBGLENBQUE7QUFBQSxRQWlCQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FO0FBQUEsVUFBQyxRQUFBLEVBQVUsWUFBWDtTQUFuRSxDQWpCZixDQUFBO0FBQUEsUUFtQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxLQUEzQyxDQUFpRCxDQUFDLFdBQWxELENBQUEsQ0FuQkEsQ0FBQTtBQUFBLFFBb0JBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxDQXBCQSxDQUFBO0FBQUEsUUFxQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWlGLENBQUMsTUFBekYsQ0FBZ0csQ0FBQyxPQUFqRyxDQUF5RyxDQUF6RyxDQXJCQSxDQUFBO0FBQUEsUUFzQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsWUFBakcsQ0F0QkEsQ0FBQTtBQUFBLFFBdUJBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQThFLENBQUEsQ0FBQSxDQUFyRixDQUF3RixDQUFDLE9BQXpGLENBQWlHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUFySSxDQXZCQSxDQUFBO0FBQUEsUUF3QkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWtGLENBQUEsQ0FBQSxDQUF6RixDQUE0RixDQUFDLE9BQTdGLENBQXFHLFlBQXJHLENBeEJBLENBQUE7QUFBQSxRQXlCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXpJLENBekJBLENBQUE7QUFBQSxRQTBCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE4RSxDQUFBLENBQUEsQ0FBckYsQ0FBd0YsQ0FBQyxPQUF6RixDQUFpRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBckksQ0ExQkEsQ0FBQTtBQUFBLFFBNEJBLHFCQUFBLENBQXNCLE1BQXRCLEVBQThCLElBQTlCLEVBQW9DLEdBQXBDLENBNUJBLENBQUE7ZUE4QkEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsa0JBQUE7QUFBQSxVQUFBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixtQkFBbUIsQ0FBQyxjQUF2QyxDQUFyQixDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sa0JBQWtCLENBQUMsYUFBbkIsQ0FBaUMsaUJBQWpDLENBQVAsQ0FBMkQsQ0FBQyxVQUE1RCxDQUF1RSxzQ0FBdkUsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxhQUFuQixDQUFpQyxJQUFqQyxDQUFQLENBQThDLENBQUMsV0FBL0MsQ0FBMkQsTUFBM0QsRUFKRztRQUFBLENBQUwsRUEvQjRDO01BQUEsQ0FBOUMsQ0ExQkEsQ0FBQTtBQUFBLE1BK0RBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBLEdBQUE7QUFDckQsUUFBQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLEtBQTNDLENBQWlELENBQUMsV0FBbEQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLGdCQUFoRSxDQUFpRixDQUFDLE1BQXpGLENBQWdHLENBQUMsT0FBakcsQ0FBeUcsQ0FBekcsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE4RSxDQUFBLENBQUEsQ0FBckYsQ0FBd0YsQ0FBQyxPQUF6RixDQUFpRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBckksQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXpJLENBSkEsQ0FBQTtBQUFBLFFBTUEsWUFBQSxHQUNFO0FBQUEsVUFBQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO21CQUNkO2NBQUM7QUFBQSxnQkFDQyxJQUFBLEVBQU0sTUFEUDtBQUFBLGdCQUVDLE1BQUEsRUFBUSxNQUZUO2VBQUQ7Y0FEYztVQUFBLENBQWhCO0FBQUEsVUFLQSxRQUFBLEVBQVUsMkJBTFY7U0FQRixDQUFBO0FBQUEsUUFjQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FO0FBQUEsVUFBQyxRQUFBLEVBQVUsWUFBWDtTQUFuRSxDQWRmLENBQUE7QUFBQSxRQWdCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLEtBQTNDLENBQWlELENBQUMsV0FBbEQsQ0FBQSxDQWhCQSxDQUFBO0FBQUEsUUFpQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBakJBLENBQUE7QUFBQSxRQWtCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBaUYsQ0FBQyxNQUF6RixDQUFnRyxDQUFDLE9BQWpHLENBQXlHLENBQXpHLENBbEJBLENBQUE7QUFBQSxRQW1CQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE4RSxDQUFBLENBQUEsQ0FBckYsQ0FBd0YsQ0FBQyxPQUF6RixDQUFpRyxZQUFqRyxDQW5CQSxDQUFBO0FBQUEsUUFvQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXJJLENBcEJBLENBQUE7QUFBQSxRQXFCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsWUFBckcsQ0FyQkEsQ0FBQTtBQUFBLFFBc0JBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLGdCQUFoRSxDQUFrRixDQUFBLENBQUEsQ0FBekYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBekksQ0F0QkEsQ0FBQTtBQUFBLFFBdUJBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQThFLENBQUEsQ0FBQSxDQUFyRixDQUF3RixDQUFDLE9BQXpGLENBQWlHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUFySSxDQXZCQSxDQUFBO0FBQUEsUUF5QkEsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQXpCQSxDQUFBO0FBQUEsUUEyQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxLQUEzQyxDQUFpRCxDQUFDLFdBQWxELENBQUEsQ0EzQkEsQ0FBQTtBQUFBLFFBNEJBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxDQTVCQSxDQUFBO0FBQUEsUUE2QkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWlGLENBQUMsTUFBekYsQ0FBZ0csQ0FBQyxPQUFqRyxDQUF5RyxDQUF6RyxDQTdCQSxDQUFBO0FBQUEsUUE4QkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXJJLENBOUJBLENBQUE7QUFBQSxRQStCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXpJLENBL0JBLENBQUE7QUFBQSxRQWlDQSxZQUFZLENBQUMsT0FBYixDQUFBLENBakNBLENBQUE7QUFBQSxRQW1DQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLEtBQTNDLENBQWlELENBQUMsV0FBbEQsQ0FBQSxDQW5DQSxDQUFBO0FBQUEsUUFvQ0EsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBcENBLENBQUE7QUFBQSxRQXFDQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBaUYsQ0FBQyxNQUF6RixDQUFnRyxDQUFDLE9BQWpHLENBQXlHLENBQXpHLENBckNBLENBQUE7QUFBQSxRQXNDQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE4RSxDQUFBLENBQUEsQ0FBckYsQ0FBd0YsQ0FBQyxPQUF6RixDQUFpRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBckksQ0F0Q0EsQ0FBQTtlQXVDQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXpJLEVBeENxRDtNQUFBLENBQXZELENBL0RBLENBQUE7YUF5R0EsRUFBQSxDQUFHLG9FQUFILEVBQXlFLFNBQUEsR0FBQTtBQUN2RSxRQUFBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsS0FBM0MsQ0FBaUQsQ0FBQyxXQUFsRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWlGLENBQUMsTUFBekYsQ0FBZ0csQ0FBQyxPQUFqRyxDQUF5RyxDQUF6RyxDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQThFLENBQUEsQ0FBQSxDQUFyRixDQUF3RixDQUFDLE9BQXpGLENBQWlHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUFySSxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLGdCQUFoRSxDQUFrRixDQUFBLENBQUEsQ0FBekYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBekksQ0FKQSxDQUFBO0FBQUEsUUFNQSxZQUFBLEdBQ0U7QUFBQSxVQUFBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7bUJBQ2Q7Y0FBQztBQUFBLGdCQUNDLElBQUEsRUFBTSxNQURQO0FBQUEsZ0JBRUMsTUFBQSxFQUFRLE1BRlQ7ZUFBRDtjQURjO1VBQUEsQ0FBaEI7QUFBQSxVQUtBLFFBQUEsRUFBVSwyQkFMVjtBQUFBLFVBTUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQU5UO1NBUEYsQ0FBQTtBQUFBLFFBZ0JBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyx1QkFBakMsRUFBMEQsT0FBMUQsRUFBbUU7QUFBQSxVQUFDLFFBQUEsRUFBVSxZQUFYO1NBQW5FLENBaEJmLENBQUE7QUFBQSxRQWtCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLEtBQTNDLENBQWlELENBQUMsV0FBbEQsQ0FBQSxDQWxCQSxDQUFBO0FBQUEsUUFtQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBbkJBLENBQUE7QUFBQSxRQW9CQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBaUYsQ0FBQyxNQUF6RixDQUFnRyxDQUFDLE9BQWpHLENBQXlHLENBQXpHLENBcEJBLENBQUE7QUFBQSxRQXFCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE4RSxDQUFBLENBQUEsQ0FBckYsQ0FBd0YsQ0FBQyxPQUF6RixDQUFpRyxZQUFqRyxDQXJCQSxDQUFBO0FBQUEsUUFzQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXJJLENBdEJBLENBQUE7QUFBQSxRQXVCQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxnQkFBaEUsQ0FBa0YsQ0FBQSxDQUFBLENBQXpGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsWUFBckcsQ0F2QkEsQ0FBQTtBQUFBLFFBd0JBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLGdCQUFoRSxDQUFrRixDQUFBLENBQUEsQ0FBekYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsZUFBekksQ0F4QkEsQ0FBQTtBQUFBLFFBeUJBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQThFLENBQUEsQ0FBQSxDQUFyRixDQUF3RixDQUFDLE9BQXpGLENBQWlHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUFySSxDQXpCQSxDQUFBO0FBQUEsUUEyQkEsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQTNCQSxDQUFBO0FBQUEsUUE2QkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxLQUEzQyxDQUFpRCxDQUFDLFdBQWxELENBQUEsQ0E3QkEsQ0FBQTtBQUFBLFFBOEJBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxDQTlCQSxDQUFBO0FBQUEsUUErQkEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWlGLENBQUMsTUFBekYsQ0FBZ0csQ0FBQyxPQUFqRyxDQUF5RyxDQUF6RyxDQS9CQSxDQUFBO0FBQUEsUUFnQ0EsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBOEUsQ0FBQSxDQUFBLENBQXJGLENBQXdGLENBQUMsT0FBekYsQ0FBaUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDLGVBQXJJLENBaENBLENBQUE7ZUFpQ0EsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsZ0JBQWhFLENBQWtGLENBQUEsQ0FBQSxDQUF6RixDQUE0RixDQUFDLE9BQTdGLENBQXFHLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxlQUF6SSxFQWxDdUU7TUFBQSxDQUF6RSxFQTFHOEI7SUFBQSxDQUFoQyxFQXhJOEI7RUFBQSxDQUFoQyxDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/provider-api-legacy-spec.coffee
