(function() {
  var BrowserPlus, BrowserPlusModel, BrowserPlusView, CompositeDisposable, favList, fs;

  CompositeDisposable = require('atom').CompositeDisposable;

  BrowserPlusModel = require('./browser-plus-model');

  BrowserPlusView = require('./browser-plus-view');

  favList = require('./fav-view');

  fs = require('fs');

  module.exports = BrowserPlus = {
    browserPlusView: null,
    subscriptions: null,
    config: {
      fav: {
        title: 'No of Favorites',
        type: 'number',
        "default": 10
      },
      history: {
        title: 'No of Days of History',
        type: 'number',
        "default": 5
      },
      homepage: {
        title: 'HomePage',
        type: 'string',
        "default": 'http://www.google.com'
      },
      live: {
        title: 'Live Refresh in ',
        type: 'number',
        "default": 500
      },
      node: {
        title: 'Node Integration ',
        type: 'boolean',
        "default": false
      },
      currentFile: {
        title: 'Show Current File',
        type: 'boolean',
        "default": true
      },
      blockUri: {
        title: 'Block URIs keywords',
        type: 'array',
        "default": ['youtube']
      },
      alert: {
        title: 'Alert message',
        type: 'boolean',
        "default": true
      }
    },
    activate: function(state) {
      var d, date, days, oneDay, resources, today, val;
      if (!state.resetAgain) {
        state.history = [];
        state.favIcon = {};
        state.title = {};
        state.fav = [];
      }
      this.history = state.history || [];
      this.fav = state.fav || [];
      this.favIcon = state.favIcon || {};
      this.title = state.title || {};
      resources = "" + (atom.packages.getLoadedPackage('browser-plus').path) + "/resources/";
      this.js = fs.readFileSync("" + resources + "browser-plus-client.js", 'utf-8');
      this.CSSjs = fs.readFileSync("" + resources + "CSSUtilities.js", 'utf-8');
      this.JQueryjs = fs.readFileSync("" + resources + "jquery-1.11.3.min.js", 'utf-8');
      this.Selectorjs = fs.readFileSync("" + resources + "selector.js", 'utf-8');
      this.clientJS = "" + resources + "bp-client.js";
      atom.workspace.addOpener((function(_this) {
        return function(uri, opt) {
          var bp, localhostPattern, path;
          path = require('path');
          if (path.extname(uri) === '.htmlp' || uri.indexOf('http:') === 0 || uri.indexOf('https:') === 0 || uri.indexOf('localhost') === 0 || uri.indexOf('file:') === 0 || uri.indexOf('browser-plus:') === 0) {
            localhostPattern = /^(http:\/\/)?localhost/i;
            if (!BrowserPlusModel.checkUrl(uri)) {
              return false;
            }
            uri = uri.replace(localhostPattern, 'http://127.0.0.1');
            bp = new BrowserPlusModel({
              browserPlus: _this,
              uri: uri,
              src: opt.src
            });
            if (uri.indexOf('browser-plus://history') === 0) {
              bp.on('destroyed', function() {
                return _this.histView = void 0;
              });
            }
            return bp;
          }
        };
      })(this));
      oneDay = 24 * 60 * 60 * 1000;
      for (date in history) {
        val = history[date];
        d = new Date(date);
        today = new Date();
        days = Math.round(Math.abs((today.getTime() - d.getTime()) / oneDay));
        if (days > atom.config.get('browser-plus.history')) {
          delete history[date];
        }
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:openCurrent': (function(_this) {
          return function() {
            return _this.open(null, null, true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:history': (function(_this) {
          return function() {
            return _this.hist();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:fav': (function(_this) {
          return function() {
            return _this.favr();
          };
        })(this)
      }));
    },
    favr: function() {
      return new favList(this.fav);
    },
    open: function(split, src, current) {
      var editor, uri, _ref;
      if (atom.config.get('browser-plus.currentFile') || current) {
        editor = atom.workspace.getActiveTextEditor();
        if (uri = editor != null ? (_ref = editor.buffer) != null ? _ref.getUri() : void 0 : void 0) {
          uri = "file:///" + uri;
        }
      }
      if (!uri) {
        uri = atom.config.get('browser-plus.homepage');
      }
      if (!split) {
        split = this.getPosition();
      }
      return atom.workspace.open(uri, {
        split: split,
        src: src
      });
    },
    hist: function(uri, side) {
      if (uri == null) {
        uri = 'browser-plus://history';
      }
      if (side == null) {
        side = 'right';
      }
      return atom.workspace.open(uri, {
        split: side
      });
    },
    getPosition: function() {
      var activePane, orientation, paneAxis, paneIndex, _ref;
      activePane = atom.workspace.paneForItem(atom.workspace.getActiveTextEditor());
      if (!activePane) {
        return;
      }
      paneAxis = activePane.getParent();
      if (!paneAxis) {
        return;
      }
      paneIndex = paneAxis.getPanes().indexOf(activePane);
      orientation = (_ref = paneAxis.orientation) != null ? _ref : 'horizontal';
      if (orientation === 'horizontal') {
        if (paneIndex === 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (paneIndex === 0) {
          return 'down';
        } else {
          return 'top';
        }
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return {
        history: this.history,
        fav: this.fav,
        favIcon: this.favIcon,
        title: this.title,
        resetAgain: true
      };
    },
    provideService: function() {
      return BrowserPlusModel;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL2xpYi9icm93c2VyLXBsdXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSkwsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQUEsR0FDZjtBQUFBLElBQUEsZUFBQSxFQUFpQixJQUFqQjtBQUFBLElBQ0EsYUFBQSxFQUFlLElBRGY7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsR0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsRUFGVDtPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxDQUZUO09BTEY7QUFBQSxNQVFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsdUJBRlQ7T0FURjtBQUFBLE1BWUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0JBQVA7QUFB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

//# sourceURL=/Users/doot/.atom/packages/browser-plus/lib/browser-plus.coffee
