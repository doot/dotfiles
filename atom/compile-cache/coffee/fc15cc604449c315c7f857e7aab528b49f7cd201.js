(function() {
  var SnippetParser, removeCharFromString;

  module.exports = SnippetParser = (function() {
    function SnippetParser() {}

    SnippetParser.prototype.reset = function() {
      this.inSnippet = false;
      this.inSnippetBody = false;
      this.snippetStart = -1;
      this.snippetEnd = -1;
      this.bodyStart = -1;
      this.bodyEnd = -1;
      return this.escapedBraceIndices = null;
    };

    SnippetParser.prototype.findSnippets = function(text) {
      var body, char, colonIndex, groupEnd, groupStart, i, index, rightBraceIndex, snippets, _i, _j, _len;
      if (!(text.length > 0 && text.indexOf('$') !== -1)) {
        return;
      }
      this.reset();
      snippets = [];
      for (index = _i = 0, _len = text.length; _i < _len; index = ++_i) {
        char = text[index];
        if (this.inSnippet && this.snippetEnd === index) {
          body = text.slice(this.bodyStart, this.bodyEnd + 1);
          body = this.removeBraceEscaping(body, this.bodyStart, this.escapedBraceIndices);
          snippets.push({
            snippetStart: this.snippetStart,
            snippetEnd: this.snippetEnd,
            bodyStart: this.bodyStart,
            bodyEnd: this.bodyEnd,
            body: body
          });
          this.reset();
          continue;
        }
        if (this.inSnippet && index >= this.bodyStart && index <= this.bodyEnd) {
          this.inBody = true;
        }
        if (this.inSnippet && (index > this.bodyEnd || index < this.bodyStart)) {
          this.inBody = false;
        }
        if (this.bodyStart === -1 || this.bodyEnd === -1) {
          this.inBody = false;
        }
        if (this.inSnippet && !this.inBody) {
          continue;
        }
        if (this.inSnippet && this.inBody) {
          continue;
        }
        if (!this.inSnippet && text.indexOf('${', index) === index) {
          colonIndex = text.indexOf(':', index + 3);
          if (colonIndex !== -1) {
            groupStart = index + 2;
            groupEnd = colonIndex - 1;
            if (groupEnd >= groupStart) {
              for (i = _j = groupStart; groupStart <= groupEnd ? _j < groupEnd : _j > groupEnd; i = groupStart <= groupEnd ? ++_j : --_j) {
                if (isNaN(parseInt(text.charAt(i)))) {
                  colonIndex = -1;
                }
              }
            } else {
              colonIndex = -1;
            }
          }
          rightBraceIndex = -1;
          if (colonIndex !== -1) {
            i = index + 4;
            while (true) {
              rightBraceIndex = text.indexOf('}', i);
              if (rightBraceIndex === -1) {
                break;
              }
              if (text.charAt(rightBraceIndex - 1) === '\\') {
                if (this.escapedBraceIndices == null) {
                  this.escapedBraceIndices = [];
                }
                this.escapedBraceIndices.push(rightBraceIndex - 1);
              } else {
                break;
              }
              i = rightBraceIndex + 1;
            }
          }
          if (colonIndex !== -1 && rightBraceIndex !== -1 && colonIndex < rightBraceIndex) {
            this.inSnippet = true;
            this.inBody = false;
            this.snippetStart = index;
            this.snippetEnd = rightBraceIndex;
            this.bodyStart = colonIndex + 1;
            this.bodyEnd = rightBraceIndex - 1;
            continue;
          } else {
            this.reset();
          }
        }
      }
      return snippets;
    };

    SnippetParser.prototype.removeBraceEscaping = function(body, bodyStart, escapedBraceIndices) {
      var bodyIndex, i, _i, _len;
      if (escapedBraceIndices != null) {
        for (i = _i = 0, _len = escapedBraceIndices.length; _i < _len; i = ++_i) {
          bodyIndex = escapedBraceIndices[i];
          body = removeCharFromString(body, bodyIndex - bodyStart - i);
        }
      }
      return body;
    };

    return SnippetParser;

  })();

  removeCharFromString = function(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvbGliL3NuaXBwZXQtcGFyc2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007K0JBQ0o7O0FBQUEsNEJBQUEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEtBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUEsQ0FGaEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFBLENBSGQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFBLENBSmIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFBLENBTFgsQ0FBQTthQU1BLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixLQVBsQjtJQUFBLENBQVAsQ0FBQTs7QUFBQSw0QkFTQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLCtGQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsSUFBb0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsS0FBdUIsQ0FBQSxDQUF6RCxDQUFBO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQVcsRUFGWCxDQUFBO0FBT0EsV0FBQSwyREFBQTsyQkFBQTtBQUNFLFFBQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxJQUFlLElBQUMsQ0FBQSxV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

//# sourceURL=/Users/doot/.atom/packages/autocomplete-plus/lib/snippet-parser.coffee
