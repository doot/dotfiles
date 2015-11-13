(function() {
  var SuggestionListElement;

  SuggestionListElement = require('../lib/suggestion-list-element');

  describe('Suggestion List Element', function() {
    var suggestionListElement;
    suggestionListElement = [][0];
    beforeEach(function() {
      return suggestionListElement = new SuggestionListElement();
    });
    afterEach(function() {
      if (suggestionListElement != null) {
        suggestionListElement.dispose();
      }
      return suggestionListElement = null;
    });
    describe('renderItem', function() {
      beforeEach(function() {
        return jasmine.attachToDOM(suggestionListElement);
      });
      it("HTML escapes displayText", function() {
        var suggestion;
        suggestion = {
          text: 'Animal<Cat>'
        };
        suggestionListElement.renderItem(suggestion);
        expect(suggestionListElement.selectedLi.innerHTML).toContain('Animal&lt;Cat&gt;');
        suggestion = {
          text: 'Animal<Cat>',
          displayText: 'Animal<Cat>'
        };
        suggestionListElement.renderItem(suggestion);
        expect(suggestionListElement.selectedLi.innerHTML).toContain('Animal&lt;Cat&gt;');
        suggestion = {
          snippet: 'Animal<Cat>',
          displayText: 'Animal<Cat>'
        };
        suggestionListElement.renderItem(suggestion);
        return expect(suggestionListElement.selectedLi.innerHTML).toContain('Animal&lt;Cat&gt;');
      });
      it("HTML escapes snippets", function() {
        var suggestion;
        suggestion = {
          snippet: 'Animal<Cat>(${1:omg<wow>}, ${2:ok<yeah>})'
        };
        suggestionListElement.renderItem(suggestion);
        expect(suggestionListElement.selectedLi.innerHTML).toContain('Animal&lt;Cat&gt;');
        expect(suggestionListElement.selectedLi.innerHTML).toContain('omg&lt;wow&gt;');
        expect(suggestionListElement.selectedLi.innerHTML).toContain('ok&lt;yeah&gt;');
        suggestion = {
          snippet: 'Animal<Cat>(${1:omg<wow>}, ${2:ok<yeah>})',
          displayText: 'Animal<Cat>(omg<wow>, ok<yeah>)'
        };
        suggestionListElement.renderItem(suggestion);
        expect(suggestionListElement.selectedLi.innerHTML).toContain('Animal&lt;Cat&gt;');
        expect(suggestionListElement.selectedLi.innerHTML).toContain('omg&lt;wow&gt;');
        return expect(suggestionListElement.selectedLi.innerHTML).toContain('ok&lt;yeah&gt;');
      });
      return it("HTML escapes labels", function() {
        var suggestion;
        suggestion = {
          text: 'something',
          leftLabel: 'Animal<Cat>',
          rightLabel: 'Animal<Dog>'
        };
        suggestionListElement.renderItem(suggestion);
        expect(suggestionListElement.selectedLi.querySelector('.left-label').innerHTML).toContain('Animal&lt;Cat&gt;');
        return expect(suggestionListElement.selectedLi.querySelector('.right-label').innerHTML).toContain('Animal&lt;Dog&gt;');
      });
    });
    describe('getDisplayHTML', function() {
      it('uses displayText over text or snippet', function() {
        var displayText, html, replacementPrefix, snippet, text;
        text = 'abcd()';
        snippet = void 0;
        displayText = 'acd';
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, displayText, replacementPrefix);
        return expect(html).toBe('<span class="character-match">a</span>cd');
      });
      it('handles the empty string in the text field', function() {
        var html, replacementPrefix, snippet, text;
        text = '';
        snippet = void 0;
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('');
      });
      it('handles the empty string in the snippet field', function() {
        var html, replacementPrefix, snippet, text;
        text = void 0;
        snippet = '';
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('');
      });
      it('handles an empty prefix', function() {
        var html, replacementPrefix, snippet, text;
        text = void 0;
        snippet = 'abc';
        replacementPrefix = '';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('abc');
      });
      it('outputs correct html when there are no snippets in the snippet field', function() {
        var html, replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(d, e)f';
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('<span class="character-match">a</span>bc(d, e)f');
      });
      it('outputs correct html when there are not character matches', function() {
        var html, replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(d, e)f';
        replacementPrefix = 'omg';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('abc(d, e)f');
      });
      it('outputs correct html when the text field is used', function() {
        var html, replacementPrefix, snippet, text;
        text = 'abc(d, e)f';
        snippet = void 0;
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('<span class="character-match">a</span>bc(d, e)f');
      });
      it('replaces a snippet with no escaped right braces', function() {
        var html, replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(${1:d}, ${2:e})f';
        replacementPrefix = 'a';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('<span class="character-match">a</span>bc(<span class="snippet-completion">d</span>, <span class="snippet-completion">e</span>)f');
      });
      it('replaces a snippet with no escaped right braces', function() {
        var html, replacementPrefix, snippet, text;
        text = '';
        snippet = 'text(${1:ab}, ${2:cd})';
        replacementPrefix = 'ta';
        html = suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix);
        return expect(html).toBe('<span class="character-match">t</span>ext(<span class="snippet-completion"><span class="character-match">a</span>b</span>, <span class="snippet-completion">cd</span>)');
      });
      it('replaces a snippet with escaped right braces', function() {
        var replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(${1:d}, ${2:e})f ${3:interface{\\}}';
        replacementPrefix = 'a';
        return expect(suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix)).toBe('<span class="character-match">a</span>bc(<span class="snippet-completion">d</span>, <span class="snippet-completion">e</span>)f <span class="snippet-completion">interface{}</span>');
      });
      it('replaces a snippet with escaped multiple right braces', function() {
        var replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(${1:d}, ${2:something{ok\\}}, ${3:e})f ${4:interface{\\}}';
        replacementPrefix = 'a';
        return expect(suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix)).toBe('<span class="character-match">a</span>bc(<span class="snippet-completion">d</span>, <span class="snippet-completion">something{ok}</span>, <span class="snippet-completion">e</span>)f <span class="snippet-completion">interface{}</span>');
      });
      return it('replaces a snippet with elements that have no text', function() {
        var replacementPrefix, snippet, text;
        text = '';
        snippet = 'abc(${1:d}, ${2:e})f${3}';
        replacementPrefix = 'a';
        return expect(suggestionListElement.getDisplayHTML(text, snippet, null, replacementPrefix)).toBe('<span class="character-match">a</span>bc(<span class="snippet-completion">d</span>, <span class="snippet-completion">e</span>)f');
      });
    });
    describe('findCharacterMatches', function() {
      var assertMatches;
      assertMatches = function(text, replacementPrefix, truthyIndices) {
        var i, matches, snippets, _i, _ref, _results;
        text = suggestionListElement.removeEmptySnippets(text);
        snippets = suggestionListElement.snippetParser.findSnippets(text);
        text = suggestionListElement.removeSnippetsFromText(snippets, text);
        matches = suggestionListElement.findCharacterMatchIndices(text, replacementPrefix);
        _results = [];
        for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (truthyIndices.indexOf(i) !== -1) {
            _results.push(expect(matches != null ? matches[i] : void 0).toBeTruthy());
          } else {
            _results.push(expect(matches != null ? matches[i] : void 0).toBeFalsy());
          }
        }
        return _results;
      };
      it('finds matches when no snippets exist', function() {
        assertMatches('hello', '', []);
        assertMatches('hello', 'h', [0]);
        assertMatches('hello', 'hl', [0, 2]);
        return assertMatches('hello', 'hlo', [0, 2, 4]);
      });
      return it('finds matches when snippets exist', function() {
        assertMatches('${0:hello}', '', []);
        assertMatches('${0:hello}', 'h', [0]);
        assertMatches('${0:hello}', 'hl', [0, 2]);
        assertMatches('${0:hello}', 'hlo', [0, 2, 4]);
        assertMatches('${0:hello}world', '', []);
        assertMatches('${0:hello}world', 'h', [0]);
        assertMatches('${0:hello}world', 'hw', [0, 5]);
        assertMatches('${0:hello}world', 'hlw', [0, 2, 5]);
        assertMatches('hello${0:world}', '', []);
        assertMatches('hello${0:world}', 'h', [0]);
        assertMatches('hello${0:world}', 'hw', [0, 5]);
        return assertMatches('hello${0:world}', 'hlw', [0, 2, 5]);
      });
    });
    return describe('removeEmptySnippets', function() {
      it('removes an empty snippet group', function() {
        expect(suggestionListElement.removeEmptySnippets('$0')).toBe('');
        return expect(suggestionListElement.removeEmptySnippets('$1000')).toBe('');
      });
      it('removes an empty snippet group with surrounding text', function() {
        expect(suggestionListElement.removeEmptySnippets('hello$0')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('$0hello')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('hello$0hello')).toBe('hellohello');
        return expect(suggestionListElement.removeEmptySnippets('hello$1000hello')).toBe('hellohello');
      });
      it('removes an empty snippet group with braces', function() {
        expect(suggestionListElement.removeEmptySnippets('${0}')).toBe('');
        return expect(suggestionListElement.removeEmptySnippets('${1000}')).toBe('');
      });
      it('removes an empty snippet group with braces with surrounding text', function() {
        expect(suggestionListElement.removeEmptySnippets('hello${0}')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('${0}hello')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('hello${0}hello')).toBe('hellohello');
        return expect(suggestionListElement.removeEmptySnippets('hello${1000}hello')).toBe('hellohello');
      });
      it('removes an empty snippet group with braces and a colon', function() {
        expect(suggestionListElement.removeEmptySnippets('${0:}')).toBe('');
        return expect(suggestionListElement.removeEmptySnippets('${1000:}')).toBe('');
      });
      return it('removes an empty snippet group with braces and a colon with surrounding text', function() {
        expect(suggestionListElement.removeEmptySnippets('hello${0:}')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('${0:}hello')).toBe('hello');
        expect(suggestionListElement.removeEmptySnippets('hello${0:}hello')).toBe('hellohello');
        return expect(suggestionListElement.removeEmptySnippets('hello${1000:}hello')).toBe('hellohello');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9zdWdnZXN0aW9uLWxpc3QtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxnQ0FBUixDQUF4QixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxRQUFBLHFCQUFBO0FBQUEsSUFBQyx3QkFBeUIsS0FBMUIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULHFCQUFBLEdBQTRCLElBQUEscUJBQUEsQ0FBQSxFQURuQjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFLQSxTQUFBLENBQVUsU0FBQSxHQUFBOztRQUNSLHFCQUFxQixDQUFFLE9BQXZCLENBQUE7T0FBQTthQUNBLHFCQUFBLEdBQXdCLEtBRmhCO0lBQUEsQ0FBVixDQUxBLENBQUE7QUFBQSxJQVNBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxPQUFPLENBQUMsV0FBUixDQUFvQixxQkFBcEIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFlBQUEsVUFBQTtBQUFBLFFBQUEsVUFBQSxHQUFhO0FBQUEsVUFBQSxJQUFBLEVBQU0sYUFBTjtTQUFiLENBQUE7QUFBQSxRQUNBLHFCQUFxQixDQUFDLFVBQXRCLENBQWlDLFVBQWpDLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxTQUF4QyxDQUFrRCxDQUFD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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/spec/suggestion-list-element-spec.coffee
