(function() {
  var hb, loophole;

  loophole = require('./eval');

  hb = loophole.allowUnsafe(function() {
    return require('handlebars');
  });

  module.exports = {
    html: function(fpath, text, options, data) {
      var tmpl;
      if (data == null) {
        data = {};
      }
      tmpl = loophole.allowUnsafe(function() {
        return hb.compile(text);
      });
      return loophole.allowUnsafe(function() {
        return tmpl(data);
      });
    },
    htmlp: function(fpath, text, options, data) {
      return this.html(fpath, text, options, data);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcHJldmlldy1wbHVzL2xpYi9sYW5nL2hhbmRsZWJhcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLFFBQVEsQ0FBQyxXQUFULENBQXFCLFNBQUEsR0FBQTtXQUFHLE9BQUEsQ0FBUSxZQUFSLEVBQUg7RUFBQSxDQUFyQixDQURMLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBb0IsSUFBcEIsR0FBQTtBQUNKLFVBQUEsSUFBQTs7UUFEd0IsT0FBSztPQUM3QjtBQUFBLE1BQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxXQUFULENBQXFCLFNBQUEsR0FBQTtlQUFHLEVBQUUsQ0FBQyxPQUFILENBQVcsSUFBWCxFQUFIO01BQUEsQ0FBckIsQ0FBUCxDQUFBO2FBQ0EsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsU0FBQSxHQUFBO2VBQUcsSUFBQSxDQUFLLElBQUwsRUFBSDtNQUFBLENBQXJCLEVBRkk7SUFBQSxDQUFOO0FBQUEsSUFJQSxLQUFBLEVBQU8sU0FBQyxLQUFELEVBQU8sSUFBUCxFQUFZLE9BQVosRUFBb0IsSUFBcEIsR0FBQTthQUNMLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixFQUFZLElBQVosRUFBaUIsT0FBakIsRUFBeUIsSUFBekIsRUFESztJQUFBLENBSlA7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/doot/.atom/packages/preview-plus/lib/lang/handlebars.coffee
