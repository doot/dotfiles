(function() {
  var triggerAutocompletion, waitForAutocomplete, _ref;

  _ref = require('./spec-helper'), waitForAutocomplete = _ref.waitForAutocomplete, triggerAutocompletion = _ref.triggerAutocompletion;

  describe('Provider API', function() {
    var autocompleteManager, completionDelay, editor, mainModule, registration, testProvider, _ref1;
    _ref1 = [], completionDelay = _ref1[0], editor = _ref1[1], mainModule = _ref1[2], autocompleteManager = _ref1[3], registration = _ref1[4], testProvider = _ref1[5];
    beforeEach(function() {
      runs(function() {
        var workspaceElement;
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
    return describe('Provider API v2.0.0', function() {
      it('registers the provider specified by [provider]', function() {
        testProvider = {
          selector: '.source.js,.source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'ohai'
              }
            ];
          }
        };
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', [testProvider]);
        return expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
      });
      it('registers the provider specified by the naked provider', function() {
        testProvider = {
          selector: '.source.js,.source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'ohai'
              }
            ];
          }
        };
        expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(1);
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
        return expect(autocompleteManager.providerManager.providersForScopeDescriptor('.source.js').length).toEqual(2);
      });
      it('passes the correct parameters to getSuggestions for the version', function() {
        testProvider = {
          selector: '.source.js,.source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'ohai'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
        spyOn(testProvider, 'getSuggestions');
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var args;
          args = testProvider.getSuggestions.mostRecentCall.args[0];
          expect(args.editor).toBeDefined();
          expect(args.bufferPosition).toBeDefined();
          expect(args.scopeDescriptor).toBeDefined();
          expect(args.prefix).toBeDefined();
          expect(args.scope).not.toBeDefined();
          expect(args.scopeChain).not.toBeDefined();
          expect(args.buffer).not.toBeDefined();
          return expect(args.cursor).not.toBeDefined();
        });
      });
      it('correctly displays the suggestion options', function() {
        testProvider = {
          selector: '.source.js, .source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'o',
                rightLabelHTML: '<span style="color: red">ohai</span>',
                description: 'There be documentation'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          expect(suggestionListView.querySelector('li .right-label')).toHaveHtml('<span style="color: red">ohai</span>');
          expect(suggestionListView.querySelector('.word')).toHaveText('ohai');
          expect(suggestionListView.querySelector('.suggestion-description-content')).toHaveText('There be documentation');
          return expect(suggestionListView.querySelector('.suggestion-description-more-link').style.display).toBe('none');
        });
      });
      it("favors the `displayText` over text or snippet suggestion options", function() {
        testProvider = {
          selector: '.source.js, .source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                snippet: 'snippet',
                displayText: 'displayOHAI',
                replacementPrefix: 'o',
                rightLabelHTML: '<span style="color: red">ohai</span>',
                description: 'There be documentation'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          return expect(suggestionListView.querySelector('.word')).toHaveText('displayOHAI');
        });
      });
      it('correctly displays the suggestion description and More link', function() {
        testProvider = {
          selector: '.source.js, .source.coffee',
          getSuggestions: function(options) {
            return [
              {
                text: 'ohai',
                replacementPrefix: 'o',
                rightLabelHTML: '<span style="color: red">ohai</span>',
                description: 'There be documentation',
                descriptionMoreURL: 'http://google.com'
              }
            ];
          }
        };
        registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
        triggerAutocompletion(editor, true, 'o');
        return runs(function() {
          var content, moreLink, suggestionListView;
          suggestionListView = atom.views.getView(autocompleteManager.suggestionList);
          content = suggestionListView.querySelector('.suggestion-description-content');
          moreLink = suggestionListView.querySelector('.suggestion-description-more-link');
          expect(content).toHaveText('There be documentation');
          expect(moreLink).toHaveText('More..');
          expect(moreLink.style.display).toBe('inline');
          return expect(moreLink.getAttribute('href')).toBe('http://google.com');
        });
      });
      return describe("when the filterSuggestions option is set to true", function() {
        var getSuggestions;
        getSuggestions = function() {
          var text, _i, _len, _ref2, _results;
          _ref2 = autocompleteManager.suggestionList.items;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            text = _ref2[_i].text;
            _results.push({
              text: text
            });
          }
          return _results;
        };
        beforeEach(function() {
          return editor.setText('');
        });
        it('filters suggestions based on the default prefix', function() {
          testProvider = {
            selector: '.source.js',
            filterSuggestions: true,
            getSuggestions: function(options) {
              return [
                {
                  text: 'okwow'
                }, {
                  text: 'ohai'
                }, {
                  text: 'ok'
                }, {
                  text: 'cats'
                }, {
                  text: 'something'
                }
              ];
            }
          };
          registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
          editor.insertText('o');
          editor.insertText('k');
          waitForAutocomplete();
          return runs(function() {
            return expect(getSuggestions()).toEqual([
              {
                text: 'ok'
              }, {
                text: 'okwow'
              }
            ]);
          });
        });
        it('filters suggestions based on the specified replacementPrefix for each suggestion', function() {
          testProvider = {
            selector: '.source.js',
            filterSuggestions: true,
            getSuggestions: function(options) {
              return [
                {
                  text: 'ohai'
                }, {
                  text: 'hai'
                }, {
                  text: 'okwow',
                  replacementPrefix: 'k'
                }, {
                  text: 'ok',
                  replacementPrefix: 'nope'
                }, {
                  text: '::cats',
                  replacementPrefix: '::'
                }, {
                  text: 'something',
                  replacementPrefix: 'sm'
                }
              ];
            }
          };
          registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
          editor.insertText('h');
          waitForAutocomplete();
          return runs(function() {
            return expect(getSuggestions()).toEqual([
              {
                text: 'hai'
              }, {
                text: '::cats'
              }, {
                text: 'something'
              }
            ]);
          });
        });
        return it('allows all suggestions when the prefix is an empty string / space', function() {
          testProvider = {
            selector: '.source.js',
            filterSuggestions: true,
            getSuggestions: function(options) {
              return [
                {
                  text: 'ohai'
                }, {
                  text: 'hai'
                }, {
                  text: 'okwow',
                  replacementPrefix: ' '
                }, {
                  text: 'ok',
                  replacementPrefix: 'nope'
                }
              ];
            }
          };
          registration = atom.packages.serviceHub.provide('autocomplete.provider', '2.0.0', testProvider);
          editor.insertText('h');
          editor.insertText(' ');
          waitForAutocomplete();
          return runs(function() {
            return expect(getSuggestions()).toEqual([
              {
                text: 'ohai'
              }, {
                text: 'hai'
              }, {
                text: 'okwow'
              }
            ]);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9wcm92aWRlci1hcGktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0RBQUE7O0FBQUEsRUFBQSxPQUErQyxPQUFBLENBQVEsZUFBUixDQUEvQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLDZCQUFBLHFCQUF0QixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsMkZBQUE7QUFBQSxJQUFBLFFBQXlGLEVBQXpGLEVBQUMsMEJBQUQsRUFBa0IsaUJBQWxCLEVBQTBCLHFCQUExQixFQUFzQyw4QkFBdEMsRUFBMkQsdUJBQTNELEVBQXlFLHVCQUF6RSxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBRUgsWUFBQSxnQkFBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixFQUEwRCxJQUExRCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUMsSUFBbkMsQ0FEQSxDQUFBO0FBQUEsUUFJQSxlQUFBLEdBQWtCLEdBSmxCLENBQUE7QUFBQSxRQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsZUFBekQsQ0FMQSxDQUFBO0FBQUEsUUFNQSxlQUFBLElBQW1CLEdBTm5CLENBQUE7QUFBQSxRQVFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FSbkIsQ0FBQTtlQVNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQVhHO01BQUEsQ0FBTCxDQUFBLENBQUE7QUFBQSxNQWNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsT0FBTyxDQUFDLEdBQVIsQ0FBWTtVQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsQ0FEVSxFQUVWLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixXQUFwQixDQUFnQyxDQUFDLElBQWpDLENBQXNDLFNBQUMsQ0FBRCxHQUFBO21CQUFPLE1BQUEsR0FBUyxFQUFoQjtVQUFBLENBQXRDLENBRlUsRUFHVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsU0FBQyxDQUFELEdBQUE7bUJBQ3RELFVBQUEsR0FBYSxDQUFDLENBQUMsV0FEdUM7VUFBQSxDQUF4RCxDQUhVO1NBQVosRUFEYztNQUFBLENBQWhCLENBZEEsQ0FBQTthQXNCQSxRQUFBLENBQVMsU0FBQSxHQUFBO2VBQ1AsbUJBQUEsR0FBc0IsVUFBVSxDQUFDLG9CQUQxQjtNQUFBLENBQVQsRUF2QlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBNEJBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQTJCLDhEQUEzQjs7VUFBQSxZQUFZLENBQUUsT0FBZCxDQUFBO1NBQUE7T0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLElBRGYsQ0FBQTtBQUVBLE1BQUEsSUFBMkIsOERBQTNCOztVQUFBLFlBQVksQ0FBRSxPQUFkLENBQUE7U0FBQTtPQUZBO2FBR0EsWUFBQSxHQUFlLEtBSlA7SUFBQSxDQUFWLENBNUJBLENBQUE7V0FrQ0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixNQUFBLEVBQUEsQ0FBRyxnREFBSCxFQUFxRCxTQUFBLEdBQUE7QUFDbkQsUUFBQSxZQUFBLEdBQ0U7QUFBQSxVQUFBLFFBQUEsRUFBVSwyQkFBVjtBQUFBLFVBQ0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTttQkFBYTtjQUFDO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFBYyxpQkFBQSxFQUFtQixNQUFqQztlQUFEO2NBQWI7VUFBQSxDQURoQjtTQURGLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxDQUpBLENBQUE7QUFBQSxRQUtBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyx1QkFBakMsRUFBMEQsT0FBMUQsRUFBbUUsQ0FBQyxZQUFELENBQW5FLENBTGYsQ0FBQTtlQU1BLE1BQUEsQ0FBTyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsMkJBQXBDLENBQWdFLFlBQWhFLENBQTZFLENBQUMsTUFBckYsQ0FBNEYsQ0FBQyxPQUE3RixDQUFxRyxDQUFyRyxFQVBtRDtNQUFBLENBQXJELENBQUEsQ0FBQTtBQUFBLE1BU0EsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxRQUFBLFlBQUEsR0FDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLDJCQUFWO0FBQUEsVUFDQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO21CQUFhO2NBQUM7QUFBQSxnQkFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLGdCQUFjLGlCQUFBLEVBQW1CLE1BQWpDO2VBQUQ7Y0FBYjtVQUFBLENBRGhCO1NBREYsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLG1CQUFtQixDQUFDLGVBQWUsQ0FBQywyQkFBcEMsQ0FBZ0UsWUFBaEUsQ0FBNkUsQ0FBQyxNQUFyRixDQUE0RixDQUFDLE9BQTdGLENBQXFHLENBQXJHLENBSkEsQ0FBQTtBQUFBLFFBS0EsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRSxZQUFuRSxDQUxmLENBQUE7ZUFNQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsZUFBZSxDQUFDLDJCQUFwQyxDQUFnRSxZQUFoRSxDQUE2RSxDQUFDLE1BQXJGLENBQTRGLENBQUMsT0FBN0YsQ0FBcUcsQ0FBckcsRUFQMkQ7TUFBQSxDQUE3RCxDQVRBLENBQUE7QUFBQSxNQWtCQSxFQUFBLENBQUcsaUVBQUgsRUFBc0UsU0FBQSxHQUFBO0FBQ3BFLFFBQUEsWUFBQSxHQUNFO0FBQUEsVUFBQSxRQUFBLEVBQVUsMkJBQVY7QUFBQSxVQUNBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7bUJBQWE7Y0FBQztBQUFBLGdCQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsZ0JBQWMsaUJBQUEsRUFBbUIsTUFBakM7ZUFBRDtjQUFiO1VBQUEsQ0FEaEI7U0FERixDQUFBO0FBQUEsUUFJQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FLFlBQW5FLENBSmYsQ0FBQTtBQUFBLFFBTUEsS0FBQSxDQUFNLFlBQU4sRUFBb0IsZ0JBQXBCLENBTkEsQ0FBQTtBQUFBLFFBT0EscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsR0FBcEMsQ0FQQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLFlBQVksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQXZELENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLFdBQXBCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGNBQVosQ0FBMkIsQ0FBQyxXQUE1QixDQUFBLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxlQUFaLENBQTRCLENBQUMsV0FBN0IsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLFdBQXBCLENBQUEsQ0FKQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQVosQ0FBa0IsQ0FBQyxHQUFHLENBQUMsV0FBdkIsQ0FBQSxDQU5BLENBQUE7QUFBQSxVQU9BLE1BQUEsQ0FBTyxJQUFJLENBQUMsVUFBWixDQUF1QixDQUFDLEdBQUcsQ0FBQyxXQUE1QixDQUFBLENBUEEsQ0FBQTtBQUFBLFVBUUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFaLENBQW1CLENBQUMsR0FBRyxDQUFDLFdBQXhCLENBQUEsQ0FSQSxDQUFBO2lCQVNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBWixDQUFtQixDQUFDLEdBQUcsQ0FBQyxXQUF4QixDQUFBLEVBVkc7UUFBQSxDQUFMLEVBVm9FO01BQUEsQ0FBdEUsQ0FsQkEsQ0FBQTtBQUFBLE1Bd0NBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsUUFBQSxZQUFBLEdBQ0U7QUFBQSxVQUFBLFFBQUEsRUFBVSw0QkFBVjtBQUFBLFVBQ0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTttQkFDZDtjQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFDQSxpQkFBQSxFQUFtQixHQURuQjtBQUFBLGdCQUVBLGNBQUEsRUFBZ0Isc0NBRmhCO0FBQUEsZ0JBR0EsV0FBQSxFQUFhLHdCQUhiO2VBREY7Y0FEYztVQUFBLENBRGhCO1NBREYsQ0FBQTtBQUFBLFFBU0EsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRSxZQUFuRSxDQVRmLENBQUE7QUFBQSxRQVdBLHFCQUFBLENBQXNCLE1BQXRCLEVBQThCLElBQTlCLEVBQW9DLEdBQXBDLENBWEEsQ0FBQTtlQWFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLGtCQUFBO0FBQUEsVUFBQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsbUJBQW1CLENBQUMsY0FBdkMsQ0FBckIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLGlCQUFqQyxDQUFQLENBQTJELENBQUMsVUFBNUQsQ0FBdUUsc0NBQXZFLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLE9BQWpDLENBQVAsQ0FBaUQsQ0FBQyxVQUFsRCxDQUE2RCxNQUE3RCxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxrQkFBa0IsQ0FBQyxhQUFuQixDQUFpQyxpQ0FBakMsQ0FBUCxDQUEyRSxDQUFDLFVBQTVFLENBQXVGLHdCQUF2RixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLG1DQUFqQyxDQUFxRSxDQUFDLEtBQUssQ0FBQyxPQUFuRixDQUEyRixDQUFDLElBQTVGLENBQWlHLE1BQWpHLEVBTEc7UUFBQSxDQUFMLEVBZDhDO01BQUEsQ0FBaEQsQ0F4Q0EsQ0FBQTtBQUFBLE1BNkRBLEVBQUEsQ0FBRyxrRUFBSCxFQUF1RSxTQUFBLEdBQUE7QUFDckUsUUFBQSxZQUFBLEdBQ0U7QUFBQSxVQUFBLFFBQUEsRUFBVSw0QkFBVjtBQUFBLFVBQ0EsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTttQkFDZDtjQUNFO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxnQkFDQSxPQUFBLEVBQVMsU0FEVDtBQUFBLGdCQUVBLFdBQUEsRUFBYSxhQUZiO0FBQUEsZ0JBR0EsaUJBQUEsRUFBbUIsR0FIbkI7QUFBQSxnQkFJQSxjQUFBLEVBQWdCLHNDQUpoQjtBQUFBLGdCQUtBLFdBQUEsRUFBYSx3QkFMYjtlQURGO2NBRGM7VUFBQSxDQURoQjtTQURGLENBQUE7QUFBQSxRQVdBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyx1QkFBakMsRUFBMEQsT0FBMUQsRUFBbUUsWUFBbkUsQ0FYZixDQUFBO0FBQUEsUUFhQSxxQkFBQSxDQUFzQixNQUF0QixFQUE4QixJQUE5QixFQUFvQyxHQUFwQyxDQWJBLENBQUE7ZUFlQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxrQkFBQTtBQUFBLFVBQUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLG1CQUFtQixDQUFDLGNBQXZDLENBQXJCLENBQUE7aUJBQ0EsTUFBQSxDQUFPLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLE9BQWpDLENBQVAsQ0FBaUQsQ0FBQyxVQUFsRCxDQUE2RCxhQUE3RCxFQUZHO1FBQUEsQ0FBTCxFQWhCcUU7TUFBQSxDQUF2RSxDQTdEQSxDQUFBO0FBQUEsTUFpRkEsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxRQUFBLFlBQUEsR0FDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLDRCQUFWO0FBQUEsVUFDQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO21CQUNkO2NBQ0U7QUFBQSxnQkFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLGdCQUNBLGlCQUFBLEVBQW1CLEdBRG5CO0FBQUEsZ0JBRUEsY0FBQSxFQUFnQixzQ0FGaEI7QUFBQSxnQkFHQSxXQUFBLEVBQWEsd0JBSGI7QUFBQSxnQkFJQSxrQkFBQSxFQUFvQixtQkFKcEI7ZUFERjtjQURjO1VBQUEsQ0FEaEI7U0FERixDQUFBO0FBQUEsUUFVQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FLFlBQW5FLENBVmYsQ0FBQTtBQUFBLFFBWUEscUJBQUEsQ0FBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsR0FBcEMsQ0FaQSxDQUFBO2VBY0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEscUNBQUE7QUFBQSxVQUFBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixtQkFBbUIsQ0FBQyxjQUF2QyxDQUFyQixDQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsa0JBQWtCLENBQUMsYUFBbkIsQ0FBaUMsaUNBQWpDLENBRFYsQ0FBQTtBQUFBLFVBRUEsUUFBQSxHQUFXLGtCQUFrQixDQUFDLGFBQW5CLENBQWlDLG1DQUFqQyxDQUZYLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUEyQix3QkFBM0IsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLFVBQWpCLENBQTRCLFFBQTVCLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBdEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxRQUFwQyxDQUxBLENBQUE7aUJBTUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFULENBQXNCLE1BQXRCLENBQVAsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxtQkFBM0MsRUFQRztRQUFBLENBQUwsRUFmZ0U7TUFBQSxDQUFsRSxDQWpGQSxDQUFBO2FBeUdBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7QUFDM0QsWUFBQSxjQUFBO0FBQUEsUUFBQSxjQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLGNBQUEsK0JBQUE7QUFBQztBQUFBO2VBQUEsNENBQUEsR0FBQTtBQUFBLFlBQVksaUJBQUEsSUFBWixDQUFBO0FBQUEsMEJBQUE7QUFBQSxjQUFDLE1BQUEsSUFBRDtjQUFBLENBQUE7QUFBQTswQkFEYztRQUFBLENBQWpCLENBQUE7QUFBQSxRQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLEVBRFM7UUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLFFBTUEsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxVQUFBLFlBQUEsR0FDRTtBQUFBLFlBQUEsUUFBQSxFQUFVLFlBQVY7QUFBQSxZQUNBLGlCQUFBLEVBQW1CLElBRG5CO0FBQUEsWUFFQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO3FCQUNkO2dCQUNFO0FBQUEsa0JBQUMsSUFBQSxFQUFNLE9BQVA7aUJBREYsRUFFRTtBQUFBLGtCQUFDLElBQUEsRUFBTSxNQUFQO2lCQUZGLEVBR0U7QUFBQSxrQkFBQyxJQUFBLEVBQU0sSUFBUDtpQkFIRixFQUlFO0FBQUEsa0JBQUMsSUFBQSxFQUFNLE1BQVA7aUJBSkYsRUFLRTtBQUFBLGtCQUFDLElBQUEsRUFBTSxXQUFQO2lCQUxGO2dCQURjO1lBQUEsQ0FGaEI7V0FERixDQUFBO0FBQUEsVUFXQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsdUJBQWpDLEVBQTBELE9BQTFELEVBQW1FLFlBQW5FLENBWGYsQ0FBQTtBQUFBLFVBYUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FiQSxDQUFBO0FBQUEsVUFjQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQWRBLENBQUE7QUFBQSxVQWVBLG1CQUFBLENBQUEsQ0FmQSxDQUFBO2lCQWlCQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUNILE1BQUEsQ0FBTyxjQUFBLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDO2NBQy9CO0FBQUEsZ0JBQUMsSUFBQSxFQUFNLElBQVA7ZUFEK0IsRUFFL0I7QUFBQSxnQkFBQyxJQUFBLEVBQU0sT0FBUDtlQUYrQjthQUFqQyxFQURHO1VBQUEsQ0FBTCxFQWxCb0Q7UUFBQSxDQUF0RCxDQU5BLENBQUE7QUFBQSxRQThCQSxFQUFBLENBQUcsa0ZBQUgsRUFBdUYsU0FBQSxHQUFBO0FBQ3JGLFVBQUEsWUFBQSxHQUNFO0FBQUEsWUFBQSxRQUFBLEVBQVUsWUFBVjtBQUFBLFlBQ0EsaUJBQUEsRUFBbUIsSUFEbkI7QUFBQSxZQUVBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7cUJBQ2Q7Z0JBQ0U7QUFBQSxrQkFBQyxJQUFBLEVBQU0sTUFBUDtpQkFERixFQUVFO0FBQUEsa0JBQUMsSUFBQSxFQUFNLEtBQVA7aUJBRkYsRUFHRTtBQUFBLGtCQUFDLElBQUEsRUFBTSxPQUFQO0FBQUEsa0JBQWdCLGlCQUFBLEVBQW1CLEdBQW5DO2lCQUhGLEVBSUU7QUFBQSxrQkFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLGtCQUFhLGlCQUFBLEVBQW1CLE1BQWhDO2lCQUpGLEVBS0U7QUFBQSxrQkFBQyxJQUFBLEVBQU0sUUFBUDtBQUFBLGtCQUFpQixpQkFBQSxFQUFtQixJQUFwQztpQkFMRixFQU1FO0FBQUEsa0JBQUMsSUFBQSxFQUFNLFdBQVA7QUFBQSxrQkFBb0IsaUJBQUEsRUFBbUIsSUFBdkM7aUJBTkY7Z0JBRGM7WUFBQSxDQUZoQjtXQURGLENBQUE7QUFBQSxVQVlBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyx1QkFBakMsRUFBMEQsT0FBMUQsRUFBbUUsWUFBbkUsQ0FaZixDQUFBO0FBQUEsVUFjQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQixDQWRBLENBQUE7QUFBQSxVQWVBLG1CQUFBLENBQUEsQ0FmQSxDQUFBO2lCQWlCQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUNILE1BQUEsQ0FBTyxjQUFBLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDO2NBQy9CO0FBQUEsZ0JBQUMsSUFBQSxFQUFNLEtBQVA7ZUFEK0IsRUFFL0I7QUFBQSxnQkFBQyxJQUFBLEVBQU0sUUFBUDtlQUYrQixFQUcvQjtBQUFBLGdCQUFDLElBQUEsRUFBTSxXQUFQO2VBSCtCO2FBQWpDLEVBREc7VUFBQSxDQUFMLEVBbEJxRjtRQUFBLENBQXZGLENBOUJBLENBQUE7ZUF1REEsRUFBQSxDQUFHLG1FQUFILEVBQXdFLFNBQUEsR0FBQTtBQUN0RSxVQUFBLFlBQUEsR0FDRTtBQUFBLFlBQUEsUUFBQSxFQUFVLFlBQVY7QUFBQSxZQUNBLGlCQUFBLEVBQW1CLElBRG5CO0FBQUEsWUFFQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO3FCQUNkO2dCQUNFO0FBQUEsa0JBQUMsSUFBQSxFQUFNLE1BQVA7aUJBREYsRUFFRTtBQUFBLGtCQUFDLElBQUEsRUFBTSxLQUFQO2lCQUZGLEVBR0U7QUFBQSxrQkFBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLGtCQUFnQixpQkFBQSxFQUFtQixHQUFuQztpQkFIRixFQUlFO0FBQUEsa0JBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxrQkFBYSxpQkFBQSxFQUFtQixNQUFoQztpQkFKRjtnQkFEYztZQUFBLENBRmhCO1dBREYsQ0FBQTtBQUFBLFVBVUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQXpCLENBQWlDLHVCQUFqQyxFQUEwRCxPQUExRCxFQUFtRSxZQUFuRSxDQVZmLENBQUE7QUFBQSxVQVlBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBWkEsQ0FBQTtBQUFBLFVBYUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FiQSxDQUFBO0FBQUEsVUFjQSxtQkFBQSxDQUFBLENBZEEsQ0FBQTtpQkFnQkEsSUFBQSxDQUFLLFNBQUEsR0FBQTttQkFDSCxNQUFBLENBQU8sY0FBQSxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQztjQUMvQjtBQUFBLGdCQUFDLElBQUEsRUFBTSxNQUFQO2VBRCtCLEVBRS9CO0FBQUEsZ0JBQUMsSUFBQSxFQUFNLEtBQVA7ZUFGK0IsRUFHL0I7QUFBQSxnQkFBQyxJQUFBLEVBQU0sT0FBUDtlQUgrQjthQUFqQyxFQURHO1VBQUEsQ0FBTCxFQWpCc0U7UUFBQSxDQUF4RSxFQXhEMkQ7TUFBQSxDQUE3RCxFQTFHOEI7SUFBQSxDQUFoQyxFQW5DdUI7RUFBQSxDQUF6QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/provider-api-spec.coffee
