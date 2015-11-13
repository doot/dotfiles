(function() {
  var exitIfError, fs, getAttributes, getTags, path, request;

  path = require('path');

  fs = require('fs');

  request = require('request');

  exitIfError = function(error) {
    if (error != null) {
      console.error(error.message);
      return process.exit(1);
    }
  };

  getTags = function(callback) {
    var requestOptions;
    requestOptions = {
      url: 'https://raw.githubusercontent.com/adobe/brackets/master/src/extensions/default/HTMLCodeHints/HtmlTags.json',
      json: true
    };
    return request(requestOptions, function(error, response, tags) {
      var options, tag, _ref;
      if (error != null) {
        return callback(error);
      }
      if (response.statusCode !== 200) {
        return callback(new Error("Request for HtmlTags.json failed: " + response.statusCode));
      }
      for (tag in tags) {
        options = tags[tag];
        if (((_ref = options.attributes) != null ? _ref.length : void 0) === 0) {
          delete options.attributes;
        }
      }
      return callback(null, tags);
    });
  };

  getAttributes = function(callback) {
    var requestOptions;
    requestOptions = {
      url: 'https://raw.githubusercontent.com/adobe/brackets/master/src/extensions/default/HTMLCodeHints/HtmlAttributes.json',
      json: true
    };
    return request(requestOptions, function(error, response, attributes) {
      var attribute, options, _ref;
      if (error != null) {
        return callback(error);
      }
      if (response.statusCode !== 200) {
        return callback(new Error("Request for HtmlAttributes.json failed: " + response.statusCode));
      }
      for (attribute in attributes) {
        options = attributes[attribute];
        if (attribute.indexOf('/') !== -1) {
          delete attributes[attribute];
        }
        if (((_ref = options.attribOption) != null ? _ref.length : void 0) === 0) {
          delete options.attribOption;
        }
      }
      return callback(null, attributes);
    });
  };

  getTags(function(error, tags) {
    exitIfError(error);
    return getAttributes(function(error, attributes) {
      var completions;
      exitIfError(error);
      completions = {
        tags: tags,
        attributes: attributes
      };
      return fs.writeFileSync(path.join(__dirname, 'completions.json'), "" + (JSON.stringify(completions, null, 0)) + "\n");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWh0bWwvdXBkYXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBQUEsTUFBQSxzREFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxTQUFDLEtBQUQsR0FBQTtBQUNaLElBQUEsSUFBRyxhQUFIO0FBQ0UsTUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEtBQUssQ0FBQyxPQUFwQixDQUFBLENBQUE7QUFDQSxhQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYixDQUFQLENBRkY7S0FEWTtFQUFBLENBSmQsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsR0FBVSxTQUFDLFFBQUQsR0FBQTtBQUNSLFFBQUEsY0FBQTtBQUFBLElBQUEsY0FBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssNEdBQUw7QUFBQSxNQUNBLElBQUEsRUFBTSxJQUROO0tBREYsQ0FBQTtXQUlBLE9BQUEsQ0FBUSxjQUFSLEVBQXdCLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsSUFBbEIsR0FBQTtBQUN0QixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUEwQixhQUExQjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO09BQUE7QUFFQSxNQUFBLElBQUcsUUFBUSxDQUFDLFVBQVQsS0FBeUIsR0FBNUI7QUFDRSxlQUFPLFFBQUEsQ0FBYSxJQUFBLEtBQUEsQ0FBTyxvQ0FBQSxHQUFvQyxRQUFRLENBQUMsVUFBcEQsQ0FBYixDQUFQLENBREY7T0FGQTtBQUtBLFdBQUEsV0FBQTs0QkFBQTtBQUNFLFFBQUEsK0NBQStDLENBQUUsZ0JBQXBCLEtBQThCLENBQTNEO0FBQUEsVUFBQSxNQUFBLENBQUEsT0FBYyxDQUFDLFVBQWYsQ0FBQTtTQURGO0FBQUEsT0FMQTthQVFBLFFBQUEsQ0FBUyxJQUFULEVBQWUsSUFBZixFQVRzQjtJQUFBLENBQXhCLEVBTFE7RUFBQSxDQVRWLENBQUE7O0FBQUEsRUF5QkEsYUFBQSxHQUFnQixTQUFDLFFBQUQsR0FBQTtBQUNkLFFBQUEsY0FBQTtBQUFBLElBQUEsY0FBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssa0hBQUw7QUFBQSxNQUNBLElBQUEsRUFBTSxJQUROO0tBREYsQ0FBQTtXQUlBLE9BQUEsQ0FBUSxjQUFSLEVBQXdCLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsVUFBbEIsR0FBQTtBQUN0QixVQUFBLHdCQUFBO0FBQUEsTUFBQSxJQUEwQixhQUExQjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO09BQUE7QUFFQSxNQUFBLElBQUcsUUFBUSxDQUFDLFVBQVQsS0FBeUIsR0FBNUI7QUFDRSxlQUFPLFFBQUEsQ0FBYSxJQUFBLEtBQUEsQ0FBTywwQ0FBQSxHQUEwQyxRQUFRLENBQUMsVUFBMUQsQ0FBYixDQUFQLENBREY7T0FGQTtBQUtBLFdBQUEsdUJBQUE7d0NBQUE7QUFDRSxRQUFBLElBQWdDLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLENBQUEsS0FBNEIsQ0FBQSxDQUE1RDtBQUFBLFVBQUEsTUFBQSxDQUFBLFVBQWtCLENBQUEsU0FBQSxDQUFsQixDQUFBO1NBQUE7QUFDQSxRQUFBLGlEQUFtRCxDQUFFLGdCQUF0QixLQUFnQyxDQUEvRDtBQUFBLFVBQUEsTUFBQSxDQUFBLE9BQWMsQ0FBQyxZQUFmLENBQUE7U0FGRjtBQUFBLE9BTEE7YUFTQSxRQUFBLENBQVMsSUFBVCxFQUFlLFVBQWYsRUFWc0I7SUFBQSxDQUF4QixFQUxjO0VBQUEsQ0F6QmhCLENBQUE7O0FBQUEsRUEwQ0EsT0FBQSxDQUFRLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNOLElBQUEsV0FBQSxDQUFZLEtBQVosQ0FBQSxDQUFBO1dBRUEsYUFBQSxDQUFjLFNBQUMsS0FBRCxFQUFRLFVBQVIsR0FBQTtBQUNaLFVBQUEsV0FBQTtBQUFBLE1BQUEsV0FBQSxDQUFZLEtBQVosQ0FBQSxDQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWM7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sWUFBQSxVQUFQO09BRmQsQ0FBQTthQUdBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixrQkFBckIsQ0FBakIsRUFBMkQsRUFBQSxHQUFFLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxXQUFmLEVBQTRCLElBQTVCLEVBQWtDLENBQWxDLENBQUQsQ0FBRixHQUF3QyxJQUFuRyxFQUpZO0lBQUEsQ0FBZCxFQUhNO0VBQUEsQ0FBUixDQTFDQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/autocomplete-html/update.coffee
