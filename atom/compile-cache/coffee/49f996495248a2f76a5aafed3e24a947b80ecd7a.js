(function() {
  var Disposable, Emitter, HTMLEditor, Model, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Disposable = _ref.Disposable, Emitter = _ref.Emitter;

  Model = require('theorist').Model;

  path = require('path');

  module.exports = HTMLEditor = (function(_super) {
    __extends(HTMLEditor, _super);

    atom.deserializers.add(HTMLEditor);

    function HTMLEditor(obj) {
      this.browserPlus = obj.browserPlus;
      this.uri = obj.uri;
      this.src = obj.src;
      this.disposable = new Disposable();
      this.emitter = new Emitter;
    }

    HTMLEditor.prototype.getViewClass = function() {
      return require('./browser-plus-view');
    };

    HTMLEditor.prototype.setText = function(text) {
      return this.view.setSrc(text);
    };

    HTMLEditor.prototype.destroyed = function() {
      return this.emitter.emit('did-destroy');
    };

    HTMLEditor.prototype.onDidDestroy = function(cb) {
      return this.emitter.on('did-destroy', cb);
    };

    HTMLEditor.prototype.getTitle = function() {
      return this.title || path.basename(this.uri);
    };

    HTMLEditor.prototype.getIconName = function() {
      return this.iconName;
    };

    HTMLEditor.prototype.getURI = function() {
      var match, regex, _ref1;
      if ((_ref1 = this.src) != null ? _ref1.includes('data:text/html,') : void 0) {
        regex = /<meta\s?\S*?\s?bp-uri=['"](.*?)['"]\S*\/>/;
        match = this.src.match(regex);
        if (match != null ? match[1] : void 0) {
          return this.uri = "browser-plus://preview~" + match[1];
        } else {
          return this.uri = "browser-plus://preview~" + (new Date().getTime()) + ".html";
        }
      } else {
        return this.uri;
      }
    };

    HTMLEditor.prototype.getGrammar = function() {};

    HTMLEditor.prototype.setTitle = function(title) {
      this.title = title;
      return this.emit('title-changed');
    };

    HTMLEditor.prototype.updateIcon = function() {
      return this.emit('icon-changed');
    };

    HTMLEditor.prototype.serialize = function() {
      return {
        data: {
          browserPlus: this.browserPlus,
          uri: this.uri,
          src: this.src,
          iconName: this.iconName,
          title: this.title
        },
        deserializer: 'HTMLEditor'
      };
    };

    HTMLEditor.deserialize = function(_arg) {
      var data;
      data = _arg.data;
      return new HTMLEditor(data);
    };

    HTMLEditor.checkUrl = function(url) {
      var pattern, uri, _i, _len, _ref1;
      _ref1 = atom.config.get('browser-plus.blockUri');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        uri = _ref1[_i];
        pattern = RegExp("" + uri, "i");
        if (url.match(pattern) || ((this.checkBlockUrl != null) && this.checkBlockUrl(url))) {
          if (atom.config.get('browser-plus.alert')) {
            atom.notifications.addSuccess("" + url + " Blocked~~Maintain Blocked URL in Browser-Plus Settings");
          } else {
            console.log("" + url + " Blocked~~Maintain Blocked URL in Browser-Plus Settings");
          }
          return false;
        }
        return true;
      }
    };

    return HTMLEditor;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL2xpYi9icm93c2VyLXBsdXMtbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsTUFBUixDQUF2QixFQUFDLGtCQUFBLFVBQUQsRUFBWSxlQUFBLE9BQVosQ0FBQTs7QUFBQSxFQUNDLFFBQVMsT0FBQSxDQUFRLFVBQVIsRUFBVCxLQURELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFVBQXZCLENBQUEsQ0FBQTs7QUFDYSxJQUFBLG9CQUFDLEdBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFHLENBQUMsV0FBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEdBQUQsR0FBTyxHQUFHLENBQUMsR0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsR0FBRCxHQUFPLEdBQUcsQ0FBQyxHQUZYLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFBLENBSGxCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BSlgsQ0FEVztJQUFBLENBRGI7O0FBQUEseUJBUUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLE9BQUEsQ0FBUSxxQkFBUixFQURZO0lBQUEsQ0FSZCxDQUFBOztBQUFBLHlCQVdBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FB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

//# sourceURL=/Users/doot/.atom/packages/browser-plus/lib/browser-plus-model.coffee
