(function() {
  var URIView, jQ, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jQ = require('../node_modules/jquery/dist/jquery.js');

  require('jquery-ui/autocomplete');

  _ = require('lodash');

  module.exports = URIView = (function(_super) {
    __extends(URIView, _super);

    function URIView() {
      return URIView.__super__.constructor.apply(this, arguments);
    }

    URIView.content = function(params) {
      return this.div({
        "class": 'uri'
      }, (function(_this) {
        return function() {
          return _this.input({
            "class": "native-key-bindings",
            type: 'text',
            id: 'search',
            outlet: 'search'
          });
        };
      })(this));
    };

    URIView.prototype.initialize = function() {
      var select, src;
      src = (function(_this) {
        return function(req, res) {
          var fav, hist, histDate, history, hists, key, pattern, searchUrl, title, uris, _i, _j, _len, _len1, _ref;
          pattern = RegExp("" + req.term, "i");
          history = [];
          fav = _.filter(_this.model.browserPlus.fav, function(fav) {
            return fav.uri.match(pattern) || fav.title.match(pattern);
          });
          _ref = _this.model.browserPlus.history;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            histDate = _ref[_i];
            for (key in histDate) {
              hists = histDate[key];
              for (_j = 0, _len1 = hists.length; _j < _len1; _j++) {
                hist = hists[_j];
                title = _this.model.browserPlus.title[hist.uri];
                if (hist.uri.match(pattern) || (title != null ? title.match(pattern) : void 0)) {
                  history.push(hist.uri);
                }
              }
            }
          }
          uris = _.union(_.pluck(fav, "uri"), history);
          res(uris);
          searchUrl = 'http://api.bing.com/osjson.aspx';
          return (function() {
            return jQ.ajax({
              url: searchUrl,
              dataType: 'json',
              data: {
                query: req.term,
                'web.count': 10
              },
              success: (function(_this) {
                return function(data) {
                  var dat, search, _k, _len2, _ref1;
                  uris = uris.slice(0, 11);
                  search = "http://www.google.com/search?as_q=";
                  _ref1 = data[1].slice(0, 11);
                  for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                    dat = _ref1[_k];
                    uris.push({
                      label: dat,
                      value: search + dat
                    });
                  }
                  return res(uris);
                };
              })(this)
            });
          })();
        };
      })(this);
      select = (function(_this) {
        return function(event, ui) {
          return _this.goToUrl(ui.item.value);
        };
      })(this);
      return jQ(this.uri).autocomplete({
        source: src,
        minLength: 2,
        select: select
      });
    };

    return URIView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL2xpYi91cmktdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSx1Q0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxPQUFBLENBQVEsd0JBQVIsQ0FEQSxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFNLEtBQU47T0FBTCxFQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQixLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxPQUFBLEVBQU0scUJBQU47QUFBQSxZQUE2QixJQUFBLEVBQUssTUFBbEM7QUFBQSxZQUF5QyxFQUFBLEVBQUcsUUFBNUM7QUFBQSxZQUFxRCxNQUFBLEVBQU8sUUFBNUQ7V0FBUCxFQURnQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLEVBRE07SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNSLFVBQUEsV0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBSyxHQUFMLEdBQUE7QUFFSixjQUFBLG9HQUFBO0FBQUEsVUFBQSxPQUFBLEdBQVUsTUFBQSxDQUFBLEVBQUEs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

//# sourceURL=/Users/doot/.atom/packages/browser-plus/lib/uri-view.coffee
