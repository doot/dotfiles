(function() {
  var beautify, cjsx, coffee, jQuery, transform;

  transform = require('coffee-react-transform');

  coffee = require('coffee-script');

  beautify = require('js-beautify').js_beautify;

  jQuery = require('jquery');

  cjsx = {
    cs: function(fpath, text, options, data) {
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      return transform(text);
    },
    js: function(fpath, text, options, data) {
      var compiled, transformed;
      if (options == null) {
        options = {};
      }
      if (data == null) {
        data = {};
      }
      transformed = this.cs(fpath, text, options, data);
      compiled = coffee.compile(transformed, options);
      return beautify(compiled);
    }
  };

  jQuery.extend(cjsx, require('./jshtml')(true, 'cjsx'));

  module.exports = cjsx;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2Nqc3guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FEVCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsV0FGbEMsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUhULENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxTQUFDLEtBQUQsRUFBTyxJQUFQLEVBQVksT0FBWixFQUF1QixJQUF2QixHQUFBOztRQUFZLFVBQVE7T0FDdEI7O1FBRHlCLE9BQUs7T0FDOUI7YUFBQSxTQUFBLENBQVUsSUFBVixFQURFO0lBQUEsQ0FBSjtBQUFBLElBR0EsRUFBQSxFQUFJLFNBQUMsS0FBRCxFQUFPLElBQVAsRUFBWSxPQUFaLEVBQXVCLElBQXZCLEdBQUE7QUFDRixVQUFBLHFCQUFBOztRQURjLFVBQVE7T0FDdEI7O1FBRHlCLE9BQUs7T0FDOUI7QUFBQSxNQUFBLFdBQUEsR0FBYyxJQUFDLENBQUEsRUFBRCxDQUFJLEtBQUosRUFBVSxJQUFWLEVBQWUsT0FBZixFQUF1QixJQUF2QixDQUFkLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFlLFdBQWYsRUFBNEIsT0FBNUIsQ0FEWCxDQUFBO2FBRUEsUUFBQSxDQUFTLFFBQVQsRUFIRTtJQUFBLENBSEo7R0FORixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLE9BQUEsQ0FBUSxVQUFSLENBQUEsQ0FBb0IsSUFBcEIsRUFBeUIsTUFBekIsQ0FBcEIsQ0FkQSxDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFmakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/cjsx.coffee
