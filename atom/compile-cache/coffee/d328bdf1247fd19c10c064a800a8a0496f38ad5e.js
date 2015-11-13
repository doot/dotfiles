(function() {
  var attributePattern, firstCharsEqual, fs, path, tagPattern, trailingWhitespace;

  fs = require('fs');

  path = require('path');

  trailingWhitespace = /\s$/;

  attributePattern = /\s+([a-zA-Z][-a-zA-Z]*)\s*=\s*$/;

  tagPattern = /<([a-zA-Z][-a-zA-Z]*)(?:\s|$)/;

  module.exports = {
    selector: '.text.html',
    disableForSelector: '.text.html .comment',
    filterSuggestions: true,
    getSuggestions: function(request) {
      var prefix;
      prefix = request.prefix;
      if (this.isAttributeValueStartWithNoPrefix(request)) {
        return this.getAttributeValueCompletions(request);
      } else if (this.isAttributeValueStartWithPrefix(request)) {
        return this.getAttributeValueCompletions(request, prefix);
      } else if (this.isAttributeStartWithNoPrefix(request)) {
        return this.getAttributeNameCompletions(request);
      } else if (this.isAttributeStartWithPrefix(request)) {
        return this.getAttributeNameCompletions(request, prefix);
      } else if (this.isTagStartWithNoPrefix(request)) {
        return this.getTagNameCompletions();
      } else if (this.isTagStartTagWithPrefix(request)) {
        return this.getTagNameCompletions(prefix);
      } else {
        return [];
      }
    },
    onDidInsertSuggestion: function(_arg) {
      var editor, suggestion;
      editor = _arg.editor, suggestion = _arg.suggestion;
      if (suggestion.type === 'attribute') {
        return setTimeout(this.triggerAutocomplete.bind(this, editor), 1);
      }
    },
    triggerAutocomplete: function(editor) {
      return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', {
        activatedManually: false
      });
    },
    isTagStartWithNoPrefix: function(_arg) {
      var prefix, scopeDescriptor, scopes;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (prefix === '<' && scopes.length === 1) {
        return scopes[0] === 'text.html.basic';
      } else if (prefix === '<' && scopes.length === 2) {
        return scopes[0] === 'text.html.basic' && scopes[1] === 'meta.scope.outside-tag.html';
      } else {
        return false;
      }
    },
    isTagStartTagWithPrefix: function(_arg) {
      var prefix, scopeDescriptor;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!prefix) {
        return false;
      }
      if (trailingWhitespace.test(prefix)) {
        return false;
      }
      return this.hasTagScope(scopeDescriptor.getScopesArray());
    },
    isAttributeStartWithNoPrefix: function(_arg) {
      var prefix, scopeDescriptor;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!trailingWhitespace.test(prefix)) {
        return false;
      }
      return this.hasTagScope(scopeDescriptor.getScopesArray());
    },
    isAttributeStartWithPrefix: function(_arg) {
      var prefix, scopeDescriptor, scopes;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!prefix) {
        return false;
      }
      if (trailingWhitespace.test(prefix)) {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('entity.other.attribute-name.html') !== -1) {
        return true;
      }
      if (!this.hasTagScope(scopes)) {
        return false;
      }
      return scopes.indexOf('punctuation.definition.tag.html') !== -1 || scopes.indexOf('punctuation.definition.tag.end.html') !== -1;
    },
    isAttributeValueStartWithNoPrefix: function(_arg) {
      var lastPrefixCharacter, prefix, scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      lastPrefixCharacter = prefix[prefix.length - 1];
      if (lastPrefixCharacter !== '"' && lastPrefixCharacter !== "'") {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      return this.hasStringScope(scopes) && this.hasTagScope(scopes);
    },
    isAttributeValueStartWithPrefix: function(_arg) {
      var lastPrefixCharacter, prefix, scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      lastPrefixCharacter = prefix[prefix.length - 1];
      if (lastPrefixCharacter === '"' || lastPrefixCharacter === "'") {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      return this.hasStringScope(scopes) && this.hasTagScope(scopes);
    },
    hasTagScope: function(scopes) {
      return scopes.indexOf('meta.tag.any.html') !== -1 || scopes.indexOf('meta.tag.other.html') !== -1 || scopes.indexOf('meta.tag.block.any.html') !== -1 || scopes.indexOf('meta.tag.inline.any.html') !== -1 || scopes.indexOf('meta.tag.structure.any.html') !== -1;
    },
    hasStringScope: function(scopes) {
      return scopes.indexOf('string.quoted.double.html') !== -1 || scopes.indexOf('string.quoted.single.html') !== -1;
    },
    getTagNameCompletions: function(prefix) {
      var attributes, completions, tag, _ref;
      completions = [];
      _ref = this.completions.tags;
      for (tag in _ref) {
        attributes = _ref[tag];
        if (!prefix || firstCharsEqual(tag, prefix)) {
          completions.push(this.buildTagCompletion(tag));
        }
      }
      return completions;
    },
    buildTagCompletion: function(tag) {
      return {
        text: tag,
        type: 'tag',
        description: "HTML <" + tag + "> tag",
        descriptionMoreURL: this.getTagDocsURL(tag)
      };
    },
    getAttributeNameCompletions: function(_arg, prefix) {
      var attribute, bufferPosition, completions, editor, options, tag, tagAttributes, _i, _len, _ref;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      completions = [];
      tag = this.getPreviousTag(editor, bufferPosition);
      tagAttributes = this.getTagAttributes(tag);
      for (_i = 0, _len = tagAttributes.length; _i < _len; _i++) {
        attribute = tagAttributes[_i];
        if (!prefix || firstCharsEqual(attribute, prefix)) {
          completions.push(this.buildAttributeCompletion(attribute, tag));
        }
      }
      _ref = this.completions.attributes;
      for (attribute in _ref) {
        options = _ref[attribute];
        if (!prefix || firstCharsEqual(attribute, prefix)) {
          if (options.global) {
            completions.push(this.buildAttributeCompletion(attribute));
          }
        }
      }
      return completions;
    },
    buildAttributeCompletion: function(attribute, tag) {
      if (tag != null) {
        return {
          snippet: "" + attribute + "=\"$1\"$0",
          displayText: attribute,
          type: 'attribute',
          rightLabel: "<" + tag + ">",
          description: "" + attribute + " attribute local to <" + tag + "> tags",
          descriptionMoreURL: this.getLocalAttributeDocsURL(attribute, tag)
        };
      } else {
        return {
          snippet: "" + attribute + "=\"$1\"$0",
          displayText: attribute,
          type: 'attribute',
          description: "Global " + attribute + " attribute",
          descriptionMoreURL: this.getGlobalAttributeDocsURL(attribute)
        };
      }
    },
    getAttributeValueCompletions: function(_arg, prefix) {
      var attribute, bufferPosition, editor, tag, value, values, _i, _len, _results;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      tag = this.getPreviousTag(editor, bufferPosition);
      attribute = this.getPreviousAttribute(editor, bufferPosition);
      values = this.getAttributeValues(attribute);
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if (!prefix || firstCharsEqual(value, prefix)) {
          _results.push(this.buildAttributeValueCompletion(tag, attribute, value));
        }
      }
      return _results;
    },
    buildAttributeValueCompletion: function(tag, attribute, value) {
      if (this.completions.attributes[attribute].global) {
        return {
          text: value,
          type: 'value',
          description: "" + value + " value for global " + attribute + " attribute",
          descriptionMoreURL: this.getGlobalAttributeDocsURL(attribute)
        };
      } else {
        return {
          text: value,
          type: 'value',
          description: "" + value + " value for " + attribute + " attribute local to <" + tag + ">",
          descriptionMoreURL: this.getLocalAttributeDocsURL(attribute, tag)
        };
      }
    },
    loadCompletions: function() {
      this.completions = {};
      return fs.readFile(path.resolve(__dirname, '..', 'completions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.completions = JSON.parse(content);
          }
        };
      })(this));
    },
    getPreviousTag: function(editor, bufferPosition) {
      var row, tag, _ref;
      row = bufferPosition.row;
      while (row >= 0) {
        tag = (_ref = tagPattern.exec(editor.lineTextForBufferRow(row))) != null ? _ref[1] : void 0;
        if (tag) {
          return tag;
        }
        row--;
      }
    },
    getPreviousAttribute: function(editor, bufferPosition) {
      var line, quoteIndex, _ref, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]).trim();
      quoteIndex = line.length - 1;
      while (line[quoteIndex] && !((_ref = line[quoteIndex]) === '"' || _ref === "'")) {
        quoteIndex--;
      }
      line = line.substring(0, quoteIndex);
      return (_ref1 = attributePattern.exec(line)) != null ? _ref1[1] : void 0;
    },
    getAttributeValues: function(attribute) {
      var _ref;
      attribute = this.completions.attributes[attribute];
      return (_ref = attribute != null ? attribute.attribOption : void 0) != null ? _ref : [];
    },
    getTagAttributes: function(tag) {
      var _ref, _ref1;
      return (_ref = (_ref1 = this.completions.tags[tag]) != null ? _ref1.attributes : void 0) != null ? _ref : [];
    },
    getTagDocsURL: function(tag) {
      return "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/" + tag;
    },
    getLocalAttributeDocsURL: function(attribute, tag) {
      return "" + (this.getTagDocsURL(tag)) + "#attr-" + attribute;
    },
    getGlobalAttributeDocsURL: function(attribute) {
      return "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/" + attribute;
    }
  };

  firstCharsEqual = function(str1, str2) {
    return str1[0].toLowerCase() === str2[0].toLowerCase();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWh0bWwvbGliL3Byb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyRUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsS0FIckIsQ0FBQTs7QUFBQSxFQUlBLGdCQUFBLEdBQW1CLGlDQUpuQixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLCtCQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsWUFBVjtBQUFBLElBQ0Esa0JBQUEsRUFBb0IscUJBRHBCO0FBQUEsSUFFQSxpQkFBQSxFQUFtQixJQUZuQjtBQUFBLElBSUEsY0FBQSxFQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLFVBQUEsTUFBQTtBQUFBLE1BQUMsU0FBVSxRQUFWLE1BQUQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsaUNBQUQsQ0FBbUMsT0FBbkMsQ0FBSDtlQUNFLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixPQUE5QixFQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSwrQkFBRCxDQUFpQyxPQUFqQyxDQUFIO2VBQ0gsSUFBQyxDQUFBLDRCQUFELENBQThCLE9BQTlCLEVBQXVDLE1BQXZDLEVBREc7T0FBQSxNQUVBLElBQUcsSUFBQyxDQUFBLDRCQUFELENBQThCLE9BQTlCLENBQUg7ZUFDSCxJQUFDLENBQUEsMkJBQUQsQ0FBNkIsT0FBN0IsRUFERztPQUFBLE1BRUEsSUFBRyxJQUFDLENBQUEsMEJBQUQsQ0FBNEIsT0FBNUIsQ0FBSDtl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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-html/lib/provider.coffee
